export function timeDiffInHours(date1: Date, date2: Date): number {
    const ts1 = +date1;
    const ts2 = +date2;

    return (ts1 - ts2) / 1000 / 3600;
}