import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Dices, SkipForward } from 'lucide-react';
import { useIsMobile } from '../../../hooks/use-mobile';
import './BubbleSortVisualizer.css';

const BUBBLE_CODE = [
  { id: 1, text: "for (let i = 0; i < n; i++) {" },
  { id: 2, text: "  for (let j = 0; j < n - i - 1; j++) {" },
  { id: 3, text: "    // Highlight j, j+1 (Comparing)" },
  { id: 4, text: "    if (arr[j] > arr[j + 1]) {" },
  { id: 5, text: "      // Animate Swap" },
  { id: 6, text: "      [arr[j], arr[j+1]] = [arr[j+1], arr[j]];" },
  { id: 7, text: "    }" },
  { id: 8, text: "  }" },
  { id: 9, text: "  // Mark n-i-1 as Sorted" },
  { id: 10, text: "}" }
];

const BubbleSortVisualizer = () => {
  const isMobile = useIsMobile();
  const [array, setArray] = useState([45, 20, 60, 15, 80, 35, 90, 5, 50]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentLine, setCurrentLine] = useState(null);
  const [activeIndices, setActiveIndices] = useState([]); // [j, j+1]
  const [swappingIndices, setSwappingIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [markers, setMarkers] = useState({ i: null, j: null });
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [calculation, setCalculation] = useState({ left: null, right: null, condition: "", result: null, isSwapping: false });
  const [logs, setLogs] = useState(["SYSTEM_IDLE"]);

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

  const generateRandom = () => {
    if (isSorting) return;
    const newArr = Array.from({ length: 9 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArr);
    resetStates();
    addLog("RANDOM_DATASET_LOADED");
  };

  const resetStates = () => {
    setActiveIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
    setMarkers({ i: null, j: null });
    setStats({ comparisons: 0, swaps: 0 });
    setCalculation({ left: null, right: null, condition: "", result: null, isSwapping: false });
    setLogs(["STAGING_AREA_CLEARED", "SYSTEM_IDLE"]);
    setCurrentLine(null);
    setIsSorting(false);
    setIsPaused(false);
    sortingRef.current = false;
    pauseRef.current = false;
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

  const sort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    sortingRef.current = true;
    pauseRef.current = false;
    addLog("EXEC_START: BUBBLE_SORT_ASC");

    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n; i++) {
      setMarkers(prev => ({ ...prev, i }));
      setCurrentLine(1);
      await wait(400);

      for (let j = 0; j < n - i - 1; j++) {
        if (!sortingRef.current) return;
        setMarkers(prev => ({ ...prev, j }));
        setCurrentLine(2);
        
        // Comparison Step
        setActiveIndices([j, j + 1]);
        setCurrentLine(3);
        setStats(s => ({ ...s, comparisons: s.comparisons + 1 }));
        setCalculation({ 
          left: arr[j], 
          right: arr[j+1], 
          condition: ">", 
          result: arr[j] > arr[j+1],
          isSwapping: false
        });
        await wait(600);

        setCurrentLine(4);
        await wait(300);

        if (arr[j] > arr[j + 1]) {
          addLog(`SWAP_DETECTED: ${arr[j]} ↔ ${arr[j+1]}`);
          // Swap Step
          setSwappingIndices([j, j + 1]);
          setCalculation(prev => ({ ...prev, isSwapping: true }));
          setCurrentLine(5);
          await wait(400);

          setCurrentLine(6);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          setStats(s => ({ ...s, swaps: s.swaps + 1 }));
          await wait(800);
          setSwappingIndices([]);
        }
        
        setCurrentLine(7);
        setActiveIndices([]);
        setCalculation({ left: null, right: null, condition: "", result: null, isSwapping: false });
        await wait(200);
      }
      
      setCurrentLine(9);
      setSortedIndices(prev => [...prev, n - i - 1]);
      addLog(`INDEX_LOCKED: ${n-i-1}`);
      await wait(400);
    }

    setCurrentLine(10);
    setMarkers({ i: null, j: null });
    setIsSorting(false);
    sortingRef.current = false;
    addLog("STATUS: SUCCESSFUL_COMPLETION");
  };

  const stopSorting = () => {
    sortingRef.current = false;
    setIsSorting(false);
    setIsPaused(false);
    addLog("FORCE_HALT: KERNEL_STOPPED");
  };

  const togglePause = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(pauseRef.current);
    addLog(pauseRef.current ? "HALT_COMMAND_ISSUED" : "RESUMING_OPERATIONS");
  };

  return (
    <div className={`bubble-visualizer-container ${isMobile ? 'mobile-view' : ''}`}>
      <div className={`visualizer-header ${isMobile ? 'flex-col gap-6 items-center text-center' : ''}`}>
        <div className="flex flex-col gap-1">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-black text-white flex items-center gap-2`}>
            <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse" />
            BUBBLE_SORT <span className="text-[#FFD700]/50 font-light">KERNEL_V1</span>
          </h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Real-time Memory Allocation Sync</p>
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
              <button className={`control-btn primary ${isMobile ? 'w-full justify-center' : ''}`} onClick={sort}>
                <Play size={16} /> Execute Sort
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-3'} gap-8`}>
        <div className={isMobile ? '' : 'lg:col-span-2 relative'}>
          <div className={`sorting-stage ${isMobile ? 'min-h-[300px] py-8 px-2' : ''}`}>
            {array.map((val, idx) => {
              const isComparing = activeIndices.includes(idx);
              const isSwapping = swappingIndices.includes(idx);
              const isSorted = sortedIndices.includes(idx);
              
              let barState = "";
              if (isSwapping) barState = "bar-swapping";
              else if (isComparing) barState = "bar-comparing";
              else if (isSorted) barState = "bar-sorted";

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
                    <motion.div 
                      layoutId="marker-j"
                      className="marker marker-j"
                      style={isMobile ? { bottom: '-30px', fontSize: '8px', padding: '2px 4px' } : {}}
                    >
                      {isMobile ? 'J' : 'PTR_J'}
                    </motion.div>
                  )}
                  {markers.i === idx && (
                    <motion.div 
                      layoutId="marker-i"
                      className="marker marker-i"
                      style={isMobile ? { bottom: '-50px', fontSize: '8px', padding: '2px 4px' } : {}}
                    >
                      {isMobile ? 'I' : 'PTR_I'}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className={`stats-row ${isMobile ? 'mt-16 flex-wrap justify-center gap-4' : 'mt-12'}`}>
            <div className="stat-item">
              <span className="stat-label">Comparisons</span>
              <span className={`${isMobile ? 'text-sm' : 'text-xl'} font-bold`}>{stats.comparisons}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Swaps</span>
              <span className={`${isMobile ? 'text-sm' : 'text-xl'} font-bold text-[#FFD700]`}>{stats.swaps}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Status</span>
              <span className={`stat-value text-[10px] mt-1 ${isSorting ? 'text-[#39ff14]' : 'text-zinc-500'}`}>
                {isSorting ? (isPaused ? 'HALTED' : 'RUNNING') : 'IDLE'}
              </span>
            </div>
          </div>

          <div className={`calculation-panel ${isMobile ? 'mt-4 py-4' : 'mt-6'}`}>
            <div className="text-[10px] text-zinc-500 mb-3 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1 h-3 bg-[#FFD700]" /> ALGO_LOGIC_PROBE
            </div>
            <div className={`flex items-center ${isMobile ? 'gap-3 justify-center' : 'gap-6'}`}>
              <div className="calc-unit">
                <span className="text-[8px] opacity-40">J</span>
                <span className={isMobile ? 'text-lg font-bold' : 'text-xl font-bold'}>{calculation.left ?? '--'}</span>
              </div>
              <div className="text-lg font-light text-[#FFD700] opacity-50">{calculation.condition || '...'}</div>
              <div className="calc-unit">
                <span className="text-[8px] opacity-40">J+1</span>
                <span className={isMobile ? 'text-lg font-bold' : 'text-xl font-bold'}>{calculation.right ?? '--'}</span>
              </div>
              <div className="h-6 w-px bg-white/10 mx-1" />
              <div className={`flex flex-col ${isMobile ? 'min-w-[80px]' : 'min-w-[140px]'}`}>
                <span className="text-[8px] opacity-40 uppercase tracking-tighter">Result</span>
                <div className="flex flex-col gap-1">
                  <span className={`text-[10px] font-black whitespace-nowrap ${calculation.left === null ? 'text-zinc-600' : (calculation.result ? 'text-[#FFD700]' : 'text-zinc-500')}`}>
                    {calculation.left === null ? 'IDLE' : (calculation.result ? 'TRUE (SWAP)' : 'FALSE')}
                  </span>
                  {calculation.isSwapping && (
                    <div className={`${isMobile ? 'w-[60px]' : 'w-[105px]'} h-1 bg-white/5 rounded-full overflow-hidden`}>
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

        <div className="flex flex-col gap-8 h-full">
          <div className="code-sync-panel">
            <div className="text-[10px] text-zinc-500 mb-4 tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-2">
               <SkipForward size={10} /> LOGIC_TRACE
            </div>
            {BUBBLE_CODE.map((line) => (
              <div 
                key={line.id} 
                className={`sync-line ${currentLine === line.id ? 'active' : ''}`}
              >
                <span className="opacity-20 mr-4 text-[10px]">{line.id.toString().padStart(2, '0')}</span>
                {line.text}
              </div>
            ))}
          </div>

          <div className="kernel-log-panel flex-1">
            <div className="text-[10px] text-zinc-500 mb-4 tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-2">
               <div className="flex items-center gap-2">
                 <span className="opacity-50">&gt;_</span> RUNTIME_KERNEL_LOG
               </div>
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

export default BubbleSortVisualizer;
