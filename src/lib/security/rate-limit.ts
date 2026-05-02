import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Create a new ratelimiter using Upstash Redis
// It will automatically use UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from .env
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"), // Limitado a 5 por hora
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export async function rateLimit(ip: string) {
  // If no env vars, fallback to success (development)
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn("Upstash Redis credentials missing. Rate limiting is disabled.");
    return { success: true, limit: 5, remaining: 5, reset: Date.now() };
  }

  try {
    const { success, limit, reset, remaining } = await ratelimit.limit(`ip_${ip}`);
    return { success, limit, remaining, reset };
  } catch (error) {
    console.error("Rate limit error:", error);
    return { success: true, limit: 5, remaining: 5, reset: Date.now() };
  }
}

export async function verifyReCaptcha(token: string) {
  // reCAPTCHA desactivado a petición del usuario.
  // Confiamos en el Honeypot, Human Speed Check y el Rate Limiting de Upstash.
  return true;
}
