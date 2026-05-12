import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaMicrochip, FaTools } from 'react-icons/fa';
import Header from '../../../components/Header';
import HeapVisualizer from '../../../dsa/trees/heap/HeapVisualizer';
import { useIsMobile } from '../../../hooks/use-mobile';

const HeapPage = () => {
  const isMobile = useIsMobile();

  return (
    <div className="overflow-x-hidden w-full">
      {/* Industrial Page Header */}
      <div className={`flex flex-col md:flex-row justify-between items-center ${isMobile ? 'p-4 gap-6 text-center' : 'm-[40px] mt-0'} border-b border-white/10 pb-10`}>
        <div className="relative overflow-hidden w-full">
          <h1 className={`absolute -top-10 ${isMobile ? 'left-1/2 -translate-x-1/2 text-[5rem]' : '-left-5 text-[10rem]'} font-black text-white/[0.02] pointer-events-none select-none`}>
            TREE
          </h1>

          <div className={`relative z-10 flex flex-col ${isMobile ? 'gap-4 items-center mt-8' : 'gap-6'}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00f3ff] rounded-full animate-pulse" />
              <span className="text-xs font-mono tracking-[0.4em] text-zinc-500 uppercase">Priority Queue Sync Active</span>
            </div>

            <div className={`flex ${isMobile ? 'flex-col items-center gap-2' : 'flex-col md:flex-row md:items-end gap-4'}`}>
              <h1 className={`${isMobile ? 'text-5xl' : 'text-7xl'} font-light tracking-tighter text-white`}>
                HEAP<span className="font-black text-[25px] text-[#00f3ff]">_SYNC</span>
              </h1>
            </div>

            <p className={`text-zinc-400 text-sm leading-relaxed ${isMobile ? 'border-t border-zinc-800 pt-4 px-2 max-w-[90%]' : 'max-w-md border-l-2 border-[#00f3ff]/30 pl-4'}`}>
              Efficiently maintains the heap invariant: every parent node is either greater (Max-Heap) or smaller (Min-Heap) than its children.
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
          .terminal-container { background: #000; color: #fff; min-height: 100vh; font-family: 'Inter', sans-serif; padding-bottom: 6rem; }
          .content-wrap { padding: 2rem 2.5rem; max-width: 1800px; margin: 0 auto; }
          .mobile-terminal .content-wrap { padding: 1rem 0.5rem; }
          .doc-card { background: #080808; border: 1px solid #111; padding: 2rem; border-radius: 12px; height: 100%; transition: all 0.3s ease; }
          .doc-card:hover { border-color: #00f3ff33; background: #0c0c0c; }
          .complexity-tag { background: #111; color: #00f3ff; padding: 4px 10px; border-radius: 4px; font-size: 0.7rem; border: 1px solid #00f3ff33; font-family: monospace; }
          @media (max-width: 768px) { .doc-grid { grid-template-columns: 1fr; } }
        `}</style>

        <Header />

        <div className="content-wrap" style={{ marginTop: "50px" }}>
          {/* Main Visualizer */}
          <HeapVisualizer />

          {/* Documentation Section */}
          <motion.section 
            style={{ marginTop: '5rem' }} 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
          >
            <div style={{ borderLeft: '4px solid #00f3ff', paddingLeft: '1.5rem', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: isMobile ? '1.1rem' : '1.6rem', fontWeight: 900, wordBreak: 'break-word' }}>
                HEAP_MANUAL: PRIORITY_QUEUING_PROTOCOL
              </h2>
              <p style={{ color: '#555', fontSize: '0.9rem' }}>Deep dive into binary heap optimization and real-time visualization mechanics.</p>
            </div>

            <div className="doc-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
              gap: '1.5rem' 
            }}>
              <div className="doc-card">
                <FaCode style={{ color: '#00f3ff', fontSize: '1.2rem', marginBottom: '1.2rem' }} />
                <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.8rem' }}>HEAP_INVARIANT</h3>
                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.8' }}>
                  A Binary Heap is a complete binary tree where the parent's value always maintains a fixed priority relationship with its children's values.
                </p>
              </div>

              <div className="doc-card">
                <FaMicrochip style={{ color: '#00f3ff', fontSize: '1.2rem', marginBottom: '1.2rem' }} />
                <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.8rem' }}>COMPLEXITY_METRICS</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>Insertion</span>
                    <span className="complexity-tag">O(log N)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>Extract Min/Max</span>
                    <span className="complexity-tag">O(log N)</span>
                  </div>
                </div>
              </div>

              <div className="doc-card">
                <FaTools style={{ color: '#00f3ff', fontSize: '1.2rem', marginBottom: '1.2rem' }} />
                <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.8rem' }}>SYSTEM_UTILITY</h3>
                <ul style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.8', paddingLeft: '1.2rem' }}>
                  <li><b>Operating Systems:</b> Process scheduling and interrupt handling.</li>
                  <li><b>Network Routing:</b> Priority-based packet switching.</li>
                  <li><b>Dijkstra's Algorithm:</b> Optimized shortest-path edge selection.</li>
                </ul>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default HeapPage;