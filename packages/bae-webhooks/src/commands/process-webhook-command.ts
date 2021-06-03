import { IsUUID, IsDefined, IsEnum, IsObject } from "class-validator";
import { v4 as uuidv4 } from "uuid";
import { BaseCommand, CommandContext } from "./base-command";
import { validateData } from "../utils/validator";
import { NotFoundError } from "../errors";
import { Topics } from "../types";

class ProcessWebhookCommandInput {
  @IsEnum(Topics)
  @IsDefined()
  type: Topics;

  @IsUUID()
  @IsDefined()
  ownerId: string;

  @IsObject()
  data: Record<string, any>;
}

export class ProcessWebhookCommand extends BaseCommand {
  private ctx: CommandContext;
  constructor(ctx: CommandContext) {
    super();
    this.ctx = ctx;
  }

  public async execute(input: ProcessWebhookCommandInput): Promise<void> {
    await validateData(input, new ProcessWebhookCommandInput());
    const owner = await this.ctx.providers.owners.read({ id: input.ownerId });
    if (!owner) {
      throw new NotFoundError("Owner not found", input.ownerId);
    }

    const webhooks = await this.ctx.providers.webhooks.read({
      ownerId: input.ownerId,
    });
    console.log(webhooks);
  }
}
