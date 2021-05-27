import { SimpleCommand } from "./commands/simple-command";
import { RegisterHookCommand } from "./commands/register-hook-command";

const command = new RegisterHookCommand();
command.execute({ ownerId: "", baseUrl: "", accessToken: null });
