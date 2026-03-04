import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET() {
  try {
    const path = join(process.cwd(), "public", "icons", "webscoutimg.png");
    const buffer = await readFile(path);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    // Fallback: generate simple OG image if file missing
    return new ImageResponse(
      (
        <div
          style={{
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 600,
              color: "#171717",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            Search ✨ Website 💬 Perfect.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#737373",
              textAlign: "center",
              marginTop: 24,
            }}
          >
            WebScout – Website structure analyzer
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
