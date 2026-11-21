import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = "Backwater Trace — Alappuzha incident reports, traced to every source";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7F3EA",
          color: "#1A1712",
          padding: 72,
          borderTop: "16px solid #24428F",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, letterSpacing: 4, textTransform: "uppercase", color: "#24428F" }}>
          {SITE.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 108, fontWeight: 700, lineHeight: 1.05 }}>{SITE.tagline}</div>
          <div style={{ display: "flex", fontSize: 38, marginTop: 28, color: "#4A443A", maxWidth: 980 }}>
            Group reports, see where sources disagree, trace every claim to its origin.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#4A443A" }}>
          {SITE.hackathon} · Malayalam voice with Sarvam AI
        </div>
      </div>
    ),
    size,
  );
}
