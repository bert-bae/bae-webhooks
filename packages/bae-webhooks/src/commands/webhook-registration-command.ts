import { IsString, IsUUID, IsDefined } from "class-validator";
import { BaseCommand } from "./base-command";

class WebhookRegistrationCommandInput {
  @IsString()
  @IsDefined()
  baseUrl: string;

  @IsUUID()
  @IsDefined()
  ownerId: string;

  @IsString()
  @IsDefined()
  accessToken: string;
}

export class WebhookRegistrationCommand extends BaseCommand {
  public async execute(input: WebhookRegistrationCommandInput) {
    this.validate(new WebhookRegistrationCommandInput());
    // Register hook and return a secret token
  }
}
