import { OwnerProvider, WebhookProvider } from "../providers";

export type CommandContext = {
  logger: {
    info: (message) => void;
    warn: (message, data) => void;
    error: (message, data) => void;
  };
  providers: {
    owners: OwnerProvider;
    webhooks: WebhookProvider;
  };
};

export abstract class BaseCommand {
  public async execute(input: any): Promise<any> {}
}
