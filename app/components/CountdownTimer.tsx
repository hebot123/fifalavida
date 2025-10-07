'use client';

import { useEffect, useId, useMemo, useState } from 'react';

const KICKOFF_ISO = '2026-06-11T00:00:00-06:00';
const SEGMENT_LABELS = ['Days', 'Hours', 'Minutes', 'Seconds'] as const;

export const getTimeDifference = (target: Date, currentTime: Date = new Date()) => {
  const total = target.getTime() - currentTime.getTime();

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

  const countdownDescriptionId = useId();
  const headingId = useId();

  const valuesByLabel: Record<(typeof SEGMENT_LABELS)[number], number> = {
    Days: timeLeft.days,
    Hours: timeLeft.hours,
    Minutes: timeLeft.minutes,
    Seconds: timeLeft.seconds,
  };

  const segments = SEGMENT_LABELS.map((label) => ({
    label,
    value: valuesByLabel[label],
  }));

  return (
    <section
      aria-labelledby={headingId}
      aria-describedby={countdownDescriptionId}
      className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-blue-600 to-slate-900 px-6 py-12 text-center text-white shadow-2xl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.28),transparent_65%)]"
      />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <h2 id={headingId} className="text-3xl font-extrabold tracking-tight">
          Countdown to Kickoff
        </h2>
        {timeLeft.isPast ? (
          <p
            className="rounded-full bg-white/10 px-6 py-3 text-base font-semibold text-emerald-50 shadow-lg backdrop-blur"
            role="status"
            aria-live="polite"
            aria-label="The FIFA World Cup 2026 has kicked off"
          >
            The FIFA World Cup 2026 has kicked off!
          </p>
        ) : (
          <div
            className="flex w-full flex-wrap items-center justify-center gap-4 md:gap-6"
            role="timer"
            aria-live="polite"
            aria-label="Countdown to FIFA World Cup 2026 kickoff"
          >
            {segments.map((segment) => (
              <div
                key={segment.label}
                className="flex min-w-[120px] flex-col items-center rounded-2xl border border-white/30 bg-white/15 px-6 py-5 shadow-lg backdrop-blur transition-transform duration-300 ease-out hover:-translate-y-1"
              >
                <span className="text-4xl font-black text-white" aria-hidden="true">
                  {segment.value.toString().padStart(2, '0')}
                </span>
                <span className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-emerald-100">
                  {segment.label}
                </span>
              </div>
            ))}
          </div>
        )}
        <p id={countdownDescriptionId} className="text-sm font-medium text-emerald-100">
          until FIFA World Cup 2026
        </p>
      </div>
    </section>
  );
};

export default CountdownTimer;
