import { BaseClient, BaseClientInput } from "../clients";

export type ProviderContext = {
  logger: {
    info: (message) => void;
    warn: (message, data) => void;
    error: (message, data) => void;
  };
  clients: {
    owners: BaseClient;
    webhooks: BaseClient;
  };
};

export abstract class BaseProvider {
  public ctx: ProviderContext;

  constructor(ctx: ProviderContext) {
    this.ctx = ctx;
  }

  public async create(input: BaseClientInput): Promise<any> {}
  public async read(input: BaseClientInput): Promise<any> {}
  public async update(input: BaseClientInput): Promise<any> {}
  public async delete(input: BaseClientInput): Promise<any> {}
}
