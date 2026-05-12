import React, { useEffect, useState, useRef } from 'react';

const IntroLoader = ({ onLoadingComplete }) => {
  const [isComplete, setIsComplete] = useState(false);
  const circlePathRef = useRef(null);
  const masterContainerRef = useRef(null);

  useEffect(() => {
    const runSequence = () => {
      const circlePath = circlePathRef.current;
      const masterContainer = masterContainerRef.current;
      if (!circlePath || !masterContainer) return;

      masterContainer.style.display = 'flex';

      const length = circlePath.getTotalLength();
      circlePath.style.strokeDasharray = length;
      circlePath.style.strokeDashoffset = length;
      void circlePath.getBoundingClientRect();
      circlePath.style.transition = 'stroke-dashoffset 1s ease-in-out';
      circlePath.style.strokeDashoffset = '0';

      setTimeout(() => {
        setIsComplete(true);
        if (onLoadingComplete) setTimeout(onLoadingComplete, 1000);
      }, 6500); 
    };

    const sequenceTimeout = setTimeout(runSequence, 100);
    return () => clearTimeout(sequenceTimeout);
  }, [onLoadingComplete]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&family=Space+Mono&display=swap');

        .intro-root {
          position: fixed; inset: 0; background-color: #050505;
          display: flex; justify-content: center; align-items: center;
          z-index: 9999; overflow: hidden;
        }

        .intro-root.is-complete {
          transform: translateY(-100%);
          transition: transform 0.8s cubic-bezier(0.8, 0, 0.2, 1);
        }

        .master-container { display: none; align-items: center; gap: 2.5rem; }

        .logo-ring {
          position: relative; width: 100px; height: 100px;
          display: flex; align-items: center; justify-content: center;
          animation: zoom-sequence 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .sigma-symbol {
          color: white; font-family: 'Space Grotesk', sans-serif;
          font-size: 2.5rem; font-weight: 700; transform: rotate(-10deg);
          opacity: 0; animation: appear 0.5s ease forwards 0.6s;
        }

        .text-group { display: flex; flex-direction: column; line-height: 1; }
        
        .code-main {
          font-family: 'Space Grotesk', sans-serif; color: white;
          font-size: 4.5rem; font-weight: 700; letter-spacing: -0.02em;
          overflow: hidden;
        }

        .code-inner {
          display: inline-block; transform: translateY(100%);
          animation: slide-up 0.7s cubic-bezier(0.2, 1, 0.3, 1) forwards 1.2s;
        }

        .canvas-sub {
          font-family: 'Space Mono', monospace; color: #888;
          font-size: 1rem; text-transform: uppercase; letter-spacing: 0.6em;
          margin-top: 8px; white-space: nowrap; overflow: hidden; width: 0;
          border-right: 2px solid transparent;
          animation: type-writer 1.5s steps(10) forwards;
          animation-delay: 2.2s;
        }

        /* --- INCREASED LENGTH TRACE DESIGN --- */
        .trace-container {
          position: absolute;
          bottom: 110px; 
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 180px; /* Increased container height */
          display: flex;
          flex-direction: column-reverse; 
          align-items: center;
        }

        .trace-base {
          width: 1px;
          height: 0;
          background: linear-gradient(to top, white, rgba(255,255,255,0.1));
          animation: trace-grow-long 0.8s ease-out forwards 3.8s;
        }

        .trace-bit {
          width: 4px;
          height: 4px;
          background: white;
          margin-bottom: 12px; /* More spacing for longer feel */
          opacity: 0;
          transform: translateY(15px);
        }

        .bit-high { animation: bit-rise 0.5s ease forwards 4.4s; }
        .bit-mid { animation: bit-rise 0.5s ease forwards 4.7s; width: 2px; height: 2px; }

        @keyframes trace-grow-long {
          to { height: 130px; } /* Increased base line height */
        }

        @keyframes bit-rise {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes type-writer { from { width: 0; border-right-color: white; } to { width: 100%; border-right-color: transparent; } }
        @keyframes zoom-sequence { 0% { transform: scale(2); opacity: 0; } 50% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes appear { to { opacity: 1; } }
        @keyframes slide-up { to { transform: translateY(0); } }

      `}</style>

      <div className={`intro-root ${isComplete ? 'is-complete' : ''}`}>
        <div className="master-container" ref={masterContainerRef}>
          <div className="logo-ring">
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100">
              <circle ref={circlePathRef} cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="1" />
            </svg>
            <span className="sigma-symbol">Σ</span>
            
            <div className="trace-container">
               <div className="trace-bit bit-mid"></div>
               <div className="trace-bit bit-high"></div>
               <div className="trace-base"></div>
            </div>
          </div>

          <div className="text-group">
            <div className="code-main"><span className="code-inner">CODE</span></div>
            <div className="canvas-sub">Canvas</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IntroLoader;