import { IsDefined, IsString, IsUUID } from "class-validator";
import { BaseProvider, ProviderContext } from "./base-provider";
import { validateData } from "../utils/validator";

export class OwnerSchema {
  @IsUUID()
  @IsDefined()
  id: string;

  @IsString()
  @IsDefined()
  accessToken: string;

  @IsString()
  @IsDefined()
  secretToken: string;
}

export class OwnerProvider extends BaseProvider {
  constructor(ctx: ProviderContext) {
    super(ctx);
    this.create = this.create.bind(this);
    this.read = this.read.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  public async create(input: OwnerSchema): Promise<OwnerSchema> {
    await validateData(input, new OwnerSchema());
    await this.ctx.clients.owners.create(input);
    return input;
  }

  public async read(input: { id: string }): Promise<OwnerSchema> {
    const owners = await this.ctx.clients.owners.read({ id: input.id });
    return owners[0];
  }

  public async update(input: OwnerSchema): Promise<OwnerSchema> {
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
