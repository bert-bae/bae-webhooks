export type BaseClientInput = Record<string, any>;

export abstract class BaseClient {
  public async create(input: BaseClientInput): Promise<any> {}
  public async read(input: BaseClientInput): Promise<any> {}
  public async update(input: BaseClientInput): Promise<any> {}
  public async delete(input: BaseClientInput): Promise<any> {}
}
