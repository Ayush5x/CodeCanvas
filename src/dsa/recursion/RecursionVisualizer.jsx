import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Box, Zap, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useIsMobile } from '../../../hooks/use-mobile';
import { RecursionEngine } from './RecursionEngine';
import './RecursionVisualizer.css';

const TreeNode = ({ id, engineState }) => {
  const node = engineState.nodes[id];
  if (!node) return null;
  const childrenIds = engineState.edges.filter(e => e.from === id).map(e => e.to);
  const parentEdge = engineState.edges.find(e => e.to === id);
  const edgeClass = parentEdge ? (parentEdge.status === 'return' ? 'edge-return' : 'edge-call') : '';

  return (
    <div className="tree-child-wrapper">
      <div className={`edge-connector ${edgeClass}`}></div>
      <motion.div 
        layoutId={`node-${id}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`tree-node ${node.status}`}
      >
        <div className="node-title">{node.name}({node.args.n})</div>
        <div className="node-locals">
          {Object.entries(node.locals).map(([k, v]) => (
            <div key={k}>{k}: {v !== null ? v.toString() : '?'}</div>
          ))}
        </div>
        {node.returnValue !== null && (
          <div className="node-return">Return: {node.returnValue}</div>
        )}
      </motion.div>
      
      {childrenIds.length > 0 && (
        <div className="tree-children-container">
          {childrenIds.map(childId => (
            <TreeNode key={childId} id={childId} engineState={engineState} />
          ))}
        </div>
      )}
    </div>
  );
};

const HanoiPegs = ({ pegs, totalDisks }) => {
  if (!pegs || !pegs.A) return null;
  return (
    <div className="flex justify-center gap-12 mb-12 p-4 bg-black/20 rounded-xl border border-white/5 mx-auto w-fit">
      {['A', 'B', 'C'].map(pegName => (
        <div key={pegName} className="flex flex-col items-center justify-end h-[120px] relative w-[100px]">
          {/* Peg Base & Pole */}
          <div className="absolute bottom-6 w-[120px] h-2 bg-white/10 rounded" />
          <div className="absolute bottom-6 w-2 h-[110px] bg-white/10 rounded-t" />
          
          {/* Disks */}
          <div className="flex flex-col items-center justify-end h-full z-10 pb-8 w-full">
             <AnimatePresence mode="popLayout">
                {pegs[pegName].map(diskSize => {
                   const width = 30 + (diskSize / Math.max(totalDisks, 3)) * 60;
                   const colors = ['bg-[#FF007F]', 'bg-[#00F5FF]', 'bg-[#FFD700]', 'bg-[#8A2BE2]', 'bg-[#39ff14]', 'bg-[#FF8C00]'];
                   const color = colors[diskSize % colors.length];
                   return (
                     <motion.div
                       key={`disk-${diskSize}`}
                       layoutId={`hanoi-disk-${diskSize}`}
                       initial={{ y: -50, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       exit={{ y: -50, opacity: 0 }}
                       className={`h-4 rounded-full mb-[2px] ${color} border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                       style={{ width: `${width}px` }}
                     />
                   )
                })}
             </AnimatePresence>
          </div>
          <span className="absolute bottom-0 font-mono text-zinc-500 text-xs font-bold">PEG {pegName}</span>
        </div>
      ))}
    </div>
  );
};

