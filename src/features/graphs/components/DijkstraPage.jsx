import React from 'react';
import { motion } from 'framer-motion';
import { FaBolt, FaInfoCircle, FaCodeBranch } from 'react-icons/fa';
import Header from '../../../components/Header';
import DijkstraVisualizer from '../../../dsa/graphs/dijkstra/DijkstraVisualizer';
import { useIsMobile } from '../../../hooks/use-mobile';

const DijkstraIndustrialTerminal = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className={`flex flex-col md:flex-row justify-between items-center ${isMobile ? 'mt-24 mx-4 mb-4 gap-8 text-center' : 'm-[40px]'} border-b border-white/10 pb-10`}>
        <div className="relative overflow-hidden w-full">
          <h1 className={`absolute -top-10 ${isMobile ? 'left-1/2 -translate-x-1/2 text-[5rem]' : '-left-5 text-[10rem]'} font-black text-white/[0.02] pointer-events-none select-none`}>
            GRAPH
          </h1>

          <div className={`relative z-10 flex flex-col ${isMobile ? 'gap-4 items-center mt-8' : 'gap-6'}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#f0e7e7] rounded-full animate-pulse" />
              <span className="text-xs font-mono tracking-[0.4em] text-zinc-500 uppercase">System Active</span>
            </div>

            <div className={`flex ${isMobile ? 'flex-col items-center gap-2' : 'flex-col md:flex-row md:items-end gap-4'}`}>
              <h1 className={`${isMobile ? 'text-4xl' : 'text-7xl'} font-light tracking-tighter text-white`}>
                Dijkstra<span className="font-black text-[25px] text-[#f0e7e7]"></span>
              </h1>
            </div>

            <p className={`text-zinc-400 text-sm leading-relaxed ${isMobile ? 'border-t border-zinc-800 pt-4 px-2 max-w-[90%]' : 'max-w-md border-l-2 border-zinc-800 pl-4'}`}>
              Greedy weight-based optimization finding the most efficient path between network nodes in weighted graphs.
            </p>
          </div>
        </div>
        <div className={`py-10 ${isMobile ? 'text-center w-full' : 'text-right'}`}> 
          <div className={`flex items-baseline ${isMobile ? 'justify-center' : 'justify-end'} gap-4`}>
            <h1 className={`${isMobile ? 'text-6xl' : 'text-8xl'} font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-800`}>
              Ds .
            </h1>
          </div>
        </div>
      </div>
      <div className={`terminal-container ${isMobile ? 'mobile-terminal' : ''}`}>
        <style>{`
          .terminal-container { background: #000; color: #fff; min-height: 100vh; font-family: 'Inter', sans-serif; padding-bottom: 5rem; }
          .content-wrap { padding: 2rem 2.5rem; max-width: 1800px; margin: 0 auto; }
          .mobile-terminal .content-wrap { padding: 1rem 0.5rem; }
          
          /* Doc Section Styles */
          .doc-section { margin-top: 4rem; border-top: 1px solid #1a1a1a; padding-top: 2rem; }
          .doc-card {
            background: #0a0a0a; border: 1px solid #1a1a1a; padding: 1.5rem; border-radius: 12px;
            transition: border 0.3s;
          }
          .doc-card:hover { border-color: #333; }
          @media (max-width: 768px) { .doc-section .grid { grid-template-columns: 1fr; } }
          .doc-icon { color: #555; margin-bottom: 1rem; font-size: 1.2rem; }
          .doc-title { font-size: 0.9rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px; }
          .doc-desc { font-size: 0.85rem; color: #888; line-height: 1.6; }
        `}</style>

        <Header></Header>
              
        <div className="content-wrap" style={{ marginTop: "50px" }}>
          
          <DijkstraVisualizer />

          {/* BEGINNER FRIENDLY DOC SECTION */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="doc-section mt-16 border-t border-[#1a1a1a] pt-8"
          >
            <div style={{ borderLeft: '3px solid #fff', paddingLeft: '1rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase' }}>Protocol_Documentation</h2>
              <p style={{ color: '#555', fontSize: '0.8rem' }}>Understanding the logic behind the shortest path engine.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              
              <motion.div className="doc-card" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <FaInfoCircle className="doc-icon" />
                <h3 className="doc-title">What is Dijkstra?</h3>
                <p className="doc-desc">
                  Think of Dijkstra as a smart GPS. It finds the shortest distance between a starting point and all other points in a weighted map. It's used in Google Maps, network routing, and flight booking.
                </p>
              </motion.div>

              <motion.div className="doc-card" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <FaBolt className="doc-icon" />
                <h3 className="doc-title">The "Greedy" Logic</h3>
                <p className="doc-desc">
                  The algorithm is "Greedy." This means it always picks the closest unvisited node first, assuming that the best immediate choice will lead to the best overall path.
                </p>
              </motion.div>

              <motion.div className="doc-card" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <FaCodeBranch className="doc-icon" />
                <h3 className="doc-title">Edge Relaxation</h3>
                <p className="doc-desc">
                  If the engine finds a new way to reach a node that is "cheaper" than the previous path, it "relaxes" that edge and updates the distance. This ensures the result is always the absolute minimum.
                </p>
              </motion.div>

            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default DijkstraIndustrialTerminal;