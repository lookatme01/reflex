// Flick Mode: Single target appears, click it, next one spawns instantly.
// Tests snap-aiming speed and accuracy.

export const flickConfig = {
  name: "Flick",
  description: "Snap to targets as fast as you can",
  icon: "⚡",
  color: "#00f0ff",
  defaultDuration: 30,
  targetSize: 44,
};

export function createFlickState(areaBounds) {
  return {
    targets: [spawnTarget(areaBounds, flickConfig.targetSize)],
    hits: 0,
    misses: 0,
    totalClicks: 0,
    reactionTimes: [],
    lastSpawnTime: performance.now(),
  };
}

export function handleFlickClick(state, x, y, areaBounds) {
  const now = performance.now();
  const target = state.targets[0];
  if (!target) return state;

  const dx = x - target.x;
  const dy = y - target.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const hit = dist <= target.radius;

  if (hit) {
    const reactionTime = now - state.lastSpawnTime;
    return {
      ...state,
      targets: [spawnTarget(areaBounds, flickConfig.targetSize)],
      hits: state.hits + 1,
      totalClicks: state.totalClicks + 1,
      reactionTimes: [...state.reactionTimes, reactionTime],
      lastSpawnTime: now,
      lastHit: { x: target.x, y: target.y, time: now },
    };
  }

  return {
    ...state,
    misses: state.misses + 1,
    totalClicks: state.totalClicks + 1,
    lastMiss: { x, y, time: now },
  };
}

export function updateFlick(state) {
  return state;
}

export function getFlickResults(state, duration) {
  const avgReaction =
    state.reactionTimes.length > 0
      ? state.reactionTimes.reduce((a, b) => a + b, 0) /
        state.reactionTimes.length
      : 0;

  return {
    score: state.hits,
    hits: state.hits,
    misses: state.misses,
    accuracy:
      state.totalClicks > 0
        ? Math.round((state.hits / state.totalClicks) * 100)
        : 0,
    avgReactionMs: Math.round(avgReaction),
    targetsPerSec: +(state.hits / duration).toFixed(2),
  };
}

function spawnTarget(bounds, size) {
  const radius = size / 2;
  const padding = radius + 10;
  return {
    id: Math.random().toString(36).slice(2, 9),
    x: padding + Math.random() * (bounds.width - padding * 2),
    y: padding + Math.random() * (bounds.height - padding * 2),
    radius,
    spawnTime: performance.now(),
  };
}
