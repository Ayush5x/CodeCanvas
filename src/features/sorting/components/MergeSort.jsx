import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Terminal, Settings, Activity, Cpu, 
  Hash, RefreshCcw, BookOpen, Info, Zap, Eraser
} from "lucide-react";
import Header from "../../../components/Header";
const MergeSort = () => {
  const [inputVal, setInputVal] = useState("");
  const [arraySize, setArraySize] = useState(8);
  const [delay, setDelay] = useState(600);
  const [order, setOrder] = useState("ASC");
  const [initialArray, setInitialArray] = useState([38, 27, 43, 3, 9, 82, 10, 55]);
  
  const [divideSteps, setDivideSteps] = useState([]); 
  const [conquerSteps, setConquerSteps] = useState([]); 
  const [sorting, setSorting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [logs, setLogs] = useState(["SYSTEM_READY"]);
  const [metrics, setMetrics] = useState({ ops: 0 });

  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "nearest" 
      });
    }
  }, [logs]);

  useEffect(() => {
    if (!sorting && !completed) {
      setDivideSteps([{ data: initialArray, level: 0, id: 'staged-node' }]);
      setConquerSteps([]);
    }
  }, [initialArray, sorting, completed]);

  const handleCustomInput = (e) => {
    e.preventDefault();
    const arr = inputVal.split(",").map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (arr.length > 0) {
      setInitialArray(arr.slice(0, 12)); 
      setCompleted(false);
      setLogs(prev => [...prev, `LOADED_CUSTOM: n=${arr.length}`]);
    }
    setInputVal("");
  };

  const generateRandom = () => {
    const arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 99) + 1);
    setInitialArray(arr);
    setCompleted(false);
    setLogs(prev => [...prev, `RANDOM_GEN: n=${arraySize}`]);
  };

  const clearAll = () => {
    setInitialArray([]);
    setDivideSteps([]);
    setConquerSteps([]);
    setCompleted(false);
    setSorting(false);
    setMetrics({ ops: 0 });
    setLogs(["CACHE_PURGED", "SYSTEM_IDLE"]);
  };

  const runAlgorithm = async () => {
    if (sorting || initialArray.length === 0) return;
    setSorting(true);
    setCompleted(false);
    setDivideSteps([]); 
    setConquerSteps([]);
    setMetrics({ ops: 0 });
    
    let tempDiv = [];
    let tempCon = [];

    const recordDivide = (arr, level) => {
      tempDiv.push({ data: arr, level, id: `d-${level}-${Math.random()}` });
      if (arr.length <= 1) return;
      const mid = Math.floor(arr.length / 2);
      recordDivide(arr.slice(0, mid), level + 1);
      recordDivide(arr.slice(mid), level + 1);
    };

    recordDivide([...initialArray], 0);
    setDivideSteps([...tempDiv]);
    setLogs(prev => [...prev, "PHASE: DIVIDE_START"]);
    await new Promise(r => setTimeout(r, delay));

    const merge = async (left, right, level) => {
      let result = [];
      let i = 0, j = 0;
      while (i < left.length && j < right.length) {
        setMetrics(m => ({ ...m, ops: m.ops + 1 }));
        const condition = order === "ASC" ? left[i] <= right[j] : left[i] >= right[j];
        if (condition) result.push(left[i++]);
        else result.push(right[j++]);
      }
      const merged = [...result, ...left.slice(i), ...right.slice(j)];
      tempCon.push({ data: merged, level, id: `c-${level}-${Math.random()}` });
      setConquerSteps([...tempCon]);
      setLogs(prev => [...prev, `MERGED_LEVEL_${level}: [${merged.join(",")}]`]);
      await new Promise(r => setTimeout(r, delay));
      return merged;
    };

    const sort = async (arr, level) => {
      if (arr.length <= 1) return arr;
      const mid = Math.floor(arr.length / 2);
      const left = await sort(arr.slice(0, mid), level + 1);
      const right = await sort(arr.slice(mid), level + 1);
      return await merge(left, right, level);
    };

    await sort([...initialArray], 0);
    setSorting(false);
    setCompleted(true);
    setLogs(prev => [...prev, "COMPUTATION_SUCCESS"]);
  };

  const renderLevels = (steps, isDivide) => {
    const map = {};
    steps.forEach(s => {
      if (!map[s.level]) map[s.level] = [];
      map[s.level].push(s);
    });
    const finalLevels = isDivide ? Object.values(map) : Object.values(map).reverse();

    return finalLevels.map((levelSteps, lIdx) => (
      <div key={`l-${lIdx}`} className="flex flex-wrap justify-center gap-3 sm:gap-6 w-full">
        {levelSteps.map((step) => (
          <motion.div 
            key={step.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className={`flex gap-2 p-2 sm:p-4 rounded-2xl border ${isDivide ? 'border-cyan-500/30' : 'border-purple-500/30'} bg-black/60 shadow-xl`}>
            {step.data?.map((v, i) => (
              <div key={`${step.id}-cell-${i}`} className={`glass-cell ${isDivide ? 'cyan-glass' : 'purple-glass'}`}>
                {v}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    ));
  };

  return (
    <div className="lab-root">
      <Header></Header>
      <style>{`
        .lab-root { 
          background: #000; min-height: 100vh; color: #fff; 
          font-family: 'Inter', sans-serif; padding: 20px;
          background-image: radial-gradient(circle at 50% 50%, #111 0%, #000 100%);
        }

        .main-heading { font-weight: 900; font-size: 32px; letter-spacing: -1.5px; display: flex; align-items: center; gap: 12px; }
        .cyan-text { color: #00e5ff; }

        .lab-grid { 
          display: grid; grid-template-columns: 1fr; gap: 20px; 
          max-width: 1600px; margin: 20px auto 0;
        }

        @media (min-width: 1024px) {
          .lab-grid { grid-template-columns: 350px 1fr 320px; height: 80vh; }
        }

        .panel { 
          background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); 
          border-radius: 24px; display: flex; flex-direction: column; backdrop-filter: blur(30px); overflow: hidden;
        }

        .p-header { 
          padding: 16px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); 
          font-size: 13px; color: rgba(255, 255, 255, 0.5); letter-spacing: 1.5px; 
          font-weight: 800; text-transform: uppercase; display: flex; align-items: center; gap: 10px;
        }

        .glass-cell {
          width: 45px; height: 45px; display: flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono'; font-weight: 800; font-size: 16px; border-radius: 10px;
          background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .cyan-glass { color: #00e5ff; border-color: rgba(0, 229, 255, 0.4); box-shadow: 0 0 15px rgba(0, 229, 255, 0.1); }
        .purple-glass { color: #a855f7; border-color: rgba(168, 85, 247, 0.4); box-shadow: 0 0 15px rgba(168, 85, 247, 0.1); }

        .lab-btn { 
          background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.15); 
          color: #fff; padding: 14px; border-radius: 14px; font-size: 14px; cursor: pointer; 
          transition: 0.3s; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .lab-btn:hover:not(:disabled) { background: #fff; color: #000; transform: translateY(-2px); }
        .lab-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .btn-danger { color: #ef4444; border-color: rgba(239, 68, 68, 0.3); }
        .btn-danger:hover { background: #ef4444 !important; color: #fff !important; }

        .canvas { flex: 1; padding: 30px; overflow-y: auto; display: flex; flex-direction: column; gap: 40px; }

        .doc-section {
          max-width: 1600px; margin: 40px auto;
          background: rgba(10, 10, 10, 0.5); border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px; padding: 30px;
          display: grid; grid-template-columns: 1fr; gap: 50px;
        }
        @media (min-width: 768px) { .doc-section { grid-template-columns: 1.5fr 1fr; } }

        .doc-title { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 900; letter-spacing: 1px; margin-bottom: 20px; color: #fff; }
        .doc-text { color: #a1a1aa; font-size: 15px; line-height: 1.7; }
        
        .complexity-row { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .complexity-label { font-size: 13px; font-weight: 700; color: #71717a; }
        .complexity-value { font-size: 15px; font-weight: 800; font-family: 'JetBrains Mono'; }

        .terminal-scroll::-webkit-scrollbar { width: 6px; }
        .terminal-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      <div className="border-l border-t border-zinc-800 p-6 relative">
  {/* Corner Accents */}
  <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-cyan-500" />
  
  <div className="flex flex-col gap-0">
    <span className="text-[10px] font-mono text-zinc-600 mb-2 tracking-tighter">REF: ENGINE_STABLE_V2</span>
    
    <div className="flex items-baseline gap-4">
      <h1 className="text-5xl font-black text-white tracking-widest">Merge-Sort</h1>
      <span className="text-5xl font-thin text-zinc-700 italic">1.0</span>
    </div>

    <div className="mt-6 flex flex-wrap gap-4 items-center">
      <span className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-400 text-[9px] font-mono">
        STABLE_MATCHING
      </span>
      <span className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-400 text-[9px] font-mono">
        LATENCY: 0.04ms
      </span>
      <div className="h-px flex-grow bg-zinc-800" />
    </div>
    
    <p className="mt-4 text-zinc-500 text-[11px] uppercase tracking-[0.3em] font-light">
      Divide and conquer recursive strategy.
    </p>
  </div>
</div>
      <header className="os-header">
        <div style={{display: 'flex', gap: '20px'}}>
        </div>
      </header>

      <div className="lab-grid">
        <aside className="panel">
          <div className="p-header"><Settings size={16}/> Configuration</div>
          <div className="p-6 flex flex-col gap-6">
            <form onSubmit={handleCustomInput}>
              <span className="text-xs text-zinc-500 font-black mb-2 block uppercase">Input Data Buffer</span>
              <input value={inputVal} onChange={(e) => setInputVal(e.target.value)} placeholder="e.g., 14, 32, 8..." className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-cyan-500/50 transition-colors" />
              <button type="submit" className="lab-btn w-full mt-3"><Hash size={16}/> Inject Buffer</button>
            </form>

            <div>
              <span className="text-xs text-zinc-500 font-black mb-2 block uppercase">Array Dimensions ({arraySize})</span>
              <input type="range" min="4" max="12" value={arraySize} onChange={(e) => setArraySize(parseInt(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
              <button onClick={generateRandom} className="lab-btn w-full mt-3"><RefreshCcw size={16}/> Randomize</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setOrder("ASC")} className={`lab-btn ${order === "ASC" ? 'bg-white text-black' : ''}`}>ASCENDING</button>
              <button onClick={() => setOrder("DSC")} className={`lab-btn ${order === "DSC" ? 'bg-white text-black' : ''}`}>DESCENDING</button>
            </div>

            <button onClick={runAlgorithm} disabled={sorting} className="lab-btn bg-cyan-500 text-black font-black border-none py-5 text-base hover:bg-cyan-400">
               {sorting ? <Cpu className="animate-spin" size={20}/> : <Play fill="black" size={18}/>} 
               {sorting ? "COMPUTING..." : "INITIALIZE SORT"}
            </button>

            <button onClick={clearAll} className="lab-btn btn-danger w-full py-4 uppercase">
              <Eraser size={18}/> Purge Cache
            </button>
          </div>
        </aside>

        <main className="panel">
          <div className="p-header"><Activity size={16}/> Recursive Visualization</div>
          <div className="canvas">
            <AnimatePresence>
              <div className="flex flex-col gap-10">{renderLevels(divideSteps, true)}</div>
              {conquerSteps.length > 0 && <div className="border-t border-white/10 my-4" />}
              <div className="flex flex-col gap-10">{renderLevels(conquerSteps, false)}</div>
            </AnimatePresence>
          </div>
        </main>

        <aside className="panel">
          <div className="p-header"><Terminal size={16}/> Runtime Kernel</div>
          <div className="flex-1 p-6 font-mono text-sm opacity-60 overflow-y-auto terminal-scroll">
            {logs.map((log, i) => <div key={i} className="mb-2 text-cyan-400/90">[{i}] {log}</div>)}
            <div ref={terminalEndRef} style={{height: "1px"}} />
          </div>
          <div className="p-6 border-t border-white/10 bg-black/20">
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-zinc-500 font-black block mb-2 uppercase tracking-widest">Total Comparisons</span>
              <div className="text-4xl font-black text-white">{metrics.ops}</div>
            </div>
          </div>
        </aside>
      </div>

      <section className="doc-section">
        <div>
          <div className="doc-title"><BookOpen size={18} className="text-cyan-400"/> ALGORITHM_SPECIFICATIONS</div>
          <p className="doc-text">
            Merge Sort is a highly efficient, stable, <b>Divide and Conquer</b> algorithm. It recursively splits the data structure into single-element arrays before merging them back together in the specified order. This approach guarantees consistent performance even on poorly distributed data.
          </p>
        </div>
        <div>
          <div className="doc-title"><Info size={18} className="text-cyan-400"/> COMPLEXITY_ANALYSIS</div>
          <div className="space-y-1">
            <div className="complexity-row"><span className="complexity-label uppercase">Time Complexity</span><span className="complexity-value text-white">O(n log n)</span></div>
            <div className="complexity-row"><span className="complexity-label uppercase">Space Complexity</span><span className="complexity-value text-white">O(n)</span></div>
            <div className="complexity-row" style={{border: 'none'}}><span className="complexity-label uppercase">Stability</span><span className="complexity-value text-cyan-400 font-black">STABLE</span></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MergeSort;