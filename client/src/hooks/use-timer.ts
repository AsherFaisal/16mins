import { useState, useEffect, useRef, useCallback } from "react";

interface UseTimerOptions {
  initialTime: number; // in seconds
  onComplete?: () => void;
}

export function useTimer({ initialTime, onComplete }: UseTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsCompleted(false);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(initialTime);
    setIsCompleted(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [initialTime]);

  const skip = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsCompleted(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onComplete?.();
  }, [onComplete]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onComplete]);

  // Send notification when timer completes
  useEffect(() => {
    if (isCompleted && timeLeft === 0) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('16mins Focus Session Complete!', {
          body: 'Great job! You completed a 16-minute focus session.',
          icon: '/manifest-icon-192.png',
          tag: 'timer-complete'
        });
      }

      // Vibrate if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  }, [isCompleted, timeLeft]);

  const progress = 1 - (timeLeft / initialTime);

  return {
    timeLeft,
    isRunning,
    isCompleted,
    progress,
    formatTime,
    start,
    pause,
    reset,
    skip
  };
}
