import {createSuccessfulReview, getReviewData, getSummary,} from "./lib/WaniKaniClient.ts";
import {Levels} from "./lib/WaniKaniTypes.ts";
import {timeDiffInHours} from "./lib/misc.ts";
import exit = Deno.exit;
import {config} from "https://deno.land/x/dotenv/mod.ts";

const conf = config();
if (conf.API_TOKEN === undefined) {
    console.log("You probably didn't create a .env file. Create a file called .env in this Application's directory with content like \n\n" +
        "API_URL=\"https://api.wanikani.com/v2\"\n" +
        "WANIKANI_REVISION=\"20170710\"\n" +
        "API_TOKEN=\"....\"\n " +
        "\nthen try again.");
    exit(1);
}


const summary = await getSummary();
const summaryData = summary.data;
const now = new Date();

if (summaryData.next_reviews_at > now) {
    console.log("Reviews are available in ~" + Math.round(timeDiffInHours(summaryData.next_reviews_at, now)) + " Hours.");
    exit(2);
}

console.log(new Date());
const reviewData = await getReviewData();

/**
 * Here we decide what assignemtns we want the program to do. Currently, that's Enlightened,
 */
const assignemntsToDo = reviewData.filter(value => {
    const stage = value.assignment.data.srs_stage;
    return ([Levels.MASTER, Levels.ENLIGHTENED, Levels.GURU, Levels.APP_2].includes(stage));
})

if (assignemntsToDo.length === 0) {
    console.log("No assignment to do for me - get to work! on those ", reviewData.length, " reviews!");
}

let successCount = 0;

try {
    for (const {subject} of assignemntsToDo) {
        console.log("Trying to create successful review for", subject.object, subject.data.characters);
        await createSuccessfulReview(subject.id);
        successCount++;
    }
} catch (err) {
    console.error("Managed to successfully complete ", successCount, "before failing");
    throw err;
}

console.log("Successfully completed!", successCount, "Reviews completed!");

