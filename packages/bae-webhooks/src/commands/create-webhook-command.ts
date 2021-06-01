import { IsString, IsUUID, IsDefined } from "class-validator";
import { BaseCommand, CommandContext } from "./base-command";
import { validateData } from "../utils/validator";
import { DuplicateError, NotFoundError, UnauthorizedError } from "../errors";

class CreateWebhookCommandInput {
  @IsString()
  @IsDefined()
  url: string;

  @IsUUID()
  @IsDefined()
  ownerId: string;

  @IsString()
  @IsDefined()
  accessToken: string;
}

export class CreateWebhookCommand extends BaseCommand {
  private ctx: CommandContext;
  constructor(ctx: CommandContext) {
    super();
    this.ctx = ctx;
  }

  public async execute(input: CreateWebhookCommandInput) {
    await validateData(input, new CreateWebhookCommandInput());
    const owner = await this.ctx.providers.owners.read({ id: input.ownerId });
    if (!owner) {
      throw new NotFoundError("Owner not found", input.ownerId);
    }

    if (owner.accessToken !== input.accessToken) {
      throw new UnauthorizedError("Access token denied");
    }

    const existingWebhooks = await this.ctx.providers.webhooks.read({
      ownerId: input.ownerId,
      url: input.url,
    });
    if (existingWebhooks[0]) {
      throw new DuplicateError(
        `Webhook exists with ${input.url} under this owner ${input.ownerId}`
      );
    }

    await this.ctx.providers.webhooks.create({
      ...input,
      topics: [],
    });

    return input;
  }
}
