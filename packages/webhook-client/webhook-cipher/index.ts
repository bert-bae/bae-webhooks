import crypto from 'crypto'

export class WebhookCipher {
  private alg: string

  constructor() {
    this.alg = 'aes-256-cbc'
  }

  public encrypt(message: string, secretKey: string) {
    const iv = crypto.randomBytes(16).toString('hex').slice(0, 16)
    const cipher = crypto.createCipheriv(this.alg, secretKey, iv)
    return iv + cipher.update(message, 'utf8', 'hex') + cipher.final('hex')
  }

  public decrypt(hash: string, secretKey: string) {
    const [iv, payload] = this.extractEncryptedPayloadParts(hash)
    const decipher = crypto.createDecipheriv(this.alg, secretKey, iv)
    return decipher.update(payload, 'hex', 'utf8') + decipher.final('utf8')
  }

  private extractEncryptedPayloadParts(hash: string): string[] {
    const iv = hash.slice(0, 16)
    const payload = hash.slice(16)
    return [iv, payload]
  }
}
