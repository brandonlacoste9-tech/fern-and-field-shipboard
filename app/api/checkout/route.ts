import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/checkout";
import { detectChannel } from "@/lib/channel";
import { CORS } from "@/lib/ucp";








async export default function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }
  const sku = String(body.sku || body.id || new URL(req.url).searchParams.get("sku") || "");
  const quantity = Number(body.quantity || 1);
  const channel = detectChannel(req, body);
  try {
    const session = await createCheckoutSession({
      sku,
      quantity,
      channel,
      origin: new URL(req.url).origin,
    });
    return NextResponse.json(session, { headers: CORS });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: msg }, { status: 400, headers: CORS });
  }
}

async function GET(req: Request) {
  const url = new URL(req.url);
  const sku = url.searchParams.get("sku") || "";
  const quantity = Number(url.searchParams.get("quantity") || 1);
  const channel = detectChannel(req, { sku });
  try {
    const session = await createCheckoutSession({
      sku,
      quantity,
      channel,
      origin: url.origin,
    });
    return NextResponse.redirect(session.url, { headers: CORS });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: msg }, { status: 400, headers: CORS });
  }
}
