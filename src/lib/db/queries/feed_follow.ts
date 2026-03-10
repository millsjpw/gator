import { db } from "..";
import { feeds, users, feedFollows, FeedFollow } from "../schema";
import { eq, and } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db.insert(feedFollows).values({userId: userId, feedId: feedId}).returning();
    // select fields from feedFollows, users, and feeds where feedFollows.userId = userId and feedFollows.feedId = feedId
    const [result] = await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            userName: users.name,
            feedUrl: feeds.url,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(users, eq(users.id, feedFollows.userId))
        .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
        .where(eq(feedFollows.id, newFeedFollow.id))
        .limit(1);
    return result;
}

export async function getFeedFollowsByUserId(userId: string) {
    const result = await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            userName: users.name,
            feedUrl: feeds.url,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(users, eq(users.id, feedFollows.userId))
        .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
        .where(eq(feedFollows.userId, userId));
    return result;
}

export async function deleteFeedFollowByUserIdAndFeedId(userId: string, feedId: string) {
    await db.delete(feedFollows).where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)));
}