import crypto from "crypto";

export const generateSecret = (): string => {
  return crypto.randomBytes(16).toString("hex");
};
