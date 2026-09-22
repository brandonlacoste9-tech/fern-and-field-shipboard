import { NextResponse } from "next/server";
import { buildUcpProfile, CORS } from "@/lib/ucp";




async export default function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  return NextResponse.json(buildUcpProfile(origin), { headers: CORS });
}
