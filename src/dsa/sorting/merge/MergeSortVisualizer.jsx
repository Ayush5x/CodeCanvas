import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Dices, SkipForward, Layers } from 'lucide-react';
import { useIsMobile } from '../../../hooks/use-mobile';
import './MergeSortVisualizer.css';

const MERGE_CODE = [
  { id: 1, text: "mergeSort(arr, start, end) {" },
  { id: 2, text: "  if (start >= end) return;" },
  { id: 3, text: "  let mid = (start + end) >> 1;" },
  { id: 4, text: "  await mergeSort(arr, start, mid);" },
  { id: 5, text: "  await mergeSort(arr, mid + 1, end);" },
  { id: 6, text: "  await merge(arr, start, mid, end);" },
  { id: 7, text: "}" },
  { id: 8, text: "// --- Merge Kernel ---" },
  { id: 9, text: "merge(arr, start, mid, end) {" },
  { id: 10, text: "  let L = arr.slice(start, mid + 1);" },
  { id: 11, text: "  let R = arr.slice(mid + 1, end + 1);" },
  { id: 12, text: "  while (i < n1 && j < n2) {" },
  { id: 13, text: "    if (L[i] <= R[j]) arr[k++] = L[i++];" },
  { id: 14, text: "    else arr[k++] = R[j++];" },
  { id: 15, text: "  }" },
  { id: 16, text: "}" }
];

