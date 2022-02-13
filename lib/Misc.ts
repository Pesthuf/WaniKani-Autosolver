import {config} from "https://deno.land/x/dotenv/mod.ts";

export function timeDiffInHours(date1: Date, date2: Date): number {
    const ts1 = +date1;
    const ts2 = +date2;

    return (ts1 - ts2) / 1000 / 3600;
}

type EnvironemntConfig = {
    apiToken: string,
    apiUrl: string,
    revision: string
}

export function getConfig() : EnvironemntConfig {
    const conf = config();

    if (!conf.API_TOKEN) {
        throw new Error("You need to provide an API-Token. Create a file called .env in this Application's directory with content like \n\n" +
            "API_TOKEN=\"....\"\n " +
            "API_URL=\"https://api.wanikani.com/v2\"\n" +
            "WANIKANI_REVISION=\"20170710\"\n" +
            "\nthen try again.");
    }

    return {
        apiToken: conf.API_TOKEN,
        apiUrl: conf.API_URL ?? 'https://api.wanikani.com/v2',
        revision: conf.WANIKANI_REVISION ?? '20170710',
    }
}