const RecursionVisualizer = () => {
  const isMobile = useIsMobile();
  const [algo, setAlgo] = useState('fibonacci');
  const [paramN, setParamN] = useState(3);
  const [speed, setSpeed] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [engineState, setEngineState] = useState({ nodes: {}, stack: [], edges: [], pegs: null });
  
  // Pan and Zoom State
  const [manualScale, setManualScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const engineRef = useRef(null);
  const speedRef = useRef(1);
  const pauseRef = useRef(false);
  const treePaneRef = useRef(null);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const wait = () => {
    return new Promise(resolve => {
      const check = setInterval(() => {
        if (!pauseRef.current) {
          clearInterval(check);
          resolve();
        }
      }, 50);
    }).then(() => new Promise(r => setTimeout(r, 1000 / speedRef.current)));
  };

  const handleStateChange = (newState) => {
    setEngineState(newState);
  };

  const startSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsPaused(false);
    pauseRef.current = false;
    setEngineState({ nodes: {}, stack: [], edges: [], pegs: null });

    engineRef.current = new RecursionEngine(handleStateChange, wait);
    
    try {
      if (algo === 'hanoi') {
        engineRef.current.initPegs(paramN);
        // Force an initial render of pegs before starting
        setEngineState(prev => ({ ...prev, pegs: engineRef.current.pegs }));
        await engineRef.current.runHanoi(paramN);
      } else if (algo === 'fibonacci') {
        await engineRef.current.runFibonacci(paramN);
      } else if (algo === 'tribonacci') {
        await engineRef.current.runTribonacci(paramN);
      } else {
        await engineRef.current.runFactorial(paramN);
      }
    } catch (e) {
      if (e.message !== "Halted") {
        console.error(e);
      }
    }
    
    if (!engineRef.current.isHalted) {
      setIsRunning(false);
    }
  };

  const haltSimulation = () => {
    if (engineRef.current) {
      engineRef.current.halt();
    }
    setIsRunning(false);
    setIsPaused(false);
    pauseRef.current = false;
    setEngineState({ nodes: {}, stack: [], edges: [] });
    // Reset pan/zoom on halt
    setManualScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const togglePause = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(pauseRef.current);
  };

  const rootNodes = Object.values(engineState.nodes).filter(n => !n.parentId);

  // Dynamic Scale Calculation to fit tree in view
  let scale = 1;
  if (algo === 'fibonacci') {
    if (paramN >= 7) scale = 0.45;
    else if (paramN >= 6) scale = 0.6;
    else if (paramN >= 5) scale = 0.8;
  } else if (algo === 'tribonacci') {
    if (paramN >= 6) scale = 0.35;
    else if (paramN >= 5) scale = 0.55;
    else if (paramN >= 4) scale = 0.75;
  } else if (algo === 'hanoi') {
    if (paramN >= 6) scale = 0.45;
    else if (paramN >= 5) scale = 0.6;
    else if (paramN >= 4) scale = 0.8;
  } else {
    // Factorial is linear, rarely needs horizontal scaling, 
    // but might need vertical if N is very large.
    if (paramN >= 7) scale = 0.8;
  }

  // Handlers for Pan and Zoom
  useEffect(() => {
    const treePane = treePaneRef.current;
    if (!treePane) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomSensitivity = 0.001;
      setManualScale(prev => Math.max(0.2, Math.min(prev - e.deltaY * zoomSensitivity, 3)));
    };

    treePane.addEventListener('wheel', handleWheel, { passive: false });
    return () => treePane.removeEventListener('wheel', handleWheel);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setManualScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className={`recursion-visualizer-container ${isMobile ? 'mobile-view' : ''}`}>
      <div className={`visualizer-header ${isMobile ? 'flex-col gap-6 items-center text-center' : ''}`}>
        <div className="flex flex-col gap-1">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-black text-white flex items-center gap-2`}>
            <div className="w-2 h-2 bg-[#8A2BE2] rounded-full animate-pulse" />
            RECURSION <span className="text-[#8A2BE2]/50 font-light">KERNEL_V2</span>
          </h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Dynamic Frame Sync Engine</p>
        </div>

        <div className={`visualizer-controls ${isMobile ? 'w-full flex-wrap justify-center' : ''}`}>
          <div className={`flex items-center gap-2 ${isMobile ? 'w-full justify-between px-2' : 'mr-4'} bg-white/5 p-2 rounded-lg border border-white/10`}>
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Algo:</label>
              <select 
                className="bg-transparent text-white text-xs outline-none cursor-pointer font-mono"
                value={algo}
                onChange={e => {
                  setAlgo(e.target.value);
                  const newMax = e.target.value === 'fibonacci' ? 7 : e.target.value === 'tribonacci' ? 6 : 8;
                  if (paramN > newMax) setParamN(newMax);
                }}
                disabled={isRunning}
              >
                <option value="fibonacci" className="bg-[#050505] text-white">Fibonacci</option>
                <option value="tribonacci" className="bg-[#050505] text-white">Tribonacci</option>
                <option value="hanoi" className="bg-[#050505] text-white">Tower of Hanoi</option>
                <option value="factorial" className="bg-[#050505] text-white">Factorial</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-px h-4 bg-white/20 mx-2" />
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">N =</label>
              <input 
                type="number" 
                className="bg-black/50 text-[#8A2BE2] w-12 text-center rounded border border-white/10 font-bold text-xs outline-none"
                value={paramN}
                min="1"
                max={algo === 'fibonacci' ? 7 : algo === 'tribonacci' ? 6 : algo === 'hanoi' ? 6 : 8}
                onChange={e => {
                  if (e.target.value === '') { setParamN(''); return; }
                  let val = parseInt(e.target.value);
                  if (isNaN(val)) return;
                  const maxN = algo === 'fibonacci' ? 7 : algo === 'tribonacci' ? 6 : algo === 'hanoi' ? 6 : 8;
                  if (val > maxN) val = maxN;
                  setParamN(val);
                }}
                onBlur={() => { if (paramN === '' || paramN < 1) setParamN(1); }}
                disabled={isRunning}
              />
            </div>
          </div>

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
              <span className="text-[10px] font-mono text-[#8A2BE2]">{speed}x</span>
            </div>
          </div>
          
          <div className={`flex gap-2 ${isMobile ? 'w-full justify-center' : ''}`}>
            <button className="control-btn" onClick={haltSimulation} disabled={!isRunning && engineState.stack.length === 0}>
              <RotateCcw size={14} /> Reset
            </button>

            {isRunning ? (
              <button className={`control-btn primary ${isMobile ? 'flex-1 max-w-[120px] justify-center' : ''}`} onClick={togglePause}>
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
                {isPaused ? "Resume" : "Pause"}
              </button>
            ) : (
              <button className={`control-btn primary ${isMobile ? 'flex-1 max-w-[120px] justify-center' : ''}`} onClick={startSimulation}>
                <Play size={16} /> Execute
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`main-stage ${isMobile ? 'flex-col overflow-y-auto' : ''}`}>
        <div className={`stack-pane ${isMobile ? 'w-full h-[250px] min-h-[250px]' : ''}`}>
          <div className="text-[10px] text-zinc-500 mb-3 uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-2">
            <Box size={12} /> FUNCTION_CALL_STACK
          </div>
          <div className="stack-container">
            <AnimatePresence>
              {engineState.stack.map((id, index) => {
                const node = engineState.nodes[id];
                if (!node) return null;
                const isTop = index === engineState.stack.length - 1;
                return (
                  <motion.div
                    key={id}
                    layoutId={`stack-${id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`stack-frame ${isTop ? 'active' : 'waiting'} ${isMobile ? 'p-2' : ''}`}
                  >
                    <div className={`${isMobile ? 'text-xs' : 'frame-title'}`}>{node.name}({node.args.n})</div>
                    <div className="frame-locals">
                      {Object.entries(node.locals).map(([k, v]) => (
                        <div key={k} className="frame-local-item">
                          <span>{k}</span>
                          <span className="text-white font-bold">{v !== null ? v.toString() : '...'}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {engineState.stack.length === 0 && (
              <div className="text-center text-zinc-600 text-xs mt-10 font-mono italic">
                Stack Empty
              </div>
            )}
          </div>
        </div>

        <div 
          className={`tree-pane ${isMobile ? 'w-full h-[450px] min-h-[450px] mt-4' : ''}`}
          ref={treePaneRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
            <button className="bg-black/50 border border-white/10 p-2 rounded text-zinc-400 hover:text-white hover:border-white/30 transition-all" onClick={() => setManualScale(s => Math.min(s + 0.2, 3))}>
              <ZoomIn size={16} />
            </button>
            <button className="bg-black/50 border border-white/10 p-2 rounded text-zinc-400 hover:text-white hover:border-white/30 transition-all" onClick={() => setManualScale(s => Math.max(s - 0.2, 0.2))}>
              <ZoomOut size={16} />
            </button>
            <button className="bg-black/50 border border-white/10 p-2 rounded text-zinc-400 hover:text-white hover:border-white/30 transition-all" onClick={resetZoom}>
              <Maximize size={16} />
            </button>
          </div>

          <div 
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${(isMobile ? 0.7 : 1) * scale * manualScale})`, 
              transformOrigin: 'top center', 
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              paddingTop: '20px'
            }}
          >
            {algo === 'hanoi' && <HanoiPegs pegs={engineState.pegs} totalDisks={paramN} />}

            {rootNodes.length > 0 ? (
              <div className="css-tree">
                 {rootNodes.map(node => (
                   <TreeNode key={node.id} id={node.id} engineState={engineState} />
                 ))}
              </div>
            ) : (
              !engineState.pegs && (
                <div className="flex flex-col items-center justify-center h-full text-zinc-600 opacity-50 mt-20">
                  <Zap size={48} className="mb-4" />
                  <div className="font-mono text-sm tracking-widest">AWAITING_EXECUTION</div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecursionVisualizer;
