import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaSearch, FaTrash, FaPlay, FaPause, 
  FaStepForward, FaUndo, FaCode, FaMicrochip, FaRandom, FaEraser,
  FaSearchPlus, FaSearchMinus
} from 'react-icons/fa';
import { useIsMobile } from '../../../hooks/use-mobile';

import './BstVisualizer.css';
import { 
  TreeNode, 
  calculateLayout, 
  getEdges, 
  searchGenerator, 
  insertGenerator, 
  deleteGenerator,
  SEARCH_CODE,
  INSERT_CODE,
  DELETE_CODE
} from './bstLogic';

const BstVisualizer = () => {
  const isMobile = useIsMobile();

  // Tree state
  const [root, setRoot] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  // Interaction state
  const [inputValue, setInputValue] = useState('');
  const [currentMode, setCurrentMode] = useState('SEARCH'); // SEARCH, INSERT, DELETE
  const [speed, setSpeed] = useState(1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  // Execution state (Synchronization)
  const [activeLine, setActiveLine] = useState(null);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [activeEdgeId, setActiveEdgeId] = useState(null);
  const [traversedNodes, setTraversedNodes] = useState([]);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: 'info' });
  const [currentCalc, setCurrentCalc] = useState('SYSTEM_IDLE');
  const [randomNodeCount, setRandomNodeCount] = useState(15);
  const [zoom, setZoom] = useState(1);



  
  const generatorRef = useRef(null);
  const timerRef = useRef(null);
  const isAutoProcessing = useRef(false);
  const isPausedRef = useRef(true);
  const speedRef = useRef(speed);




  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Initialize with empty tree

  useEffect(() => {
    // Empty on load as requested
  }, []);


  const updateTree = (newRoot) => {
    const xSpace = isMobile ? 200 : 450;
    const ySpace = isMobile ? 100 : 120;
    const layoutNodes = calculateLayout(newRoot, 0, 1000, xSpace, ySpace);
    const layoutEdges = getEdges(newRoot);
    setRoot(newRoot);
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  };

  const handleRandomize = async () => {
    if (isExecuting) return;
    isAutoProcessing.current = true;
    resetExecutionState();
    
    // Clear the current tree state
    setRoot(null);
    setNodes([]);
    setEdges([]);
    
    // Generate custom number of unique random values
    const valueSet = new Set();
    while (valueSet.size < randomNodeCount) {
      valueSet.add(Math.floor(Math.random() * 150) + 10);
    }

    const values = Array.from(valueSet);

    
    let currentTreeRoot = null;
    
    for (const val of values) {
      setCurrentMode('INSERT');
      setInputValue(val.toString());
      setIsExecuting(true);
      setIsPaused(false);
      isPausedRef.current = false;

      
      const gen = insertGenerator(currentTreeRoot, val);
      generatorRef.current = gen;
      
      // Run visual insertion
      const result = await runGeneratorToCompletion(gen);
      
      // Critical: result is the root of the tree (might be new or existing)
      currentTreeRoot = result;
      
      // Recalculate layout and update state
      const layoutNodes = calculateLayout(currentTreeRoot);
      const layoutEdges = getEdges(currentTreeRoot);
      
      // Create fresh references to force React re-render
      setRoot(currentTreeRoot);
      setNodes([...layoutNodes]);
      setEdges([...layoutEdges]);
      
      // Reset traversal state for next value
      setTraversedNodes([]);
      setActiveNodeId(null);
      setActiveEdgeId(null);
      setActiveLine(null);
      
      await new Promise(r => setTimeout(r, 600));
    }
    
    setIsExecuting(false);
    isAutoProcessing.current = false;
    setInputValue('');
  };

  const handleWipe = () => {
    resetExecutionState();
    setRoot(null);
    setNodes([]);
    setEdges([]);
    showStatus('TREE_WIPED', 'info');
  };



  const runGeneratorToCompletion = async (gen) => {
    let lastValue = null;
    while (true) {
      // Pause check: Wait if isPausedRef is true
      while (isPausedRef.current) {
        await new Promise(r => setTimeout(r, 100));
      }

      const { value, done } = await gen.next();
      if (done) return value || lastValue;
      
      setActiveLine(value.line);
      setActiveNodeId(value.nodeId);
      if (value.msg) setCurrentCalc(value.msg);

      if (value.nodeId) {
        setTraversedNodes(prev => [...new Set([...prev, value.nodeId])]);
      }
      if (value.edgeTo) {
        setActiveEdgeId(`${value.nodeId}-${value.edgeTo}`);
      } else {
        setActiveEdgeId(null);
      }
      
      lastValue = value;
      // Use a consistent delay
      await new Promise(r => setTimeout(r, 1000 / speedRef.current));
    }


  };





  const resetExecutionState = () => {
    setActiveLine(null);
    setActiveNodeId(null);
    setActiveEdgeId(null);
    setTraversedNodes([]);
    setIsExecuting(false);
    setIsPaused(true);
    isPausedRef.current = true;
    setStatusMessage({ text: '', type: 'info' });
    if (timerRef.current) clearTimeout(timerRef.current);

    generatorRef.current = null;
  };

  const showStatus = (text, type = 'info') => {
    setStatusMessage({ text, type });
    if (type !== 'error' && type !== 'success') {
       // Keep permanent for search results if needed, or clear after timeout
    }
  };


  const handleStart = async (mode) => {
    if (isExecuting) resetExecutionState();
    
    const val = parseInt(inputValue);
    if (isNaN(val)) return;

    if (mode === 'DELETE' || mode === 'SEARCH') {
      const exists = checkNodePresence(root, val);
      if (!exists) {
        showStatus(`ERROR: NODE_${val}_NOT_FOUND`, 'error');
        setCurrentCalc(`NODE_${val}_NOT_IN_TREE`);
        return;
      }
    }

    setCurrentMode(mode);

    setIsExecuting(true);
    setIsPaused(false);
    isPausedRef.current = false;


    let generator;
    if (mode === 'SEARCH') generator = searchGenerator(root, val);
    if (mode === 'INSERT') generator = insertGenerator(root, val);
    if (mode === 'DELETE') generator = deleteGenerator(root, val);
    
    generatorRef.current = generator;
    showStatus(`EXECUTING_${mode}...`, 'info');
    // useEffect will trigger runStep automatically once state updates
  };


  const checkNodePresence = (node, val) => {
    if (!node) return false;
    if (node.val === val) return true;
    if (val < node.val) return checkNodePresence(node.left, val);
    return checkNodePresence(node.right, val);
  };


  const runStep = useCallback(async () => {
    if (!generatorRef.current) return;

    const { value, done } = await generatorRef.current.next();

    if (done) {
      if (currentMode === 'INSERT' || currentMode === 'DELETE') {
        const presence = checkNodePresence(root, parseInt(inputValue));
        
        if (currentMode === 'DELETE') {
          // If we are here and presence is true, something is wrong?
          // Actually, 'done' means the generator finished.
          // For delete, we should check if the node exists BEFORE starting.
          showStatus(`${currentMode}_COMPLETE`, 'success');
          updateTree(value || root);
        } else {
          showStatus(`${currentMode}_COMPLETE`, 'success');
          updateTree(value || root);
        }
      } else if (currentMode === 'SEARCH') {
        const found = value !== null;
        showStatus(found ? `SUCCESS: NODE_${inputValue}_FOUND` : `ERROR: NODE_${inputValue}_NOT_FOUND`, found ? 'success' : 'error');
      }
      setIsExecuting(false);
      setIsPaused(true);
      return;
    }



    setActiveLine(value.line);
    setActiveNodeId(value.nodeId);
    if (value.msg) setCurrentCalc(value.msg);
    
    if (value.nodeId) {

      setTraversedNodes(prev => [...new Set([...prev, value.nodeId])]);
    }

    if (value.edgeTo) {
      setActiveEdgeId(`${value.nodeId}-${value.edgeTo}`);
    } else {
      setActiveEdgeId(null);
    }

    if (!isPaused) {
      timerRef.current = setTimeout(runStep, 1000 / speed);
    }
  }, [root, currentMode, speed, isPaused]);

  useEffect(() => {
    if (!isPaused && isExecuting && !isAutoProcessing.current) {
      timerRef.current = setTimeout(runStep, 1000 / speed);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPaused, isExecuting, runStep, speed]);


  const togglePause = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    isPausedRef.current = nextPaused;
  };

  const handleStep = () => runStep();

  const handleZoom = (factor) => {
    setZoom(prev => Math.min(2, Math.max(0.5, prev * factor)));
  };

  const getViewBox = () => {
    const baseW = isMobile ? 600 : 2000;
    const baseH = isMobile ? 1000 : 1000;
    const w = baseW / zoom;
    const h = baseH / zoom;
    const x = 1000 - w / 2;
    return `${x} 0 ${w} ${h}`;
  };

  const getCodeSnippet = () => {
    if (currentMode === 'SEARCH') return SEARCH_CODE;
    if (currentMode === 'INSERT') return INSERT_CODE;
    if (currentMode === 'DELETE') return DELETE_CODE;
    return SEARCH_CODE;
  };

  return (
    <div className={`bst-visualizer-container ${isMobile ? 'mobile-view' : ''}`}>
      <div className={`bst-header flex flex-col ${isMobile ? 'gap-6 p-4 items-center text-center' : 'gap-6 p-6'}`}>
        {/* Row 1: Brand and Data Input */}
        <div className={`flex ${isMobile ? 'flex-col gap-6' : 'justify-between items-center'} w-full`}>
          <h1 className={`${isMobile ? 'text-2xl justify-center flex-wrap' : 'text-3xl'} font-black tracking-tighter text-white flex items-center gap-3`}>
            <span className="text-[#00f3ff] bg-[#00f3ff]/10 px-2 py-1 rounded">BST</span> 
            SYNC_LAB<span className="text-[10px] font-mono text-zinc-500 ml-2 tracking-[0.3em] hidden sm:inline">V2.0</span>
          </h1>
          
          <div className={`flex ${isMobile ? 'flex-col w-full gap-4' : 'gap-4'} items-center`}>
            <div className={`control-group ${isMobile ? 'w-full justify-between px-4' : ''}`}>
              <span className="control-label">Nodes:</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  className="bst-input w-16 text-center" 
                  min="1" 
                  max="30"
                  value={randomNodeCount}
                  onChange={(e) => setRandomNodeCount(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
                />
                <button className="bst-btn" onClick={handleRandomize} disabled={isExecuting}>
                  <FaRandom size={12} /> Random
                </button>
              </div>
            </div>

            <div className={`control-group ${isMobile ? 'w-full justify-between px-4' : ''}`}>
              <span className="control-label">Target:</span>
              <input 
                type="number" 
                className={`bst-input ${isMobile ? 'w-32' : 'w-24'} text-lg font-bold text-center text-[#00f3ff]`} 
                placeholder="Val"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleStart('INSERT');
                }}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Algorithm Execution and Playback */}
        <div className={`flex ${isMobile ? 'flex-col gap-6' : 'justify-between items-center'} w-full pt-4 border-t border-white/5`}>
          <div className={`control-group ${isMobile ? 'w-full flex-col p-4' : ''}`}>
            <span className={`control-label ${isMobile ? 'mb-2' : ''}`}>Protocol:</span>
            <div className="flex flex-wrap justify-center gap-2">
              <button className="bst-btn" onClick={() => handleStart('SEARCH')} disabled={isExecuting}><FaSearch size={12} /> Search</button>
              <button className="bst-btn primary" onClick={() => handleStart('INSERT')} disabled={isExecuting}><FaPlus size={12} /> Insert</button>
              <button className="bst-btn" onClick={() => handleStart('DELETE')} disabled={isExecuting}><FaTrash size={12} /> Delete</button>
            </div>
          </div>

          <div className={`flex ${isMobile ? 'flex-col w-full gap-4' : 'gap-4'} items-center`}>
            <div className={`control-group ${isMobile ? 'w-full flex-col p-4' : ''}`}>
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
                <button className={`bst-btn ${isMobile ? 'flex-1' : ''}`} onClick={handleStep} disabled={!isExecuting || !isPaused}><FaStepForward size={12} /></button>
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



      <div className="bst-main">

        <div className="bst-viz-panel">
          <div className="canvas-grid" />
          <svg className="bst-svg" viewBox={getViewBox()}>


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
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
                className={`bst-edge ${activeEdgeId === edge.id ? 'active' : ''}`}
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
                  className="bst-node"
                >
                  <circle 
                    r="40" 
                    className={`bst-node-circle ${
                      activeNodeId === node.id ? 'comparing' : 
                      traversedNodes.includes(node.id) ? 'active' : ''
                    }`}
                  />

                  <text className="bst-node-text">{node.val}</text>
                </motion.g>
              ))}
            </AnimatePresence>
          </svg>
        </div>

        <div className="bst-side-panel">
          <div className="bst-code-viewer">
            <div className="code-viewer-header">
              <FaCode className="text-neon-cyan" />
              <span>ALGO_PROCESSOR</span>
              <div className="status-dot" />
            </div>
            <div className="code-viewer-body">
              {getCodeSnippet().map((line) => (
                <div 
                  key={line.line} 
                  className={`code-line ${activeLine === line.line ? 'active' : ''}`}
                >
                  <span className="line-num">{line.line}</span>
                  <span className="line-txt" style={{ whiteSpace: 'pre' }}>{line.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bst-telemetry-panel">
            <div className="telemetry-header">CALCULATION_TRACE</div>
            <div className="p-3 bg-black/40 rounded border border-white/5 min-h-[60px] flex items-center justify-center">
              <span className="text-xs font-mono text-[#00f3ff] text-center animate-pulse">
                {`> ${currentCalc}`}
              </span>
            </div>
            
            <div className="telemetry-header mt-4">SYSTEM_TELEMETRY</div>

            <div className="telemetry-content">
              <div className="telemetry-item">
                <span className="label">CURRENT_VAL</span>
                <span className="value text-neon-cyan">{inputValue || '--'}</span>
              </div>
              <div className="telemetry-item">
                <span className="label">ACTIVE_MODE</span>
                <span className="value">{currentMode}</span>
              </div>
              <div className="telemetry-item">
                <span className="label">NODES_TRAVERSED</span>
                <span className="value">{traversedNodes.length}</span>
              </div>
              <div className="telemetry-status mt-2">
                <div className={`status-badge ${isExecuting ? 'running' : 'idle'}`}>
                  {isExecuting ? (isPaused ? 'PAUSED' : 'EXECUTING') : 'READY'}
                </div>
              </div>
              {statusMessage.text && (
                <div className={`mt-3 p-2 rounded text-[10px] font-mono text-center border ${
                  statusMessage.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 
                  statusMessage.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 
                  'bg-blue-500/10 border-blue-500/50 text-neon-cyan'
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

export default BstVisualizer;

