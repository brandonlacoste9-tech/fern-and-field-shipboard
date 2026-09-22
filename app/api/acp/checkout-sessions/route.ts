import { NextResponse } from "next/server";
import { getProduct } from "@/lib/catalog";
import { createOrder, getOrder } from "@/lib/orders";
import { detectChannel } from "@/lib/channel";
import { CORS } from "@/lib/ucp";










/**
 * Agentic Commerce Protocol stub.
 * Logs the Shared Payment Token. v0 does not capture the charge.
 */
async export default function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id") || "";
  const order = id ? await getOrder(id) : null;
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
  return NextResponse.json({ checkout_session: order }, { headers: CORS });
}

async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }
  const payment = (body.payment || body.payment_method || {}) as Record<string, unknown>;
  const spt = String(
    payment.shared_payment_token ||
      payment.token ||
      body.shared_payment_token ||
      ""
  );
  const items = Array.isArray(body.line_items) ? body.line_items : [body];
  const first = items[0] || {};
  const sku = String(first.sku || first.id || body.sku || "");
  const quantity = Math.max(1, Number(first.quantity || body.quantity || 1));
  const product = getProduct(sku);
  if (!product) {
    return NextResponse.json({ error: "Unknown product" }, { status: 400, headers: CORS });
  }
  const channel = detectChannel(req, body);
  if (spt) {
    console.info("[ACP] Shared Payment Token received (not captured)", {
      spt: spt.slice(0, 12) + "…",
      sku: product.sku,
      channel,
    });
  } else {
    console.info("[ACP] checkout-session without SPT", { sku: product.sku, channel });
  }
  const order = await createOrder({
    channel,
    sku: product.sku,
    title: product.title,
    quantity,
    amount: product.price * quantity,
    currency: product.currency,
    status: "stub",
    agent: channel === "human" ? undefined : channel,
    spt: spt ? spt.slice(0, 24) : undefined,
  });
  return NextResponse.json(
    {
      id: order.id,
      status: "requires_confirmation",
      payment_status: spt ? "token_logged_not_captured" : "unpaid",
      checkout_session: order,
      note: "v0 ACP stub — SPT logged, charge not captured.",
    },
    { headers: CORS }
  );
}
