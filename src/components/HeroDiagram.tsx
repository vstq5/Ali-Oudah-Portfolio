import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ShoppingCart,
  User,
  Package,
  Clock,
  ShieldCheck,
  Database,
  TrendingUp,
  Asterisk,
  type LucideIcon,
} from 'lucide-react';

/**
 * Hero diagram — Shopify data routed through the implementation layer into Zoho.
 *
 * The connections are the point. Rather than a decorative bus implying that
 * everything on the left reaches everything on the right, each flow is a real
 * pairing (orders → CRM, products → inventory, …) drawn as its own curve. The
 * rails are therefore measured from the live DOM and drawn as SVG, because
 * arbitrary routing can't be expressed with CSS borders.
 *
 * Colour carries the meaning: the tools keep their own brand marks, and orange
 * is reserved for the implementation layer and whichever flow is currently
 * active. Shopify and Zoho are the tools; orange is Ali.
 */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

/** Downloaded brand files are full wordmarks; the mark is the leading square,
 *  so crop to it rather than editing third-party SVGs. */
const BrandMark = ({ file, size = 26 }: { file: string; size?: number }) => (
  <span aria-hidden className="block shrink-0 overflow-hidden" style={{ width: size, height: size }}>
    <img
      src={`/assets/logos/${file}.svg`}
      alt=""
      loading="lazy"
      decoding="async"
      style={{ height: size, width: 'auto', maxWidth: 'none' }}
    />
  </span>
);

type Node = { id: string; title: string; sub: string; logo?: string; icon?: LucideIcon };

/** Three data streams, not four — the store itself is their origin, which also
 *  breaks the 4→1→4 symmetry that made this read like a comparison table. */
const streams: Node[] = [
  { id: 'orders', title: 'Orders', sub: 'New orders', icon: ShoppingCart },
  { id: 'customers', title: 'Customers', sub: 'Customer data', icon: User },
  { id: 'products', title: 'Products', sub: 'Catalog & stock', icon: Package },
];

const destinations: Array<Node & { pill: string }> = [
  { id: 'crm', title: 'Zoho CRM', sub: 'Customer records', logo: 'zoho-crm', pill: 'Customer synced' },
  { id: 'inventory', title: 'Zoho Inventory', sub: 'Stock & availability', logo: 'zoho-inventory', pill: 'Stock updated' },
  { id: 'desk', title: 'Zoho Desk', sub: 'Support tickets', logo: 'zoho-desk', pill: 'Ticket created' },
  { id: 'books', title: 'Zoho Books', sub: 'Invoicing & finance', logo: 'zoho-books', pill: 'Invoice raised' },
];

/**
 * The actual business-data pairings. This is the claim the diagram makes, and
 * the pill belongs to the flow rather than the destination — CRM reads
 * "Order synced" or "Customer synced" depending on which stream just ran,
 * which is the whole point of showing two flows into it.
 */
const flows: Array<{ from: string; to: string; pill: string }> = [
  { from: 'orders', to: 'crm', pill: 'Order synced' },
  { from: 'products', to: 'inventory', pill: 'Stock updated' },
  { from: 'customers', to: 'desk', pill: 'Ticket created' },
  { from: 'orders', to: 'books', pill: 'Invoice raised' },
  { from: 'customers', to: 'crm', pill: 'Customer synced' },
];

const outcomes: Array<{ label: string; icon: LucideIcon }> = [
  { label: 'Real-time sync', icon: Clock },
  { label: 'Fewer errors', icon: ShieldCheck },
  { label: 'Accurate data', icon: Database },
  { label: 'Scalable growth', icon: TrendingUp },
];

type Pt = { x: number; y: number };
type Anchors = Record<string, { l: Pt; r: Pt }>;

const CARD =
  'flex items-center gap-3 rounded-xl border border-rule bg-elevated px-3.5 py-3 lg:h-[68px] ' +
  'shadow-[0_1px_2px_rgba(19,30,46,0.04)]';

const NodeCard = ({ node }: { node: Node }) => {
  const Icon = node.icon;
  return (
    <div className={CARD}>
      {node.logo ? (
        <BrandMark file={node.logo} />
      ) : (
        Icon && <Icon size={21} strokeWidth={1.6} className="shrink-0 text-ink" aria-hidden />
      )}
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-semibold leading-tight text-ink">{node.title}</span>
        <span className="block truncate text-[11px] leading-tight text-ink-muted">{node.sub}</span>
      </span>
    </div>
  );
};

