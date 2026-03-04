import { useEffect, useState } from "react";

export default function HitMarker({ hit, type }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 300);
    return () => clearTimeout(t);
  }, [hit?.time]);

  if (!visible || !hit) return null;

  const isHit = type === "hit";

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: hit.x - 15,
        top: hit.y - 15,
        width: 30,
        height: 30,
      }}
    >
      {isHit ? (
        // X-shaped hit marker like FPS games
        <svg viewBox="0 0 30 30" className="animate-target-hit">
          <line
            x1="6"
            y1="6"
            x2="12"
            y2="12"
            stroke="#00ff88"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="18"
            y1="6"
            x2="24"
            y2="12"
            stroke="#00ff88"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="6"
            y1="24"
            x2="12"
            y2="18"
            stroke="#00ff88"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="18"
            y1="24"
            x2="24"
            y2="18"
            stroke="#00ff88"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        // Miss indicator
        <svg viewBox="0 0 30 30" className="animate-target-expire">
          <circle
            cx="15"
            cy="15"
            r="8"
            fill="none"
            stroke="#ff4466"
            strokeWidth="1.5"
            opacity="0.6"
          />
        </svg>
      )}
    </div>
  );
}
