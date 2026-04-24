import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaRandom, FaSearch, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import Navbar from '../../linkedList/components/Navbar';
import Header from '../../../components/Header';
import HeapExplanation from "./HeapExplanation"

/* ================= PREMIUM STYLES (CLONED FROM AVL) ================= */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=JetBrains+Mono:wght@400;700&display=swap');

  body { margin: 0; background: #000; font-family: 'Space Grotesk', sans-serif; color: #fff; overflow-x: hidden; }
  .tree-wrapper { min-height: 100vh; display: flex; flex-direction: column; padding: 25px; box-sizing: border-box; background: #000; }

  .control-dock {
    display: flex; gap: 15px; background: rgba(255, 255, 255, 0.03);
    padding: 20px; border-radius: 18px; border: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 25px; align-items: center; flex-wrap: wrap;
    margin-top: 50px;
  }

  .input-bw {
    background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff; padding: 12px; border-radius: 10px; width: 90px;
    font-family: 'JetBrains Mono', monospace; outline: none;
  }

  .btn-bw {
    padding: 12px 24px; border-radius: 10px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; gap: 10px; font-size: 0.75rem;
    text-transform: uppercase; letter-spacing: 1px; transition: 0.3s;
  }
  .btn-main { background: #fff; color: #000; border: none; }
  .btn-outline { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.2); }
  .btn-bw:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(255,255,255,0.2); }

  .canvas-panel {
    flex: 1; position: relative; background: rgba(255, 255, 255, 0.06);
    border-radius: 30px;border: 1px solid rgba(255, 255, 255, 0.36);
    min-height: 550px; overflow: hidden;
  }

  .node-unit {
    position: absolute; width: 46px; height: 46px; border-radius: 50%;
    background: #000; border: 2px solid #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; z-index: 5;
  }

  .node-active { 
    background: #fff !important; 
    color: #000 !important; 
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
    border-color: #fff !important;
  }
  
  .node-target { 
    border-color: #00ff88 !important; 
    color: #00ff88 !important; 
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.4); 
  }

  .terminal-box {
    position: absolute; top: 20px; right: 20px; width: 260px;
    background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(15px);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
    padding: 15px; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;
    z-index: 10;
  }
  .term-line { margin-bottom: 5px; border-left: 2px solid #333; padding-left: 8px; color: rgba(255,255,255,0.4); }
  .term-high { color: #fff; border-color: #fff; }
`;

export default function HeapVisualizer() {
  const [heap, setHeap] = useState([]);
  const [heapType, setHeapType] = useState('MAX'); 
  const [inputValue, setInputValue] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [highlighted, setHighlighted] = useState([]); 
  const [targetFound, setTargetFound] = useState(null);
  const [logs, setLogs] = useState(["KERNEL INITIALIZED"]);
  
  const containerRef = useRef(null);
  const NODE_RADIUS = 23;

  const addLog = (msg) => setLogs(prev => [msg.toUpperCase(), ...prev].slice(0, 5));

  /* --- POSITIONING LOGIC --- */
  const getPos = useCallback((i) => {
    const canvasWidth = containerRef.current ? containerRef.current.offsetWidth : window.innerWidth * 0.8;
    const level = Math.floor(Math.log2(i + 1));
    const posInLevel = i - (Math.pow(2, level) - 1);
    const totalInLevel = Math.pow(2, level);
    
    const x = (canvasWidth / (totalInLevel + 1)) * (posInLevel + 1);
    const y = 80 + (level * 100);
    return { x, y };
  }, []);

  /* --- SEARCH LOGIC --- */
  const handleSearch = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val) || isBusy || heap.length === 0) return;
    setIsBusy(true);
    setInputValue('');
    setTargetFound(null);
    addLog(`SEARCH_MODE: ${val}`);

    let foundIdx = -1;
    for (let i = 0; i < heap.length; i++) {
      setHighlighted([i]);
      addLog(`CHECKING_IDX: ${i}`);
      await new Promise(r => setTimeout(r, 400));
      if (heap[i] === val) {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx !== -1) {
      setTargetFound(foundIdx);
      addLog("MATCH_LOCATED");
    } else {
      addLog("NODE_NOT_IN_MEMORY");
    }
    
    setHighlighted([]);
    setIsBusy(false);
  };

  /* --- SWAP ANIMATION WRAPPER --- */
  const swap = async (arr, i, j) => {
    setHighlighted([i, j]);
    addLog(`SWAP: ${arr[i]} ↔ ${arr[j]}`);
    await new Promise(r => setTimeout(r, 600));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    setHeap([...arr]);
  };

  /* --- INSERT LOGIC --- */
  const handleInsert = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val) || isBusy) return;
    setIsBusy(true);
    setInputValue('');
    setTargetFound(null);
    addLog(`INIT_PUSH: ${val}`);

    let newHeap = [...heap, val];
    setHeap(newHeap);
    
    let i = newHeap.length - 1;
    while (i > 0) {
      let p = Math.floor((i - 1) / 2);
      setHighlighted([i, p]);
      await new Promise(r => setTimeout(r, 600));

      const condition = heapType === 'MAX' ? newHeap[i] > newHeap[p] : newHeap[i] < newHeap[p];
      
      if (condition) {
        await swap(newHeap, i, p);
        i = p;
      } else {
        addLog("HEAP_PROPERTY_VALID");
        break;
      }
    }
    
    setHighlighted([]);
    setIsBusy(false);
  };

  /* --- RANDOM GENERATOR --- */
  const generateRandom = async () => {
    if (isBusy) return;
    setIsBusy(true);
    setHeap([]);
    setTargetFound(null);
    addLog("GENERATING_RANDOM_HEAP...");
    
    const vals = [];
    while(vals.length < 6) {
      const r = Math.floor(Math.random() * 90) + 1;
      if(!vals.includes(r)) vals.push(r);
    }

    let tempHeap = [];
    for (const v of vals) {
      addLog(`AUTO_PUSH: ${v}`);
      tempHeap = [...tempHeap, v];
      setHeap([...tempHeap]);
      await new Promise(r => setTimeout(r, 400));

      let i = tempHeap.length - 1;
      while (i > 0) {
        let p = Math.floor((i - 1) / 2);
        setHighlighted([i, p]);
        await new Promise(r => setTimeout(r, 300));
        const cond = heapType === 'MAX' ? tempHeap[i] > tempHeap[p] : tempHeap[i] < tempHeap[p];
        if (cond) {
          const t = tempHeap[i];
          tempHeap[i] = tempHeap[p];
          tempHeap[p] = t;
          setHeap([...tempHeap]);
          i = p;
          await new Promise(r => setTimeout(r, 300));
        } else break;
      }
    }
    setHighlighted([]);
    setIsBusy(false);
    addLog("HEAP_SYNC_COMPLETE");
  };

  return (
    <div className="tree-wrapper">
      <style>{STYLES}</style>
       <Header></Header>
            
                    
                   <div className="flex flex-col md:flex-row justify-between items-center w-full border-b border-white/10 pb-10">
  <div className="relative overflow-hidden">
    <h1 className="absolute -top-10 -left-5 text-[10rem] font-black text-white/[0.02] pointer-events-none select-none">
      SORT
    </h1>

    <div className="relative z-10 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-[#f0e7e7] rounded-full animate-pulse" />
        <span className="text-xs font-mono tracking-[0.4em] text-zinc-500 uppercase">System Active</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <h1 className="text-7xl font-light tracking-tighter text-white">
          Heap<span className="font-black text-[25px]  text-[#f0e7e7]">_Tree</span>
        </h1>
      </div>

      <p className="max-w-md text-zinc-400 text-sm leading-relaxed border-l-2 border-zinc-800 pl-4">
        Priority-based complete binary structure. Essential for scheduling and efficient sorting protocols.
      </p>
    </div>
  </div>
  <div className="py-10 text-right"> 
    <div className="flex items-baseline justify-end gap-4">
      <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-800">
        Ds
      </h1>
    </div>
  </div>
</div>
            

      <div className="control-dock">
        <button className="btn-bw btn-outline" onClick={() => {
          setHeapType(heapType === 'MAX' ? 'MIN' : 'MAX');
          setHeap([]);
          addLog(`SWITCHED_TO: ${heapType === 'MAX' ? 'MIN' : 'MAX'}`);
        }}>
          {heapType === 'MAX' ? <FaArrowUp /> : <FaArrowDown />} {heapType} HEAP
        </button>

        <input className="input-bw" type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="00" />
        
        <button className="btn-bw btn-main focus:outline-none" onClick={handleInsert} disabled={isBusy}><FaPlus /> Insert</button>
        <button className="btn-bw btn-outline focus:outline-none" onClick={handleSearch} disabled={isBusy}><FaSearch /> Search</button>
        <button className="btn-bw btn-outline focus:outline-none" onClick={generateRandom} disabled={isBusy}><FaRandom /> Random</button>
        
        <button className="btn-bw btn-outline focus:outline-none" style={{marginLeft:'auto'}} onClick={() => {setHeap([]); setTargetFound(null); addLog("MEMORY_PURGED");}}>
          <FaTrash /> Wipe
        </button>
      </div>

      <div className="canvas-panel" ref={containerRef}>
        <div className="terminal-box">
          <div style={{color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', marginBottom: '10px'}}>KERNEL_LOG</div>
          {logs.map((l, i) => <div key={i} className={`term-line ${i === 0 ? 'term-high' : ''}`}>{`> ${l}`}</div>)}
        </div>

        {/* --- DYNAMIC SVG LINES --- */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', top: 0, left: 0 }}>
          {heap.map((_, i) => {
            if (i === 0) return null;
            const p = Math.floor((i - 1) / 2);
            const childPos = getPos(i);
            const parentPos = getPos(p);

            return (
              <motion.line 
                key={`line-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                x1={parentPos.x} 
                y1={parentPos.y} 
                x2={childPos.x} 
                y2={childPos.y}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        <AnimatePresence>
          {heap.map((val, i) => {
            const { x, y } = getPos(i);
            return (
              <motion.div
                key={`${val}-${i}`}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                    scale: 1, 
                    opacity: 1,
                    left: x - NODE_RADIUS, 
                    top: y - NODE_RADIUS 
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className={`node-unit ${highlighted.includes(i) ? 'node-active' : ''} ${targetFound === i ? 'node-target' : ''}`}
              >
                {val}
                <div style={{ position: 'absolute', bottom: -18, fontSize: '0.5rem', opacity: 0.2 }}>IDX_{i}</div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {heap.length === 0 && !isBusy && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.1, letterSpacing: '5px', fontSize: '0.8rem' }}>
           
          </div>
        )}
      </div>
      <HeapExplanation/>
    </div>
  );
}