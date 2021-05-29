import { IsDefined, IsString, IsUUID } from "class-validator";
import { v4 as uuidv4 } from "uuid";
import { BaseProvider, ProviderContext } from "./base-provider";
import { validateData } from "../utils/validator";

export class OwnerSchema {
  @IsUUID()
  @IsDefined()
  id: string;

  @IsString()
  @IsDefined()
  accessToken: string;
}

export class OwnerProvider extends BaseProvider {
  constructor(ctx: ProviderContext) {
    super(ctx);
    this.create = this.create.bind(this);
    this.read = this.read.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  public async create(): Promise<Omit<OwnerSchema, "id">> {
    const owner = {
      id: uuidv4(),
      accessToken: uuidv4(),
    };
    await this.ctx.clients.owners.create(owner);
    return {
      accessToken: owner.accessToken,
    };
  }

  public async read(input: { id: string }): Promise<OwnerSchema> {
    return this.ctx.clients.owners.read({ id: input.id });
  }

  public async update(input: OwnerSchema): Promise<OwnerSchema> {
    validateData(input, new OwnerSchema());
    const owner = await this.read({ id: input.id });

    if (!owner) {
      throw new Error("Owner not found");
    }

    await this.ctx.clients.owners.update(input);
    return {
      ...input,
      id: undefined,
    };
  }

  public async delete(input: { id: string }): Promise<void> {
    return this.ctx.clients.owners.delete({ id: input.id });
  }
}
