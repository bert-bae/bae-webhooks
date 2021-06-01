import { IsObject, IsString, IsUUID, IsDefined } from "class-validator";
import { BaseCommand } from "./base-command";

class TestWebhookCommandInput {
  @IsUUID()
  @IsDefined()
  webhookId: string;

  @IsString()
  @IsDefined()
  accessToken: string;

  @IsObject()
  payload: Record<string, any>;
}

export class TestWebhookCommand extends BaseCommand {
  public async execute(input: TestWebhookCommandInput) {
    // this.validate(new TestWebhookCommandInput());
    // Test hook by sending a test payload
  }
}
