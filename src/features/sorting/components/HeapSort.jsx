import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Terminal, Settings, Activity, 
  Trash2, RefreshCw, Binary, BookOpen, ChevronRight, Database
} from "lucide-react";
import Header from "../../../components/Header";
const HeapSortLab = () => {
  const [arraySize, setArraySize] = useState(12);
  const [delay, setDelay] = useState(300);
  const [currentArray, setCurrentArray] = useState([45, 20, 60, 15, 80, 35, 90, 5, 50, 70, 25, 10]);
  const [initialArray, setInitialArray] = useState([45, 20, 60, 15, 80, 35, 90, 5, 50, 70, 25, 10]);
  const [manualInput, setManualInput] = useState("");
  
  const [activeIndices, setActiveIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sortDirection, setSortDirection] = useState("ASC");
  const [logs, setLogs] = useState(["SYSTEM_IDLE"]);
  const [metrics, setMetrics] = useState({ swaps: 0, comparisons: 0 });

  const logContainerRef = useRef(null);
  const pausedRef = useRef(false);
  const isResettingRef = useRef(false);

  // Prevent page shifting by maintaining scroll position in terminal
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (!sorting) regenerate();
  }, [arraySize]);

  const regenerate = () => {
    const arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 85) + 10);
    setCurrentArray(arr);
    setInitialArray([...arr]);
    setSortedIndices([]);
    setActiveIndices([]);
    setMetrics({ swaps: 0, comparisons: 0 });
    setLogs(prev => [...prev, `ALLOCATED_NEW_STREAM: ${arraySize}_NODES`]);
  };

  const applyManualData = () => {
    const parsed = manualInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (parsed.length > 0) {
      setCurrentArray(parsed);
      setInitialArray([...parsed]);
      setArraySize(parsed.length);
      setSortedIndices([]);
      setLogs(prev => [...prev, `MANUAL_OVERRIDE: ${parsed.length}_NODES`]);
    }
  };

  const systemReset = () => {
    isResettingRef.current = true;
    setSorting(false);
    setPaused(false);
    pausedRef.current = false;
    setCurrentArray([...initialArray]);
    setSortedIndices([]);
    setActiveIndices([]);
    setMetrics({ swaps: 0, comparisons: 0 });
    setLogs(["SYSTEM_REBOOT", "L0_STATE_RESTORED"]);
    setTimeout(() => { isResettingRef.current = false; }, 50);
  };

  const clearAllData = () => {
    isResettingRef.current = true;
    setSorting(false);
    setCurrentArray([]);
    setInitialArray([]);
    setSortedIndices([]);
    setActiveIndices([]);
    setMetrics({ swaps: 0, comparisons: 0 });
    setLogs(["BUFFER_PURGED"]);
    setTimeout(() => { isResettingRef.current = false; }, 50);
  };

  const togglePause = () => {
    pausedRef.current = !paused;
    setPaused(!paused);
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const waitIfPaused = async () => {
    while (pausedRef.current && !isResettingRef.current) {
      await sleep(100);
    }
    return !isResettingRef.current;
  };

  const heapify = async (arr, n, i) => {
    if (isResettingRef.current) return;
    let extreme = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (!(await waitIfPaused())) return;
    setActiveIndices([i, left, right].filter(idx => idx < n));
    setMetrics(m => ({ ...m, comparisons: m.comparisons + 1 }));
    await sleep(delay);

    const isAsc = sortDirection === "ASC";
    if (left < n && (isAsc ? arr[left] > arr[extreme] : arr[left] < arr[extreme])) extreme = left;
    if (right < n && (isAsc ? arr[right] > arr[extreme] : arr[right] < arr[extreme])) extreme = right;

    if (extreme !== i) {
      if (!(await waitIfPaused())) return;
      setMetrics(m => ({ ...m, swaps: m.swaps + 1 }));
      [arr[i], arr[extreme]] = [arr[extreme], arr[i]];
      setCurrentArray([...arr]);
      await sleep(delay);
      await heapify(arr, n, extreme);
    }
  };

  const heapSort = async () => {
    if (sorting || currentArray.length === 0) return;
    setSorting(true);
    isResettingRef.current = false;
    
    let arr = [...currentArray];
    let n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      if (isResettingRef.current) return;
      await heapify(arr, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
      if (isResettingRef.current) return;
      if (!(await waitIfPaused())) return;
      
      setActiveIndices([0, i]);
      setMetrics(m => ({ ...m, swaps: m.swaps + 1 }));
      [arr[0], arr[i]] = [arr[i], arr[0]];
      setCurrentArray([...arr]);
      setSortedIndices(prev => [i, ...prev]);
      await sleep(delay);
      await heapify(arr, i, 0);
    }
    
    if (!isResettingRef.current) {
      setSortedIndices(prev => [0, ...prev]);
      setActiveIndices([]);
      setSorting(false);
      setLogs(prev => [...prev, "ALGORITHM_COMPLETE"]);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-[#F5F5F5] p-6 font-sans selection:bg-white selection:text-black">
     <Header></Header>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=JetBrains+Mono&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; }
        .dashboard-panel { background: #0D0D0D; border: 1px solid #1A1A1A; border-radius: 16px; overflow: hidden; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        input[type="range"] { accent-color: #00ffff; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
<div className="border-l border-t border-zinc-800 p-6 relative">
  {/* Corner Accents */}
  <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-cyan-500" />
  
  <div className="flex flex-col gap-0">
    <span className="text-[10px] font-mono text-zinc-600 mb-2 tracking-tighter">REF: ENGINE_STABLE_V2</span>
    
    <div className="flex items-baseline gap-4">
      <h1 className="text-5xl font-black text-white tracking-widest">Heap-Sort</h1>
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
      Repeatedly swaps adjacent elements if they are incorrectly ordered.
    </p>
  </div>
</div>
      
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* HEADER */}
        <header className="flex justify-between items-center px-2">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <Binary size={24} className="text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Heap <span className="text-[#00ffff]">Sort</span></h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Core_Engine_v4.0</p>
            </div>
          </div>
          <div className={`px-5 py-2 rounded-full border border-zinc-900 flex items-center gap-3 ${sorting ? 'bg-zinc-900/50' : ''}`}>
             <div className={`w-2 h-2 rounded-full ${sorting ? 'bg-[#00ffff] shadow-[0_0_10px_#00ffff] animate-pulse' : 'bg-zinc-800'}`} />
             <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
               {sorting ? (paused ? 'System_Paused' : 'System_Active') : 'System_Idle'}
             </span>
          </div>
        </header>

        {/* MAIN INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* CONTROL UNIT - Fixed width on large screens */}
          <aside className="lg:col-span-3 dashboard-panel p-6 h-full min-h-[550px] flex flex-col justify-between">
            <div className="space-y-8">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 tracking-widest uppercase">
                <Settings size={16} className="text-[#00ffff]"/> Control_Unit
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Sort Order</label>
                  <div className="grid grid-cols-2 p-1 bg-black border border-zinc-800 rounded-xl">
                    {["ASC", "DESC"].map((dir) => (
                      <button key={dir} onClick={() => setSortDirection(dir)}
                        className={`py-2 text-[10px] font-black rounded-lg transition-all ${sortDirection === dir ? 'bg-white text-black' : 'text-zinc-600 hover:text-zinc-400'}`}
                      >
                        {dir}ENDING
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase">
                    <label>Node Count</label>
                    <span className="mono text-[#00ffff]">{arraySize}</span>
                  </div>
                  <input type="range" min="5" max="30" value={arraySize} onChange={(e) => setArraySize(parseInt(e.target.value))} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" disabled={sorting} />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-zinc-400 flex items-center gap-2 uppercase">
                    <Database size={14}/> Manual Input
                  </label>
                  <div className="flex gap-2">
                    <input type="text" value={manualInput} onChange={(e) => setManualInput(e.target.value)}
                      placeholder="e.g. 12, 5, 8, 20" 
                      className="flex-1 bg-black border border-zinc-800 p-3 rounded-xl text-xs mono outline-none focus:border-[#00ffff]/50 transition-all placeholder:text-zinc-700"
                    />
                    <button onClick={applyManualData} className="px-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all border border-zinc-700">
                      <ChevronRight size={18}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={regenerate} className="flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-800 text-xs font-bold hover:bg-zinc-900 transition-colors">
                  <RefreshCw size={14} /> REGEN
                </button>
                <button onClick={clearAllData} className="flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-800 text-xs font-bold hover:bg-zinc-900 transition-colors">
                  <Trash2 size={14} /> CLEAR
                </button>
              </div>
              <button onClick={systemReset} className="w-full py-3 rounded-xl border border-zinc-900 text-zinc-600 text-xs font-bold hover:text-red-400 hover:border-red-900/30 transition-all">
                SYSTEM_RESET
              </button>
              <button onClick={sorting ? togglePause : heapSort} 
                className="w-full py-4 rounded-xl bg-white text-black text-sm font-black hover:bg-[#00ffff] transition-all shadow-[0_0_30px_rgba(0,255,255,0.1)] active:scale-[0.98]"
              >
                {sorting ? (paused ? "RESUME_THREAD" : "PAUSE_THREAD") : "EXECUTE_KERNEL"}
              </button>
            </div>
          </aside>

          {/* VISUALIZER - Maintains fixed height to prevent shift */}
          <main className="lg:col-span-6 dashboard-panel flex flex-col h-[550px]">
            <div className="p-4 border-b border-zinc-900 flex items-center gap-2 text-xs font-bold tracking-widest text-[#00ffff] uppercase">
              <Activity size={16}/> Node_Stream_Canvas
            </div>
            <div className="flex-1 flex items-end justify-center gap-1.5 px-6 pb-12 pt-16 relative">
              <AnimatePresence mode="popLayout">
                {currentArray.map((val, i) => (
                  <motion.div key={`bar-${i}`} layout transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    className="flex flex-col items-center gap-4 flex-1 h-full justify-end"
                  >
                    <span className={`text-xs mono font-black transition-colors ${activeIndices.includes(i) ? 'text-white' : sortedIndices.includes(i) ? 'text-[#00ffff]' : 'text-zinc-600'}`}>
                      {val}
                    </span>
                    <div 
                      className={`w-full transition-all duration-300 rounded-t-md ${activeIndices.includes(i) ? 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)] z-10' : sortedIndices.includes(i) ? 'bg-[#00ffff]/20 border-x border-t border-[#00ffff]/40' : 'bg-zinc-900 border-x border-t border-zinc-800'}`} 
                      style={{ height: `${(val / 100) * 85}%` }} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </main>

          {/* LOGS - Fixed height terminal */}
          <aside className="lg:col-span-3 dashboard-panel flex flex-col h-[550px]">
            <div className="p-4 border-b border-zinc-900 flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-500 uppercase">
              <Terminal size={16} className="text-[#00ffff]"/> Runtime_Logs
            </div>
            <div ref={logContainerRef} className="flex-1 p-5 mono text-[11px] overflow-y-auto space-y-3 custom-scrollbar bg-black/50">
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-4 leading-none ${i === logs.length - 1 ? 'text-[#00ffff]' : 'text-zinc-600'}`}>
                  <span className="opacity-30 shrink-0 select-none">{i.toString().padStart(2, '0')}</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-zinc-900 bg-black flex justify-between gap-4">
               <div>
                  <span className="text-[10px] text-zinc-500 font-black uppercase block mb-1">Comparisons</span>
                  <span className="text-2xl font-bold mono text-white">{metrics.comparisons}</span>
               </div>
               <div className="text-right">
                  <span className="text-[10px] text-zinc-500 font-black uppercase block mb-1">Swaps</span>
                  <span className="text-2xl font-bold mono text-white">{metrics.swaps}</span>
               </div>
            </div>
          </aside>
        </div>

        {/* FOOTER DOCUMENTATION */}
        <section className="dashboard-panel p-8 bg-zinc-900/5">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 tracking-widest uppercase mb-8">
            <BookOpen size={16} className="text-[#00ffff]"/> Technical_Algorithm_Manifest
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h4 className="text-white text-sm font-bold uppercase tracking-widest border-l-4 border-[#00ffff] pl-4">The Logic</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Heap sort utilizes a <strong>Binary Heap</strong> data structure. It behaves like an improved selection sort: instead of scanning the linear array for the maximum, it organizes data into a tree where the largest value is always at the root.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-white text-sm font-bold uppercase tracking-widest border-l-4 border-white pl-4">Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-xs text-zinc-500 uppercase">Worst Case</span>
                  <span className="text-xs mono text-[#00ffff] font-bold">O(n log n)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-xs text-zinc-500 uppercase">Average Case</span>
                  <span className="text-xs mono text-[#00ffff] font-bold">O(n log n)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-xs text-zinc-500 uppercase">Space</span>
                  <span className="text-xs mono text-white">O(1)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white text-sm font-bold uppercase tracking-widest border-l-4 border-white pl-4">Process</h4>
              <ul className="space-y-3 text-xs text-zinc-500 mono uppercase">
                <li className="flex gap-3">
                  <span className="text-[#00ffff]">01</span> Build Max Heap from input.
                </li>
                <li className="flex gap-3">
                  <span className="text-[#00ffff]">02</span> Swap root with last node.
                </li>
                <li className="flex gap-3">
                  <span className="text-[#00ffff]">03</span> Heapify reduced tree.
                </li>
                <li className="flex gap-3">
                  <span className="text-[#00ffff]">04</span> Repeat until sorted.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HeapSortLab;