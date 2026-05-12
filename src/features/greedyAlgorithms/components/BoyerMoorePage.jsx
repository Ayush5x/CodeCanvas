import React from 'react';
import Header from '../../../components/Header';
import BoyerMooreVisualizer from '../../../dsa/greedy/boyer-moore/BoyerMooreVisualizer';
import BoyerMooreDocs from './BoyerMooreDocs';
import { useIsMobile } from '../../../hooks/use-mobile';
import { motion } from 'framer-motion';

const BoyerMoorePage = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`bm-page-root ${isMobile ? 'mobile-view' : ''}`}>
      <Header />
      
      <style>{`
        .bm-page-root {
          background: #000;
          min-height: 100vh;
          color: #fff;
          font-family: 'Inter', sans-serif;
          padding: 40px;
        }
        .mobile-view {
          padding: 15px;
        }
        .page-header-wrap {
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 24px;
          position: relative;
          margin-bottom: 40px;
          max-width: 1700px;
          margin-inline: auto;
        }
        .mobile-view .page-header-wrap {
          padding: 20px 10px;
          border-left: none;
        }
        .hero-title-container {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .hero-title-container.centered {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .ref-badge {
          font-size: 10px;
          font-family: 'JetBrains Mono', monospace;
          color: rgba(255, 255, 255, 0.3);
          margin-bottom: 8px;
          letter-spacing: 0.2em;
        }
        .main-title-flex {
          display: flex;
          align-items: baseline;
          gap: 16px;
        }
        .main-title-flex.stack {
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .main-h1 {
          font-size: 5rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
        }
        .mobile-view .main-h1 {
          font-size: 2.2rem;
          letter-spacing: 0.1em;
        }
        .version-label {
          font-size: 5rem;
          font-weight: 100;
          color: rgba(255, 255, 255, 0.1);
          font-style: italic;
        }
        .mobile-view .version-label {
          font-size: 1.5rem;
        }
        .hero-description {
          margin-top: 24px;
          max-width: 600px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 1rem;
          line-height: 1.6;
        }
        .mobile-view .hero-description {
          font-size: 0.9rem;
          margin-inline: auto;
        }
      `}</style>

      <div className={`page-header-wrap ${isMobile ? 'mobile-industrial' : ''}`}>
        <div className="relative overflow-hidden w-full">
          {/* Background Watermark */}
          <h1 className={`absolute -top-10 ${isMobile ? 'left-1/2 -translate-x-1/2 text-[5rem]' : '-left-5 text-[10rem]'} font-black text-white/[0.02] pointer-events-none select-none`}>
            GREEDY
          </h1>

          <div className={`relative z-10 flex flex-col ${isMobile ? 'gap-4 items-center mt-8' : 'gap-6'}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.4em] text-zinc-500 uppercase">Majority Sync Active</span>
            </div>

            <div className={`flex ${isMobile ? 'flex-col items-center gap-2' : 'flex-col md:flex-row md:items-end gap-4'}`}>
              <h1 className={`${isMobile ? 'text-4xl' : 'text-7xl'} font-light tracking-tighter text-white uppercase`}>
                BOYER-MOORE<span className="font-black text-[25px] text-cyan-400">_VOTE</span>
              </h1>
            </div>

            <p className={`text-zinc-400 text-sm leading-relaxed ${isMobile ? 'border-t border-zinc-800 pt-4 px-2 max-w-[90%] text-center' : 'max-w-md border-l-2 border-cyan-400/30 pl-4'}`}>
              A high-performance linear-time majority vote algorithm. Optimized for streaming data and constant space complexity.
            </p>

            <div className={`flex flex-wrap gap-4 items-center ${isMobile ? 'justify-center mt-2' : ''}`}>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Time: O(n)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <div className="w-2 h-2 bg-pink-400 rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">Space: O(1)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto">
        <BoyerMooreVisualizer />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <BoyerMooreDocs />
        </motion.div>
      </div>
    </div>
  );
};

export default BoyerMoorePage;