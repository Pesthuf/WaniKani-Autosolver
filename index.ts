import {
    createSuccessfulReview,
    fetchWaniKani, fetchWaniKaniSingle, getSubjects,
    getSummary,
    queryReviews,
} from "./lib/WaniKaniClient.ts";
import {CollectionResponse, Levels, ReviewData} from "./lib/WaniKaniTypes.ts";
import exit = Deno.exit;

const summary = await getSummary();
const summaryData = summary.data;
const now = new Date();

if (summaryData.next_reviews_at > now) {
    console.log("Reviews are available in ~" + Math.round(timeDiffInHours(summaryData.next_reviews_at, now)) + " Hours.");
    exit(2);
}

console.log(new Date());
const reviewAssignments = await queryReviews();

const subs = await getSubjects(reviewAssignments.data.map(a => a.data.subject_id));
let successCount = 0;
try {
    for (const subject of subs.data) {
        const assignment = reviewAssignments.data.find(a => a.data.subject_id === subject.id)!;
        if (assignment.data.srs_stage < Levels.MASTER) {
            // console.debug("Skipping", subject.object, subject.data.characters, "It is on stage" , assignment.data.srs_stage);
            continue;
        }
        console.log("Trying to create successful review for", subject.object, subject.data.characters);
        const resp = await createSuccessfulReview(subject.id);
        successCount++;
    }
}
catch(err) {
    console.error("Managed to successfully complete ", successCount, "before failing");
    throw err;
}

console.log("Successfully completed!", successCount, "Reviews completed!");

function timeDiffInHours(date1: Date, date2: Date): number {
  const ts1 = +date1;
  const ts2 = +date2;

  return (ts1 - ts2) / 1000 / 3600;
}
