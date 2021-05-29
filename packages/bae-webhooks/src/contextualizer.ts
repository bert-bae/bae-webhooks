import log from "loglevel";
import { ProviderContext } from "./providers";
import { DynamoDBClient } from "./clients";

export const createContext = (): ProviderContext => {
  const ownerClient = new DynamoDBClient("Owners", "id");
  const webhookClient = new DynamoDBClient("Webhooks", "id", "ownerId");

  return {
    logger: log,
    clients: {
      owners: ownerClient,
      webhooks: webhookClient,
    },
  };
};
