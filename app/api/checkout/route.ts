import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { email } = (await request.json().catch(() => ({}))) as { email?: string };
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!stripeKey || !priceId) {
    return NextResponse.json({
      mock: true,
      message: "Stripe is not configured. Demo Pro activation is available locally."
    });
  }

  const params = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    success_url: `${siteUrl}/pro?checkout=success`,
    cancel_url: `${siteUrl}/pro?checkout=cancelled`
  });

  if (email) {
    params.set("customer_email", email);
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Stripe checkout failed." }, { status: 500 });
  }

  const data = (await response.json()) as { url?: string };
  return NextResponse.json({ url: data.url });
}
