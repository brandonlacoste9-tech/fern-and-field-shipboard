
function buildUcpProfile(origin: string) {
  const base = origin.replace(/\/$/, "");
  return {
    ucp: {
      version: UCP_VERSION,
      services: {
        "dev.ucp.shopping": [
          {
            version: UCP_VERSION,
            spec: "https://ucp.dev/specification/overview",
            transport: "rest",
            endpoint: base + "/ucp/v1",
            schema: "https://ucp.dev/" + UCP_VERSION + "/services/shopping/openapi.json",
          },
          {
            version: UCP_VERSION,
            spec: "https://ucp.dev/specification/overview",
            transport: "mcp",
            endpoint: base + "/mcp",
            schema: "https://ucp.dev/" + UCP_VERSION + "/services/shopping/mcp.json",
          },
        ],
      },
      capabilities: {
        "dev.ucp.shopping.checkout": [
          {
            version: UCP_VERSION,
            spec: "https://ucp.dev/specification/checkout",
            schema: "https://ucp.dev/" + UCP_VERSION + "/schemas/shopping/checkout.json",
          },
        ],
        "dev.ucp.shopping.order": [
          {
            version: UCP_VERSION,
            spec: "https://ucp.dev/specification/order",
            schema: "https://ucp.dev/" + UCP_VERSION + "/schemas/shopping/order.json",
          },
        ],
      },
      payment_handlers: {
        "com.stripe": [
          {
            id: "stripe",
            version: UCP_VERSION,
            spec: "https://docs.stripe.com/agentic-commerce",
            schema: "https://docs.stripe.com/agentic-commerce/schema.json",
            config: {
              environment: process.env.STRIPE_SECRET_KEY ? "production" : "sandbox",
              checkout: base + "/api/checkout",
              acp_checkout_sessions: base + "/api/acp/checkout-sessions",
            },
          },
        ],
      },
    },
    merchant: {
      name: CATALOG.merchant,
      brand: CATALOG.brand,
      description: CATALOG.description,
      policies: CATALOG.policies,
    },
    products: PRODUCTS.map((p) => ({
      id: p.id,
      sku: p.sku,
      title: p.title,
      description: p.description,
      price: p.price,
      currency: p.currency,
      display_price: formatMoney(p.price, p.currency),
      inventory: p.inventory,
      gtin: p.gtin,
      brand: p.brand,
      images: p.images.map((src) => (src.startsWith("http") ? src : base + src)),
      url: base + "/?sku=" + p.id,
      checkout: base + "/api/checkout?sku=" + encodeURIComponent(p.sku),
    })),
    checkout: {
      rest: base + "/api/checkout",
      acp: base + "/api/acp/checkout-sessions",
      mcp: base + "/mcp",
    },
  };
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, UCP-Agent, Authorization",
  "Cache-Control": "public, max-age=60",
};

export default CORS;
