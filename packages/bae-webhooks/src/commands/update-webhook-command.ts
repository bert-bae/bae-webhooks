import { IsString, IsDefined, IsArray, IsUUID } from "class-validator";
import { BaseCommand, CommandContext } from "./base-command";
import { validateData } from "../utils/validator";
import { NotFoundError } from "../errors";

class UpdateWebhookInput {
  @IsUUID()
  @IsDefined()
  ownerId: string;

  @IsString()
  @IsDefined()
  url: string;

  @IsArray()
  @IsDefined()
  topics: string[];
}

export class UpdateWebhook extends BaseCommand {
  private ctx: CommandContext;
  constructor(ctx: CommandContext) {
    super();
    this.ctx = ctx;
  }

  public async execute(input: UpdateWebhookInput) {
    await validateData(input, new UpdateWebhookInput());
    const webhook = await this.ctx.providers.webhooks.read({
      ownerId: input.ownerId,
      url: input.url,
    });
    if (!webhook[0]) {
      throw new NotFoundError(
        "Webhook not found",
        `${input.ownerId}::${input.url}`
      );
    }

    await this.ctx.providers.webhooks.update(input);
    return input;
  }
}
