import React from "react";
import { BookOpen, Info } from "lucide-react";
import Header from "../../../components/Header";
import QuickSortVisualizer from "../../../dsa/sorting/quick/QuickSortVisualizer";
import { useIsMobile } from "../../../hooks/use-mobile";

const QuickSort = () => {
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
        <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-[#FFFF00]" />
        
        <div className={`flex flex-col gap-0 ${isMobile ? 'items-center text-center' : ''}`}>
          <span className="text-[10px] font-mono text-zinc-600 mb-2 tracking-tighter">REF: QUICK_SORT_CORE</span>
          
          <div className={`flex items-baseline ${isMobile ? 'flex-col items-center gap-2' : 'gap-4'}`}>
            <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-black text-white tracking-widest`}>Quick-Sort</h1>
            <span className={`${isMobile ? 'text-xl' : 'text-5xl'} font-thin text-zinc-700 italic`}>1.0</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-400 text-[9px] font-mono">
              DIVIDE_CONQUER
            </span>
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-400 text-[9px] font-mono text-[#FFFF00]">
              PARTITION_ACTIVE
            </span>
            <div className="h-px flex-grow bg-zinc-800" />
          </div>
          
          <p className="mt-4 text-zinc-500 text-[11px] uppercase tracking-[0.3em] font-light">
            High-performance pivot-based memory partitioning engine.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1700px', margin: '0 auto' }}>
        <QuickSortVisualizer />
      </div>

      <section className="doc-section">
        <div>
          <h3 className="doc-title"><BookOpen size={18} color="#FFFF00"/> ALGORITHM_SPECIFICATIONS</h3>
          <p className="doc-text">
            Quick Sort is an efficient sorting algorithm, serving as a systematic method for placing the elements of an array 
            in order. It is a divide and conquer algorithm. When implemented well, it can be about two or three times 
            faster than its main competitors, merge sort and heapsort.
          </p>
          <div className="complexity-tag">
            <span style={{color: '#444', fontSize: '11px', fontWeight: '800'}}>STABILITY:</span> 
            <span style={{color: '#fff', marginLeft: '10px'}}>UNSTABLE</span>
          </div>
        </div>
        <div>
          <h3 className="doc-title"><Info size={18} color="#FFFF00"/> COMPLEXITY_ANALYSIS</h3>
          <div className="doc-text">
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #1a1a1a', paddingBottom: '5px'}}>
              <span>WORST_CASE_TIME</span>
              <span style={{color: '#fff'}}>O(n²)</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #1a1a1a', paddingBottom: '5px'}}>
              <span>AVERAGE_TIME</span>
              <span style={{color: '#fff'}}>O(n log n)</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #1a1a1a', paddingBottom: '5px'}}>
              <span>BEST_CASE_TIME</span>
              <span style={{color: '#fff'}}>O(n log n)</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>SPACE_COMPLEXITY</span>
              <span style={{color: '#fff'}}>O(log n)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuickSort;