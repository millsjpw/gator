import { fetchFeed } from "src/feed";
import { parseDuration } from "src/time";
import { markFeedFetched, getNextFeedToFetch } from "src/lib/db/queries/feeds";
import { Feed } from "src/lib/db/schema";
import { createPost } from "src/lib/db/queries/posts";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <time_between_reqs>`);
    }
    
    const timeArg = args[0];
    const timeBetweenRequests = parseDuration(timeArg);
    if (!timeBetweenRequests) {
        throw new Error(
            `invalid duration: ${timeArg} - use format 1h 30m 15s or 3500ms`
        );
    }

    console.log(`Collecting feeds every ${timeArg}...`);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}

async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();
    if (!feed) {
        console.log(`No feeds to fetch.`);
        return;
    }
    console.log(`Found a feed to fetch!`);
    scrapeFeed(feed);
}

async function scrapeFeed(feed: Feed) {
    await markFeedFetched(feed.id);
    
    const feedData = await fetchFeed(feed.url);

    console.log(
        `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`
    );

    for (const item of feedData.channel.item) {
        await createPost(
            item.title,
            item.link,
            item.description,
            new Date(item.pubDate),
            feed.id
        );
    }
}

function handleError(err: unknown) {
    console.error(
        `Error scraping feeds: ${err instanceof Error ? err.message : err}`
    );
}
