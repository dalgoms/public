import { ImageResponse } from "next/og";

export const alt = "WebScout – Search Website Perfect.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
            marginBottom: 24,
          }}
        >
          Search ✨ Website 💬 Perfect.
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#737373",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          One prompt is just a start.
          <br />
          WebScout learns and improves with you.
        </div>
      </div>
    ),
    { ...size }
  );
}
