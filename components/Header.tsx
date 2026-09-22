
interface HeaderProps {
  onCartClick: () => void;
  cartCount: number;
}

export default function Header({ onCartClick, cartCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#F7F3EC] border-b border-stone-200">
      <div className="mx-auto max-w-7xl px-6 md:px-8 flex items-center justify-between h-20">
        <div className="font-serif text-2xl tracking-[-0.04em]">Fern and Field</div>
        <nav className="flex items-center gap-8 text-sm tracking-[0.18em] uppercase">
          <a href="#shop" className="hover:text-[#8B5E3C]">Shop</a>
          <a href="#catalog" className="hover:text-[#8B5E3C]">Catalog</a>
          <a href="/admin/orders" className="hover:text-[#8B5E3C]">Admin</a>
        </nav>
        <div className="flex items-center gap-5">
          <button className="p-2" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
          <button onClick={onCartClick} className="p-2 relative" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9"/></svg>
            {cartCount > 0 && <span className="absolute -top-1 -right-1 text-[10px] bg-[#8B5E3C] text-white w-4 h-4 rounded-none flex items-center justify-center tabular-nums">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
