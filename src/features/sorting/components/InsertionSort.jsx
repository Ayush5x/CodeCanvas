import React from "react";
import { BookOpen, Info } from "lucide-react";
import Header from "../../../components/Header";
import InsertionSortVisualizer from "../../../dsa/sorting/insertion/InsertionSortVisualizer";
import { useIsMobile } from "../../../hooks/use-mobile";

const InsertionSort = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`os-root ${isMobile ? 'mobile-os' : ''}`}>
      <Header />
      <style>{`
        .os-root { background: #050505; min-height: 100vh; color: #fff; font-family: 'Inter', sans-serif; padding: 40px; }
        .mobile-os { padding: 15px; }
        .page-header-wrap { border-left: 1px solid #1a1a1a; border-top: 1px solid #1a1a1a; padding: 24px; position: relative; margin-bottom: 40px; max-width: 1700px; margin-inline: auto; }
        .mobile-os .page-header-wrap { padding: 20px 10px; border-left: none; }
        .doc-section { max-width: 1700px; margin: 40px auto 0; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; padding: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
        .mobile-os .doc-section { grid-template-columns: 1fr; padding: 20px; gap: 30px; }
        .doc-title { font-size: 18px; font-weight: 800; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; color: #fff; }
        .doc-text { color: #666; font-size: 14px; line-height: 1.8; }
        .complexity-tag { background: #111; border: 1px solid #222; padding: 10px 15px; border-radius: 8px; margin-top: 15px; display: inline-block; }
      `}</style>
      
      <div className="page-header-wrap">
        <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-[#FFD700]" />
        
        <div className={`flex flex-col gap-0 ${isMobile ? 'items-center text-center' : ''}`}>
          <span className="text-[10px] font-mono text-zinc-600 mb-2 tracking-tighter">REF: INSERTION_SORT_CORE</span>
          
          <div className={`flex items-baseline ${isMobile ? 'flex-col items-center gap-2' : 'gap-4'}`}>
            <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-black text-white tracking-widest`}>Insertion-Sort</h1>
            <span className={`${isMobile ? 'text-xl' : 'text-5xl'} font-thin text-zinc-700 italic`}>1.0</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-400 text-[9px] font-mono">
              STABLE_SORT
            </span>
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-400 text-[9px] font-mono text-[#FFD700]">
              SYNC_ACTIVE
            </span>
            <div className="h-px flex-grow bg-zinc-800" />
          </div>
          
          <p className="mt-4 text-zinc-500 text-[11px] uppercase tracking-[0.3em] font-light">
            Linear insertion memory management engine.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1700px', margin: '0 auto' }}>
        <InsertionSortVisualizer />
      </div>

      <section className="doc-section">
        <div>
          <h3 className="doc-title"><BookOpen size={18} color="#FFD700"/> ALGORITHM_SPECIFICATIONS</h3>
          <p className="doc-text">
            Insertion Sort is a simple sorting algorithm that builds the final sorted array (or list) one item at a time. 
            It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort. 
            However, it provides several advantages: simple implementation, efficient for small data sets, and stable.
          </p>
          <div className="complexity-tag">
            <span style={{color: '#444', fontSize: '11px', fontWeight: '800'}}>STABILITY:</span> 
            <span style={{color: '#fff', marginLeft: '10px'}}>STABLE</span>
          </div>
        </div>
        <div>
          <h3 className="doc-title"><Info size={18} color="#FFD700"/> COMPLEXITY_ANALYSIS</h3>
          <div className="doc-text">
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #1a1a1a', paddingBottom: '5px'}}>
              <span>WORST_CASE_TIME</span>
              <span style={{color: '#fff'}}>O(n²)</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #1a1a1a', paddingBottom: '5px'}}>
              <span>AVERAGE_TIME</span>
              <span style={{color: '#fff'}}>O(n²)</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #1a1a1a', paddingBottom: '5px'}}>
              <span>BEST_CASE_TIME</span>
              <span style={{color: '#fff'}}>O(n)</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>SPACE_COMPLEXITY</span>
              <span style={{color: '#fff'}}>O(1)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InsertionSort;