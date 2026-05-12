import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Dices, SkipForward, Network } from 'lucide-react';
import { useIsMobile } from '../../../hooks/use-mobile';
import './HeapSortVisualizer.css';

const HEAP_CODE = [
  { id: 1, text: "heapSort(arr) {" },
  { id: 2, text: "  buildMaxHeap(arr);" },
  { id: 3, text: "  for (let i = n - 1; i > 0; i--) {" },
  { id: 4, text: "    swap(arr[0], arr[i]);" },
  { id: 5, text: "    heapify(arr, i, 0);" },
  { id: 6, text: "  }" },
  { id: 7, text: "}" },
  { id: 8, text: "heapify(arr, n, i) {" },
  { id: 9, text: "  let largest = i;" },
  { id: 10, text: "  if (L < n && arr[L] > arr[largest])" },
  { id: 11, text: "    largest = L;" },
  { id: 12, text: "  if (R < n && arr[R] > arr[largest])" },
  { id: 13, text: "    largest = R;" },
  { id: 14, text: "  if (largest != i) {" },
  { id: 15, text: "    swap(arr[i], arr[largest]);" },
  { id: 16, text: "    heapify(arr, n, largest);" },
  { id: 17, text: "  }" },
  { id: 18, text: "}" }
];

const HeapSortVisualizer = () => {
  const isMobile = useIsMobile();
  const [array, setArray] = useState([45, 20, 60, 15, 80, 35, 90, 5, 50, 70]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentLine, setCurrentLine] = useState(null);
  
  // Tracking states
  const [heapSize, setHeapSize] = useState(10);
  const [activeNodes, setActiveNodes] = useState([]);
  const [largestNode, setLargestNode] = useState(null);
  const [lockedIndices, setLockedIndices] = useState([]);
  const [swappingNodes, setSwappingNodes] = useState([]);
  const [violatedEdge, setViolatedEdge] = useState(null); // {parent, child}
  
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [logs, setLogs] = useState(["SYSTEM_IDLE"]);
  const [calculation, setCalculation] = useState({ left: null, right: null, condition: "", result: null });

  const sortingRef = useRef(false);
  const pauseRef = useRef(false);
  const speedRef = useRef(1);
  const codePanelRef = useRef(null);
  const lineRefs = useRef({});
  const logEndRef = useRef(null);

  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => {
    if (logEndRef.current && !isMobile) {
      logEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [logs, isMobile]);

  useEffect(() => {
    if (currentLine && lineRefs.current[currentLine] && codePanelRef.current) {
      const panel = codePanelRef.current;
      const line = lineRefs.current[currentLine];
      const offsetTop = line.offsetTop;
      const panelHeight = panel.clientHeight;
      const lineHeight = line.clientHeight;
      
      panel.scrollTo({
        top: offsetTop - panelHeight / 2 + lineHeight / 2,
        behavior: 'smooth'
      });
    }
  }, [currentLine]);

  const addLog = (msg) => setLogs(prev => [...prev, msg]);

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

  const resetStates = () => {
    setHeapSize(10);
    setActiveNodes([]);
    setLargestNode(null);
    setLockedIndices([]);
    setSwappingNodes([]);
    setViolatedEdge(null);
    setStats({ comparisons: 0, swaps: 0 });
    setLogs(["STAGING_AREA_CLEARED", "SYSTEM_IDLE"]);
    setCurrentLine(null);
    setIsSorting(false);
    setIsPaused(false);
    sortingRef.current = false;
    pauseRef.current = false;
  };

  const generateRandom = () => {
    if (isSorting) return;
    const newArr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArr);
    resetStates();
    addLog("RANDOM_DATASET_LOADED");
  };

  // Node Positions Calculation
  const nodePositions = useMemo(() => {
    const positions = [];
    const verticalGap = isMobile ? 65 : 100;
    const canvasWidth = isMobile ? 360 : 900; 
    
    for (let i = 0; i < 10; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const posInLevel = i - (Math.pow(2, level) - 1);
      const nodesInLevel = Math.pow(2, level);
      const horizontalGap = canvasWidth / (nodesInLevel + 1);
      
      positions.push({
        x: horizontalGap * (posInLevel + 1),
        y: (isMobile ? 40 : 60) + level * verticalGap
      });
    }
    return positions;
  }, [isMobile]);

  const heapify = async (arr, n, i) => {
    if (!sortingRef.current) return;
    
    setCurrentLine(8);
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    
    setActiveNodes([i, l, r].filter(idx => idx < n));
    setLargestNode(i);
    setCurrentLine(9);
    await wait(400);

    // Compare Left
    if (l < n) {
      setStats(s => ({ ...s, comparisons: s.comparisons + 1 }));
      setCalculation({ left: arr[l], right: arr[largest], condition: ">", result: arr[l] > arr[largest] });
      setCurrentLine(10);
      await wait(600);
      
      if (arr[l] > arr[largest]) {
        largest = l;
        setLargestNode(l);
        setCurrentLine(11);
        addLog(`NEW_LARGEST: ${arr[l]} at index ${l}`);
        await wait(400);
      }
    }

    // Compare Right
    if (r < n) {
      setStats(s => ({ ...s, comparisons: s.comparisons + 1 }));
      setCalculation({ left: arr[r], right: arr[largest], condition: ">", result: arr[r] > arr[largest] });
      setCurrentLine(12);
      await wait(600);

      if (arr[r] > arr[largest]) {
        largest = r;
        setLargestNode(r);
        setCurrentLine(13);
        addLog(`NEW_LARGEST: ${arr[r]} at index ${r}`);
        await wait(400);
      }
    }

    setCurrentLine(14);
    if (largest !== i) {
      // Violation detected
      setViolatedEdge({ parent: i, child: largest });
      addLog(`VIOLATION: Node ${i} < Node ${largest}`);
      await wait(500);
      
      setSwappingNodes([i, largest]);
      setCurrentLine(15);
      addLog(`SWAP: ${arr[i]} ↔ ${arr[largest]}`);
      await wait(400);

      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      setStats(s => ({ ...s, swaps: s.swaps + 1 }));
      await wait(800);
      
      setSwappingNodes([]);
      setViolatedEdge(null);
      setCurrentLine(16);
      await heapify(arr, n, largest);
    }
    
    setActiveNodes([]);
    setLargestNode(null);
    setCurrentLine(17);
    await wait(200);
  };

  const startSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    sortingRef.current = true;
    pauseRef.current = false;
    addLog("EXEC_START: HEAP_SORT_ASC");

    let arr = [...array];
    let n = arr.length;

    // Build Max Heap
    addLog("PHASE: BUILDING_MAX_HEAP");
    setCurrentLine(2);
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      if (!sortingRef.current) return;
      setCurrentLine(3);
      await heapify(arr, n, i);
    }

    // Extract Max
    addLog("PHASE: EXTRACTING_MAX_ELEMENTS");
    for (let i = n - 1; i > 0; i--) {
      if (!sortingRef.current) return;
      setCurrentLine(3);
      setHeapSize(i + 1);
      
      addLog(`EXTRACT_MAX: ${arr[0]} at Root`);
      setSwappingNodes([0, i]);
      setLargestNode(0); // Gold highlight for max being extracted
      setCurrentLine(4);
      await wait(600);

      [arr[0], arr[i]] = [arr[i], arr[0]];
      setArray([...arr]);
      setStats(s => ({ ...s, swaps: s.swaps + 1 }));
      setLockedIndices(prev => [...prev, i]);
      setHeapSize(i);
      addLog(`INDEX_LOCKED: ${i}`);
      await wait(800);
      
      setSwappingNodes([]);
      setLargestNode(null);
      
      setCurrentLine(5);
      await heapify(arr, i, 0);
    }
    
    setLockedIndices(prev => [...prev, 0]);
    setHeapSize(0);
    addLog("STATUS: SUCCESSFUL_COMPLETION");
    setIsSorting(false);
    sortingRef.current = false;
    setCurrentLine(null);
  };

  const togglePause = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(pauseRef.current);
    addLog(pauseRef.current ? "HALT_COMMAND_ISSUED" : "RESUMING_OPERATIONS");
  };

  return (
    <div className={`heap-visualizer-container ${isMobile ? 'mobile-view' : ''}`}>
      <div className={`visualizer-header ${isMobile ? 'flex-col gap-6 items-center text-center' : ''}`}>
        <div className="flex flex-col gap-1">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-black text-white flex items-center gap-2`}>
            <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse" />
            HEAP_SORT <span className="text-[#FFD700]/50 font-light">DYNAMIC_TREE_SYNC</span>
          </h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Dual-View Memory Allocation</p>
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
            <button className={`control-btn primary ${isMobile ? 'w-full justify-center' : ''}`} onClick={isSorting ? togglePause : startSort}>
              {isSorting ? (isPaused ? <Play size={16} /> : <Pause size={16} />) : <Play size={16} />}
              {isSorting ? (isPaused ? "Resume" : "Pause") : "Execute Sort"}
            </button>
          </div>
        </div>
      </div>

      <div className={`stage-wrapper ${isMobile ? 'flex flex-col' : ''}`}>
        <div className={`tree-stage ${isMobile ? 'h-[300px]' : ''}`}>
          <svg className="tree-svg" viewBox={isMobile ? "0 0 360 300" : undefined}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Render Edges First */}
            {nodePositions.map((pos, i) => {
              const left = 2 * i + 1;
              const right = 2 * i + 2;
              return [left, right].map(childIdx => {
                if (childIdx < 10) {
                  const isViolation = violatedEdge?.parent === i && violatedEdge?.child === childIdx;
                  const isActive = activeNodes.includes(i) && activeNodes.includes(childIdx);
                  const isInHeap = i < heapSize && childIdx < heapSize;
                  
                  return (
                    <line 
                      key={`edge-${i}-${childIdx}`}
                      x1={pos.x} y1={pos.y}
                      x2={nodePositions[childIdx].x} y2={nodePositions[childIdx].y}
                      className={`edge-line ${isViolation ? 'edge-violation' : ''} ${isActive ? 'edge-active' : ''}`}
                      style={{ opacity: isInHeap ? 1 : 0.1 }}
                    />
                  );
                }
                return null;
              });
            })}

            {/* Render Nodes */}
            {array.map((val, idx) => {
              const pos = nodePositions[idx];
              const isActive = activeNodes.includes(idx);
              const isLargest = largestNode === idx;
              const isSwapping = swappingNodes.includes(idx);
              const isLocked = lockedIndices.includes(idx);
              const isInHeap = idx < heapSize;

              return (
                <motion.g 
                  key={`node-${idx}`}
                  className={`node-group ${isActive ? 'node-active' : ''} ${isLargest ? 'node-largest' : ''} ${isLocked ? 'node-locked' : ''}`}
                  initial={false}
                  animate={{ opacity: (isInHeap || isLocked) ? 1 : 0.1 }}
                >
                  <circle cx={pos.x} cy={pos.y} r={isMobile ? "12" : "18"} className="node-circle" />
                  <text x={pos.x} y={pos.y + (isMobile ? 4 : 5)} textAnchor="middle" className={`node-text ${isMobile ? 'text-[10px]' : ''}`}>{val}</text>
                  <text x={pos.x} y={pos.y - (isMobile ? 18 : 25)} textAnchor="middle" className="node-index">{idx}</text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        <div className={`array-stage ${isMobile ? 'p-4 min-h-[140px]' : ''}`}>
          {array.map((val, idx) => {
            const isActive = activeNodes.includes(idx);
            const isLargest = largestNode === idx;
            const isSwapping = swappingNodes.includes(idx);
            const isLocked = lockedIndices.includes(idx);
            
            let barState = "";
            if (isLocked) barState = "bar-locked";
            else if (isSwapping) barState = "bar-swapping";
            else if (isLargest) barState = "bar-pivot"; // Reuse Gold
            else if (isActive) barState = "bar-pointer-j"; // Reuse Blue

            return (
              <motion.div key={`${idx}-${val}`} layout className={`bar-wrapper ${barState}`}>
                <div className="glass-bar" style={{ height: `${val * (isMobile ? 1 : 1.5)}px` }} />
                <div className={`bar-value ${isMobile ? 'text-[8px] -top-5' : ''}`}>{val}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className={`telemetry-grid ${isMobile ? 'flex flex-col' : ''}`}>
        <div className={`code-sync-panel ${isMobile ? 'max-h-[200px]' : ''}`} ref={codePanelRef}>
          <div className="text-[10px] text-zinc-500 mb-3 tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-2">
             <SkipForward size={10} /> LOGIC_TRACE
          </div>
          <div className="relative">
            {HEAP_CODE.map(line => (
              <div 
                key={line.id} 
                ref={el => lineRefs.current[line.id] = el}
                className={`sync-line ${currentLine === line.id ? 'active' : ''}`}
              >
                <span className="opacity-20 mr-4 text-[9px]">{line.id.toString().padStart(2, '0')}</span>
                {line.text}
              </div>
            ))}
          </div>
          <AnimatePresence>
            {calculation.left !== null && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ minHeight: isMobile ? '40px' : '50px' }} className={`calculation-panel ${isMobile ? 'p-2 mt-4' : ''}`}>
                <div className={`flex items-center gap-4 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                  <span className="text-[#FFD700] font-bold">PROBE:</span>
                  <span>{calculation.left} {calculation.condition} {calculation.right}</span>
                  <span className={`ml-auto font-black ${calculation.result ? 'text-[#00F5FF]' : 'text-zinc-500'}`}>
                    {calculation.result ? 'VIOLATION' : 'VALID'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`kernel-log-panel ${isMobile ? 'max-h-[150px]' : ''}`}>
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
  );
};

export default HeapSortVisualizer;
