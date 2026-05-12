import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronRight, Hash, Terminal, Cpu, Info, Zap } from 'lucide-react';
import { BOYER_MOORE_CODE, STEPS, INITIAL_STATE } from './boyerMooreLogic';
import './BoyerMooreVisualizer.css';

const BoyerMooreVisualizer = ({ initialArray = [2, 1, 1, 2, 2, 3, 2, 2] }) => {
  const [array, setArray] = useState(initialArray);
  const [state, setState] = useState(INITIAL_STATE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isStepMode, setIsStepMode] = useState(false);
  const [inputValue, setInputValue] = useState(initialArray.join(', '));
  
  const stateRef = useRef(INITIAL_STATE);
  const isPlayingRef = useRef(false);
  const speedRef = useRef(1);
  const resolveStepRef = useRef(null);

  // Sync refs with state
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms / speedRef.current));

  const updateState = (updates) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      stateRef.current = newState;
      return newState;
    });
  };

  const triggerStep = async (line, status, updates = {}, pulseType = null) => {
    updateState({ currentLine: line, status, pulseType, ...updates });
    
    // Wait for animation frame and speed delay
    await delay(800);
    
    // If in step mode, wait for user input
    if (isStepMode) {
      setIsPlaying(false);
      return new Promise(resolve => {
        resolveStepRef.current = resolve;
      });
    }

    // Handle pause
    while (!isPlayingRef.current && !stateRef.current.isFinished) {
      await delay(100);
    }
  };

  const executeAlgorithm = useCallback(async () => {
    const nums = [...array];
    
    await triggerStep(STEPS.START, "Initializing Execution Environment...");
    await triggerStep(STEPS.INIT_VARS, "Setting candidate = null, count = 0", { candidate: null, count: 0 });

    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      await triggerStep(STEPS.FOR_LOOP, `Iterating array: checking index ${i} (value: ${num})`, { index: i });

      await triggerStep(STEPS.CHECK_COUNT_ZERO, `Checking if count is 0... Current count: ${stateRef.current.count}`);
      if (stateRef.current.count === 0) {
        await triggerStep(STEPS.SET_CANDIDATE, `Count is 0. New candidate selected: ${num}`, { candidate: num, count: 1 }, 'up');
      } else {
        await triggerStep(STEPS.CHECK_MATCH, `Comparing ${num} with current candidate ${stateRef.current.candidate}`);
        if (num === stateRef.current.candidate) {
          await triggerStep(STEPS.INCREMENT_COUNT, `Match found! Incrementing count to ${stateRef.current.count + 1}`, { count: stateRef.current.count + 1 }, 'up');
        } else {
          await triggerStep(STEPS.DECREMENT_COUNT, `Conflict detected. Decrementing count to ${stateRef.current.count - 1}`, { count: stateRef.current.count - 1 }, 'down');
        }
      }
      await triggerStep(STEPS.LOOP_END, `Finished processing element at index ${i}`);
    }

    await triggerStep(STEPS.RETURN, `Algorithm Complete. Majority Candidate identified: ${stateRef.current.candidate}`, { isFinished: true, index: -1 });
    setIsPlaying(false);
  }, [array]);

  const startPlayback = () => {
    if (state.isFinished) {
      resetSimulation();
      // Wait for reset to propagate
      setTimeout(() => {
        setIsPlaying(true);
        executeAlgorithm();
      }, 100);
    } else {
      setIsPlaying(true);
      if (state.currentLine === -1) {
        executeAlgorithm();
      }
    }
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    setState(INITIAL_STATE);
    if (resolveStepRef.current) {
      resolveStepRef.current();
      resolveStepRef.current = null;
    }
  };

  const nextStep = () => {
    if (resolveStepRef.current) {
      resolveStepRef.current();
      resolveStepRef.current = null;
    } else if (!isPlaying && !state.isFinished) {
      setIsPlaying(true);
      executeAlgorithm();
    }
  };

  const handleCustomArray = () => {
    const newArray = inputValue.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (newArray.length > 0) {
      setArray(newArray);
      resetSimulation();
    }
  };

  return (
    <div className="bm-visualizer-container">
      <div className="bm-header">
        <div className="bm-brand">
          <h2>
            <Zap size={24} className="text-[#22d3ee]" />
            BOYER-MOORE <span className="text-zinc-500 font-light">VOTE_ENGINE</span>
          </h2>
          <div className="flex gap-2">
            <span className="badge">Greedy_Sync</span>
            <span className="badge">Async_Lock</span>
          </div>
        </div>

        <div className="bm-controls">
          <div className="speed-control">
            <label>Clock Speed</label>
            <input 
              type="range" 
              className="speed-slider" 
              min="0.5" 
              max="4" 
              step="0.1" 
              value={speed} 
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1">
            <Hash size={14} className="text-zinc-500" />
            <input 
              type="text" 
              className="bg-transparent border-none outline-none text-xs font-mono w-32 text-zinc-300"
              placeholder="e.g. 2, 1, 1, 2"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isPlaying}
            />
            <button 
              className="text-[10px] font-bold uppercase tracking-widest text-[#22d3ee] hover:opacity-80 transition-opacity"
              onClick={handleCustomArray}
              disabled={isPlaying}
            >
              Set
            </button>
          </div>
          
          <button className="control-btn" onClick={resetSimulation}>
            <RotateCcw size={16} /> Reset
          </button>

          {isPlaying ? (
            <button className="control-btn primary" onClick={() => setIsPlaying(false)}>
              <Pause size={18} /> Pause
            </button>
          ) : (
            <button className="control-btn primary" onClick={startPlayback}>
              <Play size={18} /> {state.currentLine === -1 ? 'Execute' : 'Resume'}
            </button>
          )}
          
          {isStepMode && (
            <button className="control-btn primary" onClick={nextStep} disabled={state.isFinished}>
              <ChevronRight size={18} /> Step
            </button>
          )}
        </div>
      </div>

      <div className="main-stage">
        {/* Left: Visualization */}
        <div className="viz-pane">
          <div className="stats-grid">
            <motion.div 
              className={`stat-card candidate`}
              animate={{ 
                scale: state.pulseType ? [1, 1.02, 1] : 1,
                borderColor: state.pulseType ? 'rgba(34, 211, 238, 0.4)' : 'rgba(255, 255, 255, 0.05)'
              }}
            >
              <span className="stat-label">Majority Candidate</span>
              <div className="stat-value">{state.candidate !== null ? state.candidate : 'NULL'}</div>
            </motion.div>

            <motion.div 
              className={`stat-card count ${state.pulseType === 'up' ? 'pulse-up' : state.pulseType === 'down' ? 'pulse-down' : ''}`}
              animate={{ 
                scale: state.pulseType ? [1, 1.05, 1] : 1,
                backgroundColor: state.pulseType === 'up' ? 'rgba(244, 114, 182, 0.1)' : state.pulseType === 'down' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <span className="stat-label">Confidence Count</span>
              <div className="stat-value" style={{ color: state.pulseType === 'up' ? '#f472b6' : state.pulseType === 'down' ? '#fbbf24' : '#fff' }}>
                {state.count}
              </div>
            </motion.div>
          </div>

          <div className="array-track">
            <AnimatePresence mode="popLayout">
              {array.map((val, i) => {
                const isActive = i === state.index;
                const isMatch = isActive && val === state.candidate && state.count > 0;
                const isConflict = isActive && val !== state.candidate && state.candidate !== null;
                
                return (
                  <motion.div
                    key={`${i}-${val}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: isActive ? 1.1 : 1,
                    }}
                    className={`array-element ${isActive ? 'active' : ''} ${isMatch ? 'matches' : ''} ${isConflict ? 'conflicts' : ''}`}
                  >
                    {val}
                    {isActive && (
                      <motion.div 
                        className="pointer-arrow"
                        layoutId="pointer"
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                      >
                        <ChevronRight size={32} style={{ transform: 'rotate(90deg)' }} />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="status-log">
            <Terminal size={14} />
            <span>{state.status}</span>
            <div className="status-cursor" />
          </div>
        </div>

        {/* Right: Code Trace */}
        <div className="code-pane">
          <div className="code-header">
            <Cpu size={14} />
            <span>BOYER_MOORE_LOGIC.TS</span>
            <div className="ml-auto flex gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div className="code-content">
            {BOYER_MOORE_CODE.map((line, idx) => (
              <div 
                key={idx} 
                className={`code-line ${idx === state.currentLine ? 'active' : ''}`}
                style={{ paddingLeft: `${line.indent + 1}rem` }}
              >
                {line.text}
              </div>
            ))}
            {state.currentLine !== -1 && (
              <motion.div 
                className="code-highlight"
                animate={{ top: `${state.currentLine * 1.8}rem` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ top: `${state.currentLine * 1.8}rem`, height: '1.8rem' }}
              />
            )}
          </div>
          <div className="p-4 bg-zinc-900/50 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
              <Info size={12} /> Sync_Status: {state.isFinished ? 'IDLE' : isPlaying ? 'LOCKED' : 'PAUSED'}
            </div>
            <div className="flex items-center gap-2">
               <label className="text-[10px] text-zinc-500 uppercase font-bold">Step Mode</label>
               <input 
                type="checkbox" 
                checked={isStepMode} 
                onChange={(e) => {
                  setIsStepMode(e.target.checked);
                  if (!e.target.checked && resolveStepRef.current) {
                    resolveStepRef.current();
                  }
                }}
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoyerMooreVisualizer;
