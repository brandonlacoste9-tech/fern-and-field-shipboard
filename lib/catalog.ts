
const CATALOG: StoreCatalog = {
  "merchant": "Replace the product catalog with the correct Fern and Field products: Monstera Deliciosa $38, Stoneware Planter $26, Fern Trio Set $54. Remove the incorrect field-goods products (field notebook, camp blanket, brass desk lamp, canvas tote). Update lib/catalog.ts and all product references.",
  "brand": "Replace the product catalog with the correct Fern and Field products: Monstera Deliciosa $38, Stoneware Planter $26, Fern Trio Set $54. Remove the incorrect field-goods products (field notebook, camp blanket, brass desk lamp, canvas tote). Update lib/catalog.ts and all product references.",
  "description": "Field goods for people who still write things down. One catalog, human storefront and agent profile.",
  "policies": {
    "privacy": "/policies/privacy",
    "refund": "/policies/refund",
    "shipping": "/policies/shipping"
  },
  "products": [
  { "id": "monstera-deliciosa", "sku": "MONSTERA-DEL", "title": "Monstera Deliciosa", "description": "Monstera Deliciosa", "images": [], "price": 3800, "currency": "usd", "inventory": 24, "gtin": "2001378636968", "brand": "Fern and Field" },
  { "id": "stoneware-planter", "sku": "STONEWARE-PL", "title": "Stoneware Planter", "description": "Stoneware Planter", "images": [], "price": 2600, "currency": "usd", "inventory": 24, "gtin": "2000612775114", "brand": "Fern and Field" },
  { "id": "fern-trio-set", "sku": "FERN-TRIO-SE", "title": "Fern Trio Set", "description": "Fern Trio Set", "images": [], "price": 5400, "currency": "usd", "inventory": 24, "gtin": "2000697301720", "brand": "Fern and Field" }
]
} as StoreCatalog;

const PRODUCTS: StoreProduct[] = CATALOG.products;

function getProduct(id: string): StoreProduct | null {
  const key = String(id || "").toLowerCase();
  return (
    PRODUCTS.find(
      (p) =>
        p.id === id ||
        p.sku.toLowerCase() === key ||
        p.gtin === id
    ) || null
  );
}

function searchProducts(query?: string): StoreProduct[] {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter((p) =>
    [p.title, p.description, p.brand, p.sku, p.id].join(" ").toLowerCase().includes(q)
  );
}

function formatMoney(cents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export default function CATALOG() {
  return null;
}
