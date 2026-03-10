import { UserCommandHandler, CommandHandler } from "./commands/commands";
import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";
import { User } from "./lib/db/schema";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]) => {
        const config = readConfig();
        if (!config.currentUserName) {
            console.log("No current user set in config");
            process.exit(1);
        }

        const user: User = await getUserByName(config.currentUserName);
        if (!user) {
            console.log(`Current user "${config.currentUserName}" does not exist`);
            process.exit(1);
        }

        await handler(cmdName, user, ...args);
    };
}