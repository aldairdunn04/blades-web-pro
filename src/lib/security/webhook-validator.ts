import { createHmac } from "crypto";

export class WebhookValidator {
  private static readonly SECRET = process.env.N8N_WEBHOOK_SECRET || "default_secret_change_me";

  /**
   * Generates an HMAC signature for a payload.
   */
  static generateSignature(payload: string): string {
    return createHmac("sha256", this.SECRET)
      .update(payload)
      .digest("hex");
  }

  /**
   * Verifies an HMAC signature for a payload.
   */
  static verifySignature(payload: string, signature: string): boolean {
    const expectedSignature = this.generateSignature(payload);
    return expectedSignature === signature;
  }

  /**
   * Securely signs an object payload and returns the signature.
   */
  static signPayload(data: object): string {
    const payloadString = JSON.stringify(data);
    return this.generateSignature(payloadString);
  }
}
