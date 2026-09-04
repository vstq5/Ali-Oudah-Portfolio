import { Asterisk } from 'lucide-react';
import { toolIcons } from './icons/toolIcons';

/**
 * "The tools I use" — a ring of tool marks orbiting the integration hub,
 * after Airtable's *Works with the tools you already use*.
 *
 * Measured off airtable.com rather than guessed: twelve marks on one radius at
 * exactly 30° apart, 39px icons on white circular chips, a hub at dead centre,
 * two concentric hairline circles, and a 30s linear orbit.
 *
 * THE COUNTER-ROTATION IS THE WHOLE TRICK. Airtable runs two keyframes at the
 * same 30s duration: the ring rotates +360° while every icon rotates −360°.
 * The rotations cancel, so the marks travel around the circle while staying
 * upright. Drop the counter-rotation and all twelve tumble as they orbit.
 *
 * Which forces the nesting below. A CSS `transform` and an animated rotation
 * on the same element overwrite one another, so each element gets exactly one
 * transform source:
 *
 *   ring     animated  +360° over 30s
 *   └ spoke  static    rotate(θ)                    — swings the arm out
 *     └ pos  static    translate(-50%,-50%) rotate(-θ)  — centres, cancels θ
 *       └ counter  animated  −360° over 30s         — cancels the ring
 *         └ chip                                    — the mark itself
 *
 * Geometry is in percentages, not pixels, so the whole thing scales with its
 * grid column instead of needing breakpoints.
 */

/** icon orbit radius, as a % of the container — Airtable's 203 ÷ 467 */
const RADIUS = 43.5;
const STEP = 360 / toolIcons.length; // 30° at twelve marks, same as Airtable

const ToolsRing = () => (
  <section className="relative bg-canvas py-28 md:py-36">
    <div className="shell">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
        {/* Text is first in the DOM so the heading is announced before a dozen
            decorative marks; `lg:order-2` moves it right on desktop. Airtable
            puts the visual left, and doing the same alternates against the
            hero's text-left/diagram-right split directly above. */}
        <div className="lg:order-2">
          <h2 className="font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
            The tools I use
          </h2>

          {/* No CTA here on purpose. "Talk about your setup" already appears in
              the nav and again in the hero; a third copy inside the first two
              screens is repetition, not conversion. This section's job is
              credibility, and the contact CTA is still one scroll away. */}
          <p className="mt-5 max-w-[34rem] text-[clamp(1rem,1.2vw,1.075rem)] leading-[1.65] text-ink-muted">
            The stack behind the integrations: source control, cloud, containers and
            configuration, alongside the platforms your business already runs on.
          </p>
        </div>

        <div className="lg:order-1">
          <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
            {/* Two hairline guide circles, as Airtable has: one through the
                orbit itself, one closer in to give the hub a field to sit in. */}
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rule"
              style={{ width: `${RADIUS * 2}%`, height: `${RADIUS * 2}%` }}
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rule"
              style={{ width: '52%', height: '52%' }}
            />

            {/* The travelling arc. Airtable spins a gradient; a dashed SVG
                circle on a rotating parent is the same effect with far more
                control, and it is the technique `.rail-live` already uses in
                HeroDiagram. Only this one element is orange: per the rule the
                tools are the tools, and the signal moving between them is the
                integration layer — which is the thing being sold. */}
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              className="tools-arc absolute inset-0 h-full w-full"
            >
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke="hsl(var(--brand))"
                strokeWidth="0.45"
                strokeLinecap="round"
                /* circumference is 2πr ≈ 273; an 18-unit dash is a ~7% arc */
                strokeDasharray="18 255"
              />
            </svg>

            <div className="tools-orbit absolute inset-0 will-change-transform">
              {toolIcons.map((tool, i) => {
                const angle = i * STEP;
                return (
                  <div
                    key={tool.slug}
                    aria-hidden
                    className="absolute inset-0"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div
                      className="absolute left-1/2"
                      style={{
                        top: `${50 - RADIUS}%`,
                        transform: `translate(-50%, -50%) rotate(${-angle}deg)`,
                      }}
                    >
                      {/* Chips shrink below md, and they have to. The ring is a
                          percentage of its column, so on a 390px phone the
                          orbit radius falls to ~140px, which puts adjacent
                          chip centres only 72px apart — a 64px chip would
                          leave 8px of air and read as a solid crowded band.
                          48px restores a ~24px gap at that radius. */}
                      <div className="tools-counter will-change-transform">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rule bg-elevated text-ink shadow-[0_2px_8px_rgba(19,30,46,0.05)] md:h-16 md:w-16">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 md:h-9 md:w-9">
                            <path d={tool.d} />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hub. The same ✱ and the same border/shadow treatment as the hero
                diagram's integration node — repeating the site's signature mark
                is what ties this ring to that diagram rather than leaving it
                looking like a second, unrelated borrowed section. */}
            <div className="absolute left-1/2 top-1/2 flex h-[4.5rem] w-[4.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand/25 bg-elevated shadow-[0_6px_26px_-12px_rgba(255,92,26,0.15),0_2px_10px_rgba(19,30,46,0.06)] md:h-24 md:w-24">
              <Asterisk className="h-7 w-7 text-brand md:h-9 md:w-9" strokeWidth={2.2} aria-hidden />
            </div>
          </div>

          {/* The marks are aria-hidden above — they are decoration around a hub,
              and twelve announced icons would bury the heading. The list here
              gives the same information to assistive tech in one readable pass. */}
          <ul className="sr-only">
            {toolIcons.map((tool) => (
              <li key={tool.slug}>{tool.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default ToolsRing;
