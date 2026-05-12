import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaSearch, FaTrash, FaPlay, FaPause, 
  FaStepForward, FaUndo, FaCode, FaMicrochip, FaRandom, FaEraser, FaSyncAlt,
  FaSearchPlus, FaSearchMinus
} from 'react-icons/fa';
import { useIsMobile } from '../../../hooks/use-mobile';

import './AvlVisualizer.css';
import { 
  calculateLayout, 
  getEdges, 
  insertGenerator, 
  searchGenerator,
  deleteGenerator,
  INSERT_CODE,
  SEARCH_CODE,
  DELETE_CODE
} from './avlLogic';



const AvlVisualizer = () => {
  const isMobile = useIsMobile();
  // Tree state
  const [root, setRoot] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  // Interaction state
  const [inputValue, setInputValue] = useState('');
  const [currentMode, setCurrentMode] = useState('INSERT'); 
  const [speed, setSpeed] = useState(1);
  const [randomNodeCount, setRandomNodeCount] = useState(10);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  // Execution state
  const [activeLine, setActiveLine] = useState(null);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [traversedNodes, setTraversedNodes] = useState([]);
  const [currentCalc, setCurrentCalc] = useState('SYSTEM_IDLE');
  const [statusMessage, setStatusMessage] = useState({ text: '', type: 'info' });
  const [zoom, setZoom] = useState(1);
  
  const speedRef = useRef(speed);
  const generatorRef = useRef(null);
  const timerRef = useRef(null);

  const isAutoProcessing = useRef(false);
  const isPausedRef = useRef(true);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const updateTree = (newRoot) => {
    const xSpace = isMobile ? 200 : 450;
    const ySpace = isMobile ? 100 : 120;
    const layoutNodes = calculateLayout(newRoot, xSpace, ySpace);
    const layoutEdges = getEdges(newRoot);
    setNodes(layoutNodes);
    setEdges(layoutEdges);
    setRoot(newRoot);
  };

  const resetExecutionState = () => {
    setActiveLine(null);
    setActiveNodeId(null);
    setTraversedNodes([]);
    setIsExecuting(false);
    setIsPaused(true);
    isPausedRef.current = true;
    setCurrentCalc('SYSTEM_IDLE');
    setStatusMessage({ text: '', type: 'info' });
    if (timerRef.current) clearTimeout(timerRef.current);
    generatorRef.current = null;
  };

  const checkNodePresence = (node, val) => {
    if (!node) return false;
    if (node.val === val) return true;
    if (val < node.val) return checkNodePresence(node.left, val);
    return checkNodePresence(node.right, val);
  };

  const handleStart = async (mode) => {
    if (isExecuting) resetExecutionState();
    
    const val = parseInt(inputValue);
    if (isNaN(val)) return;

    if (mode === 'INSERT') {
      const exists = checkNodePresence(root, val);
      if (exists) {
        setStatusMessage({ text: `ERROR: DUPLICATE_VALUE_${val}`, type: 'error' });
        setCurrentCalc(`NODE_${val}_ALREADY_EXISTS`);
        return;
      }
    }

    if (mode === 'SEARCH' || mode === 'DELETE') {
      const exists = checkNodePresence(root, val);
      if (!exists) {
        setStatusMessage({ text: `ERROR: NODE_${val}_NOT_FOUND`, type: 'error' });
        setCurrentCalc(`NODE_${val}_NOT_IN_TREE`);
        return;
      }
    }




    setCurrentMode(mode);
    setIsExecuting(true);
    setIsPaused(false);
    isPausedRef.current = false;

    let generator;
    if (mode === 'INSERT') generator = insertGenerator(root, val);
    if (mode === 'SEARCH') generator = searchGenerator(root, val);
    if (mode === 'DELETE') generator = deleteGenerator(root, val);

    
    generatorRef.current = generator;
    setStatusMessage({ text: `EXECUTING_${mode}...`, type: 'info' });
  };

  const runStep = useCallback(async () => {
    if (!generatorRef.current) return;

    const { value, done } = await generatorRef.current.next();

    if (done) {
      if (currentMode === 'INSERT' || currentMode === 'DELETE') {
        updateTree(value || root);
        setStatusMessage({ text: `${currentMode}_COMPLETE`, type: 'success' });
      } else if (currentMode === 'SEARCH') {

        setStatusMessage({ text: value ? 'SEARCH_SUCCESS' : 'SEARCH_FAILED', type: value ? 'success' : 'error' });
      }
      setIsExecuting(false);
      setIsPaused(true);
      return;
    }

    setActiveLine(value.line);
    setActiveNodeId(value.nodeId);
    if (value.msg) setCurrentCalc(value.msg);
    if (value.nodeId) setTraversedNodes(prev => [...new Set([...prev, value.nodeId])]);

    if (!isPaused && !isAutoProcessing.current) {
      timerRef.current = setTimeout(runStep, 1000 / speed);
    }
  }, [root, currentMode, speed, isPaused]);

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
      if (value.msg) setCurrentCalc(value.msg);
      if (value.nodeId) setTraversedNodes(prev => [...new Set([...prev, value.nodeId])]);
      
      lastValue = value;
      await new Promise(r => setTimeout(r, 1000 / speedRef.current));
    }
  };


  const handleRandomize = async () => {
    if (isExecuting) return;
    isAutoProcessing.current = true;
    resetExecutionState();
    updateTree(null);
    
    const valueSet = new Set();
    while (valueSet.size < randomNodeCount) {
      valueSet.add(Math.floor(Math.random() * 150) + 10);
    }
    const values = Array.from(valueSet);
    
    let currentRoot = null;
    for (const val of values) {
      setCurrentMode('INSERT');
      setInputValue(val.toString());
      setIsExecuting(true);
      setIsPaused(false);
      isPausedRef.current = false;
      
      const gen = insertGenerator(currentRoot, val);
      currentRoot = await runGeneratorToCompletion(gen);
      updateTree(currentRoot);
      
      await new Promise(r => setTimeout(r, 600));
    }
    
    setIsExecuting(false);
    isAutoProcessing.current = false;
    setInputValue('');
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
    const baseW = isMobile ? 600 : 2000;
    const baseH = isMobile ? 1000 : 1200;
    const w = baseW / zoom;
    const h = baseH / zoom;
    const x = 1000 - w / 2;
    return `${x} 0 ${w} ${h}`;
  };

  const getCodeSnippet = () => {
    if (currentMode === 'INSERT') return INSERT_CODE;
    if (currentMode === 'SEARCH') return SEARCH_CODE;
    if (currentMode === 'DELETE') return DELETE_CODE;
    return INSERT_CODE;
  };




  return (
    <div className={`avl-visualizer-container ${isMobile ? 'mobile-view' : ''}`}>

      <div className={`avl-header flex flex-col ${isMobile ? 'gap-6 p-4 items-center text-center' : 'gap-6 p-6'}`}>
        <div className={`flex ${isMobile ? 'flex-col gap-6' : 'justify-between items-center'} w-full`}>
          <h1 className={`${isMobile ? 'text-2xl justify-center flex-wrap' : 'text-3xl'} font-black tracking-tighter text-white flex items-center gap-3`}>
            <span className="text-[#00f3ff] bg-[#00f3ff]/10 px-2 py-1 rounded">AVL</span> 
            SYNC_LAB<span className="text-[10px] font-mono text-zinc-500 ml-2 tracking-[0.3em] hidden sm:inline">V2.0</span>
          </h1>
          
          <div className={`flex ${isMobile ? 'flex-col w-full gap-2' : 'gap-4'} items-center`}>
            <div className={`control-group ${isMobile ? 'w-full justify-center' : ''}`}>
              <span className="control-label">Nodes:</span>
              <input 
                type="number" 
                className="bst-input w-16 text-center" 
                min="1" max="20"
                value={randomNodeCount}
                onChange={(e) => setRandomNodeCount(parseInt(e.target.value))}
              />
              <button className="bst-btn" onClick={handleRandomize} disabled={isExecuting}>
                <FaRandom size={12} /> Randomize
              </button>
            </div>
          </div>
        </div>

        <div className={`flex ${isMobile ? 'flex-col gap-6' : 'justify-between items-center'} w-full pt-4 border-t border-white/5`}>
          <div className={`flex ${isMobile ? 'flex-col w-full' : 'gap-4'}`}>
            <div className={`control-group ${isMobile ? 'w-full justify-center flex-wrap' : ''}`}>
              <span className="control-label">Target:</span>
              <input 
                type="number" 
                className={`bst-input ${isMobile ? 'flex-1' : 'w-24'} text-lg font-bold text-center text-[#00f3ff]`} 
                placeholder="Val"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="flex flex-wrap justify-center gap-2">
                <button 
                  className="bst-btn primary px-4" 
                  onClick={() => handleStart('INSERT')} 
                  disabled={isExecuting}
                >
                  <FaPlus /> Insert
                </button>
                <button 
                  className="bst-btn" 
                  onClick={() => handleStart('SEARCH')} 
                  disabled={isExecuting}
                >
                  <FaSearch size={12} /> Search
                </button>
                <button 
                  className="bst-btn" 
                  onClick={() => handleStart('DELETE')} 
                  disabled={isExecuting}
                >
                  <FaTrash size={12} /> Delete
                </button>
              </div>
            </div>
          </div>

          <div className={`flex ${isMobile ? 'flex-col w-full' : 'gap-4'} items-center`}>
            <div className={`control-group ${isMobile ? 'w-full flex-col p-4' : ''}`}>
              {!isMobile && <span className="control-label">Playback:</span>}
              <div className={`flex items-center gap-3 ${isMobile ? 'w-full justify-center mb-4' : 'mr-4'}`}>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Speed</span>
                <input 
                  type="range" 
                  className={`bst-slider ${isMobile ? 'flex-1' : 'w-32'}`}
                  min="0.5" max="5" step="0.5" 
                  value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}
                />
                <span className="text-xs font-mono text-[#00f3ff] w-8">{speed}x</span>
              </div>
              
              <div className={`flex gap-2 ${isMobile ? 'w-full justify-center' : ''}`}>
                <button className="bst-btn" onClick={resetExecutionState}><FaUndo size={12} /></button>
                <button className="bst-btn primary px-6" onClick={togglePause} disabled={!isExecuting}>
                  {isPaused ? <FaPlay size={12} /> : <FaPause size={12} />} 
                  {isPaused ? "RESUME" : "PAUSE"}
                </button>
                <button className="bst-btn" onClick={() => runStep()} disabled={!isExecuting || !isPaused}>
                  <FaStepForward size={12} />
                </button>
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

      <div className={`avl-main flex ${isMobile ? 'flex-col px-2' : 'gap-6 px-6'} pb-6`}>
        <div className={`avl-viz-panel flex-1 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden ${isMobile ? 'min-h-[450px] h-[60vh]' : 'min-h-[700px]'}`}>
          <div className="canvas-grid" />
          <svg className="w-full h-full" viewBox={getViewBox()}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {edges.map(edge => (
              <motion.line
                key={edge.id}
                x1={edge.from.x} y1={edge.from.y}
                x2={edge.to.x} y2={edge.to.y}
                stroke="rgba(0, 243, 255, 0.2)"
                strokeWidth="2"
              />
            ))}

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
                    className={`avl-node-circle ${
                      activeNodeId === node.id ? 'active' : 
                      traversedNodes.includes(node.id) ? 'traversed' : ''
                    }`}
                  />
                  <text className="avl-node-text">{node.val}</text>
                  <text y="60" className="avl-height-text">h: {node.height}</text>
                </motion.g>
              ))}
            </AnimatePresence>
          </svg>
        </div>

        <div className={`avl-side-panel ${isMobile ? 'w-full' : 'w-[400px]'} flex flex-col gap-6`}>
          <div className="bst-code-viewer">
            <div className="code-viewer-header">
              <FaCode className="text-[#00f3ff]" />
              <span>AVL_BALANCING_LOGIC</span>
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
            
            <div className="telemetry-header mt-4">SYSTEM_STATUS</div>
            <div className="telemetry-content">
              <div className="telemetry-item">
                <span className="label">ROOT_STATE</span>
                <span className="value">{root ? 'STABLE' : 'NULL'}</span>
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

export default AvlVisualizer;
