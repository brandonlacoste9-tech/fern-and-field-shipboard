
interface Product {
  id: string; sku: string; title: string; description: string; images: string[]; price: number; currency: string; inventory: number; gtin: string; brand: string;
}

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
  formatMoney: (cents: number) => string;
  ICONS: Record<string, React.ReactNode>;
  onBuy: (sku: string, qty: number) => void;
}

export default function ProductDetail({ product, onClose, formatMoney, ICONS, onBuy }: ProductDetailProps) {
  const [qty, setQty] = useState(1);
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#F7F3EC] w-full max-w-5xl grid md:grid-cols-2 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="aspect-[4/5] bg-[#1C1917] relative flex items-center justify-center text-stone-400">
          {ICONS[product.id]}
          <div className="absolute top-6 left-6 font-mono text-xs tracking-[0.2em] text-stone-500">01</div>
        </div>
        <div className="p-10 md:p-14 flex flex-col">
          <button onClick={onClose} className="self-end text-xs tracking-[0.18em] uppercase mb-8">Close</button>
          <div className="font-serif text-5xl tracking-[-0.04em] leading-none mb-3">{product.title}<span className="text-[#E24A2A]">.</span></div>
          <div className="font-mono text-xl tabular-nums mb-8">{formatMoney(product.price)}</div>
          
          <div className="text-sm leading-relaxed text-stone-600 mb-8">{product.description}</div>
          
          <div className="space-y-2 text-xs tracking-widest uppercase mb-8 text-stone-500">
            <div>GTIN {product.gtin}</div>
            <div>{product.brand}</div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="text-xs tracking-[0.18em] uppercase">Quantity</div>
            <div className="flex border border-stone-300">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 hover:bg-stone-100">-</button>
              <div className="px-5 py-2 tabular-nums border-x border-stone-300">{qty}</div>
              <button onClick={() => setQty(Math.min(product.inventory, qty + 1))} className="px-4 py-2 hover:bg-stone-100">+</button>
            </div>
          </div>

          <button 
            onClick={() => onBuy(product.sku, qty)}
            className="mt-auto w-full py-4 text-[11px] tracking-[0.18em] uppercase border-b-2 border-current hover:bg-[#1C1917] hover:text-stone-50 transition-colors"
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}
