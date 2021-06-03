import { IsString, IsDefined, IsUUID } from "class-validator";
import { BaseCommand, CommandContext } from "./base-command";
import { validateData } from "../utils/validator";
import { NotFoundError } from "../errors";

class DeleteWebhookCommandInput {
  @IsUUID()
  @IsDefined()
  ownerId: string;

  @IsUUID()
  @IsDefined()
  webhookId: string;
}

export class DeleteWebhookCommand extends BaseCommand {
  private ctx: CommandContext;
  constructor(ctx: CommandContext) {
    super();
    this.ctx = ctx;
  }

  public async execute(input: DeleteWebhookCommandInput) {
    await validateData(input, new DeleteWebhookCommandInput());
    const webhook = await this.ctx.providers.webhooks.read({
      ownerId: input.ownerId,
      webhookId: input.webhookId,
    });
    if (!webhook[0]) {
      throw new NotFoundError(
        "Webhook not found",
        `${input.ownerId}::${input.webhookId}`
      );
    }

    await this.ctx.providers.webhooks.delete(input);
  }
}
