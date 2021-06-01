export class UnauthorizedError extends Error {
  public code: string;

  constructor(message: string) {
    super(message);
    this.code = "UnauthorizedError";
  }
}