/** Ease a curve out of `a` and into `b` horizontally. */
const curve = (a: Pt, b: Pt) => {
  const dx = Math.max(22, Math.abs(b.x - a.x) * 0.5);
  return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
};

const HeroDiagram = () => {
  const wrapRef = useRef<HTMLElement>(null);
  const nodes = useRef<Record<string, HTMLElement | null>>({});
  const [anchors, setAnchors] = useState<Anchors>({});
  const [active, setActive] = useState(0);
  const [reduce] = useState(prefersReducedMotion);

  const setNode = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      nodes.current[id] = el;
    },
    []
  );

  // Measure anchor points off the live DOM so the rails survive reflow.
  useLayoutEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const W = wrap.getBoundingClientRect();
      const next: Anchors = {};
      for (const [id, el] of Object.entries(nodes.current)) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const y = r.top + r.height / 2 - W.top;
        next[id] = { l: { x: r.left - W.left, y }, r: { x: r.right - W.left, y } };
      }
      // bail when nothing moved, so the observer can't feed itself
      setAnchors((prev) => {
        const ka = Object.keys(prev);
        if (ka.length === Object.keys(next).length &&
            ka.every((k) => next[k] &&
              Math.abs(prev[k].l.x - next[k].l.x) < 0.5 &&
              Math.abs(prev[k].l.y - next[k].l.y) < 0.5 &&
              Math.abs(prev[k].r.x - next[k].r.x) < 0.5)) {
          return prev;
        }
        return next;
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    Object.values(nodes.current).forEach((el) => el && ro.observe(el));
    // brand SVGs load async and can shift card heights
    const t = window.setTimeout(measure, 300);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // Cycle the active flow. Reduced motion holds on the first one.
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % flows.length), 2400);
    return () => window.clearInterval(id);
  }, [reduce]);

  const hub = anchors.hub;
  const flow = flows[active];

  // fan the shared hub endpoints apart so overlapping curves stay legible
  const hubIn = (i: number): Pt | null => (hub ? { x: hub.l.x, y: hub.l.y + (i - 1) * 11 } : null);
  const hubOut = (i: number): Pt | null => (hub ? { x: hub.r.x, y: hub.r.y + (i - 1.5) * 11 } : null);

  const leftPath = (id: string) => {
    const a = anchors[id];
    const i = streams.findIndex((s) => s.id === id);
    const b = hubIn(i);
    return a && b ? curve(a.r, b) : null;
  };
  const rightPath = (id: string) => {
    const b = anchors[id];
    const i = destinations.findIndex((d) => d.id === id);
    const a = hubOut(i);
    return a && b ? curve(a, b.l) : null;
  };

  const activeLeft = flow ? leftPath(flow.from) : null;
  const activeRight = flow ? rightPath(flow.to) : null;

  return (
    <figure ref={wrapRef} className="relative m-0 w-full">
      <figcaption className="sr-only">
        Shopify order, customer, and product data is routed through an integration
        layer into Zoho CRM, Inventory, Desk, and Books — orders and customers into
        CRM, products into Inventory, customer data into Desk, and orders into Books
        — giving real-time sync, fewer errors, accurate data, and scalable growth.
      </figcaption>

      {/* rails sit behind the cards, which are opaque */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
        fill="none"
      >
        {/* resting state — neutral, so orange only ever means "active" */}
        {streams.map((s) => {
          const d = leftPath(s.id);
          return d ? (
            <path key={s.id} d={d} stroke="hsl(var(--ink-faint))" strokeWidth={1} strokeDasharray="2 4" />
          ) : null;
        })}
        {destinations.map((dn) => {
          const d = rightPath(dn.id);
          return d ? (
            <path key={dn.id} d={d} stroke="hsl(var(--ink-faint))" strokeWidth={1} strokeDasharray="2 4" />
          ) : null;
        })}

        {/* the live flow */}
        {activeLeft && (
          <path d={activeLeft} stroke="hsl(var(--brand))" strokeWidth={1.5} className="rail-live" />
        )}
        {activeRight && (
          <path
            d={activeRight}
            stroke="hsl(var(--brand))"
            strokeWidth={1.5}
            className="rail-live"
            style={{ animationDelay: '0.85s' }}
          />
        )}

        {/* a packet travelling the route; the key restarts it on each flow */}
        {!reduce && activeLeft && (
          <circle key={`in-${active}`} r={3.5} fill="hsl(var(--brand))">
            <animateMotion dur="0.85s" fill="freeze" path={activeLeft} />
          </circle>
        )}
        {!reduce && activeRight && (
          <circle key={`out-${active}`} r={3.5} fill="hsl(var(--brand))" opacity={0}>
            <animateMotion dur="0.85s" begin="0.85s" fill="freeze" path={activeRight} />
            <set attributeName="opacity" to="1" begin="0.85s" fill="freeze" />
          </circle>
        )}
      </svg>

      {/* the Zoho column carries the longest labels ("Stock & availability"), so
          it gets the most room; the connector columns are only rails */}
      <div className="relative z-10 grid items-center gap-y-1 lg:grid-cols-[minmax(0,0.56fr)_2rem_minmax(0,0.6fr)_2rem_minmax(0,1.05fr)] lg:gap-y-0">
        {/* ── Shopify side ─────────────────────────────────────────────── */}
        <div className="grid gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-rule bg-elevated px-3.5 py-3 shadow-[0_1px_2px_rgba(19,30,46,0.04)]">
            <BrandMark file="shopify" size={26} />
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold leading-tight text-ink">
                Shopify Store
              </span>
              <span className="block truncate text-[11px] leading-tight text-ink-muted">
                Storefront
              </span>
            </span>
          </div>

          <div className="relative grid grid-cols-2 gap-3 lg:grid-cols-1 lg:pl-5">
            {streams.map((s) => (
              <div key={s.id} ref={setNode(s.id)} className="relative">
                <NodeCard node={s} />
                {/* the store feeds each stream */}
                <span
                  aria-hidden
                  className="rail-x pointer-events-none absolute right-full top-1/2 hidden h-px w-5 -translate-y-1/2 lg:block"
                />
              </div>
            ))}
            {/* spine down from the store card */}
            <span
              aria-hidden
              className="rail-y pointer-events-none absolute -top-3 bottom-[15%] left-0 hidden w-px lg:block"
            />
          </div>
        </div>

        <span aria-hidden className="rail-y mx-auto block h-6 w-px lg:hidden" />
        <span aria-hidden className="hidden lg:block" />

        {/* ── implementation layer — the focal point ───────────────────── */}
        {/* The node the flows pass through. No name here — it is already the
            nav and the headline; repeating it made this read as a business card.
            What it needs to say is what it *does*, plus a sign of life. */}
        <div
          ref={setNode('hub')}
          className="relative rounded-2xl border border-brand/25 bg-elevated px-5 py-7
                     shadow-[0_6px_26px_-12px_rgba(255,92,26,0.15),0_2px_10px_rgba(19,30,46,0.06)]"
        >
          <Asterisk size={20} strokeWidth={2.2} className="mx-auto text-brand" aria-hidden />
          <p className="mt-2 text-center text-[13px] font-semibold leading-tight text-ink">
            Integration layer
          </p>
          <span aria-hidden className="dot-bar mt-4 block h-5 w-full" />
        </div>

        <span aria-hidden className="rail-y mx-auto block h-6 w-px lg:hidden" />
        <span aria-hidden className="hidden lg:block" />

        {/* ── Zoho side ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          {destinations.map((d) => {
            const live = flow?.to === d.id;
            return (
              <div key={d.id} ref={setNode(d.id)} className="flex items-center gap-2.5">
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] leading-none transition-all duration-300 ${
                    live ? 'bg-brand-soft text-ink' : 'bg-ok-soft text-ink-muted'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                      live ? 'bg-brand' : 'bg-ok'
                    }`}
                  />
                  {live ? flow.pill : d.pill}
                </span>
                <div className="min-w-0 flex-1">
                  <NodeCard node={d} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── outcomes ───────────────────────────────────────────────────── */}
      <div className="relative z-10 mt-1 lg:mt-6">
        <span aria-hidden className="rail-y mx-auto block h-6 w-px lg:mx-0 lg:ml-[42%]" />
        <div className="grid grid-cols-2 divide-rule rounded-xl border border-rule bg-elevated px-2 py-1 shadow-[0_1px_2px_rgba(19,30,46,0.04)] sm:grid-cols-4 sm:divide-x">
          {outcomes.map(({ label, icon: Icon }) => (
            <div key={label} className="flex items-center justify-center gap-2 px-3 py-3">
              <Icon size={16} strokeWidth={1.6} className="shrink-0 text-ink-muted" aria-hidden />
              <span className="text-[12px] leading-none text-ink">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
};

export default HeroDiagram;
