import { useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const GOAL_SECONDS = 20 * 60; // 20 minutes
const SAVE_INTERVAL_MS = 5000;

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function useDailyGoal() {
  const [data, setData] = useLocalStorage('daily-goal', { date: '', seconds: 0 });

  const today = todayKey();
  const seconds = data.date === today ? data.seconds : 0;

  const activeRef = useRef(false);
  const lastTickRef = useRef(null);
  const accRef = useRef(0);
  accRef.current = seconds;

  const flush = useCallback(() => {
    setData({ date: todayKey(), seconds: accRef.current });
  }, [setData]);

  const markActive = useCallback((isPlaying) => {
    if (isPlaying && !activeRef.current) {
      activeRef.current = true;
      lastTickRef.current = Date.now();
    } else if (!isPlaying && activeRef.current) {
      const elapsed = (Date.now() - lastTickRef.current) / 1000;
      accRef.current = Math.min(accRef.current + elapsed, GOAL_SECONDS);
      activeRef.current = false;
      lastTickRef.current = null;
      flush();
    }
  }, [flush]);

  useEffect(() => {
    const iv = setInterval(() => {
      if (activeRef.current && lastTickRef.current) {
        const elapsed = (Date.now() - lastTickRef.current) / 1000;
        lastTickRef.current = Date.now();
        accRef.current = Math.min(accRef.current + elapsed, GOAL_SECONDS);
        flush();
      }
    }, SAVE_INTERVAL_MS);
    return () => clearInterval(iv);
  }, [flush]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden && activeRef.current && lastTickRef.current) {
        const elapsed = (Date.now() - lastTickRef.current) / 1000;
        lastTickRef.current = Date.now();
        accRef.current = Math.min(accRef.current + elapsed, GOAL_SECONDS);
        flush();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [flush]);

  return { seconds, goalSeconds: GOAL_SECONDS, markActive };
}
