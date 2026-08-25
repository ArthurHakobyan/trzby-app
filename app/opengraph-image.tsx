import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tržby — evidence tržeb";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const bg = "#182019";
const surface = "#212b23";
const ink = "#eae4d2";
const muted = "#9aa79a";
const gold = "#cda23f";
const cash = "#8fb996";
const card = "#86a9c9";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          background: bg,
          padding: "0 90px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 44,
              fontWeight: 700,
              color: ink,
              marginBottom: 28,
            }}
          >
            Tržby
            <span style={{ color: gold }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 700,
              color: ink,
              lineHeight: 1.15,
              marginBottom: 22,
            }}
          >
            Vaše tržby na první pohled.
          </div>
          <div style={{ display: "flex", fontSize: 26, color: muted, lineHeight: 1.4 }}>
            Hotovost i karta, zapsané na dva klepnutí.
          </div>
        </div>

        <div style={{ display: "flex", position: "relative", width: 420, height: 420 }}>
          <div
            style={{
              position: "absolute",
              left: 60,
              top: 40,
              width: 190,
              height: 260,
              background: surface,
              border: `4px solid ${gold}`,
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "36px 24px",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", width: "100%", height: 4, background: muted, opacity: 0.5, borderRadius: 2 }} />
            <div style={{ display: "flex", width: "100%", height: 4, background: muted, opacity: 0.5, borderRadius: 2 }} />
            <div style={{ display: "flex", width: "65%", height: 4, background: muted, opacity: 0.5, borderRadius: 2 }} />
          </div>

          <div
            style={{
              position: "absolute",
              right: 20,
              top: 130,
              width: 200,
              height: 130,
              background: surface,
              border: `4px solid ${card}`,
              borderRadius: 20,
              transform: "rotate(-9deg)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", width: "100%", height: 26, background: card, opacity: 0.55, marginTop: 30 }} />
            <div
              style={{
                display: "flex",
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: `4px solid ${gold}`,
                marginTop: 22,
                marginLeft: 26,
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: 30,
              bottom: 10,
              width: 96,
              height: 96,
              borderRadius: "50%",
              border: `5px solid ${cash}`,
              background: surface,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 46,
                height: 46,
                borderRadius: "50%",
                border: `3px solid ${cash}`,
                opacity: 0.6,
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
