import log from "loglevel";
import { ProviderContext, WebhookProvider, OwnerProvider } from "./providers";
import { DynamoDBClient } from "./clients";
import { CommandContext } from "./commands";

const createProviderContext = (): ProviderContext => {
  const ownerClient = new DynamoDBClient("Owners", "id");
  const webhookClient = new DynamoDBClient("Webhooks", "ownerId", "webhookId");

  return {
    logger: log,
    clients: {
      owners: ownerClient,
      webhooks: webhookClient,
    },
  };
};
const providerContext = createProviderContext();

export const createCommandContext = (): CommandContext => {
  const webhookProvider = new WebhookProvider(providerContext);
  const ownerProvider = new OwnerProvider(providerContext);
  return {
    logger: log,
    providers: {
      owners: ownerProvider,
      webhooks: webhookProvider,
    },
  };
};
