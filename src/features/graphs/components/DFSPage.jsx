import React from 'react';
import Header from '../../../components/Header';
import DfsVisualizer from '../../../dsa/graphs/dfs/DfsVisualizer';
import { useIsMobile } from '../../../hooks/use-mobile';

const DFSRoundedTerminal = () => {
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
                DFS<span className="font-black text-[25px] text-[#f0e7e7]"></span>
              </h1>
            </div>

            <p className={`text-zinc-400 text-sm leading-relaxed ${isMobile ? 'border-t border-zinc-800 pt-4 px-2 max-w-[90%]' : 'max-w-md border-l-2 border-zinc-800 pl-4'}`}>
              Depth-First Search (DFS) is a recursive exploration protocol that deep-dives into graph branches before backtracking. It utilizes a Last-In-First-Out (LIFO) stack architecture to ensure exhaustive topological traversal.
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
          .terminal-container { background: #000; color: #fff; min-height: 100vh; font-family: 'Inter', sans-serif; }
          .content-wrap { padding: 2rem 2.5rem; }
          .mobile-terminal .content-wrap { padding: 1rem 0.5rem; }
          .doc-section { margin-top: 4rem; border-top: 1px solid #1a1a1a; padding-top: 2rem; }
          .doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
          @media (max-width: 768px) { .doc-grid { grid-template-columns: 1fr; } }
          .doc-card { background: #080808; border: 1px solid #1a1a1a; padding: 1.5rem; border-radius: 8px; }
          .doc-label { font-size: 0.6rem; color: #555; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 0.5rem; }
          .doc-text { font-size: 0.9rem; color: #999; line-height: 1.6; }
        `}</style>

        <Header></Header>
              
        <div className="content-wrap" style={{ marginTop: "50px" }}>
          
          <DfsVisualizer />

          <section className="doc-section">
            <div className="doc-grid">
              <div className="doc-card">
                <div className="doc-label">Protocol_Logic</div>
                <h3 style={{ margin: '0.5rem 0' }}>Depth-First Traversal</h3>
                <p className="doc-text">
                  DFS explores as far as possible along each branch before backtracking. 
                  It utilizes a **Stack (LIFO)** data structure to track the next node to visit.
                </p>
              </div>
              <div className="doc-card">
                <div className="doc-label">Execution_Complexity</div>
                <h3 style={{ margin: '0.5rem 0' }}>Big O Metrics</h3>
                <p className="doc-text">
                  **Time Complexity:** $O(V + E)$ — Every vertex and edge is evaluated once.<br/>
                  **Space Complexity:** $O(V)$ — Worst case memory matches graph depth.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default DFSRoundedTerminal;