import { NextRequest, NextResponse } from "next/server";

const DEV_FALLBACK_URL = "http://localhost:3003/api/collect";

export async function POST(req: NextRequest) {
  const envUrl = process.env.COLLECT_API_URL;
  const isProd = process.env.NODE_ENV === "production";

  if (!envUrl && isProd) {
    return NextResponse.json(
      {
        error: {
          message:
            "COLLECT_API_URL is required in production for /api/collect proxy",
        },
      },
      { status: 500 }
    );
  }

  const upstreamUrl = envUrl ?? DEV_FALLBACK_URL;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Collect upstream error:", err);
    return NextResponse.json(
      { error: { message: "Unable to reach collect API" } },
      { status: 502 }
    );
  }

  const text = await upstreamResponse.text();

  if (!upstreamResponse.ok) {
    return NextResponse.json(
      {
        error: {
          status: upstreamResponse.status,
          message: "Collect upstream returned an error",
          body: text,
        },
      },
      { status: upstreamResponse.status }
    );
  }

  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  const messages: any[] = [];

  for (const line of lines) {
    try {
      messages.push(JSON.parse(line));
    } catch {
      // ignore malformed lines
    }
  }

  const result =
    [...messages].reverse().find((m) => m && m.type === "done") ?? null;
  const logs = messages
    .filter((m) => m && m.type === "log" && typeof m.msg === "string")
    .map((m) => m.msg as string);

  return NextResponse.json({ logs, result });
}

