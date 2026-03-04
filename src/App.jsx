import { useState, useEffect, useCallback } from "react";
import Home from "./components/Home";
import GameArena from "./components/GameArena";

export default function App() {
  const [view, setView] = useState("home");
  const [gameConfig, setGameConfig] = useState(null);

  function handleStartGame(mode, duration) {
    setGameConfig({ mode, duration });
    setView("game");
  }

  const handleHome = useCallback(() => {
    setView("home");
    setGameConfig(null);
  }, []);

  // ESC to go home
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && view === "game") {
        handleHome();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, handleHome]);

  if (view === "game" && gameConfig) {
    return (
      <GameArena
        key={`${gameConfig.mode}-${Date.now()}`}
        modeKey={gameConfig.mode}
        duration={gameConfig.duration}
        onHome={handleHome}
      />
    );
  }

  return <Home onStartGame={handleStartGame} />;
}
