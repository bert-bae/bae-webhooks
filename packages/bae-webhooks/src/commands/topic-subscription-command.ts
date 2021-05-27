import { IsString, IsDefined, IsArray, IsUUID } from "class-validator";
import { BaseCommand } from "./base-command";

class TopicSubscriptionCommandInput {
  @IsUUID()
  @IsDefined()
  webhookId: string;

  @IsArray()
  @IsDefined()
  topics: string;

  @IsString()
  @IsDefined()
  accessToken: string;
}

export class TopicSubscriptionCommand extends BaseCommand {
  public async execute(input: TopicSubscriptionCommandInput) {
    this.validate(new TopicSubscriptionCommandInput());
    // Subscribe hook to topics
  }
}
