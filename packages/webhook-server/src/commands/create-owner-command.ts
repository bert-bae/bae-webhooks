import { v4 as uuidv4 } from "uuid";
import { BaseCommand, CommandContext } from "./base-command";
import { generateSecret } from "../utils/secret-generator";

export class CreateOwnerCommand extends BaseCommand {
  private ctx: CommandContext;
  constructor(ctx: CommandContext) {
    super();
    this.ctx = ctx;
  }

  public async execute(input: void) {
    const owner = {
      id: uuidv4(),
      accessToken: uuidv4(),
      secretToken: generateSecret(),
    };
    return this.ctx.providers.owners.create(owner);
  }
}
