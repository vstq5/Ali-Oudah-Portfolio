import { useEffect, useId, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: any;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
}

export function AnimatedGridPattern({
  width = 60,
  height = 60,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const squaresGroupRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const getPos = () => {
    if (dimensions.width === 0) return [0, 0];
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ];
  };

  const squares = useMemo(() => {
    return Array.from({ length: numSquares }).map(() => ({
      id: Math.random(),
    }));
  }, [numSquares]);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0 || !squaresGroupRef.current) return;

    const ctx = gsap.context(() => {
      const rects = gsap.utils.toArray<SVGRectElement>("rect.animated-square");
      rects.forEach((rect, i) => {
        // Initial setup
        const pos = getPos();
        gsap.set(rect, {
          x: pos[0] * width + 1,
          y: pos[1] * height + 1,
          opacity: 0,
        });

        // Create endless animation loop logic
        const animateSquare = () => {
          const newPos = getPos();
          gsap.set(rect, {
            x: newPos[0] * width + 1,
            y: newPos[1] * height + 1,
          });

          gsap.to(rect, {
            opacity: maxOpacity,
            duration: duration / 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1,
            delay: Math.random() * 2,
            onComplete: animateSquare, // loop self
          });
        };

        // Start animation with a random initial delay
        gsap.delayedCall(Math.random() * duration, animateSquare);
      });
    }, squaresGroupRef);

    return () => ctx.revert();
  }, [dimensions, numSquares, width, height, maxOpacity, duration]);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible" ref={squaresGroupRef}>
        {squares.map((sq, index) => (
          <rect
            key={`${sq.id}-${index}`}
            className="animated-square"
            width={width - 1}
            height={height - 1}
            fill="currentColor"
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  );
}
