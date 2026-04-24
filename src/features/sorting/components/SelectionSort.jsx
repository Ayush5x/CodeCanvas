import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Play, RotateCcw, Pause, 
  Terminal as TerminalIcon, Dices, Settings, Activity, Trash2, BookOpen, Info
} from "lucide-react";
import Header from "../../../components/Header";
const SelectionSort = () => {
  const navigate = useNavigate();
  
  // States
  const [array, setArray] = useState([70, 10, 45, 90, 25, 60, 5, 50]);
  const [sorting, setSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sortOrder, setSortOrder] = useState("ASC"); 
  const [currentIndex, setCurrentIndex] = useState(null); 
  const [comparingIndex, setComparingIndex] = useState(null); 
  const [minIndex, setMinIndex] = useState(null); 
  const [sortedIndices, setSortedIndices] = useState([]); 
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [logs, setLogs] = useState(["SYSTEM_IDLE"]);
  const [customInput, setCustomInput] = useState("");

  const sortingRef = useRef(false);
  const pauseRef = useRef(false);
  const terminalEndRef = useRef(null);

  // FIXED: Auto-scroll terminal without shifting the whole page
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

  const generateRandom = () => {
    if (sorting) return;
    reset();
    const newArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 80) + 10);
    setArray(newArr);
    addLog("RANDOM_DATASET_LOADED");
  };

  const handleManualInput = (e) => {
    e.preventDefault();
    if (sorting) return;
    const newArr = customInput.split(",")
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n > 0)
      .slice(0, 9);
    
    if (newArr.length > 0) {
      reset();
      setArray(newArr);
      setCustomInput("");
      addLog(`OVERRIDE: [${newArr.join(", ")}]`);
    }
  };

  const reset = () => {
    sortingRef.current = false;
    pauseRef.current = false;
    setSorting(false);
    setIsPaused(false);
    setCurrentIndex(null);
    setComparingIndex(null);
    setMinIndex(null);
    setSortedIndices([]);
    setStats({ comparisons: 0, swaps: 0 });
    setLogs(["STAGING_AREA_CLEARED", "SYSTEM_IDLE"]);
  };

  const clearAll = () => {
    if (sorting) sortingRef.current = false;
    setArray([]);
    setSorting(false);
    setIsPaused(false);
    setCurrentIndex(null);
    setComparingIndex(null);
    setMinIndex(null);
    setSortedIndices([]);
    setStats({ comparisons: 0, swaps: 0 });
    setLogs(["FORCE_CLEARED: DATA_PURGED"]);
  };

  const togglePause = () => {
    if (!sorting) return;
    pauseRef.current = !pauseRef.current;
    setIsPaused(pauseRef.current);
    addLog(pauseRef.current ? "HALT_COMMAND_ISSUED" : "RESUMING_OPERATIONS");
  };

  const runSort = async () => {
    if (sorting || array.length === 0) return;
    sortingRef.current = true;
    setSorting(true);
    addLog(`EXEC_START: SELECTION_SORT_${sortOrder}`);

    let arr = [...array];
    let n = arr.length;
    let localSorted = [];

    for (let i = 0; i < n; i++) {
      let extremeIdx = i; 
      setCurrentIndex(i);
      setMinIndex(i);
      
      for (let j = i + 1; j < n; j++) {
        if (!sortingRef.current) return;
        while (pauseRef.current) {
          if (!sortingRef.current) return;
          await new Promise(r => setTimeout(r, 100));
        }

        setComparingIndex(j);
        setStats(s => ({ ...s, comparisons: s.comparisons + 1 }));
        await new Promise(r => setTimeout(r, 600));

        const condition = sortOrder === "ASC" 
          ? arr[j] < arr[extremeIdx] 
          : arr[j] > arr[extremeIdx];

        if (condition) {
          addLog(`${sortOrder === "ASC" ? "NEW_MIN" : "NEW_MAX"}: ${arr[j]} FOUND`);
          extremeIdx = j;
          setMinIndex(j);
        }
      }

      if (extremeIdx !== i) {
        addLog(`SWAP: ${arr[i]} ↔ ${arr[extremeIdx]}`);
        [arr[i], arr[extremeIdx]] = [arr[extremeIdx], arr[i]];
        setArray([...arr]);
        setStats(s => ({ ...s, swaps: s.swaps + 1 }));
        await new Promise(r => setTimeout(r, 600));
      }

      localSorted.push(i);
      setSortedIndices([...localSorted]);
    }
    setSorting(false);
    setCurrentIndex(null);
    setComparingIndex(null);
    setMinIndex(null);
    addLog("STATUS: SUCCESSFUL_COMPLETION");
  };

  return (
    <div className="os-root">
      <Header></Header>
      <style>{`
        .os-root { background: #050505; min-height: 100vh; color: #fff; font-family: 'Inter', sans-serif; padding: 40px; }
        .os-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; max-width: 1700px; margin-inline: auto; }
        .os-title { font-size: 32px; font-weight: 900; letter-spacing: -1px; }
        .cyan-text { color: #00e5ff; }
        .os-grid { display: grid; grid-template-columns: 320px 1fr 380px; gap: 20px; max-width: 1700px; margin: 0 auto; height: 700px; }
        .panel { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; }
        .panel-header { padding: 18px; border-bottom: 1px solid #1a1a1a; font-size: 13px; font-weight: 800; color: #555; display: flex; align-items: center; gap: 10px; letter-spacing: 1px; }
        .control-group { padding: 25px; display: flex; flex-direction: column; gap: 25px; flex: 1; }
        .input-label { font-size: 11px; color: #444; font-weight: 700; margin-bottom: 8px; font-family: 'JetBrains Mono', monospace; }
        .input-box { background: #111; border: 1px solid #222; padding: 15px; border-radius: 8px; width: 100%; color: #fff; font-size: 14px; outline: none; font-family: 'JetBrains Mono', monospace; }
        .os-btn { background: #111; border: 1px solid #222; color: #aaa; padding: 15px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 12px; transition: 0.2s; }
        .os-btn:hover:not(:disabled) { background: #1a1a1a; color: #fff; border-color: #444; }
        .os-btn.primary { background: #fff; color: #000; font-weight: 800; border: none; font-size: 13px; }
        .os-btn.white-glass { background: rgba(255, 255, 255, 0.95); color: #000; border: none; font-weight: 800; }

        .toggle-container { display: flex; border: 1px solid #222; border-radius: 8px; overflow: hidden; }
        .toggle-btn { flex: 1; padding: 12px; font-size: 10px; font-weight: 800; text-align: center; cursor: pointer; background: #0a0a0a; color: #444; transition: 0.2s; }
        .toggle-btn.active { background: #fff; color: #000; }

        .stage { flex: 1; display: flex; align-items: flex-end; justify-content: center; gap: 15px; padding: 80px 40px; position: relative; }
        .bar { position: relative; width: 55px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(4px); }
        .bar-label { position: absolute; top: -35px; width: 100%; text-align: center; font-size: 16px; font-weight: 800; font-family: 'JetBrains Mono', monospace; }
        
        /* FIXED: Terminal body scroll behavior */
        .terminal-body { flex: 1; padding: 20px; font-size: 13px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; font-family: 'JetBrains Mono', monospace; background: #070707; scroll-behavior: smooth; position: relative; }
        .terminal-body::-webkit-scrollbar { width: 5px; }
        .terminal-body::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        
        .log-entry { color: #555; line-height: 1.5; }
        .log-entry.latest { color: #00e5ff; }
        .stat-row { padding: 20px; border-top: 1px solid #1a1a1a; display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #444; }
        .stat-row span { color: #fff; font-size: 16px; }

        .doc-section { max-width: 1700px; margin: 40px auto 0; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 16px; padding: 40px; display: flex; justify-content: space-between; gap: 80px; }
        .doc-column { flex: 1; }
        .doc-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .doc-header h3 { font-size: 16px; font-weight: 700; color: #fff; letter-spacing: 0.5px; text-transform: uppercase; }
        .doc-body { color: #71717a; font-size: 15px; line-height: 1.7; }
        .stability-badge { display: inline-flex; align-items: center; background: #111; border: 1px solid #222; padding: 10px 18px; border-radius: 8px; margin-top: 24px; }
        .stability-label { font-size: 12px; color: #52525b; font-weight: 600; text-transform: uppercase; margin-right: 12px; }
        .stability-value { font-size: 13px; color: #fff; font-weight: 700; }
        .complexity-table { width: 100%; border-collapse: collapse; }
        .complexity-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #1a1a1a; }
        .complexity-row:last-child { border-bottom: none; }
        .complexity-label { font-size: 13px; color: #52525b; font-weight: 600; text-transform: uppercase; }
        .complexity-value { font-size: 14px; color: #fff; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
      `}</style>

     <div className="border-l border-t border-zinc-800 p-6 relative">
  {/* Corner Accents */}
  <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-cyan-500" />
  
  <div className="flex flex-col gap-0">
    <span className="text-[10px] font-mono text-zinc-600 mb-2 tracking-tighter">REF: ENGINE_STABLE_V2</span>
    
    <div className="flex items-baseline gap-4">
      <h1 className="text-5xl font-black text-white tracking-widest">Selection-Sort</h1>
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
      Repeatedly selects the minimum element.
    </p>
  </div>
</div>
      <header className="os-header">
        <div style={{display: 'flex', gap: '20px'}}>
        </div>
      </header>

      <div className="os-grid">
        <aside className="panel">
          <div className="panel-header"><Settings size={16} /> SYSTEM_PARAMETERS</div>
          <div className="control-group">
            <div>
              <div className="input-label">SORT_DIRECTION</div>
              <div className="toggle-container">
                <div 
                  className={`toggle-btn ${sortOrder === "ASC" ? "active" : ""}`} 
                  onClick={() => !sorting && setSortOrder("ASC")}
                >
                  ASCENDING
                </div>
                <div 
                  className={`toggle-btn ${sortOrder === "DSC" ? "active" : ""}`} 
                  onClick={() => !sorting && setSortOrder("DSC")}
                >
                  DESCENDING
                </div>
              </div>
            </div>

            <form onSubmit={handleManualInput}>
              <div className="input-label">DATASET_OVERRIDE</div>
              <input className="input-box" placeholder="Ex: 40, 10, 85..." value={customInput} onChange={(e) => setCustomInput(e.target.value)} disabled={sorting} />
            </form>
            <button className="os-btn" onClick={generateRandom} disabled={sorting}><Dices size={18}/> GENERATE_RANDOM_DATA</button>
            <button className="os-btn white-glass" onClick={clearAll}><Trash2 size={18}/> CLEAR_ALL_DATA</button>
            <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px'}}>
               <button className="os-btn" onClick={reset}><RotateCcw size={18}/> SYSTEM_RESET</button>
               {sorting ? (
                 <button className="os-btn" onClick={togglePause} style={{borderColor: '#00e5ff', color: '#00e5ff'}}>
                    {isPaused ? <Play size={18}/> : <Pause size={18}/>} 
                    {isPaused ? "RESUME_EXECUTION" : "PAUSE_EXECUTION"}
                 </button>
               ) : (
                 <button className="os-btn primary" onClick={runSort}><Play size={18} fill="currentColor"/> START_ALGORITHM</button>
               )}
            </div>
          </div>
        </aside>

        <main className="panel">
          <div className="panel-header"><Activity size={16} /> DATA_STREAM_VISUALIZER</div>
          <div className="stage">
             {array.length > 0 ? array.map((val, idx) => {
               const isScanning = comparingIndex === idx;
               const isExtreme = minIndex === idx; 
               const isSorted = sortedIndices.includes(idx);
               
               let bgColor = "rgba(255, 255, 255, 0.03)";
               let borderColor = "rgba(255, 255, 255, 0.1)";
               let textColor = "#444";

               if (isSorted) {
                  bgColor = "rgba(0, 229, 255, 0.2)";
                  borderColor = "rgba(0, 229, 255, 0.5)";
                  textColor = "#00e5ff";
               } else if (isExtreme) {
                  bgColor = "rgba(168, 85, 247, 0.2)"; 
                  borderColor = "rgba(168, 85, 247, 0.5)";
                  textColor = "#a855f7";
               } else if (isScanning) {
                  bgColor = "rgba(255, 255, 255, 0.15)";
                  borderColor = "rgba(255, 255, 255, 0.4)";
                  textColor = "#fff";
               }

               return (
                 <motion.div key={`${val}-${idx}`} layout transition={{type: 'spring', stiffness: 300, damping: 30}}
                    className="bar" style={{
                      height: `${val * 4.5}px`,
                      background: bgColor,
                      borderColor: borderColor
                    }}>
                   <div className="bar-label" style={{color: textColor}}>{val}</div>
                 </motion.div>
               );
             }) : (
               <div style={{color: '#222', fontStyle: 'italic', fontSize: '14px'}}>NO_ACTIVE_DATA_STREAM</div>
             )}
          </div>
        </main>

        <aside className="panel">
          <div className="panel-header"><TerminalIcon size={16} /> RUNTIME_KERNEL_LOG</div>
          <div className="terminal-body">
             {logs.map((log, i) => (
               <div key={i} className={`log-entry ${i === logs.length - 1 ? 'latest' : ''}`}>{log}</div>
             ))}
             <div ref={terminalEndRef} style={{height: "1px"}}/>
          </div>
          <div className="stat-row">
            <div>COMP_COUNT: <br/><span>{stats.comparisons}</span></div>
            <div>SWAP_COUNT: <br/><span>{stats.swaps}</span></div>
          </div>
        </aside>
      </div>

      <section className="doc-section">
        <div className="doc-column">
          <div className="doc-header">
            <BookOpen size={20} color="#00e5ff" />
            <h3>ALGORITHM_SPECIFICATIONS</h3>
          </div>
          <div className="doc-body">
            Selection Sort is an in-place comparison-based algorithm. It divides the input list into a sorted sublist at the front and an unsorted sublist for the remainder. 
            The algorithm finds the extreme element (smallest for ASC, largest for DSC) in the unsorted sublist and exchanges it with the leftmost unsorted element.
          </div>
          <div className="stability-badge">
            <span className="stability-label">STABILITY:</span>
            <span className="stability-value">UNSTABLE</span>
          </div>
        </div>

        <div className="doc-column">
          <div className="doc-header">
            <Info size={20} color="#00e5ff" />
            <h3>COMPLEXITY_ANALYSIS</h3>
          </div>
          <div className="complexity-table">
            <div className="complexity-row">
              <span className="complexity-label">WORST_CASE_TIME</span>
              <span className="complexity-value">O(n²)</span>
            </div>
            <div className="complexity-row">
              <span className="complexity-label">AVERAGE_TIME</span>
              <span className="complexity-value">O(n²)</span>
            </div>
            <div className="complexity-row">
              <span className="complexity-label">BEST_CASE_TIME</span>
              <span className="complexity-value">O(n²)</span>
            </div>
            <div className="complexity-row">
              <span className="complexity-label">SPACE_COMPLEXITY</span>
              <span className="complexity-value">O(1)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SelectionSort;