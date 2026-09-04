/**
 * "Worked with" logo marquee, built to Zapier's measured spec.
 *
 * Numbers below are taken off zapier.com's own trusted-by strip, not guessed:
 *   viewport   1280px max-width, 56px tall, overflow hidden, inside the
 *              content column — the row is NOT full-bleed
 *   edge fade  50px gradients on both sides (see `.marquee-fade`) — this is
 *              what makes marks dissolve away and return, rather than being
 *              guillotined at the container edge
 *   track      display:flex, gap 80px, translateX(0 → -50%), linear
 *   speed      ~27px/s — 54s for their 1442px half-track
 *   logos      12–24px tall, 51–136px wide (mean 84.7), and their SVGs are
 *              trimmed tight to the ink — ≤0.8px padding on every side — so
 *              that 80px gap is genuine ink-to-ink whitespace, not artwork
 *              margin. See `Set` for why ours is 72 rather than 80.
 *
 * WHY EVERY MARK IS CROPPED
 *
 * Zapier's row is nine single-word wordmarks, so the glyphs fill their boxes.
 * Ours are institutional lockups — acronym plus a column of English and Arabic
 * sub-text, or a seal floating in transparent padding. Sizing those by their
 * bounding box puts the readable part at roughly half Zapier's glyph height,
 * which is exactly why the strip read as small and far away.
 *
 * So each entry carries the ink box of the mark we actually want, measured off
 * the asset's own alpha channel, and `h` sizes THAT rather than the artwork.
 * The sub-text is cropped away, not shrunk into mud — the same call Zapier's
 * suppliers already made before handing over an SVG.
 *
 * Re-measure `src`/`crop` if an asset is ever replaced; guessing them shifts
 * the mark inside its window.
 */

type Logo = {
  file: string;
  name: string;
  /** intrinsic pixel size of the asset */
  src: [w: number, h: number];
  /** ink box of the mark to show, in source pixels: [x, y, w, h] */
  crop: [x: number, y: number, w: number, h: number];
  /** rendered height of the CROP, not of the artwork */
  h: number;
  /** grey level, tuned at render size so no mark shouts louder than the rest */
  ink: number;
  /** the source is white-on-dark, so flip it to sit on the cream ground */
  invert?: boolean;
  /** rescues fine line work that muddies once flattened to grey */
  contrast?: number;
};

// Rendered widths: 45, 83, 101, 106, 96, 87, 120, 143 — 781px of ink. Wider
// than Zapier's 51–136 because the period has to clear a wider strip; the
// spread between the narrowest and widest still matches theirs, so no single
// mark dominates and none disappears.
const logos: Logo[] = [
  // The seal is the only pictorial mark here: no wordmark to crop to, far more
  // ink per pixel than a letterform, so it gets the most height and the least
  // opacity of anything in the row.
  { file: 'worked-kuwait-university.png', name: 'Kuwait University', src: [398, 502], crop: [0, 0, 398, 502], h: 57, ink: 0.62, contrast: 1.3 },
  // square artwork, wordmark floating in the middle third
  { file: 'worked-coded.png', name: 'CODED', src: [1595, 1595], crop: [151, 571, 1292, 452], h: 29, ink: 0.7 },
  // crop drops "kuwait technical college" + the Arabic line beneath it
  { file: 'worked-ktech.png', name: 'Kuwait Technical College', src: [702, 355], crop: [9, 7, 685, 176], h: 26, ink: 0.72 },
  // crop drops "Gulf University for Science & Technology" set alongside
  { file: 'worked-gust.svg', name: 'GUST', src: [243, 28], crop: [0, 0, 95, 26], h: 29, ink: 0.72 },
  // already a bare acronym — the wide gap two thirds along is the tracking
  // between U and K, not a sub-lockup, so the crop is the whole artwork
  { file: 'worked-auk.webp', name: 'American University of Kuwait', src: [966, 292], crop: [0, 0, 966, 292], h: 29, ink: 0.55, invert: true },
  // full lockup, trimmed margin only. Cropping this to its bare "AU" reads as
  // a second AUK two marks later; the Arabic and "AUSTRALIAN UNIVERSITY"
  // column beside it is what tells the two apart at a glance.
  { file: 'worked-au.png', name: 'Australian University of Kuwait', src: [759, 329], crop: [44, 35, 671, 262], h: 34, ink: 0.68 },
  // already a compact icon + wordmark lockup; crop is just the trimmed margin
  { file: 'worked-aafaq.png', name: 'Aafaq Education', src: [312, 101], crop: [0, 16, 278, 72], h: 31, ink: 0.72 },
  // Simple Icons packs its wordmarks into a square, so the glyph is a thin
  // band across the middle of otherwise empty artwork
  { file: 'worked-ticketmaster.svg', name: 'Ticketmaster', src: [150, 150], crop: [0, 65, 150, 20], h: 19, ink: 0.8 },
];

