import { db } from "..";
import { feeds, users } from "../schema";
import { eq, sql } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createFeed(url: string, name: string, userId: string) {
    const [result] = await db.insert(feeds).values({ url, name, userId: userId }).returning();
    return result;
}

export async function getFeedByURL(url: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url)).limit(1);
    return result;
}

export async function getFeedsByUserId(userId: string) {
    const result = await db.select().from(feeds).where(eq(feeds.userId, userId));
    return result;
}

export async function deleteAllFeeds() {
    await db.delete(feeds);
}

export async function getAllFeeds() {
    const result = await db.select().from(feeds);
    return result;
}

export async function markFeedFetched(feedId: string) {
    const now = new Date();
    await db.update(feeds).set({ lastFetchedAt: now, updatedAt: now }).where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch() {
    const result = await db
        .select()
        .from(feeds)
        .orderBy(sql`${feeds.lastFetchedAt} asc nulls first`)
        .limit(1);
    return firstOrUndefined(result);
}