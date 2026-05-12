import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Play, Pause, SkipForward, RotateCcw, 
  Plus, Trash2, Search, Terminal, Box, 
  Cpu, Zap, Database, ChevronRight, Activity,
  Settings2, ArrowRight, RefreshCw, Eye
} from 'lucide-react';
import Header from '../../../components/Header';
import { LinkedListLogic } from './LinkedListLogic';
import { CIR_CODE } from './CodeTemplates';
import { useIsMobile } from '../../../hooks/use-mobile';
import './CircularLinkedListVisualizer.css';

const CircularLinkedListVisualizer = () => {
  const isMobile = useIsMobile();
  const [list, setList] = useState([]);
  const [memoryPool, setMemoryPool] = useState([]);
  const [activeMethod, setActiveMethod] = useState('insert');
  const [activeLine, setActiveLine] = useState(-1);
  const [pointers, setPointers] = useState({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [inputValue, setInputValue] = useState('10');
  const [indexValue, setIndexValue] = useState('0');
  const [status, setStatus] = useState('SYSTEM_IDLE');

  const logicRef = useRef(null);
  const stepResolverRef = useRef(null);
  const isPausedRef = useRef(false);
  const speedRef = useRef(1000);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const checkPause = useCallback(() => {
    if (isPausedRef.current) {
      setStatus('PAUSED_BY_USER');
      return new Promise(resolve => {
        stepResolverRef.current = resolve;
      });
    }
    return Promise.resolve();
  }, []);

  const onUpdate = useCallback(({ line, head, pointers, list: newList, memoryPool: newPool }) => {
    setActiveLine(line);
    setPointers(pointers || {});
    setList(newList);
    if (newPool) setMemoryPool(newPool);
    if (line !== -1) setStatus(`EXECUTING_LINE_${line}`);
  }, []);

  useEffect(() => {
    logicRef.current = new LinkedListLogic(onUpdate, () => speedRef.current, checkPause);
    setMemoryPool(logicRef.current.memoryPool);
  }, [onUpdate, checkPause]);

  const handleExecute = async (method, ...args) => {
    if (isExecuting) return;
    setIsExecuting(true);
    setActiveMethod(method);
    setIsPaused(false);
    setStatus(`STARTING_${method.toUpperCase()}`);
    
    try {
      await logicRef.current[method](...args);
      setStatus('EXECUTION_COMPLETE');
    } catch (error) {
      console.error("Execution error:", error);
      setStatus('SYSTEM_ERROR');
    } finally {
      setIsExecuting(false);
      setActiveLine(-1);
      setPointers({});
      setTimeout(() => setStatus('SYSTEM_READY'), 2000);
    }
  };

  const handleStep = () => {
    if (stepResolverRef.current) {
      stepResolverRef.current();
      stepResolverRef.current = null;
      setStatus('STEP_EXECUTED');
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused && stepResolverRef.current) {
      handleStep();
    }
  };

  const resetList = () => {
    logicRef.current = new LinkedListLogic(onUpdate, () => speedRef.current, checkPause);
    setList([]);
    setMemoryPool(logicRef.current.memoryPool);
    setPointers({});
    setActiveLine(-1);
    setStatus('SYSTEM_RESET');
  };

  return (
    <div className={`cir-container ${isMobile ? 'mobile-view' : ''}`}>
      <Header />
      
      <div className="cir-top-info">
        <div className={`flex ${isMobile ? 'flex-col items-start gap-4' : 'items-center gap-6'}`}>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em]">Module</span>
            <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-light tracking-tighter text-white`}>
              Circular<span className="font-black text-emerald-500">_LinkedList</span>
            </h1>
          </div>
          {!isMobile && <div className="h-10 w-[1px] bg-zinc-800" />}
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em]">Status</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isExecuting ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
              <span className="font-mono text-xs text-zinc-300">{status}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="cir-main">
        {/* Left Pane: Code & Controls */}
        <section className="cir-left-pane">
          <div className="cir-panel cir-code-panel">
            <div className="cir-panel-header">
              <Terminal size={14} className="text-zinc-500" />
              <span>SOURCE_CODE: {activeMethod}.js</span>
            </div>
            <div className="cir-code-content">
              <SyntaxHighlighter
                language="javascript"
                style={vscDarkPlus}
                showLineNumbers
                customStyle={{ background: 'transparent', padding: '1rem 0', margin: 0, fontSize: '0.85rem' }}
                lineProps={lineNumber => {
                  const style = { display: 'block', width: '100%', transition: 'all 0.2s' };
                  if (lineNumber === activeLine) {
                    return { 
                      style: { ...style, background: 'rgba(255, 215, 0, 0.15)', borderLeft: '4px solid #ffd700' } 
                    };
                  }
                  return { style };
                }}
              >
                {CIR_CODE[activeMethod]}
              </SyntaxHighlighter>
            </div>
          </div>

          <div className="cir-panel cir-controls-panel">
            <div className="cir-panel-header">
              <Settings2 size={14} className="text-zinc-500" />
              <span>EXECUTION_CONTROLS</span>
            </div>
            <div className="cir-controls-grid">
              <div className="cir-input-group">
                <label>VALUE</label>
                <input 
                  type="text" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Data"
                />
              </div>
              <div className="cir-input-group">
                <label>INDEX</label>
                <input 
                  type="number" 
                  value={indexValue} 
                  onChange={(e) => setIndexValue(e.target.value)}
                  placeholder="Pos"
                />
              </div>
              
              <button 
                className="cir-action-btn primary"
                disabled={isExecuting}
                onClick={() => handleExecute('insert', inputValue, parseInt(indexValue) || 0)}
              >
                <Plus size={16} /> INSERT
              </button>
              
              <button 
                className="cir-action-btn"
                disabled={isExecuting || list.length === 0}
                onClick={() => handleExecute('delete', parseInt(indexValue) || 0)}
              >
                <Trash2 size={16} /> DELETE
              </button>
              
              <button 
                className="cir-action-btn"
                disabled={isExecuting || list.length === 0}
                onClick={() => handleExecute('search', inputValue)}
              >
                <Search size={16} /> SEARCH
              </button>

              <button 
                className="cir-action-btn"
                disabled={isExecuting || list.length === 0}
                onClick={() => handleExecute('traverse')}
              >
                <Eye size={16} /> TRAVERSE
              </button>

              <button className="cir-action-btn" style={{ gridColumn: 'span 2' }} onClick={resetList}>
                <RotateCcw size={16} /> RESET_SYSTEM
              </button>
            </div>

            <div className="px-5 pb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-zinc-500 tracking-widest">VELOCITY</span>
                <span className="text-[10px] text-emerald-500 font-mono">{speed}ms</span>
              </div>
              <input 
                type="range" 
                className="cir-range"
                min="100" 
                max="2000" 
                step="100" 
                value={2100 - speed} 
                onChange={(e) => setSpeed(2100 - parseInt(e.target.value))}
              />
              
              <div className="flex gap-2 mt-4">
                <button 
                  className={`cir-play-btn ${isPaused ? 'paused' : ''}`}
                  onClick={togglePause}
                  disabled={!isExecuting}
                >
                  {isPaused ? <Play size={14} /> : <Pause size={14} />}
                  {isPaused ? 'RESUME' : 'PAUSE'}
                </button>
                <button 
                  className="cir-play-btn"
                  onClick={handleStep}
                  disabled={!isExecuting || !isPaused}
                >
                  <SkipForward size={14} /> STEP
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Pane: Visual Canvas */}
        <section className="cir-visual-pane">
          <div className="cir-canvas-header">
            <div className="flex items-center p-5 gap-2">
              <Activity size={14} className="text-emerald-500" />
              <span className="text-[10px] tracking-[0.2em] text-zinc-400">MEMORY_VISUALIZATION</span>
            </div>
          </div>
          
          <div className="cir-canvas-main">
            <div className="cir-node-line">
              <AnimatePresence>
                {list.length === 0 && !isExecuting && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="cir-empty-state"
                  >
                    <Database size={40} className="text-zinc-800 mb-4" />
                    <p>SYSTEM_IDLE</p>
                    <span className="text-zinc-600 text-xs">Waiting for initialization...</span>
                  </motion.div>
                )}
                {list.map((node, index) => {
                  const isCurr = pointers.curr?.id === node.id;
                  const isNewNode = pointers.newNode?.id === node.id;
                  const isFound = pointers.found?.id === node.id;
                  const isActive = isCurr || isNewNode || isFound;
                  const isHead = index === 0;
                  const isLast = index === list.length - 1;
                  
                  return (
                    <div key={node.id} className="cir-node-wrapper">
                      <motion.div
                        layout
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ 
                          scale: isActive ? 1.05 : 1, 
                          opacity: 1, 
                          y: 0,
                          borderColor: isActive ? '#ffd700' : 'rgba(255,255,255,0.1)',
                          boxShadow: isActive ? '0 0 20px rgba(255, 215, 0, 0.3)' : '0 10px 20px rgba(0,0,0,0.3)'
                        }}
                        exit={{ scale: 0.8, opacity: 0, y: -20 }}
                        className={`cir-node-v2 ${isActive ? 'is-active' : ''}`}
                      >
                        <div className="cir-node-addr">{node.address}</div>
                        <div className="cir-node-val-v2">{node.value}</div>
                        <div className="cir-node-ptr-v2">
                          NEXT {'->'} {node.nextAddr}
                        </div>
                        
                        <div className="cir-pointer-tags-container">
                          {isFound && <div className="cir-pointer-tag found">FOUND</div>}
                          {isCurr && <div className="cir-pointer-tag curr">CURR</div>}
                          {isNewNode && <div className="cir-pointer-tag new">NEW</div>}
                          {isHead && <div className="cir-pointer-tag head">HEAD</div>}
                        </div>
                      </motion.div>
                      
                      {index < list.length - 1 && (
                        <div className="cir-node-connector">
                          <ArrowRight size={20} className={isActive ? "text-[#ffd700]" : "text-zinc-700"} />
                        </div>
                      )}

                      {isLast && list.length > 0 && (
                        <div className="cir-circular-connector">
                           <div className="cir-curved-arrow"></div>
                           <span className="cir-back-label">BACK_TO_HEAD</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </AnimatePresence>

              {pointers.newNode && !list.find(n => n.id === pointers.newNode.id) && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="cir-node-v2 is-active ghost"
                  style={{ borderColor: '#ffd700' }}
                >
                  <div className="cir-node-addr">{pointers.newNode.address}</div>
                  <div className="cir-node-val-v2">{pointers.newNode.value}</div>
                  <div className="cir-node-ptr-v2">PTR_INIT</div>
                  <div className="cir-pointer-tag new">NEW_NODE</div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="cir-memory-footer">
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={12} className="text-zinc-500" />
              <span className="text-[10px] tracking-widest text-zinc-500 uppercase">Physical_RAM_Pool</span>
            </div>
            <div className="cir-memory-grid">
              {memoryPool.map((slot, i) => {
                const isActive = list.some(node => node.address === slot.address) || 
                               (pointers.newNode?.address === slot.address);
                return (
                  <div key={i} className={`cir-memory-slot ${isActive ? 'active' : ''}`}>
                    {slot.address}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CircularLinkedListVisualizer;
