import { IsDefined, IsString, IsUUID } from "class-validator";
import { BaseProvider } from "./base-provider";

export class OwnerSchema {
  @IsUUID()
  @IsDefined()
  id: string;

  @IsString()
  @IsDefined()
  accessToken: string;
}

export class OwnerProvider extends BaseProvider {
  public async create(input: OwnerSchema): Promise<OwnerSchema> {
    this.validate(new OwnerSchema());
    const owner = await this.read({ id: input.id });

    if (owner) {
      return owner;
    }

    return this.ctx.clients.owners.create(input);
  }

  public async read(input: { id: string }): Promise<OwnerSchema> {
    return this.ctx.clients.owners.read({ id: input.id });
  }

  public async update(input: OwnerSchema): Promise<OwnerSchema> {
    this.validate(new OwnerSchema());
    const owner = await this.read({ id: input.id });

    if (!owner) {
      throw new Error("Owner not found");
    }

    return this.ctx.clients.owners.update(input);
  }

  public async delete(input: { id: string }): Promise<void> {
    return this.ctx.clients.owners.delete({ id: input.id });
  }
}
