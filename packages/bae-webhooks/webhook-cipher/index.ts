import crypto from "crypto";

export class WebookCipher {
  private alg: string;
  private iv: any;
  private secretKey: string;

  constructor(secretKey: string) {
    this.alg = "aes-256-cbc";
    this.iv = crypto.randomBytes(16).toString("hex").slice(0, 16);
    this.secretKey = secretKey;
  }

  public encrypt(message: string) {
    const cipher = crypto.createCipheriv(this.alg, this.secretKey, this.iv);
    return cipher.update(message, "utf8", "hex") + cipher.final("hex");
  }

  public decrypt(hash: string) {
    const decipher = crypto.createDecipheriv(this.alg, this.secretKey, this.iv);
    return decipher.update(hash, "hex", "utf8") + decipher.final("utf8");
  }
}
