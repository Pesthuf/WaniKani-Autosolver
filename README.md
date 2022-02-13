# WaniKani-Autosolver

This script can be used to skip certain stages on WaniKani.
I made this because I'd like to go through WaniKani again - to refresh my memory. Which is why I don't want to go through every stage again and drown in hundreds of reviews per day.

## What this script does
When it's launched, it checks if you have any reviews pending. If yes, it will check if any of those are in the stages I want to skip (currently Apprentice-2, Guru 1, Master and Enlightened).
It will then use the WaniKani API to clear those reviews for you.

# How to run
This script uses [Deno](https://deno.land/). It should run on every OS Deno supports.
You can run this script using
```bash
deno run --allow-net --allow-read index.ts
```

Or, alternatively, if you have `make` installed,  using 
```bash
make run
```

This script will only check for currently pending reviews, do any it deems appropriate, then quit. If you want it to run regularly, you need to schedule it youself, using `cron`, `systemd-timer`, `jenkins` or whatever else you want. 

## Configuration
You need to configure the script using environemtn variables. You only need to provide one environment variable:
```bash
API_TOKEN="...."
```

Generate yourself an API-Token [here](https://www.wanikani.com/settings/personal_access_tokens).


