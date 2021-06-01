export class ValidationError extends Error {
  public code: string;
  public validations: Array<Record<string, any>>;

  constructor(message: string, validations: Array<Record<string, any>>) {
    super(message);
    this.code = "ValidationError";
    this.validations = validations;
  }
}
