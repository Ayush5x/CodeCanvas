import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Box, Zap, Cpu, Terminal, Hash, ChevronRight } from 'lucide-react';
import { FlowchartEngine } from './FlowchartEngine';
import Header from '../../components/Header';
import { useIsMobile } from '../../hooks/use-mobile';

const NODE_SIZES = {
  start: { w: 140, h: 50 },
  process: { w: 180, h: 60 },
  decision: { w: 140, h: 140 },
};

const MOBILE_NODE_SIZES = {
  start: { w: 100, h: 40 },
  process: { w: 130, h: 50 },
  decision: { w: 100, h: 100 },
};

const ALGO_CONFIGS = {
  // ... (keeping existing configs)
  factorial: {
    name: "Factorial(N)",
    nodes: [
      { id: "n_start", type: "start", label: "Start: fact(n)", x: 400, y: 50 },
      { id: "n_dec", type: "decision", label: "n <= 1?", x: 400, y: 180 },
      { id: "n_base", type: "process", label: "return 1", x: 200, y: 350 },
      { id: "n_rec", type: "process", label: "child = fact(n-1)", x: 600, y: 350 },
      { id: "n_mul", type: "process", label: "return n * child", x: 600, y: 500 },
      { id: "n_end", type: "start", label: "End", x: 400, y: 650 },
    ],
    edges: [
      { id: "e_start_dec", from: "n_start", to: "n_dec" },
      { id: "e_dec_base", from: "n_dec", to: "n_base", label: "Yes" },
      { id: "e_dec_rec", from: "n_dec", to: "n_rec", label: "No" },
      { id: "e_base_end", from: "n_base", to: "n_end" },
      { id: "e_rec_mul", from: "n_rec", to: "n_mul" },
      { id: "e_mul_end", from: "n_mul", to: "n_end" },
      { id: "e_rec_loop", from: "n_rec", to: "n_start", isLoop: true }
    ],
    startFunc: (engine, n) => engine.runFactorial(n),
    substitute: (label, frame) => {
      if (!frame) return label;
      let l = label.replace('n-1', frame.n - 1).replace('n', frame.n);
      if (frame.locals.childRes !== undefined) l = l.replace('child', frame.locals.childRes);
      return l;
    }
  },
  binary_search: {
    name: "Binary Search",
    nodes: [
      { id: "bs_start", type: "start", label: "Search(L, H)", x: 400, y: 50 },
      { id: "bs_mid", type: "process", label: "mid = (L+H)/2", x: 400, y: 150 },
      { id: "bs_dec", type: "decision", label: "arr[mid] == T?", x: 400, y: 300 },
      { id: "bs_update_high", type: "process", label: "H = mid - 1", x: 200, y: 450 },
      { id: "bs_update_low", type: "process", label: "L = mid + 1", x: 600, y: 450 },
      { id: "bs_end", type: "start", label: "Result", x: 400, y: 600 },
    ],
    edges: [
      { id: "bs_start_mid", from: "bs_start", to: "bs_mid" },
      { id: "bs_mid_dec", from: "bs_mid", to: "bs_dec" },
      { id: "bs_dec_found", from: "bs_dec", to: "bs_end", label: "==" },
      { id: "bs_dec_left", from: "bs_dec", to: "bs_update_high", label: "> T" },
      { id: "bs_dec_right", from: "bs_dec", to: "bs_update_low", label: "< T" },
      { id: "bs_loop", from: "bs_update_high", to: "bs_start", isLoop: true },
      { id: "bs_loop_r", from: "bs_update_low", to: "bs_start", isLoop: true },
    ],
    startFunc: (engine, n) => engine.runBinarySearch([1, 3, 5, 7, 9, 11, 13, 15], 7, 0, 7),
    substitute: (label, frame) => {
      if (!frame) return label;
      return label.replace('L', frame.low).replace('H', frame.high).replace('mid', frame.locals.mid ?? 'mid');
    }
  },
  gcd: {
    name: "GCD (Euclidean)",
    nodes: [
      { id: "gcd_start", type: "start", label: "GCD(a, b)", x: 400, y: 50 },
      { id: "gcd_dec", type: "decision", label: "b == 0?", x: 400, y: 180 },
      { id: "gcd_mod", type: "process", label: "b = a % b", x: 600, y: 350 },
      { id: "gcd_end", type: "start", label: "Return a", x: 200, y: 350 },
    ],
    edges: [
      { id: "gcd_start_dec", from: "gcd_start", to: "gcd_dec" },
      { id: "gcd_dec_base", from: "gcd_dec", to: "gcd_end", label: "Yes" },
      { id: "gcd_dec_rec", from: "gcd_dec", to: "gcd_mod", label: "No" },
      { id: "gcd_loop", from: "gcd_mod", to: "gcd_start", isLoop: true }
    ],
    startFunc: (engine, n) => engine.runGCD(48, 18),
    substitute: (label, frame) => {
      if (!frame) return label;
      return label.replace('a', frame.a).replace('b', frame.b);
    }
  },
  graham_scan: {
    name: "Graham Scan",
    nodes: [
      { id: "gs_start", type: "start", label: "Start Sweep", x: 400, y: 50 },
      { id: "gs_check", type: "decision", label: "Left Turn?", x: 400, y: 180 },
      { id: "gs_push", type: "process", label: "Push Point", x: 200, y: 350 },
      { id: "gs_pop", type: "process", label: "Pop Last", x: 600, y: 350 },
      { id: "gs_end", type: "start", label: "Hull Complete", x: 400, y: 500 },
    ],
    edges: [
      { id: "gs_start_check", from: "gs_start", to: "gs_check" },
      { id: "gs_check_left", from: "gs_check", to: "gs_push", label: "Yes" },
      { id: "gs_check_right", from: "gs_check", to: "gs_pop", label: "No" },
      { id: "gs_loop", from: "gs_push", to: "gs_check", isLoop: true },
      { id: "gs_loop_p", from: "gs_pop", to: "gs_check", isLoop: true },
    ],
    startFunc: (engine, n) => engine.runGrahamScan([{x:0,y:0},{x:1,y:1},{x:2,y:0}]),
    substitute: (label, frame) => label
  }
};

const getCenter = (n) => {
  if (!n) return { x: 0, y: 0, type: 'process' };
  return { x: n.x, y: n.y, type: n.type };
};

const getBezierPath = (f, t, isLoop, sizes) => {
  if (isLoop) {
    return `M ${f.x + sizes.process.w/2} ${f.y} C ${f.x + sizes.process.w} ${f.y}, ${t.x + sizes.start.w} ${t.y - sizes.start.h}, ${t.x} ${t.y - sizes.start.h/2}`;
  }
  const dy = t.y - f.y;
  const curvature = 0.5;
  const fH = sizes[f.type]?.h || 60;
  const tH = sizes[t.type]?.h || 60;
  return `M ${f.x} ${f.y + fH/2} C ${f.x} ${f.y + Math.abs(dy) * curvature}, ${t.x} ${t.y - Math.abs(dy) * curvature}, ${t.x} ${t.y - tH/2}`;
};

export default function RecursiveFlowchartVisualizer() {
  const isMobile = useIsMobile();
  const [selectedAlgo, setSelectedAlgo] = useState('factorial');
  const [paramN, setParamN] = useState(4);
  const [speed, setSpeed] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [engineState, setEngineState] = useState({ activeNode: null, activeEdge: null, status: 'idle', callStack: [] });

  const engineRef = useRef(null);
  const speedRef = useRef(1);
  const pauseRef = useRef(false);

  const currentSizes = isMobile ? MOBILE_NODE_SIZES : NODE_SIZES;

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
    }).then(() => new Promise(r => setTimeout(r, 1500 / speedRef.current)));
  };

  const handleStateChange = (newState) => {
    setEngineState(newState);
  };

  const startSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsPaused(false);
    pauseRef.current = false;
    setEngineState({ activeNode: null, activeEdge: null, status: 'idle', callStack: [] });

    engineRef.current = new FlowchartEngine(handleStateChange, wait);
    
    try {
      const config = ALGO_CONFIGS[selectedAlgo];
      await config.startFunc(engineRef.current, paramN);
    } catch (e) {
      if (e.message !== "Halted") console.error(e);
    }
    
    if (engineRef.current && !engineRef.current.isHalted) setIsRunning(false);
  };

  const haltSimulation = () => {
    if (engineRef.current) engineRef.current.halt();
    setIsRunning(false);
    setIsPaused(false);
    pauseRef.current = false;
    setEngineState({ activeNode: null, activeEdge: null, status: 'idle', callStack: [] });
  };

  const togglePause = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(pauseRef.current);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentConfig = ALGO_CONFIGS[selectedAlgo];
  const topFrame = engineState.callStack.length > 0 
    ? engineState.callStack[engineState.callStack.length - 1] 
    : null;

  return (
    <div className={`min-h-screen bg-[#000000] text-white flex flex-col font-sans ${isMobile ? 'mobile-mode' : ''}`}>
      <Header />
      
      {/* Industrial Page Header */}
      <div className={`page-header-wrap ${isMobile ? 'mt-24 px-4 text-center' : 'mt-20 p-10 border-t border-white/10'}`}>
        <div className="relative overflow-hidden w-full">
          {/* Background Watermark */}
          <h1 className={`absolute -top-10 ${isMobile ? 'left-1/2 -translate-x-1/2 text-[5rem]' : '-left-5 text-[10rem]'} font-black text-white/[0.02] pointer-events-none select-none uppercase`}>
            FLOW
          </h1>

          <div className={`relative z-10 flex flex-col ${isMobile ? 'gap-4 items-center mt-8' : 'gap-6'}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.4em] text-zinc-500 uppercase">Recursive Engine Active</span>
            </div>

            <div className={`flex ${isMobile ? 'flex-col items-center gap-2' : 'flex-col md:flex-row md:items-end gap-4'}`}>
              <h1 className={`${isMobile ? 'text-3xl' : 'text-7xl'} font-light tracking-tighter text-white uppercase`}>
                FLOWCHART<span className="font-black text-[25px] text-cyan-400">_SYNC</span>
              </h1>
            </div>

            <p className={`text-zinc-400 text-sm leading-relaxed ${isMobile ? 'border-t border-zinc-800 pt-4 px-2 max-w-[90%] text-center' : 'max-w-md border-l-2 border-cyan-400/30 pl-4'}`}>
              Real-time visual tracing of recursive logic through dynamic flowcharts. Optimized for deep-call stack monitoring and state isolation.
            </p>

            <div className={`flex flex-wrap gap-4 items-center ${isMobile ? 'justify-center mt-2' : ''}`}>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Logic_Sync</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <div className="w-2 h-2 bg-pink-400 rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">State_Visualizer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

        <div className={`flex-1 flex ${isMobile ? 'flex-col gap-6' : 'flex-row'} ${!isMobile ? 'border-t border-white/10' : ''}`}>
          
          {/* Left Pane: Stack & Controls */}
          <div className={`${isMobile ? 'w-full' : 'w-[350px] border-r'} bg-black/40 border-white/5 p-6 flex flex-col overflow-y-auto`}>
            {!isMobile && (
              <div className="mb-8">
                <h1 className="text-2xl font-black tracking-widest text-white uppercase italic flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00F5FF] rounded-full animate-pulse" />
                  Flow<span className="text-[#00F5FF] font-light">Visualizer</span>
                </h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mt-1">Recursive Code Sync Execution</p>
              </div>
            )}

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col gap-4 mb-8">
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1'} gap-4`}>
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Algorithm:</label>
                  
                  {/* Custom Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => !isRunning && setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm flex justify-between items-center transition-all ${isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:border-cyan-400/50'}`}
                    >
                      <span className="text-cyan-400 font-bold">{ALGO_CONFIGS[selectedAlgo].name}</span>
                      <ChevronRight size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-90' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-[100] top-full left-0 w-full mt-2 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-cyan-900/20"
                        >
                          {Object.entries(ALGO_CONFIGS).map(([key, config]) => (
                            <button
                              key={key}
                              onClick={() => {
                                setSelectedAlgo(key);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full p-3 text-left text-sm transition-colors hover:bg-cyan-400/10 ${selectedAlgo === key ? 'text-cyan-400 bg-cyan-400/5' : 'text-zinc-400'}`}
                            >
                              {config.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                
                {selectedAlgo === 'factorial' && (
                  <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Parameter N:</label>
                    <input 
                      type="number" 
                      className="bg-black/50 text-[#00F5FF] w-16 text-center rounded border border-white/10 font-bold text-sm outline-none p-2"
                      value={paramN}
                      min="1" max="10"
                      onChange={e => setParamN(parseInt(e.target.value) || 1)}
                      disabled={isRunning}
                    />
                  </div>
                )}
              </div>

              <div className="bg-black/20 p-3 rounded-lg">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-2">Clock Speed</label>
                <input 
                  type="range" className="w-full accent-[#00F5FF]" 
                  min="0.5" max="4" step="0.1" 
                  value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}
                />
              </div>
              
              <div className={`flex ${isMobile ? 'flex-row' : 'flex-col'} gap-2 mt-2`}>
                {isRunning ? (
                  <button className="flex-1 bg-[#8A2BE2]/20 border border-[#8A2BE2]/40 text-[#8A2BE2] py-3 rounded-xl font-bold uppercase text-xs flex justify-center items-center gap-2 hover:bg-[#8A2BE2]/30 transition-all" onClick={togglePause}>
                    {isPaused ? <Play size={14} /> : <Pause size={14} />}
                    {isPaused ? "Resume" : "Pause"}
                  </button>
                ) : (
                  <button className="flex-1 bg-[#00F5FF]/20 border border-[#00F5FF]/40 text-[#00F5FF] py-3 rounded-xl font-bold uppercase text-xs flex justify-center items-center gap-2 hover:bg-[#00F5FF]/30 transition-all" onClick={startSimulation}>
                    <Play size={14} /> Execute
                  </button>
                )}
                <button className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl font-bold uppercase text-xs flex justify-center items-center gap-2 hover:bg-white/10 transition-all" onClick={haltSimulation} disabled={!isRunning && engineState.callStack.length === 0}>
                  <RotateCcw size={14} /> Reset
                </button>
              </div>
            </div>

            <div className={`flex-1 flex flex-col border border-white/10 bg-black/50 rounded-xl overflow-hidden ${isMobile ? 'min-h-[250px]' : ''}`}>
              <div className="bg-white/5 p-3 border-b border-white/10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                <Box size={14} /> Call Stack
              </div>
              <div className={`flex-1 p-4 flex ${isMobile ? 'flex-row gap-4 overflow-x-auto overflow-y-hidden' : 'flex-col-reverse gap-3 overflow-y-auto'}`}>
                <AnimatePresence>
                  {engineState.callStack.map((frame, idx) => {
                    const isTop = idx === engineState.callStack.length - 1;
                    return (
                      <motion.div
                        key={frame.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`p-3 rounded-lg border backdrop-blur-md transition-all ${isMobile ? 'min-w-[140px]' : 'w-full'} ${
                          isTop ? 'bg-[#8A2BE2]/10 border-[#8A2BE2]/50 shadow-[0_0_15px_rgba(138,43,226,0.2)]' : 'bg-white/5 border-white/10 opacity-60'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-mono text-[10px] font-bold text-white truncate">{currentConfig.name}</span>
                        </div>
                        <div className="text-[9px] text-zinc-400 font-mono space-y-1">
                          {Object.entries(frame).map(([key, value]) => {
                            if (key === 'id' || key === 'locals') return null;
                            return <div key={key}>{key}: <span className="text-[#00F5FF]">{value.toString()}</span></div>
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {engineState.callStack.length === 0 && (
                  <div className="text-zinc-700 font-mono text-[10px] text-center w-full mt-4">Stack_Idle</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Pane: SVG Flowchart */}
          <div className={`flex-1 relative bg-[#020202] overflow-hidden flex justify-center items-center border-l border-white/5 ${isMobile ? 'min-h-[500px]' : ''}`}>
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)] pointer-events-none" />
             <div className="w-full h-full relative overflow-auto no-scrollbar" style={{ minHeight: isMobile ? '500px' : '800px', minWidth: isMobile ? '400px' : '800px' }}>
                <svg width="100%" height="100%" viewBox={isMobile ? "100 0 600 700" : "0 0 800 800"} className="absolute inset-0">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.03)" />
                    </pattern>
                    <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.2)" />
                    </marker>
                    <marker id="arrow-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#00F5FF" />
                    </marker>
                    <marker id="arrow-loop" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#8A2BE2" />
                    </marker>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {currentConfig.edges.map(e => {
                    const fNode = currentConfig.nodes.find(n => n.id === e.from);
                    const tNode = currentConfig.nodes.find(n => n.id === e.to);
                    const f = getCenter(fNode);
                    const t = getCenter(tNode);
                    const isActive = engineState.activeEdge === e.id;
                    
                    let stroke = "rgba(255,255,255,0.1)";
                    let marker = "url(#arrow)";
                    let strokeWidth = isActive ? "3" : "2";
                    let dashArray = isActive ? "10 5" : "none";
                    let classes = isActive ? "animate-[dash_1s_linear_infinite]" : "transition-all duration-300";

                    if (isActive) {
                      if (e.isLoop) {
                        stroke = "#8A2BE2";
                        marker = "url(#arrow-loop)";
                      } else if (engineState.status === 'success') {
                        stroke = "#39ff14";
                        marker = "url(#arrow-active)";
                      } else if (engineState.status === 'fail') {
                        stroke = "#ff003c";
                        marker = "url(#arrow-active)";
                      } else {
                        stroke = "#00F5FF";
                        marker = "url(#arrow-active)";
                      }
                    }

                    let pathD = getBezierPath(f, t, e.isLoop, currentSizes);
                    return (
                      <g key={e.id}>
                        <path d={pathD} fill="none" stroke={stroke} strokeWidth={strokeWidth} markerEnd={marker} strokeDasharray={dashArray} className={classes} />
                        {e.label && (
                          <text x={(f.x + t.x)/2} y={(f.y + t.y)/2 - 10} fill={isActive ? stroke : "rgba(255,255,255,0.4)"} fontSize={isMobile ? "10" : "12"} fontWeight="bold" textAnchor="middle">
                            {e.label}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {currentConfig.nodes.map(n => {
                    const size = currentSizes[n.type];
                    const isActive = engineState.activeNode === n.id;
                    let stroke = "rgba(255,255,255,0.1)";
                    let fill = "rgba(255,255,255,0.03)";
                    
                    if (isActive) {
                      if (n.type === 'decision') {
                        if (engineState.status === 'success') stroke = "#39ff14";
                        else if (engineState.status === 'fail') stroke = "#ff003c";
                        else stroke = "#FFD700";
                      } else if (engineState.status === 'recursive') {
                        stroke = "#8A2BE2";
                      } else {
                        stroke = "#00F5FF";
                      }
                      fill = `${stroke}20`;
                    }

                    const displayLabel = currentConfig.substitute(n.label, topFrame);

                    return (
                      <g key={n.id} transform={`translate(${n.x},${n.y})`} className="transition-all duration-300">
                        {n.type === "process" && (
                          <>
                            <rect x={-size.w/2} y={-size.h/2} width={size.w} height={size.h} rx="8" fill={fill} stroke={stroke} strokeWidth={isActive ? 3 : 1.5} filter={isActive ? `drop-shadow(0 0 10px ${stroke})` : 'none'} className="transition-all duration-300" />
                          </>
                        )}
                        {n.type === "start" && (
                          <rect x={-size.w/2} y={-size.h/2} width={size.w} height={size.h} rx={size.h/2} fill={fill} stroke={stroke} strokeWidth={isActive ? 3 : 1.5} filter={isActive ? `drop-shadow(0 0 10px ${stroke})` : 'none'} className="transition-all duration-300" />
                        )}
                        {n.type === "decision" && (
                          <polygon points={`0,${-size.h/2} ${size.w/2},0 0,${size.h/2} ${-size.w/2},0`} fill={fill} stroke={stroke} strokeWidth={isActive ? 3 : 1.5} filter={isActive ? `drop-shadow(0 0 10px ${stroke})` : 'none'} className="transition-all duration-300" />
                        )}
                        <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill={isActive ? "#fff" : "rgba(255,255,255,0.8)"} style={{ fontSize: isMobile ? '10px' : '13px' }} className="font-mono font-bold tracking-tight pointer-events-none">
                          {displayLabel}
                        </text>
                      </g>
                    );
                  })}
                </svg>
             </div>
          </div>
        </div>
      
      <style>{`
        @keyframes dash { to { stroke-dashoffset: -30; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

