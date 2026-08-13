import { useEffect, useState } from 'react';

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
}

function calculate(endDate: string): TimeRemaining {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isEnded: false,
  };
}

export function useCountdown(endDate: string): TimeRemaining {
  const [time, setTime] = useState<TimeRemaining>(() => calculate(endDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculate(endDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return time;
}
