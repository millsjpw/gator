import { createFeedFollow, deleteFeedFollowByUserIdAndFeedId, getFeedFollowsByUserId } from "src/lib/db/queries/feed_follow";
import { getFeedByURL } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        console.log(`Usage: cli ${cmdName} <feedURL>`);
        process.exit(1);
    }

    const feedURL = args[0];
    const feed = await getFeedByURL(feedURL);
    if (!feed) {
        console.log(`No feed found with URL "${feedURL}"`);
        process.exit(1);
    }

    const feedFollow = await createFeedFollow(user.id, feed.id);
    if (!feedFollow) {
        throw new Error(`Failed to follow feed`);
    }

    console.log(`Feed follow created:`);
    printFeedFollow(feedFollow.userName, feedFollow.feedName);
}

export async function handlerListFollows(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 0) {
        console.log(`Usage: cli ${cmdName}`);
        process.exit(1);
    }

    const feedFollows = await getFeedFollowsByUserId(user.id);
    if (!feedFollows || feedFollows.length === 0) {
        console.log("No follows found for current user");
        return;
    }

    console.log(`Feeds followed by "${user.name}":`);
    for (const feedFollow of feedFollows) {
        console.log(` * ${feedFollow.feedName} (${feedFollow.feedUrl})`);
    }
}

export function printFeedFollow(username: string, feedname: string) {
  console.log(`* User:          ${username}`);
  console.log(`* Feed:          ${feedname}`);
}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        console.log(`Usage: cli ${cmdName} <feedURL>`);
        process.exit(1);
    }

    const feedURL = args[0];
    const feed = await getFeedByURL(feedURL);
    if (!feed) {
        console.log(`No feed found with URL "${feedURL}"`);
        process.exit(1);
    }

    await deleteFeedFollowByUserIdAndFeedId(user.id, feed.id);
    console.log(`Unfollowed feed "${feed.name}" successfully!`);
}