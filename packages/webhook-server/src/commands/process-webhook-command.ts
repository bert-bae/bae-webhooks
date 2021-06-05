import { IsUUID, IsDefined, IsEnum, IsObject } from 'class-validator'
import axios from 'axios'
import { BaseCommand, CommandContext } from './base-command'
import { WebhookSchema } from '../providers'
import { validateData } from '../utils/validator'
import { NotFoundError } from '../errors'
import { Topics } from '../types'

class ProcessWebhookCommandInput {
  @IsEnum(Topics)
  @IsDefined()
  type: Topics

  @IsUUID()
  @IsDefined()
  ownerId: string

  @IsObject()
  data: Record<string, any>
}

export class ProcessWebhookCommand extends BaseCommand {
  private ctx: CommandContext
  constructor(ctx: CommandContext) {
    super()
    this.ctx = ctx
  }

  public async execute(input: ProcessWebhookCommandInput): Promise<void> {
    await validateData(input, new ProcessWebhookCommandInput())
    this.ctx.logger.info(
      `[ProcessWebhook] Processing webhook event ${input.type} for owner ${input.ownerId}`
    )
    const owner = await this.ctx.providers.owners.read({ id: input.ownerId })
    if (!owner) {
      throw new NotFoundError('Owner not found', input.ownerId)
    }

    const webhooks = await this.ctx.providers.webhooks.read({
      ownerId: input.ownerId,
    })
    await Promise.all(
      webhooks.map(async (hook) => {
        if (this.hookIsSubscribed(hook, input.type)) {
          const payload = this.ctx.cipher.encrypt(
            JSON.stringify(input),
            owner.secretToken
          )
          this.ctx.logger.info(
            `[ProcessWebhook] Topic subscription to ${input.type} found. Sending encrypted payload ${payload}`
          )
          await this.sendWebhook(hook, payload)
        }
      })
    )
  }

  private hookIsSubscribed(webhook: WebhookSchema, type: Topics): boolean {
    return webhook.topics.includes(type)
  }

  private async sendWebhook(
    webhook: WebhookSchema,
    payload: string
  ): Promise<void> {
    await axios.post(webhook.url, {
      payload,
    })
  }
}
