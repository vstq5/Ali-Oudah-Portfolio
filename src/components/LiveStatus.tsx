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
        "glass-card inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm"
      }
      aria-live="polite"
    >
      <span aria-hidden="true">📍</span>
      <span className="text-foreground/90">Based in {city}</span>
      <span className="text-muted-foreground">•</span>
      <span className="font-mono text-muted-foreground">{formatter.format(now)}</span>
    </div>
  );
}
