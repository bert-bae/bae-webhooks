import { BaseCommand } from "./base-command";

export type SimpleCommandInput = {
  hello: "world";
};

export class SimpleCommand extends BaseCommand {
  public async execute(input: SimpleCommandInput) {
    console.log("hello world");
  }
}
