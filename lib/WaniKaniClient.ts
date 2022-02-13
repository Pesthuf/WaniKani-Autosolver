import {
    Assignment,
    CollectionResponse,
    Review,
    ReviewData,
    SingleResponse,
    Subject,
    Summary,
    WaniKaniResponse,
} from "./WaniKaniTypes.ts";
import {config} from "https://deno.land/x/dotenv/mod.ts";

const ISO_8601_FULL =
    /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

/**
 * Fetch All pages if there are multiple.
 * @param endpoint
 * @param options
 */
export const fetchWaniKani = async <ResponseWrapper extends WaniKaniResponse<DataType>,
    DataType,
    >(endpoint: string, options: RequestInit = {}): Promise<ResponseWrapper> => {

    let nextEndpoint: string | null = endpoint;
    let returnValue: ResponseWrapper | undefined;

    while (nextEndpoint !== null) {
        const responseData: ResponseWrapper = await fetchWaniKaniSingle(nextEndpoint, options);

        nextEndpoint = null;
        if (responseData.object === 'collection') {
            if (returnValue === undefined) {
                returnValue = responseData;
            } else {
                // noinspection JSUnusedAssignment
                (returnValue.data as DataType[]).push(...responseData.data);
            }

            nextEndpoint = (responseData as CollectionResponse<DataType>).pages.next_url;
            //console.debug("Next endpoint is", nextEndpoint);
        } else {
            nextEndpoint = null;
            returnValue = responseData;
        }
    }

    return returnValue!;
}


export const fetchWaniKaniSingle = async <ResponseWrapper extends WaniKaniResponse<DataType>,
    DataType,
    >(endpoint: string, options: RequestInit = {}): Promise<ResponseWrapper> => {
    const conf = config();

    const apitoken = conf.API_TOKEN;
    const apiUrl = conf.API_URL;
    const revision = conf.WANIKANI_REVISION;

    const headers = new Headers(options.headers ?? {});
    headers.set("Wanikani-Revision", revision);
    headers.set("Authorization", `Bearer ${apitoken}`);

    let repeatRequest;
    let response;

    do {
        repeatRequest = false;
        let url = endpoint;
        if (!endpoint.startsWith('https://')) {
            url = apiUrl + endpoint;
        }
        response = await fetch(url, {
            ...options,
            headers,
        });
        if (!response.ok) {
            // TODO: Handle timeouts.
            if (response.status === 429) {
                let rateLimitEpoch = Number(response.headers.get("RateLimit-Reset"));
                const resetDate = new Date(rateLimitEpoch * 1000);
                const waitTime = +resetDate - +new Date();
                console.warn(
                    `Got 429 (Too many requests - Waiting for ${waitTime} milliseconds!`,
                );

                await new Promise((resolve) => setTimeout(resolve, waitTime));
                repeatRequest = true;
                continue;
            }

            throw new Error(response.statusText);
        }
    } while (repeatRequest);

    const text = await response.text();
    return JSON.parse(text, function (_key, value) {
        if (typeof value === "string") {
            if (ISO_8601_FULL.test(value)) {
                return new Date(value);
            }
        }
        return value;
    });
};

export function fetchAllReviews(): Promise<CollectionResponse<ReviewData>> {
    return fetchWaniKani("/reviews");
}

export function getSummary(): Promise<SingleResponse<Summary>> {
    return fetchWaniKani("/summary");
}

export async function queryReviews(): Promise<CollectionResponse<Assignment>> {
    const params = new URLSearchParams();
    params.set("immediately_available_for_review", "1");
    return await fetchWaniKani("/assignments?" + params);

    // I won't implement paging for now.
}

export async function getSubjects(SubjectIds: number[]): Promise<CollectionResponse<Subject>> {
    return await fetchWaniKani('/subjects?ids=' + SubjectIds.join(','));
}

export async function createSuccessfulReview(
    subjectId: number,
): Promise<SingleResponse<Review>> {
    return await fetchWaniKani("/reviews", {
        method: "POST",
        headers: {"Content-Type": "application/json; charset=utf-8"},
        body: JSON.stringify({
            review: {
                subject_id: subjectId,
                incorrect_meaning_answers: 0,
                incorrect_reading_answers: 0,
            }
        }),
    });
}

export async function getReviewData() {
    const reviewAssignments = (await queryReviews()).data;
    const subjects = (await getSubjects(reviewAssignments.map(a => a.data.subject_id))).data;

    const subsBySubjectId = subjects.reduce<Record<number, Subject>>((previousValue, currentValue) => {
        previousValue[currentValue.id] = currentValue;
        return previousValue;
    }, {});

    return reviewAssignments.map(value => {
        return {
            subject: subsBySubjectId[value.data.subject_id],
            assignment: value
        }
    });
}