import { readConfig } from "src/config";
import { createFeedFollow } from "src/lib/db/queries/feed_follow";
import { createFeed, getAllFeeds } from "src/lib/db/queries/feeds";
import { getUserByName, getUserById } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 2) {
        console.log(`Usage: cli ${cmdName} <feedName> <url>`);
        process.exit(1);
    }

    const feedName = args[0];
    const feedURL = args[1];
    const feed: Feed = await createFeed(feedURL, feedName, user.id);
    if (!feed) {
        throw new Error(`Failed to create feed`);
    }

    console.log("Feed created successfully!");
    // add a feed follow for the current user and the new feed
    await createFeedFollow(user.id, feed.id);
    printFeed(user, feed);
}

export async function handlerListFeeds(cmdName: string, ...args: string[]) {
    const feeds: Feed[] = await getAllFeeds();

    if (feeds.length === 0) {
        console.log("No feeds found.");
        return;
    }

    console.log(`Found ${feeds.length} feeds:\n`);
    for (let feed of feeds) {
        const user = await getUserById(feed.userId);
        if (!user) {
            throw new Error(`Failed to find user for feed ${feed.id}`);
        }

        printFeed(user, feed);
        console.log(`=====================================`);
    }
}

function printFeed(user: User, feed: Feed) {
    console.log(`* ID:            ${feed.id}`);
    console.log(`* Created:       ${feed.createdAt}`);
    console.log(`* Updated:       ${feed.updatedAt}`);
    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User:          ${user.name}`);
}