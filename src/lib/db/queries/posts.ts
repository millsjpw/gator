import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { feeds, posts } from "../schema";

export async function createPost(title: string, url: string, description: string | null, publishedAt: Date | null, feedId: string) {
    // url is unique, so if a post with the same url already exists, we can skip it
    const existingPost = await db.select().from(posts).where(eq(posts.url, url)).limit(1);
    if (existingPost.length > 0) {
        return null;
    }
    const [result] = await db.insert(posts).values({ title, url, description, publishedAt, feedId }).returning();
    return result;
}

export async function getPostsForUser(userId: string, limit: number = 2) {
    const result = await db
        .select()
        .from(posts)
        .innerJoin(feeds, eq(posts.feedId, feeds.id))
        .where(eq(feeds.userId, userId))
        .orderBy(sql`${posts.publishedAt} desc nulls last, ${posts.createdAt} desc`)
        .limit(limit);
    return result.map((row) => row.posts);
}