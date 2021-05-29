import { validate } from "class-validator";

export const validateData = async (input: Record<string, any>, schema) => {
  const data = {
    ...schema,
    ...input,
  };
  const validations = await validate(data);
  if (validations.length !== 0) {
    throw new Error("Validation errors");
  }
};
