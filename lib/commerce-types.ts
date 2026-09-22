type OrderChannel = "chatgpt" | "gemini" | "copilot" | "human";

interface StoreProduct {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  currency: "usd" | "cad";
  inventory: number;
  gtin: string;
  brand: string;
  sku: string;
}

interface StorePolicyUrls {
  privacy: string;
  refund: string;
  shipping: string;
}

interface StoreCatalog {
  merchant: string;
  brand: string;
  description: string;
  products: StoreProduct[];
  policies: StorePolicyUrls;
}

interface StoreOrder {
  id: string;
  createdAt: string;
  channel: OrderChannel;
  sku: string;
  title: string;
  quantity: number;
  amount: number;
  currency: string;
  status: "open" | "paid" | "stub";
  agent?: string;
  spt?: string;
}

const UCP_VERSION = "2026-01-23";

export default UCP_VERSION;
