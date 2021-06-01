import { validate } from "class-validator";
import { ValidationError } from "../errors";

export const validateData = async (input: Record<string, any>, schema) => {
  for (const k in input) {
    schema[k] = input[k];
  }
  const validations = await validate(schema);
  if (validations.length !== 0) {
    throw new ValidationError("Validation errors", validations);
  }
};
