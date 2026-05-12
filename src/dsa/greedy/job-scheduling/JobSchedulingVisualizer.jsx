import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Plus, Dice5, Trash2, Terminal, Cpu, Zap, Hash, DollarSign, Clock } from 'lucide-react';
import { JOB_SCHEDULING_CODE, STEPS, INITIAL_STATE } from './jobSchedulingLogic';
import './JobSchedulingVisualizer.css';

const JobSchedulingVisualizer = ({ initialJobs = [
  { id: "J1", deadline: 2, profit: 100 },
  { id: "J2", deadline: 1, profit: 19 },
  { id: "J3", deadline: 2, profit: 27 },
  { id: "J4", deadline: 1, profit: 25 },
  { id: "J5", deadline: 3, profit: 15 }
] }) => {
  const [jobs, setJobs] = useState(initialJobs);
  const [state, setState] = useState(INITIAL_STATE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJob, setNewJob] = useState({ id: '', deadline: '', profit: '' });

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

  const executeAlgorithm = useCallback(async () => {
    const jobList = [...jobs];
    
    await triggerStep(STEPS.START, "System Initialized. Preparing Greedy Scheduler...");
    
    // Sort
    await triggerStep(STEPS.SORT, "Sorting jobs by profit in descending order...");
    const sorted = [...jobList].sort((a, b) => b.profit - a.profit);
    updateState({ sortedJobs: sorted });
    await delay(800);

    const maxD = Math.max(...jobList.map(j => j.deadline));
    await triggerStep(STEPS.INIT_SLOTS, `Initializing timeline with ${maxD} slots...`, { slots: new Array(maxD).fill(-1) });

    for (let i = 0; i < sorted.length; i++) {
      const job = sorted[i];
      await triggerStep(STEPS.FOR_JOBS, `Processing job ${job.id} (Deadline: ${job.deadline}, Profit: ${job.profit})`, { currentJobId: job.id, currentSlotIndex: -1 });

      let assigned = false;
      await triggerStep(STEPS.FOR_SLOTS, `Searching backwards from slot ${job.deadline}...`);
      
      for (let j = Math.min(maxD, job.deadline) - 1; j >= 0; j--) {
        await triggerStep(STEPS.CHECK_SLOT, `Checking availability of slot ${j + 1}...`, { currentSlotIndex: j });
        
        if (stateRef.current.slots[j] === -1) {
          const newSlots = [...stateRef.current.slots];
          newSlots[j] = job.id;
          await triggerStep(STEPS.FILL_SLOT, `Slot ${j + 1} is empty! Allotting job ${job.id}.`, { 
            slots: newSlots, 
            totalProfit: stateRef.current.totalProfit + job.profit,
            highlightedJobId: job.id
          });
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        await triggerStep(STEPS.NEXT_JOB, `No slots available for ${job.id}. Skipping...`, { highlightedJobId: null });
      }
    }

    await triggerStep(STEPS.RETURN, "Scheduling Complete. Total Yield Optimized.", { isFinished: true, currentJobId: null, currentSlotIndex: -1 });
    setIsPlaying(false);
  }, [jobs]);

  const resetSimulation = () => {
    setIsPlaying(false);
    setState(INITIAL_STATE);
  };

  const randomizeJobs = () => {
    const newJobs = Array.from({ length: 5 }, (_, i) => ({
      id: `J${i + 1}`,
      deadline: Math.floor(Math.random() * 5) + 1,
      profit: Math.floor(Math.random() * 150) + 10
    }));
    setJobs(newJobs);
    resetSimulation();
  };

  const handleAddJob = (e) => {
    e.preventDefault();
    if (newJob.id && newJob.deadline && newJob.profit) {
      setJobs([...jobs, { 
        id: newJob.id.toUpperCase(), 
        deadline: parseInt(newJob.deadline), 
        profit: parseInt(newJob.profit) 
      }]);
      setNewJob({ id: '', deadline: '', profit: '' });
      setShowAddForm(false);
      resetSimulation();
    }
  };

  return (
    <div className="js-visualizer-container">
      <div className="js-header">
        <div className="js-brand">
          <h2>
            <Zap size={24} className="text-[#22d3ee]" />
            JOB_SCHEDULER <span className="text-zinc-500 font-light">GREEDY_CORE</span>
          </h2>
          <div className="flex gap-2">
            <span className="badge">Max_Profit</span>
            <span className="badge">Slot_Lock</span>
          </div>
        </div>

        <div className="js-controls">
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

          <button className="control-btn" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={16} /> Add Job
          </button>
          
          <button className="control-btn" onClick={randomizeJobs}>
            <Dice5 size={16} /> Randomize
          </button>

          <button className="control-btn" onClick={resetSimulation}>
            <RotateCcw size={16} /> Reset
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

      {showAddForm && (
        <motion.form 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-6 rounded-2xl flex gap-4 items-end"
          onSubmit={handleAddJob}
        >
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Job ID</label>
            <input 
              className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-[#22d3ee] transition-all"
              placeholder="e.g. J6"
              value={newJob.id}
              onChange={e => setNewJob({...newJob, id: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Deadline</label>
            <input 
              type="number"
              className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-[#22d3ee] transition-all"
              placeholder="1-5"
              value={newJob.deadline}
              onChange={e => setNewJob({...newJob, deadline: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Profit</label>
            <input 
              type="number"
              className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-[#22d3ee] transition-all"
              placeholder="Profit"
              value={newJob.profit}
              onChange={e => setNewJob({...newJob, profit: e.target.value})}
            />
          </div>
          <button type="submit" className="control-btn primary">Add</button>
          <button type="button" className="control-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
        </motion.form>
      )}

      <div className="main-stage">
        {/* Left: Visualization */}
        <div className="viz-pane">
          <div className="stats-bar">
            <div className="stat-item">
              <span className="label">Maximized Profit</span>
              <div className="value">${state.totalProfit}</div>
            </div>
            <div className="stat-item">
              <span className="label">Jobs Count</span>
              <div className="value">{jobs.length}</div>
            </div>
            <div className="stat-item">
              <span className="label">Status</span>
              <div className="value" style={{ fontSize: '0.7rem', color: '#22d3ee' }}>{state.isFinished ? 'OPTIMIZED' : isPlaying ? 'SYNCING' : 'IDLE'}</div>
            </div>
          </div>

          <div className="job-registry">
            <AnimatePresence mode="popLayout">
              {(state.sortedJobs.length > 0 ? state.sortedJobs : jobs).map((job, idx) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: state.currentJobId === job.id ? -10 : 0,
                    borderColor: state.currentJobId === job.id ? '#22d3ee' : 'rgba(255, 255, 255, 0.08)'
                  }}
                  className={`job-card ${state.currentJobId === job.id ? 'active' : ''} ${state.sortedJobs.length > 0 ? 'sorted' : ''}`}
                >
                  <span className="job-id-badge">{job.id}</span>
                  <div className="job-profit">${job.profit}</div>
                  <div className="job-deadline">
                    <Clock size={12} /> T-{job.deadline}
                  </div>
                  {state.slots.includes(job.id) && (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-[#f472b6] rounded-full p-1 shadow-lg"
                    >
                      <Zap size={10} fill="white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="timeline-track">
            <div className="flex items-center gap-2 mb-4">
              <Hash size={14} className="text-[#22d3ee]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Timeline_Schedule</span>
            </div>
            <div className="timeline-slots">
              {state.slots.map((jobId, idx) => (
                <motion.div
                  key={idx}
                  className={`slot ${state.currentSlotIndex === idx ? 'checking' : ''} ${jobId !== -1 ? 'filled' : ''}`}
                  animate={{
                    scale: state.currentSlotIndex === idx ? 1.05 : 1
                  }}
                >
                  <span className="slot-label">Slot {idx + 1}</span>
                  {jobId !== -1 ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="slot-content">
                      {jobId}
                    </motion.div>
                  ) : (
                    <div className="w-1 h-1 rounded-full bg-zinc-800" />
                  )}
                </motion.div>
              ))}
              {state.slots.length === 0 && (
                <div className="text-zinc-700 font-mono text-xs italic">Waiting for algorithm initialization...</div>
              )}
            </div>
          </div>

          <div className="status-bar">
            <Terminal size={14} />
            <span>{state.status}</span>
            <div className="status-cursor" />
          </div>
        </div>

        {/* Right: Code Trace */}
        <div className="code-pane">
          <div className="code-header">
            <Cpu size={14} />
            <span>GREEDY_SCHEDULER.TS</span>
            <div className="ml-auto flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
              <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
              <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
            </div>
          </div>
          <div className="code-content">
            {JOB_SCHEDULING_CODE.map((line, idx) => (
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

export default JobSchedulingVisualizer;
