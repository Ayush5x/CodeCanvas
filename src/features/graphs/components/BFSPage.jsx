import React from 'react';
import BFSDocPage from './BFSExplanation';
import Header from '../../../components/Header';
import BfsVisualizer from '../../../dsa/graphs/bfs/BfsVisualizer';
import { useIsMobile } from '../../../hooks/use-mobile';

const BFSIndustrialTerminal = () => {
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
                BFS<span className="font-black text-[25px] text-[#f0e7e7]"></span>
              </h1>
            </div>

            <p className={`text-zinc-400 text-sm leading-relaxed ${isMobile ? 'border-t border-zinc-800 pt-4 px-2 max-w-[90%]' : 'max-w-md border-l-2 border-zinc-800 pl-4'}`}>
              Breadth-First Search (BFS) is a graph traversal protocol that explores all immediate neighbor nodes before proceeding to the next level. It guarantees the shortest path in unweighted networks using a strict FIFO queue architecture.
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
          .terminal-container {
            background: #000; color: #fff; min-height: 100vh;
            padding: 0; font-family: 'Inter', sans-serif;
          }

          .content-wrap { padding: 2rem 2.5rem; }
          .mobile-terminal .content-wrap { padding: 1rem 0.5rem; }
        `}</style>

    <Header></Header>
          
                  
      <div className="content-wrap" style={{marginTop:"50px"}}>
        <BfsVisualizer />

        <div>
         <BFSDocPage/>
         
          
        </div>
      </div>
    </div></>
  );
};

export default BFSIndustrialTerminal;