const Mark = ({ logo, decorative }: { logo: Logo; decorative: boolean }) => {
  const [srcW, srcH] = logo.src;
  const [cx, cy, cw, ch] = logo.crop;
  const scale = logo.h / ch;

  return (
    // The window is the crop at render size; the artwork is laid out full-size
    // behind it and offset so the crop lands in view. Both boxes are explicit
    // so the track measures correctly before any lazy image decodes — the loop
    // depends on the track being exactly twice one set.
    <span
      className="relative shrink-0 overflow-hidden"
      style={{ width: Math.round(cw * scale), height: logo.h }}
    >
      <img
        src={`/assets/logos/${logo.file}`}
        alt={decorative ? '' : logo.name}
        loading="lazy"
        decoding="async"
        className={`logo-mono absolute ${logo.invert ? 'logo-invert' : ''}`}
        style={
          {
            left: -cx * scale,
            top: -cy * scale,
            width: srcW * scale,
            height: srcH * scale,
            maxWidth: 'none',
            '--logo-ink': logo.ink,
            ...(logo.contrast ? { '--logo-contrast': logo.contrast } : {}),
          } as React.CSSProperties
        }
      />
    </span>
  );
};

const Set = ({ decorative }: { decorative: boolean }) => (
  <div
    // THE PERIOD CONSTRAINT — read before touching sizes or gaps.
    //
    // A duplicated-track marquee puts the same mark back on screen every
    // `period` px, where period = sum of mark widths + one gap each. If the
    // strip is wider than the period, a mark enters on the left while it is
    // still leaving on the right and you see it twice.
    //
    // Zapier never hits this: nine marks at 80px gaps give them a 1442px
    // period against a 1280px content column. Eight marks is a shorter period,
    // and this shell is wider (1472px at its cap), so the marks are scaled up
    // ~30% over Zapier's to buy the length back: 781px of ink + 8×96px gaps =
    // a 1549px period, clear of the 1472px strip at every window size.
    //
    // Their SVGs are trimmed tight to the ink (measured: ≤0.8px padding a
    // side), so their 80px gap really is ink-to-ink and comparable to ours;
    // 96px against our wider marks lands at 50.4% ink to their 51.4%.
    //
    // So: shrinking a mark, or narrowing the gap, shortens the period and
    // brings the double back. Adding a ninth logo is what buys room to do
    // either. `pr` matches `gap-x` so the seam spaces like every other gap.
    className="flex h-20 shrink-0 items-center gap-x-16 pr-16 md:gap-x-24 md:pr-24"
    {...(decorative ? { 'aria-hidden': true } : {})}
  >
    {logos.map((l) => (
      <Mark key={l.file} logo={l} decorative={decorative} />
    ))}
  </div>
);

const WorkedWith = () => (
  <section className="bg-canvas py-14">
    <div className="shell">
      {/* Deliberately NOT Zapier's label, which is a 12px uppercase eyebrow at
          0.04em tracking. Two things were wrong with importing it:

          1. This site already has an eyebrow spec — `text-xs uppercase
             tracking-[0.2em]` (About.tsx, Projects.tsx). Zapier's tracking is
             five times tighter, so the strip read as cramped small caps beside
             the page's own airy labels.
          2. Every other section here is titled with a left-aligned display
             heading. A centred micro-label was the only one of its kind.

          So it becomes a real heading in the site's voice, one step below the
          4xl/5xl used by "Selected work." and "The tools I use" — this section
          is a supporting strip, and the smaller step is what says so. */}
      <h2 className="font-display text-2xl font-medium tracking-tight text-ink md:text-3xl">
        Worked with
      </h2>

      {/* Spans the full content column, like Zapier's does — see `Set` for the
          sizing constraint that makes that possible with only eight marks.
          80px tall rather than Zapier's 56 because our marks run bigger and the
          seal is the one that can't be cropped down to a wordmark.
          `.marquee-fade` gives the dissolve at each edge, and the track is
          duplicated + translated -50% so the loop has no seam. `footer-marquee`
          is the existing reduced-motion guard in index.css — reuse it, don't
          fork it. 57s is Zapier's ~27px/s applied to our 1549px half-track. */}
      <div className="marquee-fade mt-8 h-20 overflow-hidden md:mt-10">
        <div className="footer-marquee flex w-max [animation:footerMarquee_57s_linear_infinite] will-change-transform">
          <Set decorative={false} />
          <Set decorative />
        </div>
      </div>
    </div>
  </section>
);

export default WorkedWith;
