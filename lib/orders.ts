
const DDL = "create table if not exists store_orders (\n  id text primary key,\n  created_at timestamptz not null default now(),\n  channel text not null,\n  sku text not null,\n  title text not null,\n  quantity integer not null,\n  amount integer not null,\n  currency text not null,\n  status text not null,\n  agent text,\n  spt text\n);\ncreate index if not exists store_orders_created_at_idx on store_orders (created_at desc);";

type G = typeof globalThis & {
  __storeOrders?: StoreOrder[];
  __storePool?: import("pg").Pool;
  __storeReady?: Promise<void>;
};
const g = globalThis as G;
if (!g.__storeOrders) g.__storeOrders = [];

function databaseUrl(): string {
  return (process.env.DATABASE_URL || "").trim();
}

async function getPool(): Promise<import("pg").Pool | null> {
  const url = databaseUrl();
  if (!url) return null;
  if (!g.__storePool) {
    const { Pool } = await import("pg");
    g.__storePool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
    });
  }
  return g.__storePool;
}

async function ensureTable(): Promise<import("pg").Pool | null> {
  const pool = await getPool();
  if (!pool) return null;
  if (!g.__storeReady) {
    g.__storeReady = pool.query(DDL).then(() => undefined);
  }
  await g.__storeReady;
  return pool;
}

function toOrder(row: {
  id: string;
  created_at: string | Date;
  channel: OrderChannel;
  sku: string;
  title: string;
  quantity: number;
  amount: number;
  currency: string;
  status: StoreOrder["status"];
  agent: string | null;
  spt: string | null;
}): StoreOrder {
  const createdAt =
    row.created_at instanceof Date
      ? row.created_at.toISOString()
      : String(row.created_at);
  return {
    id: row.id,
    createdAt,
    channel: row.channel,
    sku: row.sku,
    title: row.title,
    quantity: Number(row.quantity),
    amount: Number(row.amount),
    currency: row.currency,
    status: row.status,
    agent: row.agent || undefined,
    spt: row.spt || undefined,
  };
}

async function listOrders(limit = 20): Promise<StoreOrder[]> {
  const cap = Math.max(1, Math.min(100, Number(limit) || 20));
  const pool = await ensureTable();
  if (!pool) return (g.__storeOrders || []).slice(0, cap);
  const res = await pool.query(
    "select id, created_at, channel, sku, title, quantity, amount, currency, status, agent, spt from store_orders order by created_at desc limit $1",
    [cap]
  );
  return res.rows.map(toOrder);
}

async function getOrder(id: string): Promise<StoreOrder | null> {
  const pool = await ensureTable();
  if (!pool) {
    return (g.__storeOrders || []).find((o) => o.id === id) || null;
  }
  const res = await pool.query(
    "select id, created_at, channel, sku, title, quantity, amount, currency, status, agent, spt from store_orders where id = $1 limit 1",
    [id]
  );
  return res.rows[0] ? toOrder(res.rows[0]) : null;
}

async function createOrder(input: {
  channel: OrderChannel;
  sku: string;
  title: string;
  quantity: number;
  amount: number;
  currency: string;
  status?: StoreOrder["status"];
  agent?: string;
  spt?: string;
}): Promise<StoreOrder> {
  const order: StoreOrder = {
    id: "ord_" + randomUUID().slice(0, 8),
    createdAt: new Date().toISOString(),
    channel: input.channel,
    sku: input.sku,
    title: input.title,
    quantity: input.quantity,
    amount: input.amount,
    currency: input.currency,
    status: input.status || "open",
    agent: input.agent,
    spt: input.spt,
  };
  const pool = await ensureTable();
  if (!pool) {
    g.__storeOrders = [order, ...(g.__storeOrders || [])].slice(0, 100);
    return order;
  }
  await pool.query(
    "insert into store_orders (id, created_at, channel, sku, title, quantity, amount, currency, status, agent, spt) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
    [
      order.id,
      order.createdAt,
      order.channel,
      order.sku,
      order.title,
      order.quantity,
      order.amount,
      order.currency,
      order.status,
      order.agent ?? null,
      order.spt ?? null,
    ]
  );
  return order;
}

export default DDL;
