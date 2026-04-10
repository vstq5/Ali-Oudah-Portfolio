import { memo } from 'react';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { Meteors } from '@/components/ui/meteors';

const GlobalBackground = memo(() => {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden bg-background">
      {/* Layer 1: Ambient Noise / Static (provided by App.tsx CSS but we can add grid here) */}
      <AnimatedGridPattern
        numSquares={150}
        maxOpacity={0.15}
        duration={3}
        className="text-white/20"
      />
      
      {/* Layer 2: Meteors */}
      <Meteors number={20} />
    </div>
  );
});

GlobalBackground.displayName = 'GlobalBackground';

export default GlobalBackground;
