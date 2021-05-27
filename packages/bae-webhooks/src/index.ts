import { SimpleCommand } from "./commands/simple-command";

const command = new SimpleCommand();
command.execute({ hello: "world" });
