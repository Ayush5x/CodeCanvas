import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Dices, SkipForward, Target } from 'lucide-react';
import { useIsMobile } from '../../../hooks/use-mobile';
import './QuickSortVisualizer.css';

const QUICK_CODE = [
  { id: 1, text: "quickSort(arr, low, high) {" },
  { id: 2, text: "  if (low < high) {" },
  { id: 3, text: "    let pIdx = await partition(arr, low, high);" },
  { id: 4, text: "    await quickSort(arr, low, pIdx - 1);" },
  { id: 5, text: "    await quickSort(arr, pIdx + 1, high);" },
  { id: 6, text: "  }" },
  { id: 7, text: "}" },
  { id: 8, text: "partition(arr, low, high) {" },
  { id: 9, text: "  let pivot = arr[high];" },
  { id: 10, text: "  let i = low - 1;" },
  { id: 11, text: "  for (let j = low; j < high; j++) {" },
  { id: 12, text: "    if (arr[j] < pivot) {" },
  { id: 13, text: "      i++; swap(arr[i], arr[j]);" },
  { id: 14, text: "    }" },
  { id: 15, text: "  }" },
  { id: 16, text: "  swap(arr[i + 1], arr[high]); return i + 1;" },
  { id: 17, text: "}" }
];

const QuickSortVisualizer = () => {
  const isMobile = useIsMobile();
  const [array, setArray] = useState([45, 20, 60, 15, 80, 35, 90, 5, 50]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentLine, setCurrentLine] = useState(null);
  const [activeBounds, setActiveBounds] = useState({ low: 0, high: 8 });
  const [markers, setMarkers] = useState({ i: null, j: null, pivot: null });
  const [swappingIndices, setSwappingIndices] = useState([]);
  const [lockedIndices, setLockedIndices] = useState([]);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [logs, setLogs] = useState(["SYSTEM_IDLE"]);
  const [calculation, setCalculation] = useState({ left: null, right: null, condition: "", result: null, isSwapping: false });

  const sortingRef = useRef(false);
  const pauseRef = useRef(false);
  const speedRef = useRef(1);
  const logEndRef = useRef(null);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    if (logEndRef.current && !isMobile) {
      logEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [logs, isMobile]);

  const addLog = (msg) => {
    setLogs(prev => [...prev, msg]);
  };

  const wait = async (ms) => {
    return new Promise(resolve => {
      const check = setInterval(() => {
        if (!pauseRef.current || !sortingRef.current) {
          clearInterval(check);
          resolve();
        }
      }, 50);
    }).then(() => new Promise(r => setTimeout(r, ms / speedRef.current)));
  };

  const generateRandom = () => {
    if (isSorting) return;
    const newArr = Array.from({ length: 9 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArr);
    resetStates();
    addLog("RANDOM_DATASET_LOADED");
  };

  const resetStates = () => {
    setActiveBounds({ low: 0, high: 8 });
    setMarkers({ i: null, j: null, pivot: null });
    setSwappingIndices([]);
    setLockedIndices([]);
    setStats({ comparisons: 0, swaps: 0 });
    setLogs(["STAGING_AREA_CLEARED", "SYSTEM_IDLE"]);
    setCalculation({ left: null, right: null, condition: "", result: null, isSwapping: false });
    setCurrentLine(null);
    setIsSorting(false);
    setIsPaused(false);
    sortingRef.current = false;
    pauseRef.current = false;
  };

  const partition = async (arr, low, high) => {
    if (!sortingRef.current) return;
    
    setCurrentLine(8);
    let pivot = arr[high];
    setMarkers(prev => ({ ...prev, pivot: high }));
    addLog(`PIVOT_ASSIGNED: ${pivot} at index ${high}`);
    setCurrentLine(9);
    await wait(600);

    let i = low - 1;
    setMarkers(prev => ({ ...prev, i }));
    setCurrentLine(10);
    await wait(400);

    for (let j = low; j < high; j++) {
      if (!sortingRef.current) return;
      setMarkers(prev => ({ ...prev, j }));
      setCurrentLine(11);
      
      // Comparison
      setStats(s => ({ ...s, comparisons: s.comparisons + 1 }));
      setCalculation({ 
        left: arr[j], 
        right: pivot, 
        condition: "<", 
        result: arr[j] < pivot,
        isSwapping: false
      });
      setCurrentLine(12);
      await wait(600);

      if (arr[j] < pivot) {
        i++;
        setMarkers(prev => ({ ...prev, i }));
        setCurrentLine(13);
        addLog(`SWAP: ${arr[i]} ↔ ${arr[j]}`);
        
        setSwappingIndices([i, j]);
        setCalculation(prev => ({ ...prev, isSwapping: true }));
        await wait(400);

        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        setStats(s => ({ ...s, swaps: s.swaps + 1 }));
        await wait(800);
        setSwappingIndices([]);
      }
      setCurrentLine(14);
      setCalculation({ left: null, right: null, condition: "", result: null, isSwapping: false });
      await wait(200);
    }

    setCurrentLine(15);
    await wait(300);

    setCurrentLine(16);
    addLog(`FINAL_PIVOT_SWAP: ${arr[i+1]} ↔ ${arr[high]}`);
    setSwappingIndices([i + 1, high]);
    setCalculation({ left: arr[i+1], right: arr[high], condition: "SWAP", result: true, isSwapping: true });
    await wait(400);

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    setStats(s => ({ ...s, swaps: s.swaps + 1 }));
    await wait(800);
    
    setSwappingIndices([]);
    setMarkers(prev => ({ ...prev, pivot: i + 1, j: null }));
    setCalculation({ left: null, right: null, condition: "", result: null, isSwapping: false });
    
    return i + 1;
  };

  const quickSort = async (arr, low, high) => {
    if (!sortingRef.current || low > high) return;

    setActiveBounds({ low, high });
    setCurrentLine(1);
    await wait(400);

    if (low < high) {
      setCurrentLine(2);
      await wait(300);

      setCurrentLine(3);
      let pIdx = await partition(arr, low, high);
      
      if (!sortingRef.current) return;
      
      // Pivot is locked
      setLockedIndices(prev => [...prev, pIdx]);
      addLog(`INDEX_LOCKED: ${pIdx} (${arr[pIdx]})`);
      await wait(400);

      setCurrentLine(4);
      await quickSort(arr, low, pIdx - 1);
      
      if (!sortingRef.current) return;
      setActiveBounds({ low, high }); // Restore bounds after recursion
      
      setCurrentLine(5);
      await quickSort(arr, pIdx + 1, high);
      
      if (!sortingRef.current) return;
      setActiveBounds({ low, high });
    } else if (low === high) {
      // Single element is sorted
      setLockedIndices(prev => [...prev, low]);
      addLog(`INDEX_LOCKED: ${low} (${arr[low]})`);
      await wait(200);
    }
    
    setCurrentLine(6);
    await wait(200);
  };

  const startSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    sortingRef.current = true;
    pauseRef.current = false;

    let arr = [...array];
    await quickSort(arr, 0, arr.length - 1);

    if (sortingRef.current) {
      setIsSorting(false);
      sortingRef.current = false;
      addLog("STATUS: SUCCESSFUL_COMPLETION");
      setCurrentLine(null);
      setActiveBounds({ low: 0, high: 8 });
      setMarkers({ i: null, j: null, pivot: null });
      // Final lock all
      setLockedIndices(Array.from({ length: 9 }, (_, k) => k));
    }
  };

  const togglePause = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(pauseRef.current);
    addLog(pauseRef.current ? "HALT_COMMAND_ISSUED" : "RESUMING_OPERATIONS");
  };

  return (
    <div className={`quick-visualizer-container ${isMobile ? 'mobile-view' : ''}`}>
      <div className={`visualizer-header ${isMobile ? 'flex-col gap-6 items-center text-center' : ''}`}>
        <div className="flex flex-col gap-1">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-black text-white flex items-center gap-2`}>
            <div className="w-2 h-2 bg-[#FFFF00] rounded-full animate-pulse" />
            QUICK_SORT <span className="text-[#FFFF00]/50 font-light">PARTITION_KERNEL</span>
          </h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Recursive Pivot Synchronization</p>
        </div>

        <div className={`visualizer-controls ${isMobile ? 'w-full flex-wrap justify-center' : ''}`}>
          <div className={`speed-control ${isMobile ? 'w-full px-4' : ''}`}>
            <label>Clock Speed</label>
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                className={`speed-slider ${isMobile ? 'flex-1' : ''}`} 
                min="0.5" 
                max="4" 
                step="0.1" 
                value={speed} 
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
              />
              <span className="text-[10px] font-mono text-[#FFFF00]">{speed}x</span>
            </div>
          </div>
          
          <div className={`flex gap-2 ${isMobile ? 'w-full justify-center' : ''}`}>
            <button className="control-btn" onClick={generateRandom} disabled={isSorting}>
              <Dices size={14} /> Random
            </button>
            
            <button className="control-btn" onClick={resetStates} disabled={isSorting && !isPaused}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div className={isMobile ? 'w-full px-2' : ''}>
            {isSorting ? (
              <button className={`control-btn primary ${isMobile ? 'w-full justify-center' : ''}`} onClick={togglePause}>
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
                {isPaused ? "Resume" : "Pause"}
              </button>
            ) : (
              <button className={`control-btn primary ${isMobile ? 'w-full justify-center' : ''}`} onClick={startSort}>
                <Play size={16} /> Execute Sort
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-4'} gap-8 h-full`}>
        <div className={isMobile ? '' : 'lg:col-span-3 flex flex-col gap-6'}>
          <div className={`sorting-stage relative overflow-hidden ${isMobile ? 'min-h-[220px] py-8 px-2' : ''}`}>
            {array.map((val, idx) => {
              const isInactive = idx < activeBounds.low || idx > activeBounds.high;
              const isPivot = markers.pivot === idx;
              const isPtrI = markers.i === idx;
              const isPtrJ = markers.j === idx;
              const isSwapping = swappingIndices.includes(idx);
              const isLocked = lockedIndices.includes(idx);
              
              let barState = "";
              if (isLocked) barState = "bar-locked";
              else if (isSwapping) barState = "bar-swapping";
              else if (isPivot) barState = "bar-pivot";
              else if (isPtrI) barState = "bar-pointer-i";
              else if (isPtrJ) barState = "bar-pointer-j";
              if (isInactive && isSorting) barState += " bar-inactive";

              return (
                <motion.div 
                  key={`${idx}-${val}`}
                  layout
                  className={`bar-wrapper ${barState}`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div 
                    className="glass-bar" 
                    style={{ height: `${val * (isMobile ? 2.2 : 3)}px` }}
                  />
                  <div className={`bar-value ${isMobile ? 'text-[10px] -top-5' : ''}`}>{val}</div>
                  
                  {markers.j === idx && (
                    <motion.div layoutId="marker-j" className="marker marker-j" style={isMobile ? { bottom: '-22px', fontSize: '8px', padding: '2px 4px' } : {}}>{isMobile ? 'J' : 'PTR_J'}</motion.div>
                  )}
                  {markers.i === idx && (
                    <motion.div layoutId="marker-i" className="marker marker-i" style={isMobile ? { bottom: '-40px', fontSize: '8px', padding: '2px 4px' } : {}}>{isMobile ? 'I' : 'PTR_I'}</motion.div>
                  )}
                  {markers.pivot === idx && (
                    <motion.div layoutId="marker-pivot" className="marker marker-pivot" style={isMobile ? { bottom: '-58px', fontSize: '8px', padding: '2px 4px' } : {}}>{isMobile ? 'PIV' : 'PIVOT'}</motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className={`stats-row bg-black/20 ${isMobile ? 'p-3' : 'p-4'} rounded-xl border border-white/5`}>
              <div className="stat-item">
                <span className="stat-label">Comparisons</span>
                <span className={`${isMobile ? 'text-sm' : 'text-xl'} font-bold`}>{stats.comparisons}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Swaps</span>
                <span className={`${isMobile ? 'text-sm' : 'text-xl'} font-bold text-[#FFFF00]`}>{stats.swaps}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Status</span>
                <span className={`stat-value ${isMobile ? 'text-[8px]' : 'text-[9px]'} mt-1 ${isSorting ? 'text-[#39ff14]' : 'text-zinc-500'}`}>
                  {isSorting ? (isPaused ? 'HALTED' : 'PARTITIONING') : 'IDLE'}
                </span>
              </div>
            </div>

            <div className={`calculation-panel ${isMobile ? 'p-3 py-4 min-h-[80px]' : ''}`}>
              <div className="text-[9px] text-zinc-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-3 bg-[#FFFF00]" /> PIVOT_LOGIC_PROBE
              </div>
              <div className={`flex items-center ${isMobile ? 'gap-3 justify-center' : 'gap-4'}`}>
                <div className="calc-unit">
                  <span className="text-[8px] opacity-40">ARR[J]</span>
                  <span className={isMobile ? 'text-lg font-bold' : 'text-xl font-bold'}>{calculation.left ?? '--'}</span>
                </div>
                <div className="text-xl font-light text-[#FFFF00] opacity-50">{calculation.condition || '...'}</div>
                <div className="calc-unit">
                  <span className="text-[8px] opacity-40">PIVOT</span>
                  <span className={isMobile ? 'text-lg font-bold' : 'text-xl font-bold'}>{calculation.right ?? '--'}</span>
                </div>
                <div className={`flex flex-col ml-auto ${isMobile ? 'min-w-[80px]' : 'min-w-[120px]'}`}>
                  <span className="text-[8px] opacity-40 uppercase">Outcome</span>
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-black ${calculation.left === null ? 'text-zinc-600' : (calculation.result ? 'text-[#00F5FF]' : 'text-zinc-500')}`}>
                      {calculation.left === null ? 'IDLE' : (calculation.result ? 'SWAP(I, J)' : 'SCAN_NEXT')}
                    </span>
                    {calculation.isSwapping && (
                      <div className={`${isMobile ? 'w-[60px]' : 'w-[80px]'} h-1 bg-white/5 rounded-full overflow-hidden`}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.8 / speed, ease: "linear" }}
                          className="h-full bg-[#FFFF00]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="code-sync-panel">
            <div className="text-[10px] text-zinc-500 mb-3 tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-2">
               <SkipForward size={10} /> LOGIC_TRACE
            </div>
            {QUICK_CODE.map((line) => (
              <div 
                key={line.id} 
                className={`sync-line ${currentLine === line.id ? 'active' : ''}`}
              >
                <span className="opacity-20 mr-4 text-[9px]">{line.id.toString().padStart(2, '0')}</span>
                {line.text}
              </div>
            ))}
          </div>

          <div className="kernel-log-panel flex-1">
            <div className="text-[10px] text-zinc-500 mb-3 tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-2">
               <span className="opacity-50">&gt;_</span> RUNTIME_KERNEL_LOG
            </div>
            <div className="log-scroll-area">
              {logs.map((log, i) => (
                <div key={i} className={`log-entry ${i === logs.length - 1 ? 'active' : ''}`}>
                  <span className="opacity-30 mr-2">&gt;</span> {log}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSortVisualizer;
