
export default function Footer() {
  return (
    <footer className="bg-[#F7F3EC] border-t border-stone-200 py-16 text-sm">
      <div className="mx-auto max-w-7xl px-6 md:px-8 grid md:grid-cols-2 gap-y-12">
        <div>
          <div className="font-serif text-2xl tracking-[-0.04em] mb-3">Fern and Field</div>
          <div className="text-stone-500">houseplants and ceramic planters</div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-end gap-x-12 gap-y-2 text-xs tracking-[0.18em] uppercase">
          <a href="/policies/shipping">Shipping</a>
          <a href="/policies/refund">Returns</a>
          <a href="/policies/privacy">Privacy</a>
        </div>
      </div>
      <div className="mt-20 text-center text-[10px] tracking-[0.2em] text-stone-400">© {new Date().getFullYear()} Fern and Field</div>
    </footer>
  );
}
