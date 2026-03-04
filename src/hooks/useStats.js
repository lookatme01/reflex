import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "reflex-stats";

export function useStats() {
  const [stats, setStats] = useLocalStorage(STORAGE_KEY, {
    sessions: [],
    bestScores: {},
  });

  function saveSession(session) {
    setStats((prev) => {
      const sessions = [session, ...prev.sessions].slice(0, 100);
      const best = { ...prev.bestScores };
      const key = session.mode;
      if (!best[key] || session.score > best[key].score) {
        best[key] = {
          score: session.score,
          accuracy: session.accuracy,
          date: session.date,
        };
      }
      return { sessions, bestScores: best };
    });
  }

  function getModeSessions(mode) {
    return stats.sessions.filter((s) => s.mode === mode);
  }

  function getBest(mode) {
    return stats.bestScores[mode] || null;
  }

  function clearStats() {
    setStats({ sessions: [], bestScores: {} });
  }

  return { stats, saveSession, getModeSessions, getBest, clearStats };
}
