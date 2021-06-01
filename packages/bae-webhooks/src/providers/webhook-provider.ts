import { IsArray, IsDefined, IsString, IsUrl } from "class-validator";
import { BaseProvider, ProviderContext } from "./base-provider";
import { validateData } from "../utils/validator";
import { NotFoundError } from "../errors";

export class WebhookSchema {
  @IsUrl()
  @IsDefined()
  url: string;

  @IsString()
  @IsDefined()
  ownerId: string;

  @IsArray()
  topics: string[];
}

export class WebhookProvider extends BaseProvider {
  constructor(ctx: ProviderContext) {
    super(ctx);
    this.create = this.create.bind(this);
    this.read = this.read.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  public async create(input: WebhookSchema): Promise<WebhookSchema> {
    await validateData(input, new WebhookSchema());
    await this.ctx.clients.webhooks.create(input);
    return input;
  }

  public async read(input: Partial<WebhookSchema>): Promise<WebhookSchema[]> {
    const params: Partial<WebhookSchema> & { rangeExpression?: string } = {
      ownerId: input.ownerId,
    };

    if (input.url) {
      params.url = input.url;
      params.rangeExpression = `url = :rkey`;
    }

    return this.ctx.clients.webhooks.read(params);
  }

  public async update(input: WebhookSchema): Promise<WebhookSchema> {
    await validateData(input, new WebhookSchema());

    const webhooks = await this.read(input);
    if (!webhooks[0]) {
      throw new NotFoundError(
        "Webhook does not exist",
        `${input.ownerId}::${input.url}`
      );
    }

    return this.ctx.clients.webhooks.update(input);
  }

  public async delete(
    input: Pick<WebhookSchema, "ownerId" | "url">
  ): Promise<void> {
    return this.ctx.clients.webhooks.delete(input);
  }
}
