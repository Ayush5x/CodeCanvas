import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Play, RotateCcw, Pause, 
  Terminal as TerminalIcon, Dices, Settings, Activity, Trash2, BookOpen, Info, Database
} from "lucide-react";
import Header from "../../../components/Header";
const QuickSort = () => {
  const navigate = useNavigate();
  
  // State Management
  const [array, setArray] = useState([45, 20, 60, 15, 80, 35, 90, 5, 50]);
  const [initialArray, setInitialArray] = useState([45, 20, 60, 15, 80, 35, 90, 5, 50]);
  const [sorting, setSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndices, setActiveIndices] = useState([]); 
  const [pivotIndex, setPivotIndex] = useState(null);
  const [sortedIndices, setSortedIndices] = useState([]); 
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [logs, setLogs] = useState(["SYSTEM_READY"]);
  const [customInput, setCustomInput] = useState("");

  // Control Refs
  const sortingRef = useRef(false);
  const pauseRef = useRef(false);
  const killSwitchRef = useRef(false); 
  const terminalEndRef = useRef(null);

  // FIX: Page jumping. Uses 'nearest' to prevent global window scrolling.
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "nearest" 
      });
    }
  }, [logs]);

  const addLog = (msg) => {
    setLogs(prev => [...prev, `> ${msg}`]);
  };

  const handleManualInput = (e) => {
    e.preventDefault();
    if (sorting) return;
    const newArr = customInput.split(",")
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n > 0)
      .slice(0, 12); 
    
    if (newArr.length > 0) {
      setArray(newArr);
      setInitialArray([...newArr]);
      setCustomInput("");
      setSortedIndices([]);
      addLog(`DATA_INJECTED: [${newArr.join(", ")}]`);
    }
  };

  const generateRandom = () => {
    if (sorting) return;
    const newArr = Array.from({ length: 9 }, () => Math.floor(Math.random() * 80) + 10);
    setArray(newArr);
    setInitialArray([...newArr]);
    setSortedIndices([]);
    setStats({ comparisons: 0, swaps: 0 });
    addLog("RANDOM_DATASET_GENERATED");
  };

  const systemReset = () => {
    killSwitchRef.current = true; 
    sortingRef.current = false;
    pauseRef.current = false;
    
    setSorting(false);
    setIsPaused(false);
    setArray([...initialArray]); 
    setActiveIndices([]);
    setPivotIndex(null);
    setSortedIndices([]);
    setStats({ comparisons: 0, swaps: 0 });
    setLogs(["SYSTEM_REBOOT", "BUFFER_RESTORED", "SYSTEM_IDLE"]);
    
    setTimeout(() => { killSwitchRef.current = false; }, 100);
  };

  const clearAll = () => {
    systemReset();
    setArray([]);
    setInitialArray([]);
    addLog("CACHE_PURGED: NO_ACTIVE_DATA");
  };

  const togglePause = () => {
    if (!sorting) return;
    pauseRef.current = !pauseRef.current;
    setIsPaused(pauseRef.current);
    addLog(pauseRef.current ? "HALT_COMMAND_ISSUED" : "RESUMING_THREADS");
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const waitIfPaused = async () => {
    while (pauseRef.current && !killSwitchRef.current) {
      await sleep(100);
    }
    return !killSwitchRef.current;
  };

  const partition = async (arr, low, high) => {
    if (killSwitchRef.current) return;
    
    let pivot = arr[high];
    setPivotIndex(high);
    addLog(`PIVOT_SET: ${pivot}`);
    
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (killSwitchRef.current) return;
      if (!(await waitIfPaused())) return;

      setActiveIndices([j, high]);
      setStats(s => ({ ...s, comparisons: s.comparisons + 1 }));
      await sleep(400);

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        setStats(s => ({ ...s, swaps: s.swaps + 1 }));
        await sleep(400);
      }
    }
    
    if (killSwitchRef.current) return;
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    setStats(s => ({ ...s, swaps: s.swaps + 1 }));
    setPivotIndex(null);
    return i + 1;
  };

  const quickSortRecursive = async (arr, low, high) => {
    if (killSwitchRef.current || low > high) return;
    let pi = await partition(arr, low, high);
    if (pi === undefined || killSwitchRef.current) return;
    setSortedIndices(prev => [...prev, pi]);
    await quickSortRecursive(arr, low, pi - 1);
    await quickSortRecursive(arr, pi + 1, high);
  };

  const runSort = async () => {
    if (sorting || array.length === 0) return;
    setSorting(true);
    sortingRef.current = true;
    killSwitchRef.current = false;
    setSortedIndices([]);
    addLog("INIT_KERNEL_EXECUTION");
    let arr = [...array];
    await quickSortRecursive(arr, 0, arr.length - 1);
    if (!killSwitchRef.current) {
      setSorting(false);
      setActiveIndices([]);
      setPivotIndex(null);
      setSortedIndices([...Array(arr.length).keys()]);
      addLog("SUCCESS: DATA_STABILIZED");
    }
  };

  return (
    <div className="os-root">
      <Header></Header>
      <style>{`
        .os-root { background: #050505; min-height: 100vh; color: #ffffff; font-family: 'Inter', sans-serif; padding: 40px; }
        .os-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; max-width: 1700px; margin-inline: auto; }
        .os-title { font-size: 32px; font-weight: 900; letter-spacing: -1px; color: #ffffff; }
        .cyan-text { color: #00e5ff; }
        
        .os-grid { display: grid; grid-template-columns: 320px 1fr 360px; gap: 20px; max-width: 1700px; margin: 0 auto; height: 700px; }
        .panel { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; }
        .panel-header { padding: 16px; border-bottom: 1px solid #1a1a1a; font-size: 11px; font-weight: 800; color: #ffffff; display: flex; align-items: center; gap: 10px; letter-spacing: 2px; }
        
        .control-group { padding: 24px; display: flex; flex-direction: column; gap: 20px; flex: 1; }
        .input-label { font-size: 11px; color: #ffffff; font-weight: 800; margin-bottom: 8px; font-family: 'JetBrains Mono', monospace; }
        .input-box { background: #0d0d0d; border: 1px solid #333; padding: 14px; border-radius: 8px; width: 100%; color: #ffffff; font-size: 14px; outline: none; font-family: 'JetBrains Mono', monospace; }
        .input-box:focus { border-color: #ffffff; }
        
        .os-btn { background: #111; border: 1px solid #333; color: #ffffff; padding: 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: 0.2s; }
        .os-btn:hover:not(:disabled) { background: #ffffff; color: #000000; border-color: #ffffff; }
        .os-btn.primary { background: #ffffff; color: #000000; font-weight: 900; border: none; }
        
        .stage { flex: 1; display: flex; align-items: flex-end; justify-content: center; gap: 12px; padding: 60px; position: relative; }
        .bar { position: relative; width: 45px; border-radius: 4px 4px 0 0; border: 1px solid rgba(255, 255, 255, 0.2); transition: background 0.3s, height 0.3s; }
        .bar-label { position: absolute; top: -35px; width: 100%; text-align: center; font-size: 15px; font-weight: 900; font-family: 'JetBrains Mono', monospace; color: #ffffff; }
        
        .terminal-body { flex: 1; padding: 20px; font-size: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; font-family: 'JetBrains Mono', monospace; background: #050505; color: #ffffff; scrollbar-width: thin; }
        .log-entry { opacity: 0.6; }
        .log-entry.latest { color: #00e5ff; opacity: 1; font-weight: 800; }
        
        .stat-row { padding: 20px; border-top: 1px solid #1a1a1a; display: flex; justify-content: space-between; background: #070707; }
        .stat-unit { font-size: 10px; color: #ffffff; font-weight: 800; letter-spacing: 1px; }
        .stat-val { display: block; color: #ffffff; font-size: 20px; margin-top: 4px; font-family: 'JetBrains Mono', monospace; font-weight: 900; }
        
        .doc-section { max-width: 1700px; margin: 40px auto; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .doc-card { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 30px; border-radius: 12px; }
        .doc-title { font-size: 18px; font-weight: 900; margin-bottom: 15px; color: #ffffff; display: flex; align-items: center; gap: 10px; }
        .doc-text { color: #ffffff; opacity: 0.7; font-size: 14px; line-height: 1.7; }
      `}</style>

      <div className="border-l border-t border-zinc-800 p-6 relative">
  {/* Corner Accents */}
  <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-cyan-500" />
  
  <div className="flex flex-col gap-0">
    <span className="text-[10px] font-mono text-zinc-600 mb-2 tracking-tighter">REF: ENGINE_STABLE_V2</span>
    
    <div className="flex items-baseline gap-4">
      <h1 className="text-5xl font-black text-white tracking-widest">Quick-Sort</h1>
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
      Efficient partitioning around a pivot.
    </p>
  </div>
</div>
      <header className="os-header">
        <div style={{display: 'flex', gap: '20px'}}>
        </div>
      </header>

      <div className="os-grid">
        <aside className="panel">
          <div className="panel-header"><Settings size={16} /> CONTROL_INTERFACE</div>
          <div className="control-group">
            <form onSubmit={handleManualInput}>
              <div className="input-label">DATA_OVERRIDE (COMMA_SEP)</div>
              <div style={{display: 'flex', gap: '8px'}}>
                <input 
                  className="input-box" 
                  placeholder="22, 10, 45..." 
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  disabled={sorting}
                />
                <button type="submit" className="os-btn" style={{padding: '0 18px'}} disabled={sorting}>
                  <Database size={18} />
                </button>
              </div>
            </form>

            <button className="os-btn" onClick={generateRandom} disabled={sorting}>
              <Dices size={18}/> RANDOM_STREAM
            </button>

            <button className="os-btn" onClick={clearAll}>
              <Trash2 size={18}/> PURGE_BUFFER
            </button>
            
            <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px'}}>
               <button className="os-btn" onClick={systemReset} style={{background: '#ffffff', color: '#000000'}}>
                 <RotateCcw size={18}/> SYSTEM_RESET
               </button>
               
               {sorting ? (
                 <button className="os-btn" onClick={togglePause} style={{borderColor: '#00e5ff', color: '#00e5ff'}}>
                    {isPaused ? <Play size={18}/> : <Pause size={18}/>} 
                    {isPaused ? "RESUME_THREAD" : "PAUSE_THREAD"}
                 </button>
               ) : (
                 <button className="os-btn primary" onClick={runSort}>
                   <Play size={18} fill="black"/> START_ALGORITHM
                 </button>
               )}
            </div>
          </div>
        </aside>

        <main className="panel">
          <div className="panel-header"><Activity size={16} /> DATA_STREAM_VISUALIZER</div>
          <div className="stage">
             <AnimatePresence>
             {array.length > 0 ? array.map((val, idx) => {
               const isActive = activeIndices.includes(idx);
               const isPivot = pivotIndex === idx;
               const isSorted = sortedIndices.includes(idx);
               
               let bgColor = "rgba(255, 255, 255, 0.05)";
               let border = "1px solid rgba(255, 255, 255, 0.1)";

               if (isPivot) { bgColor = "#ffffff"; border = "1px solid #ffffff"; }
               else if (isSorted) { bgColor = "rgba(0, 229, 255, 0.25)"; border = "1px solid #00e5ff"; }
               else if (isActive) { bgColor = "rgba(255, 255, 255, 0.4)"; border = "2px solid #ffffff"; }

               return (
                 <motion.div key={`${idx}-${val}`} layout transition={{type: 'spring', stiffness: 300, damping: 30}}
                    className="bar" style={{ height: `${val * 6}px`, background: bgColor, border: border }}>
                   <div className="bar-label">{val}</div>
                 </motion.div>
               );
             }) : (
               <div className="text-white mono text-sm uppercase tracking-widest opacity-30">Awaiting_Data_Input</div>
             )}
             </AnimatePresence>
          </div>
        </main>

        <aside className="panel">
          <div className="panel-header"><TerminalIcon size={16} /> KERNEL_LOG</div>
          <div className="terminal-body">
             {logs.map((log, i) => (
               <div key={i} className={`log-entry ${i === logs.length - 1 ? 'latest' : ''}`}>{log}</div>
             ))}
             <div ref={terminalEndRef} style={{ height: '1px' }} />
          </div>
          <div className="stat-row">
            <div className="stat-unit">COMPARISONS<span className="stat-val">{stats.comparisons}</span></div>
            <div className="stat-unit text-right">SWAPS<span className="stat-val">{stats.swaps}</span></div>
          </div>
        </aside>
      </div>

      <section className="doc-section">
        <div className="doc-card">
          <h3 className="doc-title"><BookOpen size={20} className="cyan-text"/> Partitioning_Logic</h3>
          <p className="doc-text">
            Quick Sort utilizes a pivot-based divide and conquer strategy. It partitions the array into two sub-arrays around the pivot: 
            elements smaller than the pivot go to the left, and elements larger go to the right. This implementation uses the 
            <strong> Last Element Pivot</strong> strategy.
          </p>
        </div>
        <div className="doc-card">
          <h3 className="doc-title"><Info size={20} className="cyan-text"/> Complexity_Profile</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '8px'}}>
              <span className="doc-text">AVERAGE_TIME</span><span className="stat-unit" style={{fontSize: '14px', color: '#fff'}}>O(n log n)</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '8px'}}>
              <span className="doc-text">WORST_TIME</span><span className="stat-unit" style={{fontSize: '14px', color: '#fff'}}>O(n²)</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span className="doc-text">SPACE_COMPLEXITY</span><span className="stat-unit" style={{fontSize: '14px', color: '#fff'}}>O(log n)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuickSort;