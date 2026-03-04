// Pop Mode: Multiple targets appear and disappear on a timer.
// Click them before they vanish. Tests speed under pressure.

export const popConfig = {
  name: "Pop",
  description: "Click targets before they disappear",
  icon: "🎯",
  color: "#ff6b35",
  defaultDuration: 30,
  targetSize: 50,
  maxTargets: 3,
  targetLifetime: 1500,
  spawnInterval: 600,
};

export function createPopState(areaBounds) {
  return {
    targets: [spawnTarget(areaBounds, popConfig.targetSize)],
    hits: 0,
    misses: 0,
    totalClicks: 0,
    expired: 0,
    lastSpawnTime: performance.now(),
    pendingRemove: [],
  };
}

export function handlePopClick(state, x, y) {
  const now = performance.now();
  let hitTarget = null;

  for (const target of state.targets) {
    if (state.pendingRemove.includes(target.id)) continue;
    const dx = x - target.x;
    const dy = y - target.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= target.radius) {
      hitTarget = target;
      break;
    }
  }

  if (hitTarget) {
    return {
      ...state,
      hits: state.hits + 1,
      totalClicks: state.totalClicks + 1,
      pendingRemove: [...state.pendingRemove, hitTarget.id],
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

export function updatePop(state, _delta, _timestamp, areaBounds) {
  const now = performance.now();
  let { targets, expired, lastSpawnTime, pendingRemove } = state;

  // Remove hit targets (after brief delay for animation)
  targets = targets.filter((t) => !pendingRemove.includes(t.id));
  pendingRemove = [];

  // Check for expired targets
  const alive = [];
  for (const t of targets) {
    if (now - t.spawnTime > popConfig.targetLifetime) {
      expired++;
    } else {
      alive.push(t);
    }
  }
  targets = alive;

  // Spawn new targets
  if (
    targets.length < popConfig.maxTargets &&
    now - lastSpawnTime > popConfig.spawnInterval
  ) {
    targets = [...targets, spawnTarget(areaBounds, popConfig.targetSize)];
    lastSpawnTime = now;
  }

  return { ...state, targets, expired, lastSpawnTime, pendingRemove };
}

export function getPopResults(state, duration) {
  const total = state.hits + state.expired;
  return {
    score: state.hits,
    hits: state.hits,
    misses: state.misses,
    expired: state.expired,
    accuracy:
      state.totalClicks > 0
        ? Math.round((state.hits / state.totalClicks) * 100)
        : 0,
    hitRate: total > 0 ? Math.round((state.hits / total) * 100) : 0,
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
