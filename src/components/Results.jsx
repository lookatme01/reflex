import { useState, useEffect } from "react";
import { MODES } from "../modes";

function StatCard({ label, value, color, span }) {
  return (
    <div
      style={{
        padding: "13px 14px",
        borderRadius: "12px",
        background: "rgba(44, 44, 46, 0.7)",
        border: "1px solid rgba(255,255,255,0.055)",
        gridColumn: span ? "span 2" : "span 1",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#48484A",
          marginBottom: "7px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "21px",
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ReplayButton({ accent, onClick }) {
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
        height: "44px",
        borderRadius: "100px",
        border: "none",
        background: accent,
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "15px",
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "7px",
        boxShadow: pressed
          ? `0 2px 10px ${accent}38`
          : hovered
          ? `0 8px 28px ${accent}50`
          : `0 4px 16px ${accent}38`,
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
      Play Again
    </button>
  );
}

function HomeButton({ onClick }) {
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
        height: "44px",
        borderRadius: "100px",
        border: "1.5px solid rgba(255,255,255,0.09)",
        background: hovered ? "rgba(255,255,255,0.07)" : "transparent",
        color: hovered ? "#F2F2F7" : "#636366",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "15px",
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        transition: "all 0.18s ease",
      }}
    >
      Home
    </button>
  );
}

export default function Results({ results, mode, modeKey, best, onReplay, onHome }) {
  const [visible, setVisible] = useState(false);

  const modeData = MODES[modeKey];
  const accent = modeData?.config.color ?? "#7f85f5";
  const isBest = best ? results.score >= best.score : false;
  const isTracking = modeKey === "tracking";

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Build stat items conditionally from whichever fields exist
  const statItems = [];
  if (results.hits !== undefined)
    statItems.push({ label: "Hits", value: results.hits, color: "#30D158" });
  if (results.misses !== undefined)
    statItems.push({ label: "Misses", value: results.misses, color: "#FF453A" });
  if (results.expired !== undefined)
    statItems.push({ label: "Expired", value: results.expired, color: "#FF9F0A" });
  if (results.accuracy !== undefined)
    statItems.push({
      label: "Accuracy",
      value: `${results.accuracy}%`,
      color:
        results.accuracy >= 80
          ? "#30D158"
          : results.accuracy >= 50
          ? "#FF9F0A"
          : "#FF453A",
    });
  if (results.hitRate !== undefined)
    statItems.push({
      label: "Hit Rate",
      value: `${results.hitRate}%`,
      color:
        results.hitRate >= 80
          ? "#30D158"
          : results.hitRate >= 50
          ? "#FF9F0A"
          : "#FF453A",
    });
  if (results.avgReactionMs !== undefined)
    statItems.push({
      label: "Avg Reaction",
      value: `${results.avgReactionMs}ms`,
      color:
        results.avgReactionMs < 400
          ? "#30D158"
          : results.avgReactionMs < 600
          ? "#FF9F0A"
          : "#FF453A",
    });
  if (results.targetsPerSec !== undefined)
    statItems.push({ label: "Targets / sec", value: results.targetsPerSec, color: accent });
  if (results.onTargetPercent !== undefined)
    statItems.push({
      label: "On Target",
      value: `${results.onTargetPercent}%`,
      color:
        results.onTargetPercent >= 70
          ? "#30D158"
          : results.onTargetPercent >= 40
          ? "#FF9F0A"
          : "#FF453A",
    });
  if (results.avgDistancePx !== undefined)
    statItems.push({ label: "Avg Distance", value: `${results.avgDistancePx}px`, color: "#BF5AF2" });

  const hasOdd = statItems.length % 2 !== 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.72)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 30,
        padding: "16px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          borderRadius: "24px",
          background: "#1C1C1E",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: `0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04), 0 8px 40px ${accent}14`,
          overflow: "hidden",
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(28px) scale(0.96)",
          transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Colored top accent line */}
        <div
          style={{
            height: "3px",
            background: `linear-gradient(90deg, ${accent}, ${accent}44)`,
          }}
        />

        <div style={{ padding: "28px 28px 32px" }}>
          {/* ─── Header ─── */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#48484A",
                marginBottom: "16px",
              }}
            >
              {mode} · Complete
            </div>

            {/* Main score */}
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "76px",
                fontWeight: 800,
                lineHeight: 1,
                color: accent,
                letterSpacing: "-0.03em",
                textShadow: `0 0 48px ${accent}38`,
                marginBottom: "12px",
              }}
            >
              {results.score}
              {isTracking ? "%" : ""}
            </div>

            {/* Personal best badge */}
            {isBest ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "5px 14px",
                  borderRadius: "100px",
                  background: "rgba(255, 159, 10, 0.12)",
                  border: "1px solid rgba(255, 159, 10, 0.22)",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#FF9F0A",
                  letterSpacing: "0.04em",
                }}
              >
                <span>🏆</span>
                New Personal Best
              </div>
            ) : best ? (
              <div style={{ fontSize: "12px", color: "#48484A" }}>
                Best:{" "}
                <span style={{ color: "#636366", fontWeight: 600 }}>
                  {best.score}
                  {isTracking ? "%" : ""}
                </span>
              </div>
            ) : null}
          </div>

          {/* ─── Stats Grid ─── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              marginBottom: "24px",
            }}
          >
            {statItems.map((stat, i) => (
              <StatCard
                key={stat.label}
                {...stat}
                span={hasOdd && i === statItems.length - 1}
              />
            ))}
          </div>

          {/* ─── Actions ─── */}
          <div style={{ display: "flex", gap: "8px" }}>
            <ReplayButton accent={accent} onClick={onReplay} />
            <HomeButton onClick={onHome} />
          </div>
        </div>
      </div>
    </div>
  );
}
