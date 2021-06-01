import { IsUUID, IsDefined } from "class-validator";
import { BaseCommand, CommandContext } from "./base-command";
import { validateData } from "../utils/validator";

class DeleteOwnerCommandInput {
  @IsUUID()
  @IsDefined()
  id: string;
}

export class DeleteOwnerCommand extends BaseCommand {
  private ctx: CommandContext;
  constructor(ctx: CommandContext) {
    super();
    this.ctx = ctx;
  }

  public async execute(input: DeleteOwnerCommandInput) {
    await validateData(input, new DeleteOwnerCommandInput());
    await this.ctx.providers.owners.delete({ id: input.id });
  }
}
