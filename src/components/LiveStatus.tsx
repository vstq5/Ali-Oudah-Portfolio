import { useEffect, useMemo, useState } from "react";

interface LiveStatusProps {
  city: string;
  timeZone: string;
  className?: string;
  showSeconds?: boolean;
}

function formatTime(timeZone: string, showSeconds: boolean) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
    hour12: true,
    timeZone,
  });
}

export default function LiveStatus({
  city,
  timeZone,
  className,
  showSeconds = false,
}: LiveStatusProps) {
  const formatter = useMemo(() => formatTime(timeZone, showSeconds), [timeZone, showSeconds]);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalMs = showSeconds ? 1000 : 15_000;
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [showSeconds]);

  return (
    <div
      className={
        className ??
        "flex items-center justify-between gap-4 py-2 border-b border-foreground/10 text-xs font-mono"
      }
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className="text-primary font-medium tracking-widest">[LOC]</span>
        <span className="text-muted-foreground uppercase tracking-widest">{city}</span>
      </div>
      <span className="text-foreground/80">{formatter.format(now)}</span>
    </div>
  );
}
