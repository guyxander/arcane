"use client";

import { useEffect, useState } from "react";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(deadline: number): TimeLeft | null {
  const difference = deadline - Date.now();
  if (difference <= 0) return null;
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  };
}

export function Countdown({
  deadline,
  deadlineLabel,
  cohortName,
}: {
  deadline: string | null;
  deadlineLabel: string | null;
  cohortName: string | null;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null | undefined>(undefined);

  useEffect(() => {
    if (!deadline) {
      return;
    }
    const deadlineTime = new Date(deadline).getTime();
    const update = () => setTimeLeft(getTimeLeft(deadlineTime));
    update();
    const interval = window.setInterval(update, 1_000);
    return () => window.clearInterval(interval);
  }, [deadline]);

  if (!deadline) return <strong className="countdown-closed">NEXT COHORT · SCHEDULE COMING SOON</strong>;
  if (timeLeft === undefined) return <span className="countdown-loading">{cohortName || "NEXT COHORT"} · ENROLLMENT CLOSES {deadlineLabel || "SOON"}</span>;
  if (timeLeft === null) return <strong className="countdown-closed">{cohortName || "NEXT COHORT"} · ENROLLMENT CLOSED</strong>;

  const units = [[timeLeft.days, "DAYS"], [timeLeft.hours, "HRS"], [timeLeft.minutes, "MIN"], [timeLeft.seconds, "SEC"]] as const;

  return (
    <div className="countdown" aria-label="Time remaining until enrollment closes">
      <strong>{cohortName || "NEXT COHORT"}</strong>
      <span className="countdown-label">ENROLLMENT CLOSES IN</span>
      <div className="countdown-units" aria-live="off">
        {units.map(([value, label]) => <span className="countdown-unit" key={label}><b>{String(value).padStart(2, "0")}</b><small>{label}</small></span>)}
      </div>
      <span className="sr-only">Deadline: {deadlineLabel}.</span>
    </div>
  );
}