const MergeSortVisualizer = () => {
  const isMobile = useIsMobile();
  const [array, setArray] = useState([45, 20, 60, 15, 80, 35, 90, 5, 50]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentLine, setCurrentLine] = useState(null);
  const [activeBounds, setActiveBounds] = useState({ start: 0, end: 8 });
  const [comparingIndices, setComparingIndices] = useState([]);
  const [liftingIndices, setLiftingIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [treeDepth, setTreeDepth] = useState(0);
  const [stats, setStats] = useState({ comparisons: 0, merges: 0 });
  const [logs, setLogs] = useState(["SYSTEM_IDLE"]);
  const [calculation, setCalculation] = useState({ left: null, right: null, condition: "", result: null, isMoving: false });

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
    addLog("RANDOM_DATASET_GENERATED");
  };

  const resetStates = () => {
    setComparingIndices([]);
    setLiftingIndices([]);
    setSortedIndices([]);
    setTreeDepth(0);
    setActiveBounds({ start: 0, end: 8 });
    setStats({ comparisons: 0, merges: 0 });
    setLogs(["STAGING_AREA_CLEARED", "SYSTEM_IDLE"]);
    setCurrentLine(null);
    setCalculation({ left: null, right: null, condition: "", result: null, isMoving: false });
    setIsSorting(false);
    setIsPaused(false);
    sortingRef.current = false;
    pauseRef.current = false;
  };

  const merge = async (arr, start, mid, end, depth) => {
    if (!sortingRef.current) return;
    setCurrentLine(9);
    addLog(`MERGE_PHASE: [${start}...${end}]`);
    
    let leftArr = arr.slice(start, mid + 1);
    let rightArr = arr.slice(mid + 1, end + 1);
    
    setCurrentLine(10);
    await wait(400);
    setCurrentLine(11);
    await wait(300);

    // Lifting Animation
    setLiftingIndices(Array.from({ length: end - start + 1 }, (_, i) => start + i));
    addLog("AUXILIARY_BUFFER_LIFTED");
    await wait(600);

    let i = 0, j = 0, k = start;
    
    setCurrentLine(12);
    while (i < leftArr.length && j < rightArr.length) {
      if (!sortingRef.current) return;
      
      // Highlight comparison
      setComparingIndices([start + i, mid + 1 + j]);
      setStats(s => ({ ...s, comparisons: s.comparisons + 1 }));
      setCalculation({ 
        left: leftArr[i], 
        right: rightArr[j], 
        condition: "<=", 
        result: leftArr[i] <= rightArr[j],
        isMoving: false
      });
      setCurrentLine(13);
      await wait(600);

      if (leftArr[i] <= rightArr[j]) {
        addLog(`PULL_LEFT: ${leftArr[i]} → index ${k}`);
        setCalculation(prev => ({ ...prev, isMoving: true }));
        await wait(400);
        arr[k] = leftArr[i];
        i++;
      } else {
        setCurrentLine(14);
        addLog(`PULL_RIGHT: ${rightArr[j]} → index ${k}`);
        setCalculation(prev => ({ ...prev, isMoving: true }));
        await wait(400);
        arr[k] = rightArr[j];
        j++;
      }
      
      setArray([...arr]);
      k++;
      setComparingIndices([]);
      setCalculation({ left: null, right: null, condition: "", result: null, isMoving: false });
      await wait(400);
    }

    setCurrentLine(15);
    while (i < leftArr.length) {
      if (!sortingRef.current) return;
      addLog(`REMAINING_L: ${leftArr[i]} → index ${k}`);
      arr[k] = leftArr[i];
      setArray([...arr]);
      i++; k++;
      await wait(300);
    }
    while (j < rightArr.length) {
      if (!sortingRef.current) return;
      addLog(`REMAINING_R: ${rightArr[j]} → index ${k}`);
      arr[k] = rightArr[j];
      setArray([...arr]);
      j++; k++;
      await wait(300);
    }

    setLiftingIndices([]);
    setStats(s => ({ ...s, merges: s.merges + 1 }));
    addLog(`MERGE_COMPLETE: [${start}...${end}]`);
    
    // If it's the top level merge, mark as sorted
    if (start === 0 && end === arr.length - 1) {
      setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    }
    await wait(600);
  };

  const mergeSort = async (arr, start, end, depth) => {
    if (!sortingRef.current || start >= end) return;
    
    setTreeDepth(depth);
    setActiveBounds({ start, end });
    addLog(`DIVIDE: [${start}...${end}] Depth: ${depth}`);
    setCurrentLine(1);
    await wait(400);

    setCurrentLine(2);
    await wait(200);

    let mid = (start + end) >> 1;
    setCurrentLine(3);
    await wait(300);

    setCurrentLine(4);
    await mergeSort(arr, start, mid, depth + 1);
    
    // Restore bounds for this level
    if (!sortingRef.current) return;
    setActiveBounds({ start, end });
    setTreeDepth(depth);
    
    setCurrentLine(5);
    await mergeSort(arr, mid + 1, end, depth + 1);

    if (!sortingRef.current) return;
    setActiveBounds({ start, end });
    setTreeDepth(depth);
    
    setCurrentLine(6);
    await merge(arr, start, mid, end, depth);
  };

  const startSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    sortingRef.current = true;
    pauseRef.current = false;
    
    let arr = [...array];
    await mergeSort(arr, 0, arr.length - 1, 0);

    if (sortingRef.current) {
      setIsSorting(false);
      sortingRef.current = false;
      addLog("STATUS: SUCCESSFUL_COMPLETION");
      setCurrentLine(null);
      setActiveBounds({ start: 0, end: 8 });
      setTreeDepth(0);
    }
  };

  const togglePause = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(pauseRef.current);
    addLog(pauseRef.current ? "HALT_COMMAND_ISSUED" : "RESUMING_OPERATIONS");
  };

  return (
    <div className={`merge-visualizer-container ${isMobile ? 'mobile-view' : ''}`}>
      <div className={`visualizer-header ${isMobile ? 'flex-col gap-6 items-center text-center' : ''}`}>
        <div className="flex flex-col gap-1">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-black text-white flex items-center gap-2`}>
            <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse" />
            MERGE_SORT <span className="text-[#FFD700]/50 font-light">RECURSIVE_KERNEL</span>
          </h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Divide & Conquer Memory Sync</p>
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
              <span className="text-[10px] font-mono text-[#FFD700]">{speed}x</span>
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
            <div className="depth-indicator">
              <Layers size={10} className="inline mr-2" /> RECURSION_DEPTH: {treeDepth}
            </div>
            {array.map((val, idx) => {
              const isInactive = idx < activeBounds.start || idx > activeBounds.end;
              const isComparing = comparingIndices.includes(idx);
              const isLifting = liftingIndices.includes(idx);
              const isSorted = sortedIndices.includes(idx);
              
              let barState = "";
              if (isLifting) barState = "bar-lifting";
              if (isComparing) barState = "bar-comparing";
              if (isSorted) barState = "bar-sorted";
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
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className={`stats-row bg-black/20 ${isMobile ? 'p-3' : 'p-4'} rounded-xl border border-white/5`}>
              <div className="stat-item">
                <span className="stat-label">Comparisons</span>
                <span className={`${isMobile ? 'text-sm' : 'text-xl'} font-bold text-[#FFD700]`}>{stats.comparisons}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Merge Ops</span>
                <span className={`${isMobile ? 'text-sm' : 'text-xl'} font-bold text-[#FF007F]`}>{stats.merges}</span>
              </div>
            </div>

            <div className={`calculation-panel ${isMobile ? 'p-3 py-4 min-h-[80px]' : ''}`}>
              <div className="text-[9px] text-zinc-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-3 bg-[#FF007F]" /> MERGE_KERNEL_PROBE
              </div>
              <div className={`flex items-center ${isMobile ? 'gap-3 justify-center' : 'gap-4'}`}>
                <div className="calc-unit">
                  <span className="text-[8px] opacity-40">L</span>
                  <span className={isMobile ? 'text-lg font-bold' : 'text-xl font-bold'}>{calculation.left ?? '--'}</span>
                </div>
                <div className="text-xl font-light text-[#FF007F] opacity-50">{calculation.condition || '...'}</div>
                <div className="calc-unit">
                  <span className="text-[8px] opacity-40">R</span>
                  <span className={isMobile ? 'text-lg font-bold' : 'text-xl font-bold'}>{calculation.right ?? '--'}</span>
                </div>
                <div className={`flex flex-col ml-auto ${isMobile ? 'min-w-[80px]' : 'min-w-[120px]'}`}>
                  <span className="text-[8px] opacity-40 uppercase">Result</span>
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-black ${calculation.left === null ? 'text-zinc-600' : (calculation.result ? 'text-[#FFD700]' : 'text-[#FF007F]')}`}>
                      {calculation.left === null ? 'IDLE' : (calculation.result ? 'PULL_LEFT' : 'PULL_RIGHT')}
                    </span>
                    {calculation.isMoving && (
                      <div className={`${isMobile ? 'w-[60px]' : 'w-[80px]'} h-1 bg-white/5 rounded-full overflow-hidden`}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.8 / speed, ease: "linear" }}
                          className="h-full bg-[#FFD700]"
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
            {MERGE_CODE.map((line) => (
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

export default MergeSortVisualizer;
