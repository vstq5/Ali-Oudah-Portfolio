import { useEffect, useState } from 'react';

const MARQUEE_REPEATS = 8;

const links = [
  { label: 'GitHub', href: 'https://github.com/vstq5' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ali-oudah' },
  { label: 'Email', href: 'mailto:alialoudah5@gmail.com' },
];

const sidePadding = { paddingLeft: 'clamp(1.5rem, 6vw, 7rem)', paddingRight: 'clamp(1.5rem, 6vw, 7rem)' };

const kuwaitTime = () =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kuwait',
  }).format(new Date());

const Footer = () => {
  const [time, setTime] = useState(kuwaitTime);

  useEffect(() => {
    const interval = window.setInterval(() => setTime(kuwaitTime()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const names = Array.from({ length: MARQUEE_REPEATS }, (_, i) => (
    <span key={i} className="pr-14">
      Ali Oudah <span className="text-cream/[0.04]">·</span>
    </span>
  ));

  return (
    <footer className="relative bg-[#0A0B0D] border-t border-cream/10 overflow-hidden">
      {/* name marquee */}
      <div aria-hidden className="overflow-hidden py-8 md:py-12">
        <div className="footer-marquee [animation:footerMarquee_48s_linear_infinite] flex whitespace-nowrap will-change-transform w-max">
          <div className="flex font-display font-medium tracking-tight leading-none text-cream/[0.07] text-[clamp(3.5rem,10vw,8rem)]">
            {names}
          </div>
          <div className="flex font-display font-medium tracking-tight leading-none text-cream/[0.07] text-[clamp(3.5rem,10vw,8rem)]">
            {names}
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-6 border-t border-cream/10 text-xs text-sand/50"
        style={sidePadding}
      >
        <span>&copy; {new Date().getFullYear()} Ali Oudah</span>
        <span>
          Kuwait City &middot; {time} <span className="text-sand/35">UTC+3</span>
        </span>
        <div className="flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.href.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="hover:text-cream transition-colors duration-150"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
