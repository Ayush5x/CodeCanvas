import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Plus, Trash2, Terminal, Cpu, Zap, Hash, Clock, Layers, ArrowDown } from 'lucide-react';
import { STABLE_RECURSIVE_CODE, STEPS, INITIAL_STATE } from './stableRecursiveLogic';
import './StableRecursiveVisualizer.css';

const StableRecursiveVisualizer = ({ initialActivities = [
  { id: 1, start: 1, finish: 4 },
  { id: 2, start: 3, finish: 5 },
  { id: 3, start: 0, finish: 6 },
  { id: 4, start: 5, finish: 7 },
  { id: 5, start: 3, finish: 9 },
  { id: 6, start: 5, finish: 9 },
  { id: 7, start: 6, finish: 10 },
  { id: 8, start: 8, finish: 11 },
  { id: 9, start: 8, finish: 12 },
  { id: 10, start: 2, finish: 14 },
  { id: 11, start: 12, finish: 16 }
] }) => {
  // Add a virtual activity at the start (index 0) with finish 0
  const [activities, setActivities] = useState([{ id: 0, start: 0, finish: 0 }, ...initialActivities.sort((a, b) => a.finish - b.finish)]);
  const [state, setState] = useState(INITIAL_STATE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  const stateRef = useRef(INITIAL_STATE);
  const isPlayingRef = useRef(false);
  const speedRef = useRef(1);

  useEffect(() => {
    stateRef.current = state;
    isPlayingRef.current = isPlaying;
    speedRef.current = speed;
  }, [state, isPlaying, speed]);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms / speedRef.current));

  const updateState = (updates) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      stateRef.current = newState;
      return newState;
    });
  };

  const triggerStep = async (line, status, updates = {}) => {
    updateState({ currentLine: line, status, ...updates });
    await delay(1000);
    while (!isPlayingRef.current && !stateRef.current.isFinished) {
      await delay(100);
    }
  };

  const activitySelectRecursive = async (S, i, n, depth = 0) => {
    const currentFrame = { name: `CALL_${depth}`, i, n, depth };
    const newStack = [...stateRef.current.stack, currentFrame];
    
    await triggerStep(STEPS.START, `Recursive Call: activitySelect(S, ${i}, ${n})`, { 
      stack: newStack, 
      depth,
      currentIndex: i 
    });

    await triggerStep(STEPS.INIT_M, `Setting m = i + 1 = ${i + 1}`);
    let m = i + 1;
    updateState({ currentM: m });

    await triggerStep(STEPS.WHILE_START, `Searching for first compatible activity...`);
    while (m <= n && S[m].start < S[i].finish) {
      const isDiscarded = m <= n && S[m].start < S[i].finish;
      if (isDiscarded) {
        updateState({ 
          discardedIds: [...new Set([...stateRef.current.discardedIds, S[m].id])],
          status: `Activity ${S[m].id} starts at ${S[m].start}, before ${S[i].id} finishes at ${S[i].finish}. Discarding...`
        });
        await delay(600);
      }
      
      await triggerStep(STEPS.INCREMENT_M, `Incrementing m to ${m + 1}`);
      m++;
      updateState({ currentM: m });
    }

    await triggerStep(STEPS.IF_VALID, `Checking if valid activity found (m = ${m})...`);
    if (m <= n) {
      updateState({ selectedIds: [...new Set([...stateRef.current.selectedIds, S[m].id])] });
      await triggerStep(STEPS.RECURSIVE_CALL, `Found activity ${S[m].id}! Recursing into next level...`);
      
      const subResult = await activitySelectRecursive(S, m, n, depth + 1);
      
      // Unwinding
      const unwoundStack = stateRef.current.stack.filter(f => f.depth < depth + 1);
      await triggerStep(STEPS.RECURSIVE_CALL, `Unwinding stack frame depth ${depth + 1}...`, { stack: unwoundStack });
      
      return [S[m], ...subResult];
    } else {
      await triggerStep(STEPS.BASE_CASE, "No more activities compatible. Base case reached.");
      return [];
    }
  };

  const executeAlgorithm = useCallback(async () => {
    updateState({ isFinished: false, selectedIds: [], discardedIds: [], stack: [], status: "Preparing stable recursive execution..." });
    const n = activities.length - 1;
    await activitySelectRecursive(activities, 0, n, 0);
    await triggerStep(STEPS.START, "Execution Complete. Stable Activity Set Locked.", { isFinished: true, currentIndex: -1, currentM: -1 });
    setIsPlaying(false);
  }, [activities]);

  const resetSimulation = () => {
    setIsPlaying(false);
    setState(INITIAL_STATE);
  };

  const randomizeActivities = () => {
    const newInitial = Array.from({ length: 8 }, (_, i) => {
      const start = Math.floor(Math.random() * 12);
      const duration = Math.floor(Math.random() * 4) + 2;
      return { id: i + 1, start, finish: start + duration };
    });
    setActivities([{ id: 0, start: 0, finish: 0 }, ...newInitial.sort((a, b) => a.finish - b.finish)]);
    resetSimulation();
  };

  return (
    <div className="sr-visualizer-container">
      <div className="sr-header">
        <div className="sr-brand">
          <h2>
            <Layers size={24} className="text-[#22d3ee]" />
            STABLE_RECURSIVE <span className="text-zinc-500 font-light">ACTIVITY_ENGINE</span>
          </h2>
          <div className="flex gap-2">
            <span className="badge">Greedy_Choice</span>
            <span className="badge">Recursive_Lock</span>
          </div>
        </div>

        <div className="sr-controls">
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

          <button className="control-btn" onClick={randomizeActivities}>
            <RotateCcw size={16} /> Randomize
          </button>

          <button className="control-btn" onClick={resetSimulation}>
            <Trash2 size={16} /> Reset
          </button>

          {isPlaying ? (
            <button className="control-btn primary" onClick={() => setIsPlaying(false)}>
              <Pause size={18} /> Pause
            </button>
          ) : (
            <button className="control-btn primary" onClick={() => { setIsPlaying(true); if (state.currentLine === -1) executeAlgorithm(); }}>
              <Play size={18} /> {state.currentLine === -1 ? 'Execute' : 'Resume'}
            </button>
          )}
        </div>
      </div>

      <div className="main-stage">
        {/* Left: Timeline Canvas */}
        <div className="timeline-pane">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-[#22d3ee]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Timeline_Sync_View</span>
          </div>
          
          <div className="activity-track">
            {/* Time Markers */}
            <div className="time-axis">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="time-marker" data-time={i * 2} style={{ left: `${i * 10}%` }} />
              ))}
            </div>

            <AnimatePresence mode="popLayout">
              {activities.filter(a => a.id !== 0).map((activity, idx) => {
                const isSelected = state.selectedIds.includes(activity.id);
                const isDiscarded = state.discardedIds.includes(activity.id);
                const isCurrent = state.currentIndex !== -1 && activities[state.currentIndex]?.id === activity.id;
                const isChecking = state.currentM !== -1 && activities[state.currentM]?.id === activity.id;

                return (
                  <motion.div
                    key={activity.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      scale: isCurrent || isChecking ? 1.02 : 1
                    }}
                    className={`activity-bar ${isSelected ? 'selected' : ''} ${isDiscarded ? 'discarded' : ''} ${isCurrent ? 'focus' : ''} ${isChecking ? 'focus border-[#facc15]' : ''}`}
                    style={{
                      marginLeft: `${(activity.start / 20) * 100}%`,
                      width: `${((activity.finish - activity.start) / 20) * 100}%`
                    }}
                  >
                    <span className="activity-id">A{activity.id}</span>
                    <span className="truncate">{activity.start} - {activity.finish}</span>
                    {(isCurrent || isChecking) && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="absolute -right-10 text-[#22d3ee]"
                      >
                        <Zap size={14} className="animate-pulse" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="status-bar">
            <Terminal size={14} />
            <span>{state.status}</span>
            <div className="status-cursor" />
          </div>
        </div>

        {/* Center: Stack Pane */}
        <div className="stack-pane">
          <div className="flex items-center gap-2 px-2">
            <Layers size={14} className="text-[#22d3ee]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Recursion_Stack</span>
          </div>
          <div className="stack-container">
            <AnimatePresence mode="popLayout">
              {state.stack.map((frame, idx) => (
                <motion.div
                  key={`${frame.name}-${idx}`}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="stack-frame"
                >
                  <div className="stack-frame-title">{frame.name}</div>
                  <div className="stack-frame-details">i: {frame.i}, n: {frame.n}</div>
                  <div className="stack-frame-details">depth: {frame.depth}</div>
                </motion.div>
              ))}
            </AnimatePresence>
            {state.stack.length === 0 && (
              <div className="text-zinc-800 font-mono text-[10px] text-center mt-10">Stack Empty</div>
            )}
          </div>
        </div>

        {/* Right: Code Trace */}
        <div className="code-pane">
          <div className="code-header">
            <Cpu size={14} />
            <span>STABLE_RECURSIVE.TS</span>
            <div className="ml-auto flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div className="code-content">
            {STABLE_RECURSIVE_CODE.map((line, idx) => (
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
                animate={{ top: `${state.currentLine * 1.7}rem` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ top: `${state.currentLine * 1.7}rem`, height: '1.7rem' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StableRecursiveVisualizer;
