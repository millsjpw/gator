import { createUser, getUserByName, getAllUsers } from "src/lib/db/queries/users";
import { readConfig, setUser } from "../config";
import { getPostsForUser } from "src/lib/db/queries/posts";
import { User } from "src/lib/db/schema";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    const userName = args[0];
    const user = await getUserByName(userName);
    if (!user) {
        throw new Error(`user "${userName}" does not exist`);
    }
    setUser(userName);
    console.log(`User switched successfully!`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    const userName = args[0];
    const result = await createUser(userName);
    if (!result) {
        throw new Error(`user "${userName}" already exists`);
    }
    setUser(userName);
    console.log(`User registered successfully!`);
    console.log(result);
}

export async function handlerListUsers(cmdName: string, ...args: string[]) {
    if (args.length !== 0) {
        throw new Error(`usage: ${cmdName}`);
    }
    const users = await getAllUsers();
    const config = readConfig();

    for (const user of users) {
        console.log(` * ${user.name}${user.name === config.currentUserName ? " (current)" : ""}`);
    }
}

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    // get the latest posts for the user with an optional limit parameter
    let limit = 2; // default limit
    if (args.length > 1) {
        throw new Error(`usage: ${cmdName} [limit]`);
    }
    if (args.length === 1) {
        limit = parseInt(args[0], 10);
        if (isNaN(limit) || limit <= 0) {
            throw new Error(`invalid limit: ${args[0]}`);
        }
    }

    const posts = await getPostsForUser(user.id, limit);
    for (const post of posts) {
        console.log(` * ${post.title} (${post.url})`);
    }
}