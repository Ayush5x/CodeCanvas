import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaMinus, FaRandom, FaEraser, FaPlay, FaPause, 
  FaStepForward, FaUndo, FaCode, FaMicrochip, FaArrowUp, FaArrowDown,
  FaSearchPlus, FaSearchMinus
} from 'react-icons/fa';
import { useIsMobile } from '../../../hooks/use-mobile';

import './HeapVisualizer.css';
import { 
  calculateHeapLayout, 
  getHeapEdges, 
  insertGenerator, 
  extractGenerator,
  INSERT_CODE,
  EXTRACT_CODE
} from './heapLogic';

const HeapVisualizer = () => {
  const isMobile = useIsMobile();
  // Heap state (Array-based: [null, val1, val2, ...])
  const [heap, setHeap] = useState([null]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isMaxHeap, setIsMaxHeap] = useState(true);
  
  // Interaction state
  const [inputValue, setInputValue] = useState('');
  const [currentMode, setCurrentMode] = useState('INSERT'); 
  const [speed, setSpeed] = useState(1);
  const [randomNodeCount, setRandomNodeCount] = useState(15);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  // Execution state
  const [activeLine, setActiveLine] = useState(null);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [compareNodeId, setCompareNodeId] = useState(null);
  const [currentCalc, setCurrentCalc] = useState('SYSTEM_IDLE');
  const [statusMessage, setStatusMessage] = useState({ text: '', type: 'info' });
  const [zoom, setZoom] = useState(1);
  
  const generatorRef = useRef(null);
  const timerRef = useRef(null);
  const isAutoProcessing = useRef(false);
  const isPausedRef = useRef(true);
  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);


  // Sync visualization with heap state
  useEffect(() => {
    const xSpace = isMobile ? 200 : 450;
    const ySpace = isMobile ? 100 : 120;
    const layoutNodes = calculateHeapLayout(heap, xSpace, ySpace);
    const layoutEdges = getHeapEdges(heap, xSpace, ySpace);
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [heap, isMobile]);

  const resetExecutionState = () => {
    setActiveLine(null);
    setActiveNodeId(null);
    setCompareNodeId(null);
    setIsExecuting(false);
    setIsPaused(true);
    isPausedRef.current = true;
    setCurrentCalc('SYSTEM_IDLE');
    setStatusMessage({ text: '', type: 'info' });
    if (timerRef.current) clearTimeout(timerRef.current);
    generatorRef.current = null;
  };

  const handleStart = async (mode) => {
    if (isExecuting) resetExecutionState();
    
    let generator;
    if (mode === 'INSERT') {
      const val = parseInt(inputValue);
      if (isNaN(val)) return;
      generator = insertGenerator(heap, val, isMaxHeap);
    } else {
      if (heap.length <= 1) {
        setStatusMessage({ text: 'ERROR: HEAP_UNDERFLOW', type: 'error' });
        return;
      }
      generator = extractGenerator(heap, isMaxHeap);
    }

    setCurrentMode(mode);
    setIsExecuting(true);
    setIsPaused(false);
    isPausedRef.current = false;
    generatorRef.current = generator;
    showStatus(`EXECUTING_${mode}...`, 'info');
  };

  const showStatus = (text, type = 'info') => {
    setStatusMessage({ text, type });
  };

  const runStep = useCallback(async () => {
    if (!generatorRef.current) return;

    const { value, done } = await generatorRef.current.next();

    if (done) {
      setHeap(value || heap);
      showStatus(`${currentMode}_COMPLETE`, 'success');
      setIsExecuting(false);
      setIsPaused(true);
      return;
    }

    setActiveLine(value.line);
    setActiveNodeId(value.nodeId);
    setCompareNodeId(value.parentId || value.leftId || value.rightId || value.swapId);
    if (value.heap) setHeap(value.heap);
    if (value.msg) setCurrentCalc(value.msg);

    if (!isPaused && !isAutoProcessing.current) {
      timerRef.current = setTimeout(runStep, 1000 / speed);
    }
  }, [heap, currentMode, speed, isPaused]);

  useEffect(() => {
    if (!isPaused && isExecuting && !isAutoProcessing.current) {
      timerRef.current = setTimeout(runStep, 1000 / speed);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPaused, isExecuting, runStep, speed]);

  const runGeneratorToCompletion = async (gen) => {
    let lastValue = null;
    while (true) {
      while (isPausedRef.current) {
        await new Promise(r => setTimeout(r, 100));
      }
      const { value, done } = await gen.next();
      if (done) return value || lastValue;
      
      setActiveLine(value.line);
      setActiveNodeId(value.nodeId);
      setCompareNodeId(value.parentId || value.leftId || value.rightId || value.swapId);
      if (value.heap) setHeap(value.heap);
      if (value.msg) setCurrentCalc(value.msg);
      
      lastValue = value;
      await new Promise(r => setTimeout(r, 1000 / speedRef.current));
    }
  };


  const handleRandomize = async () => {
    if (isExecuting) return;
    isAutoProcessing.current = true;
    resetExecutionState();
    
    setHeap([null]);
    
    const valueSet = new Set();
    while (valueSet.size < randomNodeCount) {
      valueSet.add(Math.floor(Math.random() * 150) + 10);
    }
    const values = Array.from(valueSet);
    
    let currentHeap = [null];
    for (const val of values) {
      setCurrentMode('INSERT');
      setInputValue(val.toString());
      setIsExecuting(true);
      setIsPaused(false);
      isPausedRef.current = false;
      
      const gen = insertGenerator(currentHeap, val, isMaxHeap);
      currentHeap = await runGeneratorToCompletion(gen);
      setHeap([...currentHeap]);
      
      await new Promise(r => setTimeout(r, 600));
    }
    
    setIsExecuting(false);
    isAutoProcessing.current = false;
    setInputValue('');
  };

  const handleWipe = () => {
    resetExecutionState();
    setHeap([null]);
    showStatus('HEAP_WIPED', 'info');
  };

  const togglePause = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    isPausedRef.current = nextPaused;
  };

  const handleZoom = (factor) => {
    setZoom(prev => Math.min(2, Math.max(0.5, prev * factor)));
  };

  const getViewBox = () => {
    if (isMobile) {
      const baseW = 600 / zoom;
      const baseH = 1000 / zoom;
      const x = 1000 - baseW / 2;
      return `${x} 0 ${baseW} ${baseH}`;
    }
    const baseW = 2000 / zoom;
    const baseH = 1200 / zoom;
    const x = 1000 - baseW / 2;
    return `${x} 0 ${baseW} ${baseH}`;
  };

  const getCodeSnippet = () => {
    return currentMode === 'INSERT' ? INSERT_CODE : EXTRACT_CODE;
  };

  return (
    <div className={`heap-visualizer-container ${isMobile ? 'mobile-view' : ''}`}>
      <div className={`heap-header flex flex-col ${isMobile ? 'gap-6 p-4 items-center text-center' : 'gap-6 p-6'} !max-h-none`}>
        <div className={`flex ${isMobile ? 'flex-col gap-6' : 'justify-between items-center'} w-full`}>
          <h1 className={`${isMobile ? 'text-2xl justify-center flex-wrap' : 'text-3xl'} font-black tracking-tighter text-white flex items-center gap-3`}>
            <span className="text-[#00f3ff] bg-[#00f3ff]/10 px-2 py-1 rounded">HEAP</span> 
            SYNC_LAB<span className="text-[10px] font-mono text-zinc-500 ml-2 tracking-[0.3em] hidden sm:inline">V2.0</span>
          </h1>
          
          <div className={`flex ${isMobile ? 'flex-col w-full gap-4' : 'gap-4'} items-center`}>
            <div className={`control-group ${isMobile ? 'w-full justify-between px-4' : ''}`}>
              <span className="control-label">Type:</span>
              <div className="flex gap-2">
                <button 
                  className={`bst-btn ${isMaxHeap ? 'primary' : ''} ${isMobile ? 'flex-1' : ''}`} 
                  onClick={() => { setIsMaxHeap(true); handleWipe(); }}
                  disabled={isExecuting}
                >
                  <FaArrowUp size={10} /> MAX
                </button>
                <button 
                  className={`bst-btn ${!isMaxHeap ? 'primary' : ''} ${isMobile ? 'flex-1' : ''}`} 
                  onClick={() => { setIsMaxHeap(false); handleWipe(); }}
                  disabled={isExecuting}
                >
                  <FaArrowDown size={10} /> MIN
                </button>
              </div>
            </div>

            <div className={`control-group ${isMobile ? 'w-full justify-between px-4' : ''}`}>
              <span className="control-label">Nodes:</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  className="bst-input w-16 text-center" 
                  min="1" 
                  max="31"
                  value={randomNodeCount}
                  onChange={(e) => setRandomNodeCount(Math.min(31, Math.max(1, parseInt(e.target.value) || 1)))}
                />
                <button className="bst-btn" onClick={handleRandomize} disabled={isExecuting}>
                  <FaRandom size={12} /> Random
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`flex ${isMobile ? 'flex-col gap-6' : 'justify-between items-center'} w-full pt-4 border-t border-white/5`}>
          <div className={`flex ${isMobile ? 'flex-col w-full' : 'gap-4'}`}>
            <div className={`control-group ${isMobile ? 'w-full flex-col p-4 items-stretch' : ''}`}>
              <div className="flex justify-between items-center mb-2 sm:mb-0">
                <span className="control-label">Target:</span>
                {isMobile && <span className="text-[10px] text-zinc-500 font-mono">VAL_INPUT</span>}
              </div>
              <div className={`flex ${isMobile ? 'flex-col' : ''} gap-2`}>
                <input 
                  type="number" 
                  className={`bst-input ${isMobile ? 'w-full mb-2' : 'w-24'} text-lg font-bold text-center text-[#00f3ff]`} 
                  placeholder="Val"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="flex gap-2">
                  <button className="bst-btn primary flex-1" onClick={() => handleStart('INSERT')} disabled={isExecuting}><FaPlus /> Insert</button>
                  <button className="bst-btn primary flex-1" onClick={() => handleStart('EXTRACT')} disabled={isExecuting}><FaMinus /> Extract</button>
                </div>
              </div>
            </div>
          </div>

          <div className={`flex ${isMobile ? 'flex-col w-full gap-4' : 'gap-4'} items-center`}>
            <div className={`control-group ${isMobile ? 'w-full flex-col p-4 items-stretch' : ''}`}>
              <div className={`flex items-center gap-3 ${isMobile ? 'w-full justify-between mb-4' : 'mr-4'}`}>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Speed</span>
                <input type="range" className={`bst-slider ${isMobile ? 'flex-1 mx-4' : 'w-32'}`} min="0.5" max="5" step="0.5" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} />
                <span className="text-xs font-mono text-[#00f3ff] w-8">{speed}x</span>
              </div>
              
              <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
                <button className={`bst-btn ${isMobile ? 'flex-1' : ''}`} onClick={resetExecutionState}><FaUndo size={12} /></button>
                <button className={`bst-btn primary ${isMobile ? 'flex-[2]' : 'px-6'}`} onClick={togglePause} disabled={!isExecuting}>
                  {isPaused ? <FaPlay size={12} /> : <FaPause size={12} />} {isPaused ? "RESUME" : "PAUSE"}
                </button>
                <button className={`bst-btn ${isMobile ? 'flex-1' : ''}`} onClick={() => runStep()} disabled={!isExecuting || !isPaused}><FaStepForward size={12} /></button>
              </div>

              <div className={`flex gap-2 ${isMobile ? 'w-full mt-2' : 'ml-4 border-l border-white/10 pl-4'}`}>
                <button className="bst-btn" onClick={() => handleZoom(1.2)} title="Zoom In">
                  <FaSearchPlus size={12} />
                </button>
                <button className="bst-btn" onClick={() => handleZoom(0.8)} title="Zoom Out">
                  <FaSearchMinus size={12} />
                </button>
                <button className="bst-btn" onClick={() => setZoom(1)} title="Reset Zoom">
                  <span className="text-[10px] font-bold">1x</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`heap-main flex ${isMobile ? 'flex-col px-2' : 'gap-6 px-6'} pb-6`}>
        <div className={`heap-viz-panel flex-1 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden ${isMobile ? 'min-h-[400px] h-[50vh]' : 'min-h-[700px]'}`}>
          <div className="canvas-grid" />
          <svg className="w-full h-full" viewBox={getViewBox()}>

            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Edges */}
            {edges.map(edge => (
              <motion.line
                key={edge.id}
                x1={edge.from.x} y1={edge.from.y}
                x2={edge.to.x} y2={edge.to.y}
                stroke="rgba(0, 243, 255, 0.2)"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            ))}

            {/* Nodes */}
            <AnimatePresence>
              {nodes.map(node => (
                <motion.g
                  key={node.id}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, x: node.x, y: node.y }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <circle 
                    r="40" 
                    className={`heap-node-circle ${
                      activeNodeId === node.id ? 'active' : 
                      compareNodeId === node.id ? 'comparing' : ''
                    }`}
                  />
                  <text className="heap-node-text">{node.val}</text>
                  <text y="60" className="heap-idx-text">idx: {node.index}</text>
                </motion.g>
              ))}
            </AnimatePresence>
          </svg>
        </div>

        <div className={`heap-side-panel ${isMobile ? 'w-full' : 'w-[400px]'} flex flex-col gap-6`}>
          <div className="bst-code-viewer">
            <div className="code-viewer-header">
              <FaCode className="text-[#00f3ff]" />
              <span>HEAP_ALGO_SYNC</span>
              <div className="status-dot" />
            </div>
            <div className="code-viewer-body">
              {getCodeSnippet().map((line) => (
                <div key={line.line} className={`code-line ${activeLine === line.line ? 'active' : ''}`}>
                  <span className="line-num">{line.line}</span>
                  <span className="line-txt whitespace-pre">{line.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bst-telemetry-panel">
            <div className="telemetry-header">CALCULATION_TRACE</div>
            <div className="p-3 bg-black/40 rounded border border-white/5 min-h-[80px] flex items-center justify-center">
              <span className="text-xs font-mono text-[#00f3ff] text-center animate-pulse">
                {`> ${currentCalc}`}
              </span>
            </div>
            
            <div className="telemetry-header mt-4">SYSTEM_TELEMETRY</div>
            <div className="telemetry-content">
              <div className="telemetry-item">
                <span className="label">HEAP_TYPE</span>
                <span className="value text-[#00f3ff]">{isMaxHeap ? 'MAX' : 'MIN'}</span>
              </div>
              <div className="telemetry-item">
                <span className="label">SIZE</span>
                <span className="value">{heap.length - 1}</span>
              </div>
              <div className={`status-badge mt-4 ${isExecuting ? 'running' : 'idle'}`}>
                {isExecuting ? (isPaused ? 'PAUSED' : 'EXECUTING') : 'READY'}
              </div>
              {statusMessage.text && (
                <div className={`mt-3 p-2 rounded text-[10px] font-mono text-center border ${
                  statusMessage.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 
                  statusMessage.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 
                  'bg-blue-500/10 border-blue-500/50 text-[#00f3ff]'
                }`}>
                  {statusMessage.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeapVisualizer;
