import { useState, useEffect } from "react";

export default function Countdown({ onDone }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onDone();
      return;
    }
    const t = setTimeout(() => setCount(count - 1), 750);
    return () => clearTimeout(t);
  }, [count, onDone]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-bg/80 z-30">
      <div
        key={count}
        className="animate-countdown-pop text-8xl font-black text-accent"
        style={{
          textShadow: "0 0 40px rgba(127,133,245,0.4), 0 0 80px rgba(127,133,245,0.2)",
        }}
      >
        {count === 0 ? "GO" : count}
      </div>
    </div>
  );
}
