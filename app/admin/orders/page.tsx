import { listOrders } from "@/lib/orders";
import { formatMoney } from "@/lib/catalog";






const dynamic = "force-dynamic";

async export default function AdminOrdersPage() {
  const orders = await listOrders(20);
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Admin
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Last 20 orders</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Channel is written at checkout from query, UCP-Agent, or referrer.
        ChatGPT click-out → channel=chatgpt.
      </p>
      <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-[11px] uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-3 py-2 font-medium">When</th>
              <th className="px-3 py-2 font-medium">Agent</th>
              <th className="px-3 py-2 font-medium">SKU</th>
              <th className="px-3 py-2 font-medium">Qty</th>
              <th className="px-3 py-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td className="px-3 py-8 text-zinc-500" colSpan={5}>
                  No orders yet. Open /.well-known/ucp and POST /api/checkout.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-zinc-100">
                  <td className="px-3 py-2 tabular-nums text-zinc-600">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 font-medium">{o.channel}</td>
                  <td className="px-3 py-2">
                    {o.sku}
                    <span className="mt-0.5 block text-[11px] text-zinc-500">{o.title}</span>
                  </td>
                  <td className="px-3 py-2 tabular-nums">{o.quantity}</td>
                  <td className="px-3 py-2 tabular-nums">
                    {formatMoney(o.amount, o.currency)}
                    <span className="mt-0.5 block text-[11px] text-zinc-500">{o.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
