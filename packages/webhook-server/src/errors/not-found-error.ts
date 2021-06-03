export class NotFoundError extends Error {
  public code: string;
  public entity: string;

  constructor(message: string, entity: string) {
    super(message);
    this.code = "NotFoundError";
    this.entity = entity;
  }
}
