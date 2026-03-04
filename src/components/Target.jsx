import { useEffect, useState } from "react";

export default function Target({ target, mode, isOnTarget }) {
  const [animClass, setAnimClass] = useState("animate-target-spawn");
  const size = target.radius * 2;

  useEffect(() => {
    setAnimClass("animate-target-spawn");
  }, [target.id]);

  const isTracking = mode === "tracking";

  return (
    <div
      className={`absolute rounded-full ${animClass}`}
      style={{
        width: size,
        height: size,
        left: target.x - target.radius,
        top: target.y - target.radius,
        pointerEvents: "none",
      }}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle, ${isTracking ? (isOnTarget ? "#a855f7" : "#6b21a8") : "rgba(255,255,255,0.3)"} 0%, transparent 70%)`,
          transform: "scale(1.8)",
        }}
      />
      {/* Main target body */}
      <div
        className="absolute inset-0 rounded-full border-2 flex items-center justify-center"
        style={{
          background: isTracking
            ? isOnTarget
              ? "radial-gradient(circle, #c084fc 0%, #7c3aed 60%, #4c1d95 100%)"
              : "radial-gradient(circle, #7c3aed 0%, #4c1d95 60%, #2e1065 100%)"
            : "radial-gradient(circle, rgba(255,80,80,0.9) 0%, rgba(200,30,30,0.9) 50%, rgba(140,0,0,0.95) 100%)",
          borderColor: isTracking
            ? isOnTarget
              ? "#e9d5ff"
              : "#a78bfa"
            : "rgba(255,120,120,0.8)",
          boxShadow: isTracking
            ? isOnTarget
              ? "0 0 20px rgba(168,85,247,0.6), inset 0 0 15px rgba(255,255,255,0.1)"
              : "0 0 12px rgba(168,85,247,0.3)"
            : "0 0 15px rgba(255,50,50,0.5), inset 0 0 10px rgba(255,255,255,0.1)",
        }}
      >
        {/* Inner ring */}
        <div
          className="rounded-full border"
          style={{
            width: size * 0.55,
            height: size * 0.55,
            borderColor: "rgba(255,255,255,0.3)",
          }}
        />
        {/* Bullseye dot */}
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.18,
            height: size * 0.18,
            background: "rgba(255,255,255,0.9)",
          }}
        />
      </div>
    </div>
  );
}
