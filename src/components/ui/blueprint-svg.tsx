import { useEffect, useRef } from "react";
import gsap from "gsap";

export const BlueprintSvg = ({
  className,
}: {
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray<SVGPathElement>("path, circle, rect, polyline, line");

      paths.forEach((path) => {
        const length = (path as SVGGeometryElement).getTotalLength?.() || 1000;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: Math.random() * 2 + 2, // 2-4 seconds
          ease: "power2.inOut",
          delay: Math.random() * 0.5,
        });
      });
      
      // Endless slow rotation for internal rings
      const rings = gsap.utils.toArray<SVGElement>(".rotate-ring");
      rings.forEach((ring, i) => {
        gsap.to(ring, {
          rotation: 360,
          transformOrigin: "50% 50%",
          duration: 20 + i * 10,
          repeat: -1,
          ease: "none",
        });
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      className={`w-full h-full stroke-secondary fill-none ${className}`}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer measurement ring */}
      <circle cx="400" cy="400" r="350" strokeWidth="1" strokeDasharray="4 8" opacity="0.4" />
      <circle cx="400" cy="400" r="340" strokeWidth="0.5" opacity="0.2" />
      
      {/* Target Crosshairs */}
      <line x1="400" y1="20" x2="400" y2="780" strokeWidth="0.5" opacity="0.3" />
      <line x1="20" y1="400" x2="780" y2="400" strokeWidth="0.5" opacity="0.3" />

      {/* Rotating geometric layers */}
      <g className="rotate-ring">
        <circle cx="400" cy="400" r="280" strokeWidth="1" strokeDasharray="1 10" />
        <path d="M 400 120 A 280 280 0 0 1 680 400" strokeWidth="2" />
        <path d="M 400 680 A 280 280 0 0 1 120 400" strokeWidth="2" />
      </g>

      <g className="rotate-ring" style={{ animationDirection: 'reverse' }}>
        <polygon points="400,180 590,510 210,510" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="400" cy="400" r="220" strokeWidth="0.5" />
      </g>

      {/* Center core */}
      <circle cx="400" cy="400" r="100" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="400" cy="400" r="80" strokeWidth="2" fill="currentColor" fillOpacity="0.02" />
      <circle cx="400" cy="400" r="40" strokeWidth="1.5" />
      <circle cx="400" cy="400" r="10" fill="currentColor" strokeWidth="0" className="animate-pulse" />

      {/* Engineering technical lines / labels */}
      <polyline points="400,200 450,150 600,150" strokeWidth="1" />
      <polyline points="400,600 350,650 200,650" strokeWidth="1" />
      
      {/* Decorative Nodes */}
      <circle cx="600" cy="150" r="4" fill="currentColor" />
      <circle cx="200" cy="650" r="4" fill="currentColor" />
      <circle cx="680" cy="400" r="4" fill="currentColor" />
      <circle cx="120" cy="400" r="4" fill="currentColor" />
    </svg>
  );
};
