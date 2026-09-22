export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-16 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Replace the product catalog with the correct Fern and Field products: Monstera Deliciosa $38, Stoneware Planter $26, Fern Trio Set $54. Remove the incorrect field-goods products (field notebook, camp blanket, brass desk lamp, canvas tote). Update lib/catalog.ts and all product references.
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Order received</h1>
      <p className="mt-3 text-sm text-zinc-600">
        If this was a ChatGPT click-out, the order row is tagged channel=chatgpt.
        Stripe charges only run when STRIPE_SECRET_KEY is set; the ACP stub never captures.
      </p>
      <p className="mt-8 text-sm">
        <a className="underline" href="/admin/orders">
          View orders
        </a>
      </p>
    </main>
  );
}
