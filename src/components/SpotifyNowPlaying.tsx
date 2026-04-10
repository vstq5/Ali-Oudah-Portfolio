import { useEffect, useMemo, useState } from 'react';
import { siSpotify } from 'simple-icons';

type NowPlayingResponse =
  | {
    isPlaying: true;
    title: string;
    artist: string;
    songUrl: string;
    albumImageUrl: string;
  }
  | {
    isPlaying: false;
  };

function SpotifyMark() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className="h-4 w-4"
    >
      <path d={siSpotify.path} fill={`#${siSpotify.hex}`} />
    </svg>
  );
}

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<NowPlayingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshMs = 25_000;

  const subtitle = useMemo(() => {
    if (!data) return 'Checking Spotify…';
    if (!data.isPlaying) return 'Not listening right now';
    return `${data.artist}`;
  }, [data]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function load() {
      try {
        setError(null);
        const res = await fetch('/api/spotify/now-playing', {
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
          },
        });

        const json = (await res.json().catch(() => null)) as NowPlayingResponse | null;
        if (!mounted) return;

        if (!json) {
          setData({ isPlaying: false });
          return;
        }

        setData(json);
      } catch (e: unknown) {
        if (!mounted) return;
        if (e instanceof Error && e.name === 'AbortError') return;
        setError('Unable to load Spotify status');
        setData({ isPlaying: false });
      }
    }

    void load();
    const interval = window.setInterval(load, refreshMs);

    return () => {
      mounted = false;
      controller.abort();
      window.clearInterval(interval);
    };
  }, []);

  const isPlaying = Boolean(data && 'isPlaying' in data && data.isPlaying);

  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-foreground/10 text-xs font-mono w-full">
      <div className="flex items-center gap-3">
        <span className="text-primary font-medium tracking-widest">[SFTY]</span>
        <span className="text-muted-foreground uppercase tracking-widest min-w-[70px]">
          {isPlaying ? 'PLAYING' : 'IDLE'}
        </span>
      </div>

      <div className="min-w-0 flex-1 text-right">
        {isPlaying ? (
          <a
            href={(data as Extract<NowPlayingResponse, { isPlaying: true }>).songUrl}
            target="_blank"
            rel="noreferrer"
            className="group block min-w-0"
            title="Open in Spotify"
          >
            <div className="flex items-center justify-end gap-2 min-w-0">
              <span className="truncate text-foreground/80 group-hover:text-primary transition-colors">
                {(data as Extract<NowPlayingResponse, { isPlaying: true }>).title}
              </span>
              <span className="shrink-0 text-muted-foreground/30">//</span>
              <span className="truncate text-muted-foreground">{subtitle}</span>
            </div>
          </a>
        ) : (
          <div className="text-muted-foreground">
            {error ? error : subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
