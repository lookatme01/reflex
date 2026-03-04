import { useState, useEffect } from "react";
import { MODES } from "../modes";
import { useStats } from "../hooks/useStats";

const modeList = Object.values(MODES);
const DURATIONS = [15, 30, 60];

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(iso).toLocaleDateString("en", { month: "short", day: "numeric" });
}

function accuracyColor(acc) {
  if (acc >= 80) return "#30D158";
  if (acc >= 55) return "#FF9F0A";
  return "#FF453A";
}

function ModeCard({ mode: m, isSelected, best, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "20px",
        borderRadius: "18px",
        background: isSelected
          ? "rgba(58, 58, 60, 0.95)"
          : hovered
          ? "rgba(44, 44, 46, 0.85)"
          : "rgba(44, 44, 46, 0.6)",
        border: `1.5px solid ${
          isSelected ? `${m.config.color}50` : "rgba(255,255,255,0.07)"
        }`,
        boxShadow: isSelected
          ? `0 8px 40px ${m.config.color}1e, 0 2px 16px rgba(0,0,0,0.35)`
          : hovered
          ? "0 4px 20px rgba(0,0,0,0.25)"
          : "0 1px 4px rgba(0,0,0,0.2)",
        cursor: "pointer",
        textAlign: "left",
        transform: isSelected
          ? "translateY(-3px)"
          : hovered
          ? "translateY(-1px)"
          : "translateY(0)",
        transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        overflow: "hidden",
      }}
    >
      {/* Colored top stripe when selected */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${m.config.color}, ${m.config.color}55)`,
          }}
        />
      )}

      {/* Mode icon */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "44px",
          height: "44px",
          borderRadius: "13px",
          background: `${m.config.color}1a`,
          fontSize: "22px",
          marginBottom: "14px",
          transition: "transform 0.22s ease",
          transform: isSelected ? "scale(1.07)" : "scale(1)",
        }}
      >
        {m.config.icon}
      </div>

      {/* Name */}
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: "15px",
          color: isSelected ? m.config.color : "#F2F2F7",
          marginBottom: "5px",
          transition: "color 0.22s ease",
        }}
      >
        {m.config.name}
      </div>

      {/* Description */}
      <div style={{ fontSize: "12px", color: "#8E8E93", lineHeight: 1.5 }}>
        {m.config.description}
      </div>

      {/* Best score or first-run nudge */}
      <div
        style={{
          marginTop: "14px",
          paddingTop: "12px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {best ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "19px",
                fontWeight: 700,
                color: m.config.color,
                lineHeight: 1,
              }}
            >
              {best.score}
              {m.key === "tracking" ? "%" : ""}
            </span>
            <span style={{ fontSize: "11px", color: "#48484A", fontWeight: 500 }}>
              best
            </span>
          </div>
        ) : (
          <div style={{ fontSize: "11px", color: "#48484A", fontStyle: "italic" }}>
            No runs yet
          </div>
        )}
      </div>
    </button>
  );
}

function StartButton({ accent, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        flex: 1,
        minWidth: "180px",
        height: "44px",
        padding: "0 32px",
        borderRadius: "100px",
        border: "none",
        background: accent,
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "15px",
        fontWeight: 700,
        letterSpacing: "0.02em",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "9px",
        boxShadow: pressed
          ? `0 2px 10px ${accent}38`
          : hovered
          ? `0 8px 32px ${accent}55`
          : `0 4px 20px ${accent}40`,
        transform: pressed ? "scale(0.97)" : hovered ? "scale(1.02)" : "scale(1)",
        transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
        <path
          d="M1 1.5L9.5 6.5L1 11.5V1.5Z"
          fill="white"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      Start Training
    </button>
  );
}

export default function Home({ onStartGame }) {
  const [selectedMode, setSelectedMode] = useState("flick");
  const [duration, setDuration] = useState(30);
  const [ready, setReady] = useState(false);
  const { stats, getBest } = useStats();

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const mode = MODES[selectedMode];
  const accent = mode.config.color;

  const fadeIn = (delay = 0) => ({
    opacity: ready ? 1 : 0,
    transform: ready ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.5s ease ${delay}s, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflowY: "auto",
        overflowX: "hidden",
        background: "#1C1C1E",
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#F2F2F7",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* Ambient glow that follows the selected mode color */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60vh",
          background: `radial-gradient(ellipse at 50% -5%, ${accent}18 0%, transparent 65%)`,
          pointerEvents: "none",
          transition: "background 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "800px",
          margin: "0 auto",
          padding: "clamp(52px, 10vh, 104px) 24px clamp(40px, 6vh, 64px)",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* ─── Hero ─── */}
        <header
          style={{
            textAlign: "center",
            marginBottom: "clamp(36px, 6.5vh, 64px)",
            ...fadeIn(0),
          }}
        >
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(60px, 14vw, 108px)",
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 0.9,
              marginBottom: "14px",
              color: "#F2F2F7",
            }}
          >
            REFLEX
          </h1>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#48484A",
            }}
          >
            Aim Trainer
          </p>
        </header>

        {/* ─── Mode Cards ─── */}
        <section
          style={{
            marginBottom: "clamp(20px, 3.5vh, 36px)",
            ...fadeIn(0.07),
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#48484A",
              marginBottom: "12px",
            }}
          >
            Mode
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(168px, 1fr))",
              gap: "10px",
            }}
          >
            {modeList.map((m) => (
              <ModeCard
                key={m.key}
                mode={m}
                isSelected={selectedMode === m.key}
                best={getBest(m.key)}
                onClick={() => setSelectedMode(m.key)}
              />
            ))}
          </div>
        </section>

        {/* ─── Duration + Start ─── */}
        <section
          style={{
            marginBottom: "clamp(28px, 5vh, 52px)",
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
            ...fadeIn(0.14),
          }}
        >
          {/* iOS-style segmented control */}
          <div
            style={{
              display: "inline-flex",
              background: "rgba(255, 255, 255, 0.06)",
              borderRadius: "12px",
              padding: "3px",
              gap: "2px",
              flexShrink: 0,
            }}
          >
            {DURATIONS.map((d) => {
              const active = duration === d;
              return (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "10px",
                    border: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: active ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: active ? "rgba(255,255,255,0.1)" : "transparent",
                    color: active ? "#F2F2F7" : "#48484A",
                    boxShadow: active ? "0 1px 8px rgba(0,0,0,0.25)" : "none",
                  }}
                >
                  {d}s
                </button>
              );
            })}
          </div>

          <StartButton accent={accent} onClick={() => onStartGame(selectedMode, duration)} />
        </section>

        {/* ─── Recent Sessions ─── */}
        {stats.sessions.length > 0 && (
          <section style={fadeIn(0.21)}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#48484A",
                marginBottom: "12px",
              }}
            >
              Recent Sessions
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {stats.sessions.slice(0, 5).map((s, i) => {
                const m = MODES[s.mode];
                if (!m) return null;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "13px 16px",
                      borderRadius: "14px",
                      background: "rgba(44, 44, 46, 0.65)",
                      border: "1px solid rgba(255,255,255,0.055)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                        background: `${m.config.color}1a`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        flexShrink: 0,
                      }}
                    >
                      {m.config.icon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#F2F2F7" }}>
                        {m.config.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#48484A", marginTop: "1px" }}>
                        {s.duration}s · {timeAgo(s.date)}
                      </div>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: "20px",
                          fontWeight: 700,
                          color: m.config.color,
                          lineHeight: 1,
                        }}
                      >
                        {s.score}
                        {s.mode === "tracking" ? "%" : ""}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: accuracyColor(s.accuracy),
                          marginTop: "2px",
                        }}
                      >
                        {s.accuracy}% acc
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── Footer ─── */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "clamp(32px, 5vh, 56px)",
            textAlign: "center",
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#3A3A3C",
          }}
        >
          Click Targets · Get Faster · Win More
        </div>
      </div>
    </div>
  );
}
