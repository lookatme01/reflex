import { useState, useRef, useCallback, useEffect } from "react";
import { MODES } from "../modes";
import { useGameLoop } from "../hooks/useGameLoop";
import { useStats } from "../hooks/useStats";
import Target from "./Target";
import HitMarker from "./HitMarker";
import HUD from "./HUD";
import Countdown from "./Countdown";
import Results from "./Results";

const PHASE = {
  COUNTDOWN: "countdown",
  PLAYING: "playing",
  RESULTS: "results",
};

export default function GameArena({ modeKey, duration, onHome }) {
  const mode = MODES[modeKey];
  const { saveSession, getBest } = useStats();

  const areaRef = useRef(null);
  const [phase, setPhase] = useState(PHASE.COUNTDOWN);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [gameState, setGameState] = useState(null);
  const [results, setResults] = useState(null);
  const startTimeRef = useRef(null);
  const gameStateRef = useRef(null);

  // Keep ref in sync
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  function getAreaBounds() {
    const el = areaRef.current;
    if (!el) return { width: 800, height: 600 };
    return { width: el.clientWidth, height: el.clientHeight };
  }

  const startGame = useCallback(() => {
    const bounds = getAreaBounds();
    const state = mode.create(bounds);
    setGameState(state);
    gameStateRef.current = state;
    startTimeRef.current = performance.now();
    setTimeLeft(duration);
    setPhase(PHASE.PLAYING);
  }, [mode, duration]);

  const endGame = useCallback(() => {
    setPhase(PHASE.RESULTS);
    const state = gameStateRef.current;
    if (!state) return;
    const res = mode.getResults(state, duration);
    setResults(res);
    saveSession({
      mode: modeKey,
      score: res.score,
      accuracy: res.accuracy,
      date: new Date().toISOString(),
      duration,
      details: res,
    });
  }, [mode, modeKey, duration, saveSession]);

  // Game loop
  useGameLoop(
    useCallback(
      (delta) => {
        if (!gameStateRef.current) return;
        const bounds = getAreaBounds();

        // Update timer
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        const remaining = Math.max(0, duration - elapsed);
        setTimeLeft(remaining);

        if (remaining <= 0) {
          endGame();
          return;
        }

        // Update game state
        const updated = mode.update(
          gameStateRef.current,
          delta,
          performance.now(),
          bounds
        );
        setGameState(updated);
      },
      [duration, endGame, mode]
    ),
    phase === PHASE.PLAYING
  );

  function handleAreaClick(e) {
    if (phase !== PHASE.PLAYING || !mode.handleClick) return;
    const rect = areaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const bounds = getAreaBounds();
    const updated = mode.handleClick(gameStateRef.current, x, y, bounds);
    setGameState(updated);
    gameStateRef.current = updated;
  }

  function handleAreaMouseMove(e) {
    if (phase !== PHASE.PLAYING || !mode.handleMouseMove) return;
    const rect = areaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const updated = mode.handleMouseMove(gameStateRef.current, x, y);
    setGameState(updated);
    gameStateRef.current = updated;
  }

  function handleReplay() {
    setResults(null);
    setPhase(PHASE.COUNTDOWN);
  }

  // Compute HUD values
  const score = gameState?.hits ?? gameState?.onTargetFrames ?? 0;
  const accuracy =
    gameState?.totalClicks > 0
      ? Math.round((gameState.hits / gameState.totalClicks) * 100)
      : gameState?.totalFrames > 0
        ? Math.round((gameState.onTargetFrames / gameState.totalFrames) * 100)
        : 100;

  const hudExtra =
    modeKey === "tracking" && gameState
      ? {
          label: "On Target",
          value: gameState.isOnTarget ? "YES" : "NO",
          color: gameState.isOnTarget ? "#00ff88" : "#ff4466",
        }
      : null;

  const hudScore =
    modeKey === "tracking"
      ? `${accuracy}%`
      : score;

  return (
    <div className="w-screen h-screen bg-bg flex flex-col">
      {/* Game area */}
      <div
        ref={areaRef}
        className="flex-1 relative game-area overflow-hidden"
        onClick={handleAreaClick}
        onMouseMove={handleAreaMouseMove}
        style={{
          background:
            "radial-gradient(ellipse at center, #12121a 0%, #0a0a0f 70%)",
        }}
      >
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* HUD */}
        {phase === PHASE.PLAYING && (
          <HUD
            timeLeft={timeLeft}
            score={hudScore}
            accuracy={accuracy}
            mode={mode.config.name}
            extra={hudExtra}
          />
        )}

        {/* Targets */}
        {phase === PHASE.PLAYING &&
          gameState &&
          (modeKey === "tracking" ? (
            <Target
              target={gameState.target}
              mode="tracking"
              isOnTarget={gameState.isOnTarget}
            />
          ) : (
            gameState.targets?.map((t) => (
              <Target key={t.id} target={t} mode={modeKey} />
            ))
          ))}

        {/* Hit/Miss markers */}
        {phase === PHASE.PLAYING && gameState?.lastHit && (
          <HitMarker hit={gameState.lastHit} type="hit" />
        )}
        {phase === PHASE.PLAYING && gameState?.lastMiss && (
          <HitMarker hit={gameState.lastMiss} type="miss" />
        )}

        {/* Countdown overlay */}
        {phase === PHASE.COUNTDOWN && <Countdown onDone={startGame} />}

        {/* Results overlay */}
        {phase === PHASE.RESULTS && results && (
          <Results
            results={results}
            mode={mode.config.name}
            best={getBest(modeKey)}
            onReplay={handleReplay}
            onHome={onHome}
          />
        )}

        {/* ESC hint */}
        {phase === PHASE.PLAYING && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-text-dim/30 text-xs">
            ESC to quit
          </div>
        )}
      </div>
    </div>
  );
}
