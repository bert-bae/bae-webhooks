import crypto from 'crypto'

export class WebhookCipher {
  private alg: string
  private iv: any

  constructor() {
    this.alg = 'aes-256-cbc'
    this.iv = '1234567891234567' // crypto.randomBytes(16).toString('hex').slice(0, 16)
  }

  public encrypt(message: string, secretKey: string) {
    const cipher = crypto.createCipheriv(this.alg, secretKey, this.iv)
    return cipher.update(message, 'utf8', 'hex') + cipher.final('hex')
  }

  public decrypt(hash: string, secretKey: string) {
    const decipher = crypto.createDecipheriv(this.alg, secretKey, this.iv)
    return decipher.update(hash, 'hex', 'utf8') + decipher.final('utf8')
  }
}
