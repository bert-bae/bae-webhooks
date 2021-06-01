export class DuplicateError extends Error {
  public code: string;

  constructor(message: string) {
    super(message);
    this.code = "DuplicateError";
  }
}
