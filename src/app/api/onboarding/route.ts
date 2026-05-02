import { NextResponse } from "next/server";
import { WebhookValidator } from "@/lib/security/webhook-validator";
import { rateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  // 1. Rate Limiting (Protección contra ataques)
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const { success, remaining } = await rateLimit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: "Demasiadas peticiones. Por favor, espera una hora.", remaining },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const n8nWebhookUrl = process.env.N8N_ONBOARDING_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      console.warn("N8N_ONBOARDING_WEBHOOK_URL is not defined. Data will only be logged.");
      console.log("Onboarding Data:", body);
      return NextResponse.json({ success: true, message: "Logged (no webhook)" });
    }

    // Prepare data with security metadata
    const payload = {
      ...body,
      timestamp: Date.now(),
      app: "Blades Web Pro",
      process: "Onboarding Process Pro Max"
    };

    // Sign the payload
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
      const errorText = await response.text();
      console.error(`n8n Error (${response.status}):`, errorText);
      return NextResponse.json({ 
        success: false, 
        error: `n8n respondió con estado ${response.status}`,
        details: errorText
      }, { status: response.status });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Onboarding process triggered successfully" 
    });
  } catch (error: any) {
    console.error("Onboarding API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
