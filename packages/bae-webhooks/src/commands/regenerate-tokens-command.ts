import { IsUUID, IsDefined } from "class-validator";
import { v4 as uuidv4 } from "uuid";
import { BaseCommand, CommandContext } from "./base-command";
import { validateData } from "../utils/validator";
import { NotFoundError } from "../errors";

class RegenerateTokensCommandInput {
  @IsUUID()
  @IsDefined()
  id: string;
}

export class RegenerateTokensCommand extends BaseCommand {
  private ctx: CommandContext;
  constructor(ctx: CommandContext) {
    super();
    this.ctx = ctx;
  }

  public async execute(input: RegenerateTokensCommandInput) {
    await validateData(input, new RegenerateTokensCommandInput());
    const owner = await this.ctx.providers.owners.read({ id: input.id });
    if (!owner) {
      throw new NotFoundError("Owner not found", input.id);
    }

    owner.accessToken = uuidv4();
    owner.secretToken = uuidv4();
    await this.ctx.providers.owners.update(owner);
    return owner;
  }
}
