"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Countdown component shows time remaining until the 2026 World Cup kickoff
export default function Countdown() {
  // set kickoff date/time in Mexico City timezone (UTC-05:00)
  const kickoff = new Date("2026-06-11T00:00:00-05:00");

  function calculateTimeLeft(): TimeLeft {
    const now = new Date();
    const difference = kickoff.getTime() - now.getTime();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isPast = kickoff.getTime() - new Date().getTime() <= 0;

  return (
    <section className="py-12 text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-2">
        Countdown to FIFA World Cup 2026
      </h2>
      {isPast ? (
        <p className="text-xl md:text-2xl mb-1">The World Cup has begun!</p>
      ) : (
        <p className="text-xl md:text-2xl mb-1" aria-label="Time remaining">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </p>
      )}
      <p className="text-sm text-gray-600">until FIFA World Cup 2026</p>
    </section>
  );
}
