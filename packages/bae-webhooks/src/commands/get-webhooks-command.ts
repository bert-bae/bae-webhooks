import { IsString, IsUUID, IsDefined } from "class-validator";
import { BaseCommand, CommandContext } from "./base-command";
import { validateData } from "../utils/validator";
import { DuplicateError, NotFoundError, UnauthorizedError } from "../errors";

class GetWebhookCommandInput {
  @IsString()
  url: string;

  @IsUUID()
  @IsDefined()
  ownerId: string;
}

export class GetWebhooksCommand extends BaseCommand {
  private ctx: CommandContext;
  constructor(ctx: CommandContext) {
    super();
    this.ctx = ctx;
  }

  public async execute(input: GetWebhookCommandInput) {
    await validateData(input, new GetWebhookCommandInput());
    return this.ctx.providers.webhooks.read(input);
  }
}
