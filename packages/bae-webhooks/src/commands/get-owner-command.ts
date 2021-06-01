import { IsUUID, IsDefined } from "class-validator";
import { BaseCommand, CommandContext } from "./base-command";
import { validateData } from "../utils/validator";
import { NotFoundError } from "../errors";

class GetOwnerCommandInput {
  @IsUUID()
  @IsDefined()
  id: string;
}

export class GetOwnerCommand extends BaseCommand {
  private ctx: CommandContext;
  constructor(ctx: CommandContext) {
    super();
    this.ctx = ctx;
  }

  public async execute(input: GetOwnerCommandInput) {
    await validateData(input, new GetOwnerCommandInput());
    const owner = await this.ctx.providers.owners.read({ id: input.id });
    if (!owner) {
      throw new NotFoundError("Owner not found", input.id);
    }

    return owner;
  }
}
