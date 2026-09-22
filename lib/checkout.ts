
async function createCheckoutSession(input: {
  sku: string;
  quantity?: number;
  channel?: OrderChannel;
  origin?: string;
}): Promise<{ id: string; url: string; orderId: string; stub: boolean }> {
  const product = getProduct(input.sku);
  if (!product) throw new Error("Unknown product");
  const quantity = Math.max(1, Math.min(99, Number(input.quantity) || 1));
  const amount = product.price * quantity;
  const origin = (input.origin || process.env.NEXT_PUBLIC_STORE_URL || "").replace(/\/$/, "");
  const secret = process.env.STRIPE_SECRET_KEY?.trim();

  if (secret) {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity,
          price_data: {
            currency: product.currency,
            unit_amount: product.price,
            product_data: { name: product.title, images: product.images.slice(0, 1) },
          },
        },
      ],
      success_url: origin + "/checkout/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin + "/",
      metadata: {
        sku: product.sku,
        channel: input.channel || "human",
      },
    });
    const order = await createOrder({
      channel: input.channel || "human",
      sku: product.sku,
      title: product.title,
      quantity,
      amount,
      currency: product.currency,
      status: "open",
    });
    return { id: session.id, url: session.url || "/checkout/success", orderId: order.id, stub: false };
  }

  const order = await createOrder({
    channel: input.channel || "human",
    sku: product.sku,
    title: product.title,
    quantity,
    amount,
    currency: product.currency,
    status: "stub",
  });
  const url =
    (origin || "") +
    "/checkout/success?order=" +
    order.id +
    "&channel=" +
    (input.channel || "human");
  return { id: "cs_stub_" + order.id, url, orderId: order.id, stub: true };
}

export default Stripe;
