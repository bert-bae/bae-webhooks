import { WebhookCipher } from "@bae/webhooks";
import { OwnerProvider, WebhookProvider } from "../providers";

export type CommandContext = {
  logger: {
    info: (message) => void;
    warn: (message, data) => void;
    error: (message, data) => void;
  };
  cipher: WebhookCipher;
  providers: {
    owners: OwnerProvider;
    webhooks: WebhookProvider;
  };
};

export abstract class BaseCommand {
  public async execute(input: any): Promise<any> {}
}
