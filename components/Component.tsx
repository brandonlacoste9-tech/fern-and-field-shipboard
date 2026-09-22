import Header from "./Header";
import ProductGrid from "./ProductGrid";
import ProductDetail from "./ProductDetail";
import Footer from "./Footer";
import CATALOG from "./lib/catalog";
import UCP_VERSION from "./lib/commerce-types";
import CHANNELS from "./lib/channel";
import DDL from "./lib/orders";
import Stripe from "./lib/checkout";
import CORS from "./lib/ucp";
import OPTIONS from "./app/.well-known/ucp/route";
import OPTIONS from "./app/ucp/v1/products/route";
import OPTIONS from "./app/api/checkout/route";
import OPTIONS from "./app/api/acp/checkout-sessions/route";
import TOOLS from "./app/mcp/route";
import AdminOrdersPage from "./app/admin/orders/page";
import CheckoutSuccessPage from "./app/checkout/success/page";
import Page from "./app/policies/privacy/page";
import Page from "./app/policies/refund/page";
import Page from "./app/policies/shipping/page";

const PRODUCTS = [
  { "id": "monstera-deliciosa", "sku": "MONSTERA-DEL", "title": "Monstera Deliciosa", "description": "Monstera Deliciosa", "images": [], "price": 3800, "currency": "usd", "inventory": 24, "gtin": "2001378636968", "brand": "Fern and Field" },
  { "id": "stoneware-planter", "sku": "STONEWARE-PL", "title": "Stoneware Planter", "description": "Stoneware Planter", "images": [], "price": 2600, "currency": "usd", "inventory": 24, "gtin": "2000612775114", "brand": "Fern and Field" },
  { "id": "fern-trio-set", "sku": "FERN-TRIO-SE", "title": "Fern Trio Set", "description": "Fern Trio Set", "images": [], "price": 5400, "currency": "usd", "inventory": 24, "gtin": "2000697301720", "brand": "Fern and Field" }
];

const ICONS: Record<string, React.ReactNode> = {
  "monstera-deliciosa": <svg viewBox="0 0 120 150" className="w-4/5 h-4/5"><path d="M60 20 Q85 45 70 85 Q55 120 60 140" fill="none" stroke="#57534E" strokeWidth="2"/><circle cx="60" cy="55" r="18" fill="none" stroke="#57534E" strokeWidth="1.5"/><path d="M42 50 Q30 65 38 90" fill="none" stroke="#57534E" strokeWidth="1.5"/></svg>,
  "stoneware-planter": <svg viewBox="0 0 120 150" className="w-4/5 h-4/5"><rect x="35" y="45" width="50" height="70" rx="2" fill="none" stroke="#57534E" strokeWidth="2"/><path d="M30 50 Q60 35 90 50" fill="none" stroke="#57534E" strokeWidth="1.5"/><line x1="35" y1="115" x2="85" y2="115" stroke="#57534E" strokeWidth="2"/></svg>,
  "fern-trio-set": <svg viewBox="0 0 120 150" className="w-4/5 h-4/5"><path d="M45 30 Q40 70 55 110" fill="none" stroke="#57534E" strokeWidth="1.5"/><path d="M60 25 Q55 65 70 105" fill="none" stroke="#57534E" strokeWidth="1.5"/><path d="M75 32 Q70 72 82 108" fill="none" stroke="#57534E" strokeWidth="1.5"/><circle cx="60" cy="120" r="8" fill="none" stroke="#57534E" strokeWidth="1.5"/></svg>
};

function formatMoney(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export default function Component() {
  const [selected, setSelected] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const channel = new URLSearchParams(window.location.search).get('channel') || 'human';

  const handleBuy = async (sku: string, quantity: number) => {
    const result = await (window as any).createCheckoutSession?.({ sku, quantity, channel });
    if (result?.url) {
      window.location.href = result.url;
    } else {
      alert('Checkout attaches on eject');
    }
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setEmail(''); }, 1800);
    }
  };

  return (
    <div className="bg-[#F7F3EC] text-stone-900 font-sans min-h-screen">
      <div className="bg-[#F7F3EC] border-b border-stone-200 py-2 text-center text-[11px] tracking-[0.2em] uppercase">
        Free shipping on orders over $75 <span className="inline-block w-px h-3 bg-[#E24A2A] mx-3 align-middle"></span> Curated in small batches
      </div>

      <Header onCartClick={() => {}} cartCount={cartCount} />

      <section className="min-h-[92vh] flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <div className="font-serif text-[72px] md:text-[92px] tracking-[-0.04em] leading-[0.92]">Fern and Field.<br />houseplants and ceramic planters</div>
          <a href="#catalog" className="mt-10 inline-block px-10 py-4 text-[11px] tracking-[0.18em] uppercase border-b-2 border-current hover:bg-stone-900 hover:text-stone-50 transition-colors">Explore the collection</a>
        </div>
      </section>

      <div id="catalog" className="mx-auto max-w-7xl px-6 md:px-8 py-8 border-b border-stone-200">
        <div className="font-mono text-xs tracking-[0.2em] text-stone-500">03 OBJECTS / 01 COLLECTION</div>
      </div>

      <section className="store-contrast w-full bg-[#1C1917] text-stone-100 py-20 md:py-28">
        <div className="store-contrast-inner mx-auto max-w-7xl px-6 md:px-8">
          <ProductGrid products={PRODUCTS} onSelect={setSelected} formatMoney={formatMoney} ICONS={ICONS} />
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 md:px-8 py-24 text-center text-stone-600 text-[15px] leading-relaxed border-b border-stone-200">
        Each piece is grown or thrown in small batches. We select only the healthiest specimens and the most considered forms.
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 py-16 grid md:grid-cols-3 gap-8 text-xs tracking-[0.18em] uppercase border-b border-stone-200">
        <div>Complimentary shipping on orders over $75</div>
        <div>30-day returns on all living plants</div>
        <div>Care instructions included with every order</div>
      </div>

      <div className="border-b border-stone-200 py-20">
        <div className="mx-auto max-w-md px-6 text-center">
          <div className="font-serif text-3xl tracking-tight mb-6">Stay in the garden</div>
          <form onSubmit={handleNewsletter} className="flex">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" className="flex-1 border-b border-stone-300 bg-transparent py-3 text-sm focus:outline-none" required />
            <button type="submit" className="px-8 text-xs tracking-[0.18em] uppercase border-b-2 border-current">Subscribe</button>
          </form>
          {submitted && <div className="mt-3 text-xs text-[#8B5E3C]">Thank you. You’re on the list.</div>}
        </div>
      </div>

      <Footer />

      <ProductDetail product={selected} onClose={() => setSelected(null)} formatMoney={formatMoney} ICONS={ICONS} onBuy={handleBuy} />
    </div>
  );
}
