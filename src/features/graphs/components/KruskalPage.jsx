import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaServer, FaCogs } from 'react-icons/fa';
import Header from '../../../components/Header';
import KruskalVisualizer from '../../../dsa/graphs/kruskal/KruskalVisualizer';
import { useIsMobile } from '../../../hooks/use-mobile';

const KruskalIndustrialTerminal = () => {
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
                Kruskal's<span className="font-black text-[25px] text-[#f0e7e7]"></span>
              </h1>
            </div>

            <p className={`text-zinc-400 text-sm leading-relaxed ${isMobile ? 'border-t border-zinc-800 pt-4 px-2 max-w-[90%]' : 'max-w-md border-l-2 border-zinc-800 pl-4'}`}>
              Edge-based MST generation utilizing Union-Find structures. Efficient for sparse graph implementations and global cost optimization.
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
          .terminal-container { background: #000; color: #fff; min-height: 100vh; font-family: 'Inter', sans-serif; padding-bottom: 6rem; overflow-x: hidden; }
          .content-wrap { padding: 2rem 2.5rem; max-width: 1800px; margin: 0 auto; }
          .mobile-terminal .content-wrap { padding: 1rem 0.5rem; }
          .doc-card { background: #080808; border: 1px solid #111; padding: 2.5rem; border-radius: 16px; transition: 0.4s; position: relative; overflow: hidden; }
          .doc-card:hover { border-color: #444; background: #0c0c0c; }
          .complexity-tag { background: #1a1a1a; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 0.7rem; border: 1px solid #333; font-family: monospace; }
          @media (max-width: 768px) { .doc-grid { grid-template-columns: 1fr; } }
        `}</style>

        <Header></Header>

        <motion.div 
          className="content-wrap" 
          style={{ marginTop: "50px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <KruskalVisualizer />

          {/* EXTENDED DOCUMENTATION SECTION */}
          <div style={{ marginTop: '5rem' }}>
            <motion.div 
              style={{ borderLeft: '4px solid #fff', paddingLeft: '1.5rem', marginBottom: '3rem' }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>KRUSKAL_PROTOCOL: SPECIFICATIONS</h2>
              <p style={{ color: '#555', fontSize: '0.9rem' }}>Detailed analysis of Edge-List Greedy Spanning logic.</p>
            </motion.div>

            <div className="doc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
              <motion.div className="doc-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <FaCode style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem', letterSpacing: '1px' }}>01_ALGORITHM_CORE</h3>
                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                  Kruskal's is an edge-centric algorithm. It converts a connected graph into a Minimum Spanning Tree by treating every node as a distinct forest and merging them.
                </p>
                <ul style={{ fontSize: '0.8rem', color: '#888', paddingLeft: '1.2rem', lineHeight: '2' }}>
                  <li>Global sorting of all edge weights.</li>
                  <li>Selection of edges with minimal cost.</li>
                  <li>Cycle prevention via Disjoint Set Union (DSU).</li>
                </ul>
              </motion.div>

              <motion.div className="doc-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <FaServer style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem', letterSpacing: '1px' }}>02_COMPLEXITY_STATS</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>Sorting Complexity</span>
                    <span className="complexity-tag">O(E log E)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>Union-Find Operations</span>
                    <span className="complexity-tag">O(E α(V))</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>Total Operational Cost</span>
                    <span className="complexity-tag">O(E log V)</span>
                  </div>
                </div>
              </motion.div>

              <motion.div className="doc-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <FaCogs style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem', letterSpacing: '1px' }}>03_INDUSTRIAL_USE</h3>
                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.8' }}>
                  Kruskal’s is preferred for **sparse graphs** where the number of edges is relatively low compared to nodes.
                </p>
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid #1a1a1a', paddingTop: '1.5rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#444', marginBottom: '0.5rem' }}>APPLICATION_DOMAINS:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['LAN_SETUP', 'CIVIL_PIPING', 'CIRCUIT_DESIGN', 'OCEANIC_CABLES'].map(tag => (
                      <span key={tag} style={{ fontSize: '0.6rem', color: '#fff', border: '1px solid #222', padding: '2px 8px', borderRadius: '4px' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>  );
};

export default KruskalIndustrialTerminal;