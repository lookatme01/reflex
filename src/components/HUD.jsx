export default function HUD({ timeLeft, score, accuracy, mode, extra }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const isLow = timeLeft <= 5;

  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 pointer-events-none z-10">
      {/* Timer */}
      <div
        className={`text-3xl font-bold tabular-nums tracking-wider ${isLow ? "text-miss" : "text-text"}`}
        style={{
          textShadow: isLow ? "0 0 20px rgba(255,68,102,0.5)" : "none",
        }}
      >
        {timeStr}
      </div>

      {/* Center - Mode name */}
      <div className="text-text-dim text-sm uppercase tracking-widest">
        {mode}
      </div>

      {/* Right - Score & Accuracy */}
      <div className="flex items-center gap-6">
        {extra && (
          <div className="text-right">
            <div className="text-text-dim text-xs uppercase tracking-wider">
              {extra.label}
            </div>
            <div className="text-lg font-semibold" style={{ color: extra.color }}>
              {extra.value}
            </div>
          </div>
        )}
        <div className="text-right">
          <div className="text-text-dim text-xs uppercase tracking-wider">
            Accuracy
          </div>
          <div
            className="text-lg font-semibold"
            style={{ color: accuracy >= 80 ? "#00ff88" : accuracy >= 50 ? "#ffaa00" : "#ff4466" }}
          >
            {accuracy}%
          </div>
        </div>
        <div className="text-right">
          <div className="text-text-dim text-xs uppercase tracking-wider">
            Score
          </div>
          <div className="text-2xl font-bold text-accent">{score}</div>
        </div>
      </div>
    </div>
  );
}
