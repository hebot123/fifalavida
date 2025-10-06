'use client';

import { useEffect, useMemo, useState } from 'react';

const KICKOFF_ISO = '2026-06-11T00:00:00-06:00';

const getTimeDifference = (target: Date) => {
  const now = new Date();
  const total = target.getTime() - now.getTime();

  if (total <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
    } as const;
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
  } as const;
};

const CountdownTimer = () => {
  const targetDate = useMemo(() => new Date(KICKOFF_ISO), []);
  const [timeLeft, setTimeLeft] = useState(() => getTimeDifference(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeDifference(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const segments = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl font-bold mb-6">Countdown to Kickoff</h2>
      {timeLeft.isPast ? (
        <p className="text-lg font-semibold" role="status" aria-live="polite">
          The FIFA World Cup 2026 has kicked off!
        </p>
      ) : (
        <div
          className="flex flex-wrap items-center justify-center gap-4"
          role="timer"
          aria-live="polite"
        >
          {segments.map((segment) => (
            <div
              key={segment.label}
              className="bg-white/80 rounded-lg shadow px-6 py-4 min-w-[110px]"
            >
              <div className="text-3xl font-extrabold text-blue-600" aria-hidden="true">
                {segment.value.toString().padStart(2, '0')}
              </div>
              <span className="block text-sm font-medium text-gray-600">{segment.label}</span>
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 text-sm text-gray-500">until FIFA World Cup 2026</p>
    </div>
  );
};

export default CountdownTimer;
