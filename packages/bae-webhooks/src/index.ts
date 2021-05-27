import { RegisterHookCommand } from "./commands/webhook-registration-command";

const command = new RegisterHookCommand();
command.execute({ ownerId: "", baseUrl: "", accessToken: null });
