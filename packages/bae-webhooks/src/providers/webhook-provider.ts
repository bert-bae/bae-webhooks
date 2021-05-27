import { IsArray, IsDefined, IsString, IsUUID } from "class-validator";
import { BaseProvider } from "./base-provider";

export class WebhookSchema {
  @IsUUID()
  @IsDefined()
  id: string;

  @IsUUID()
  @IsDefined()
  url: string;

  @IsString()
  @IsDefined()
  ownerId: string;

  @IsArray()
  topics: string[];
}

export class WebhookProvider extends BaseProvider {
  public async create(input: WebhookSchema): Promise<WebhookSchema> {
    this.validate(new WebhookSchema());
    const webhook = await this.read({ id: input.id });

    if (webhook) {
      return webhook;
    }

    return this.ctx.clients.webhooks.create(input);
  }

  public async read(input: { id: string }): Promise<WebhookSchema> {
    return this.ctx.clients.webhooks.read({ id: input.id });
  }

  public async update(input: WebhookSchema): Promise<WebhookSchema> {
    this.validate(new WebhookSchema());
    const webhook = await this.read({ id: input.id });

    if (webhook.ownerId !== input.ownerId) {
      throw new Error(
        "Only the owner of the webhook can modify webhook configurations"
      );
    }

    return this.ctx.clients.webhooks.update(input);
  }

  public async delete(input: { id: string }): Promise<void> {
    return this.ctx.clients.webhooks.delete({ id: input.id });
  }
}
