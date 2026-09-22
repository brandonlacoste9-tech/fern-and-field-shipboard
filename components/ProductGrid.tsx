
interface Product {
  id: string; sku: string; title: string; description: string; images: string[]; price: number; currency: string; inventory: number; gtin: string; brand: string;
}

interface ProductGridProps {
  products: Product[];
  onSelect: (p: Product) => void;
  formatMoney: (cents: number) => string;
  ICONS: Record<string, React.ReactNode>;
}

export default function ProductGrid({ products, onSelect, formatMoney, ICONS }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <div key={product.id} onClick={() => onSelect(product)} className="group cursor-pointer">
          <div className="relative aspect-[4/5] overflow-hidden bg-stone-900 mb-4">
            <div className="absolute inset-0 flex items-center justify-center text-stone-400">
              {ICONS[product.id]}
            </div>
            <div className="absolute top-4 left-4 font-mono text-[11px] tracking-[0.2em] text-stone-400 tabular-nums">
              {(index + 1).toString().padStart(2, '0')}
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onSelect(product); }}
              className="absolute bottom-4 right-4 px-6 py-2 text-[11px] tracking-[0.18em] uppercase border border-stone-100 hover:bg-stone-100 hover:text-[#1C1917] transition-colors"
            >
              Quick add
            </button>
          </div>
          <div className="flex justify-between items-baseline">
            <div>
              <div className="font-serif text-lg tracking-tight">{product.title}</div>
              <div className="text-xs tracking-[0.2em] text-stone-500 mt-0.5">{product.sku}</div>
            </div>
            <div className="font-mono text-sm tabular-nums">{formatMoney(product.price)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
