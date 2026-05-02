import { NextResponse } from "next/server";
import { WebhookValidator } from "@/lib/security/webhook-validator";
import { rateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await rateLimit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Has excedido el límite de reservas. Inténtalo más tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Placeholder for n8n Webhook URL
    // In production, this should be in .env.local
    const n8nWebhookUrl = process.env.N8N_BOOKING_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      console.warn("N8N_BOOKING_WEBHOOK_URL is not defined. Data will only be logged.");
      console.log("Booking Data:", body);
      return NextResponse.json({ success: true, message: "Logged (no webhook)" });
    }

    const payload = {
      ...body,
      timestamp: new Date().toISOString(),
      source: "Blades Web Pro",
    };

    const signature = WebhookValidator.signPayload(payload);

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Blades-Signature": signature,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`n8n responded with ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
