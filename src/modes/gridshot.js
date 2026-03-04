// Grid Shot Mode: Targets appear on a grid, click them as fast as possible.
// Classic aim trainer mode inspired by Aimlab/Kovaak's.

export const gridshotConfig = {
  name: "Grid Shot",
  description: "Rapid-fire targets on a grid",
  icon: "⊞",
  color: "#00ff88",
  defaultDuration: 30,
  targetSize: 56,
  maxTargets: 3,
  cols: 6,
  rows: 4,
};

export function createGridshotState(areaBounds) {
  const grid = buildGrid(areaBounds);
  return {
    grid,
    targets: pickTargets(grid, [], gridshotConfig.maxTargets),
    hits: 0,
    misses: 0,
    totalClicks: 0,
    reactionTimes: [],
    lastSpawnTime: performance.now(),
  };
}

export function handleGridshotClick(state, x, y, areaBounds) {
  const now = performance.now();
  let hitTarget = null;

  for (const target of state.targets) {
    const dx = x - target.x;
    const dy = y - target.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= target.radius) {
      hitTarget = target;
      break;
    }
  }

  if (hitTarget) {
    const reactionTime = now - hitTarget.spawnTime;
    const remaining = state.targets.filter((t) => t.id !== hitTarget.id);
    const newTargets = pickTargets(state.grid, remaining, 1);
    return {
      ...state,
      targets: [...remaining, ...newTargets],
      hits: state.hits + 1,
      totalClicks: state.totalClicks + 1,
      reactionTimes: [...state.reactionTimes, reactionTime],
      lastHit: { x: hitTarget.x, y: hitTarget.y, time: now },
    };
  }

  return {
    ...state,
    misses: state.misses + 1,
    totalClicks: state.totalClicks + 1,
    lastMiss: { x, y, time: now },
  };
}

export function updateGridshot(state) {
  return state;
}

export function getGridshotResults(state, duration) {
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

function buildGrid(bounds) {
  const { cols, rows, targetSize } = gridshotConfig;
  const radius = targetSize / 2;
  const cellW = (bounds.width - 40) / cols;
  const cellH = (bounds.height - 40) / rows;
  const points = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      points.push({
        x: 20 + cellW * c + cellW / 2,
        y: 20 + cellH * r + cellH / 2,
        radius,
      });
    }
  }
  return points;
}

function pickTargets(grid, existing, count) {
  const usedPositions = new Set(existing.map((t) => `${t.x},${t.y}`));
  const available = grid.filter((p) => !usedPositions.has(`${p.x},${p.y}`));
  const shuffled = available.sort(() => Math.random() - 0.5);
  const now = performance.now();
  return shuffled.slice(0, count).map((p) => ({
    id: Math.random().toString(36).slice(2, 9),
    x: p.x,
    y: p.y,
    radius: p.radius,
    spawnTime: now,
  }));
}
