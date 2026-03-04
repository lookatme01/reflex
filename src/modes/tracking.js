// Tracking Mode: Follow a smoothly moving target with your cursor.
// Score is based on time spent within the target bounds.

export const trackingConfig = {
  name: "Track",
  description: "Keep your cursor on the moving target",
  icon: "🔄",
  color: "#a855f7",
  defaultDuration: 30,
  targetSize: 60,
  speed: 180,
};

export function createTrackingState(areaBounds) {
  const cx = areaBounds.width / 2;
  const cy = areaBounds.height / 2;
  return {
    target: {
      x: cx,
      y: cy,
      radius: trackingConfig.targetSize / 2,
      vx: (Math.random() - 0.5) * trackingConfig.speed * 2,
      vy: (Math.random() - 0.5) * trackingConfig.speed * 2,
    },
    mouseX: 0,
    mouseY: 0,
    totalFrames: 0,
    onTargetFrames: 0,
    isOnTarget: false,
    distanceSum: 0,
  };
}

export function handleTrackingMouseMove(state, x, y) {
  return { ...state, mouseX: x, mouseY: y };
}

export function updateTracking(state, delta, _timestamp, areaBounds) {
  let { target, mouseX, mouseY, totalFrames, onTargetFrames, distanceSum } =
    state;

  // Move target
  let { x, y, vx, vy, radius } = target;
  x += vx * delta;
  y += vy * delta;

  // Add gentle random acceleration for organic movement
  vx += (Math.random() - 0.5) * 400 * delta;
  vy += (Math.random() - 0.5) * 400 * delta;

  // Clamp speed
  const speed = Math.sqrt(vx * vx + vy * vy);
  const maxSpeed = trackingConfig.speed * 1.5;
  const minSpeed = trackingConfig.speed * 0.5;
  if (speed > maxSpeed) {
    vx = (vx / speed) * maxSpeed;
    vy = (vy / speed) * maxSpeed;
  } else if (speed < minSpeed) {
    vx = (vx / speed) * minSpeed;
    vy = (vy / speed) * minSpeed;
  }

  // Bounce off walls
  const padding = radius + 5;
  if (x < padding) {
    x = padding;
    vx = Math.abs(vx);
  }
  if (x > areaBounds.width - padding) {
    x = areaBounds.width - padding;
    vx = -Math.abs(vx);
  }
  if (y < padding) {
    y = padding;
    vy = Math.abs(vy);
  }
  if (y > areaBounds.height - padding) {
    y = areaBounds.height - padding;
    vy = -Math.abs(vy);
  }

  // Check if cursor is on target
  const dx = mouseX - x;
  const dy = mouseY - y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const isOnTarget = dist <= radius;

  totalFrames++;
  if (isOnTarget) onTargetFrames++;
  distanceSum += dist;

  return {
    ...state,
    target: { x, y, vx, vy, radius },
    totalFrames,
    onTargetFrames,
    isOnTarget,
    distanceSum,
  };
}

export function getTrackingResults(state, duration) {
  const accuracy =
    state.totalFrames > 0
      ? Math.round((state.onTargetFrames / state.totalFrames) * 100)
      : 0;

  const avgDistance =
    state.totalFrames > 0
      ? Math.round(state.distanceSum / state.totalFrames)
      : 0;

  return {
    score: accuracy,
    accuracy,
    avgDistancePx: avgDistance,
    onTargetPercent: accuracy,
    totalFrames: state.totalFrames,
    onTargetFrames: state.onTargetFrames,
    duration,
  };
}
