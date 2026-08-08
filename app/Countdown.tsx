"use client";

import { useEffect, useState } from "react";

const deadline = new Date("2026-08-14T23:59:00+01:00").getTime();
type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(): TimeLeft | null {
  const difference = deadline - Date.now();
  if (difference <= 0) return null;
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  };
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null | undefined>(undefined);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft());
    update();
    const interval = window.setInterval(update, 1_000);
    return () => window.clearInterval(interval);
  }, []);

  if (timeLeft === undefined) return <span className="countdown-loading">AUGUST COHORT · ENROLLMENT CLOSES AUGUST 14, 11:59 PM WAT</span>;
  if (timeLeft === null) return <strong className="countdown-closed">AUGUST COHORT · ENROLLMENT CLOSED</strong>;

  const units = [[timeLeft.days, "DAYS"], [timeLeft.hours, "HRS"], [timeLeft.minutes, "MIN"], [timeLeft.seconds, "SEC"]] as const;

  return (
    <div className="countdown" aria-label="Time remaining until enrollment closes">
      <strong>AUGUST COHORT</strong>
      <span className="countdown-label">ENROLLMENT CLOSES IN</span>
      <div className="countdown-units" aria-live="off">
        {units.map(([value, label]) => <span className="countdown-unit" key={label}><b>{String(value).padStart(2, "0")}</b><small>{label}</small></span>)}
      </div>
      <span className="sr-only">Deadline: August 14, 2026 at 11:59 PM West Africa Time.</span>
    </div>
  );
}
