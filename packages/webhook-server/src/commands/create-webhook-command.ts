import { IsString, IsUUID, IsDefined } from 'class-validator'
import { v4 as uuidv4 } from 'uuid'
import { BaseCommand, CommandContext } from './base-command'
import { validateData } from '../utils/validator'
import { DuplicateError, NotFoundError, UnauthorizedError } from '../errors'

class CreateWebhookCommandInput {
  @IsString()
  @IsDefined()
  url: string

  @IsUUID()
  @IsDefined()
  ownerId: string

  @IsString()
  @IsDefined()
  accessToken: string
}

export class CreateWebhookCommand extends BaseCommand {
  private ctx: CommandContext
  constructor(ctx: CommandContext) {
    super()
    this.ctx = ctx
  }

  public async execute(input: CreateWebhookCommandInput) {
    await validateData(input, new CreateWebhookCommandInput())
    const owner = await this.ctx.providers.owners.read({ id: input.ownerId })
    if (!owner) {
      throw new NotFoundError('Owner not found', input.ownerId)
    }

    if (owner.accessToken !== input.accessToken) {
      throw new UnauthorizedError('Access token denied')
    }

    const existingWebhooks = await this.ctx.providers.webhooks.read({
      ownerId: input.ownerId,
    })
    if (existingWebhooks.find((h) => h.url === input.url)) {
      throw new DuplicateError(
        `Webhook exists with ${input.url} under this owner ${input.ownerId}`
      )
    }

    const webhook = {
      ownerId: input.ownerId,
      url: input.url,
      webhookId: uuidv4(),
      topics: [],
    }

    this.ctx.logger.info(
      `[Webhook] Creating webhook ${webhook.webhookId} for owner ${webhook.ownerId}`
    )
    await this.ctx.providers.webhooks.create(webhook)

    return webhook
  }
}
