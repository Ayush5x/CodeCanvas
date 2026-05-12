import React from 'react';
import Header from '../../../components/Header';
import RecursionDocs from './RecursionDocs';
import RecursionEngineVisualizer from '../../../dsa/recursion/RecursionVisualizer';
import { useIsMobile } from '../../../hooks/use-mobile';

const RecursionVisualizer = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`os-root ${isMobile ? 'mobile-os' : ''}`}>
      <Header />
      <style>{`
        .os-root { background: #050505; min-height: 100vh; color: #fff; font-family: 'Inter', sans-serif; padding: 40px; }
        .mobile-os { padding: 15px; }
        .page-header-wrap { border-left: 1px solid #1a1a1a; border-top: 1px solid #1a1a1a; padding: 24px; position: relative; margin-bottom: 40px; max-width: 1700px; margin-inline: auto; }
        .mobile-os .page-header-wrap { padding: 20px 10px; border-left: none; }
      `}</style>
      
      <div className="page-header-wrap">
        <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-[#8A2BE2]" />
        
        <div className={`flex flex-col gap-0 ${isMobile ? 'items-center text-center' : ''}`}>
          <span className="text-[10px] font-mono text-zinc-600 mb-2 tracking-tighter">REF: RECURSION_CORE</span>
          
          <div className={`flex items-baseline ${isMobile ? 'flex-col items-center gap-2' : 'gap-4'}`}>
            <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-black text-white tracking-widest`}>Recursion</h1>
            <span className={`${isMobile ? 'text-xl' : 'text-5xl'} font-thin text-zinc-700 italic`}>2.0</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-400 text-[9px] font-mono">
              CALL_STACK
            </span>
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-400 text-[9px] font-mono text-[#8A2BE2]">
              RECURSIVE_ACTIVE
            </span>
            <div className="h-px flex-grow bg-zinc-800" />
          </div>
          
          <p className="mt-4 text-zinc-500 text-[11px] uppercase tracking-[0.3em] font-light">
            Atomic synchronization of function call stack and recursive abstract structure.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1700px', margin: '0 auto' }}>
        <RecursionEngineVisualizer />
      </div>

      <div style={{ maxWidth: '1700px', margin: '40px auto 0' }}>
        <RecursionDocs />
      </div>
    </div>
  );
};

export default RecursionVisualizer;