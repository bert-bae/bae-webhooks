import { validate } from "class-validator";

export abstract class BaseCommand {
  protected async validate(commandClass) {
    const validations = await validate(commandClass);
    if (validations.length !== 0) {
      throw new Error("Validation errors");
    }
  }
  public async execute(input: any): Promise<any> {}
}
