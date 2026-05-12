'use client';

import React, { memo } from 'react';

/**
 * Individual Card with Glassmorphism
 */
const MarqueeCard = memo(({ item, accentColor }) => (
  <div className="
    flex items-center gap-3 px-6 py-3 rounded-xl 
    whitespace-nowrap transition-all duration-300
    bg-white/[0.05] backdrop-blur-xl border border-white/10 
    hover:bg-white/[0.08] hover:border-white/20
    group
  ">
  
    <span className="text-sm font-medium text-slate-200">{item}</span>
  </div>
));

MarqueeCard.displayName = 'MarqueeCard';

/**
 * Main Two-Way Infinite Marquee
 */
const DoubleMarquee = () => {
  const row1 = ['Recursion', 'Big O', 'Heaps', 'Dijkstra', 'Binary Search', 'Bit Masking', 'Sorting', 'Arrays'];
  const row2 = ['Graph Theory', 'Trees', 'Linked Lists', 'Hash Maps', 'Dynamic Programming', 'Heaps', 'Stacks', 'Queues'];
  
  const accentColor = '#6366f1'; 

  // Combined Styles: Keyframes + Hover Logic + Edge Fading
  const styles = `
    @keyframes scrollLeft {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    @keyframes scrollRight {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(0); }
    }

    /* Individual track hover logic: Only the hovered row stops */
    .marquee-track:hover {
      animation-play-state: paused !important;
    }

    /* The "Edge Shade" - Masking from Black to Transparent */
    .marquee-mask {
      mask-image: linear-gradient(
        to right, 
        transparent 0%, 
        black 50%, 
        black 85%, 
        transparent 100%
      );
      -webkit-mask-image: linear-gradient(
        to right, 
        transparent 0%, 
        black 50%, 
        black 85%, 
        transparent 100%
      );
    }
  `;

  return (
    <div className="w-full mb-20">
      <style>{styles}</style>
      
      <div className="marquee-mask flex flex-col gap-6">
        
        {/* Row 1: Leftward Moving */}
        <div className="relative w-full overflow-hidden">
          <div 
            className="marquee-track flex gap-4 w-max"
            style={{ animation: `scrollLeft 30s linear infinite` }}
          >
            {[...row1, ...row1].map((item, idx) => (
              <MarqueeCard key={`row1-${idx}`} item={item} accentColor={accentColor} />
            ))}
          </div>
        </div>

        {/* Row 2: Rightward Moving */}
        <div className="relative w-full overflow-hidden">
          <div 
            className="marquee-track flex gap-4 w-max"
            style={{ animation: `scrollRight 35s linear infinite` }}
          >
            {[...row2, ...row2].map((item, idx) => (
              <MarqueeCard key={`row2-${idx}`} item={item} accentColor={accentColor} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoubleMarquee;