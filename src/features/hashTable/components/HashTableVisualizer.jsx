import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Play, Pause, SkipForward, RotateCcw, 
  Plus, Trash2, Search, Terminal, Box, 
  Cpu, Zap, Database, ChevronRight, Activity,
  Settings2, ArrowRight, Hash, Calculator, Layers,
  Binary, Command
} from 'lucide-react';
import Header from '../../../components/Header';
import { HashLogic } from '../../../dsa/hash-table/HashLogic';
import { getHashCode } from '../../../dsa/hash-table/CodeTemplates';
import '../styles/HashTableVisualizer.css';
import { useIsMobile } from '../../../hooks/use-mobile';

const HashTableVisualizer = () => {
  const isMobile = useIsMobile();
  const [size, setSize] = useState(11);
  const [hashType, setHashType] = useState('division');
  const [probeType, setProbeType] = useState('linear');
  const [table, setTable] = useState(Array(11).fill(null));
  const [activeLine, setActiveLine] = useState(-1);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [collisionIndex, setCollisionIndex] = useState(-1);
  const [status, setStatus] = useState('SYSTEM_IDLE');
  const [mathLogs, setMathLogs] = useState([]);
  const [currentMath, setCurrentMath] = useState(null);
  const [inputValue, setInputValue] = useState('42');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const logicRef = useRef(null);
  const stepResolverRef = useRef(null);
  const isPausedRef = useRef(false);
  const speedRef = useRef(1000);
  const logEndRef = useRef(null);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mathLogs]);

  const onUpdate = useCallback(({ line, table: newTable, highlightedIndex, collisionIndex, message, math }) => {
    setActiveLine(line);
    setTable(newTable);
    setHighlightedIndex(highlightedIndex !== undefined ? highlightedIndex : -1);
    setCollisionIndex(collisionIndex !== undefined ? collisionIndex : -1);
    
    if (math) setCurrentMath(math);
    if (message) {
      setStatus(message);
      setMathLogs(prev => [...prev, { message, math, timestamp: new Date().toLocaleTimeString().split(' ')[0] }]);
    }
  }, []);

  useEffect(() => {
    logicRef.current = new HashLogic(size, hashType, probeType, onUpdate, () => speedRef.current, checkPause);
    setTable(Array(size).fill(null));
    setMathLogs([]);
    setCurrentMath(null);
  }, [size, hashType, probeType, onUpdate]);

  const checkPause = useCallback(() => {
    if (isPausedRef.current) {
      setStatus('PAUSED');
      return new Promise(resolve => {
        stepResolverRef.current = resolve;
      });
    }
    return Promise.resolve();
  }, []);

  const handleExecute = async () => {
    if (isExecuting || !inputValue) return;
    setIsExecuting(true);
    setIsPaused(false);
    setCurrentMath(null);
    setMathLogs([]);
    
    try {
      await logicRef.current.insert(inputValue);
    } catch (error) {
      console.error("Execution error:", error);
      setStatus('ERROR');
    } finally {
      setIsExecuting(false);
      setActiveLine(-1);
      setHighlightedIndex(-1);
      setCollisionIndex(-1);
    }
  };

  const handleStep = () => {
    if (stepResolverRef.current) {
      stepResolverRef.current();
      stepResolverRef.current = null;
      setStatus('STEP_SYNC');
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused && stepResolverRef.current) {
      handleStep();
    }
  };

  const resetTable = () => {
    logicRef.current = new HashLogic(size, hashType, probeType, onUpdate, () => speedRef.current, checkPause);
    setTable(Array(size).fill(null));
    setMathLogs([]);
    setCurrentMath(null);
    setHighlightedIndex(-1);
    setCollisionIndex(-1);
    setActiveLine(-1);
    setStatus('READY');
  };

  return (
    <div className={`hash-v3-container ${isMobile ? 'mobile-view' : ''}`}>
      <Header />

      <div className={`relative flex flex-col items-center justify-center text-center overflow-hidden w-full shrink-0 ${isMobile ? 'pt-24 pb-4' : 'pt-32 pb-8'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#00ffcc]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-zinc-800" />
            <span className="text-[10px] font-mono tracking-[0.6em] text-zinc-500 uppercase">Architecture // V3</span>
            <div className="h-[1px] w-8 bg-zinc-800" />
          </div>
          <h1 className={`${isMobile ? 'text-4xl' : 'text-6xl md:text-8xl'} font-black tracking-tighter text-white uppercase italic`}>
            Hash<span className="text-[#00ffcc] not-italic">.</span>Table
          </h1>
          
          <p className={`mt-6 mx-auto text-zinc-400 leading-relaxed font-light tracking-wide ${isMobile ? 'text-xs max-w-[90%] px-4' : 'text-sm max-w-lg'}`}>
            A high-fidelity environment for <span className="text-white">algorithmic exploration</span>. 
            Optimized for structural transparency and real-time computation.
          </p>
        </div>
      </div>
      
      <div className={`hash-dashboard ${isMobile ? 'flex flex-col' : ''}`}>
        {/* Left Side: Table View (Primary) */}
        <div className="hash-main-canvas">
          <div className={`canvas-header ${isMobile ? 'flex-col items-center text-center gap-4' : ''}`}>
            <div className={`flex items-center ${isMobile ? 'flex-col gap-3' : 'gap-4'}`}>
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 tracking-[0.4em] uppercase">Storage_Engine</span>
                <h2 className="text-2xl font-bold tracking-tighter text-white">HASH_REGISTRY_v3</h2>
              </div>
              {!isMobile && <div className="h-8 w-[1px] bg-zinc-800" />}
              <div className="status-badge">
                <div className={`status-dot ${isExecuting ? 'active' : ''}`} />
                <span>{status}</span>
              </div>
            </div>

            {/* Live Calculation Overlay - Right Corner */}
            <AnimatePresence>
              {currentMath && (
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  className="live-calculation-card"
                >
                  <div className="card-header">
                    <Calculator size={12} className="text-[#00ffcc]" />
                    <span>LIVE_CALCULATION</span>
                  </div>
                  <div className="math-text">{currentMath}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="table-grid-wrapper">
            <div className="hash-grid-v3">
              {table.map((val, i) => (
                <motion.div
                  key={i}
                  layout
                  className={`slot-v3 ${highlightedIndex === i ? 'active' : ''} ${collisionIndex === i ? 'collision' : ''} ${val !== null ? 'filled' : ''}`}
                >
                  <div className="slot-idx">{i}</div>
                  <div className="slot-content">
                    {val !== null ? (
                       <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{val}</motion.span>
                    ) : (
                       <span className="null-indicator">EMPTY</span>
                    )}
                  </div>
                  {highlightedIndex === i && <div className="probing-tag">PROBING</div>}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="canvas-footer">
             <div className={`control-bar ${isMobile ? 'flex-wrap justify-center gap-3' : ''}`}>
                <div className={`input-field ${isMobile ? 'w-full' : ''}`}>
                  <input 
                    type="number" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="ENTER_KEY"
                    disabled={isExecuting}
                    className={isMobile ? 'flex-1' : ''}
                  />
                  <button className="execute-trigger" onClick={handleExecute} disabled={isExecuting || !inputValue}>
                    INSERT
                  </button>
                </div>
                {!isMobile && <div className="h-6 w-[1px] bg-zinc-800" />}
                
                <div className={`flex gap-2 ${isMobile ? 'w-full justify-center' : ''}`}>
                  <button className="icon-action" onClick={togglePause} disabled={!isExecuting}>
                    {isPaused ? <Play size={16} /> : <Pause size={16} />}
                  </button>
                  <button className="icon-action" onClick={handleStep} disabled={!isExecuting || !isPaused}>
                    <SkipForward size={16} />
                  </button>
                  <button className="icon-action" onClick={resetTable}>
                    <RotateCcw size={16} />
                  </button>
                </div>

                {!isMobile && <div className="h-6 w-[1px] bg-zinc-800" />}
                <div className={`velocity-control ${isMobile ? 'w-full items-center mt-2 max-w-full' : ''}`}>
                  <span className="text-[9px] text-zinc-500">SPD: {speed}ms</span>
                  <input 
                    type="range" 
                    min="100" max="2000" 
                    value={2100 - speed} 
                    onChange={(e) => setSpeed(2100 - parseInt(e.target.value))} 
                    className={isMobile ? 'w-[80%]' : ''}
                  />
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Logic & Terminal */}
        <div className="hash-logic-sidebar">
          {/* Config Section */}
          <div className="sidebar-panel config-panel">
            <div className="panel-label">
              <Settings2 size={12} />
              <span>CONFIGURATION</span>
            </div>
            <div className="dropdown-grid">
               <div className="custom-select">
                  <label>SIZE</label>
                  <select value={size} onChange={(e) => setSize(parseInt(e.target.value))} disabled={isExecuting}>
                    {[7, 11, 13, 17].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
               </div>
               <div className="custom-select">
                  <label>HASH</label>
                  <select value={hashType} onChange={(e) => setHashType(e.target.value)} disabled={isExecuting}>
                    <option value="division">Division</option>
                    <option value="midSquare">Mid-Square</option>
                    <option value="folding">Folding</option>
                  </select>
               </div>
               <div className="custom-select">
                  <label>PROBE</label>
                  <select value={probeType} onChange={(e) => setProbeType(e.target.value)} disabled={isExecuting}>
                    <option value="linear">Linear</option>
                    <option value="quadratic">Quadratic</option>
                    <option value="double">Double</option>
                  </select>
               </div>
            </div>
          </div>

          {/* Source Code Section */}
          <div className="sidebar-panel code-panel">
             <div className="panel-label">
                <Command size={12} />
                <span>SOURCE_EXECUTION</span>
             </div>
             <div className="code-view-v3">
                <SyntaxHighlighter
                  language="javascript"
                  style={vscDarkPlus}
                  showLineNumbers
                  customStyle={{ background: 'transparent', padding: '1rem 0', margin: 0, fontSize: '0.75rem' }}
                  lineProps={lineNumber => ({
                    style: { 
                      display: 'block', 
                      width: '100%', 
                      background: lineNumber === activeLine ? 'rgba(255, 215, 0, 0.15)' : 'transparent',
                      borderLeft: lineNumber === activeLine ? '3px solid #ffd700' : 'none'
                    }
                  })}
                >
                  {getHashCode(hashType, probeType)}
                </SyntaxHighlighter>
             </div>
          </div>

          {/* Math Log Section */}
          <div className="sidebar-panel terminal-panel">
             <div className="panel-label">
                <Binary size={12} />
                <span>MATH_TERMINAL</span>
             </div>
             <div className="terminal-logs">
                {mathLogs.length === 0 && <div className="text-zinc-700 text-[10px] italic">No active logs...</div>}
                {mathLogs.map((log, i) => (
                  <div key={i} className="log-row">
                    <span className="log-time">{log.timestamp}</span>
                    <span className="log-msg">{log.message}</span>
                    {log.math && <span className="log-calc">{log.math}</span>}
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

export default HashTableVisualizer;