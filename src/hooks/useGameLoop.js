import { useRef, useEffect, useCallback } from "react";

export function useGameLoop(callback, isRunning) {
  const callbackRef = useRef(callback);
  const frameRef = useRef(null);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const loop = useCallback((timestamp) => {
    if (lastTimeRef.current === null) {
      lastTimeRef.current = timestamp;
    }
    const delta = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;
    callbackRef.current(delta, timestamp);
    frameRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = null;
      frameRef.current = requestAnimationFrame(loop);
    } else {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    }
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isRunning, loop]);
}
