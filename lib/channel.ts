
const CHANNELS: OrderChannel[] = ["chatgpt", "gemini", "copilot", "human"];

function asChannel(raw: string | null | undefined): OrderChannel | null {
  const v = String(raw || "").trim().toLowerCase();
  if (v === "openai" || v === "chat.openai.com" || v === "chatgpt.com") return "chatgpt";
  if (v === "google" || v === "bard") return "gemini";
  if (v === "microsoft" || v === "bing") return "copilot";
  return (CHANNELS as string[]).includes(v) ? (v as OrderChannel) : null;
}

function detectChannel(req: Request, body?: Record<string, unknown> | null): OrderChannel {
  const url = new URL(req.url);
  const q =
    asChannel(url.searchParams.get("channel")) ||
    asChannel(url.searchParams.get("utm_source"));
  if (q) return q;

  const bodyCh = asChannel(
    body && typeof body.channel === "string" ? body.channel : undefined
  );
  if (bodyCh) return bodyCh;

  const agent = req.headers.get("ucp-agent") || req.headers.get("x-ucp-agent") || "";
  const agentLower = agent.toLowerCase();
  if (agentLower.includes("chatgpt") || agentLower.includes("openai")) return "chatgpt";
  if (agentLower.includes("gemini") || agentLower.includes("google")) return "gemini";
  if (agentLower.includes("copilot") || agentLower.includes("microsoft")) return "copilot";

  const ref = (req.headers.get("referer") || "").toLowerCase();
  if (ref.includes("chatgpt.com") || ref.includes("chat.openai.com")) return "chatgpt";
  if (ref.includes("gemini.google.com")) return "gemini";
  if (ref.includes("copilot.microsoft.com")) return "copilot";

  return "human";
}

export default function CHANNELS() {
  return null;
}
