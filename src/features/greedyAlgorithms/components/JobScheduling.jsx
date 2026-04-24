import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, RotateCcw, Plus, Zap, Terminal, Activity, 
  Cpu, Box, X, Dice5, Info, Code2, BookOpen, ChevronRight, Hash 
} from "lucide-react";
import Header from "../../../components/Header";

// --- SUB-COMPONENT: DOCUMENTATION ---
const DocsSection = () => {
  const [activeTab, setActiveTab] = useState("concept");

  const tabs = [
    { id: "concept", label: "01_CONCEPT", icon: <Info size={14} /> },
    { id: "logic", label: "02_ALGORITHM", icon: <Code2 size={14} /> },
    { id: "complexity", label: "03_PERFORMANCE", icon: <Cpu size={14} /> },
  ];

  const content = {
    concept: (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Hash className="text-zinc-800" size={20} /> Problem_Objective
        </h3>
        <p className="text-zinc-400 leading-relaxed font-light text-lg">
          The <span className="text-white font-medium">Job Scheduling Problem</span> is a combinatorial optimization challenge. 
          Given $n$ tasks with specific deadlines and profits, the engine must select a sequence that maximizes revenue without violating temporal constraints.
        </p>
        <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4">
          <h4 className="text-xs mono uppercase text-zinc-500 tracking-widest">Example_Case</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[10px] text-zinc-500">JOB_A</p>
              <p className="font-bold">D:2 | $100</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[10px] text-zinc-500">JOB_B</p>
              <p className="font-bold">D:1 | $50</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[10px] text-zinc-500">JOB_C</p>
              <p className="font-bold">D:2 | $80</p>
            </div>
          </div>
          <p className="text-sm text-zinc-400 italic pt-2">
            Result: We pick A and C. B is rejected because its slot (T1) is taken by A to maximize profit.
          </p>
        </div>
      </motion.div>
    ),
    logic: (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h3 className="text-2xl font-bold tracking-tight uppercase">Greedy_Logic_Trace</h3>
        <div className="space-y-4">
          {[
            { title: "SORTING", desc: "Sort jobs in descending order of profit. We value high-profit jobs most." },
            { title: "LATEST_SLOT", desc: "Attempt to schedule the job at its latest possible time slot (Deadline $d$)." },
            { title: "BACKWARD_SCAN", desc: "If $d$ is occupied, scan $d-1, d-2...$ until an empty slot is found." },
            { title: "COMMIT", desc: "If a slot is found, lock it. If not, the job is discarded." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
              <div className="mono text-zinc-700 text-xs mt-1">[{i+1}]</div>
              <div>
                <h4 className="font-bold text-xs tracking-widest uppercase mb-1 group-hover:text-white transition-colors">{item.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    ),
    complexity: (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <h3 className="text-2xl font-bold tracking-tight">System_Complexity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.02]">
            <p className="text-[10px] mono text-zinc-500 uppercase mb-4 tracking-widest">Time_Complexity</p>
            <p className="text-5xl font-bold mono tracking-tighter">$O(n^2)$</p>
            <p className="text-xs text-zinc-600 mt-6 leading-relaxed">
              Standard implementation requires nested loops (Jobs $\times$ Slots). Optimize to $O(n \log n)$ with Disjoint Set Union.
            </p>
          </div>
          <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.02]">
            <p className="text-[10px] mono text-zinc-500 uppercase mb-4 tracking-widest">Space_Complexity</p>
            <p className="text-5xl font-bold mono tracking-tighter">$O(n)$</p>
            <p className="text-xs text-zinc-600 mt-6 leading-relaxed">
              Requires a linear array to store the result schedule based on the maximum deadline.
            </p>
          </div>
        </div>
      </motion.div>
    )
  };

  return (
    <div className="mt-24 border-t border-white/5 pt-20 pb-32">
      
      <Header></Header>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
          <BookOpen className="text-zinc-500" size={20} />
          <h2 className="text-sm mono text-zinc-500 uppercase tracking-[0.5em]">Extended_Documentation</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full group flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 ${
                  activeTab === tab.id
                    ? "bg-white text-black border-white shadow-2xl"
                    : "bg-transparent text-zinc-600 border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3 font-bold mono text-[10px] tracking-widest uppercase">
                  {tab.icon} {tab.label}
                </div>
                <ChevronRight size={14} className={activeTab === tab.id ? "opacity-100" : "opacity-0"} />
              </button>
            ))}
          </nav>

          <div className="lg:col-span-3 bg-white/[0.01] border border-white/5 p-10 md:p-14 rounded-[40px] min-h-[500px]">
            <AnimatePresence mode="wait">
              {content[activeTab]}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const JobSchedulingSaaS = () => {
  const [jobs, setJobs] = useState([
    { id: "J1", deadline: 2, profit: 100 },
    { id: "J2", deadline: 1, profit: 19 },
    { id: "J3", deadline: 2, profit: 27 },
    { id: "J4", deadline: 1, profit: 25 },
    { id: "J5", deadline: 3, profit: 15 }
  ]);

  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newJob, setNewJob] = useState({ id: "", deadline: "", profit: "" });
  const speed = 800;

  const generateRandomJobs = () => {
    const newJobs = Array.from({ length: 5 }, (_, i) => ({
      id: `R${Math.floor(Math.random() * 900) + 100}`,
      deadline: Math.floor(Math.random() * 5) + 1,
      profit: Math.floor(Math.random() * 150) + 10
    }));
    setJobs(newJobs);
    setStepIndex(0);
    setIsPlaying(false);
  };

  const timeline = useMemo(() => {
    const steps = [];
    if (jobs.length === 0) return [{ msg: "SYSTEM_IDLE", state: { sorted: [], schedule: [], currentJob: -1, currentSlot: -1, profit: 0, codeLine: 0 } }];

    const sorted = [...jobs].sort((a, b) => b.profit - a.profit);
    const maxD = Math.max(...jobs.map(j => parseInt(j.deadline) || 0));
    const schedule = new Array(maxD).fill(null);
    let totalProfit = 0;

    steps.push({ msg: "CORE_PROCESS: SORTING_BY_PROFIT", state: { sorted, schedule: [...schedule], currentJob: -1, currentSlot: -1, profit: 0, codeLine: 1 } });

    sorted.forEach((job, i) => {
      steps.push({ msg: `EVALUATING: ${job.id}`, state: { sorted, schedule: [...schedule], currentJob: i, currentSlot: -1, profit: totalProfit, codeLine: 2 } });
      let placed = false;
      const dIndex = Math.min(maxD, parseInt(job.deadline)) - 1;

      for (let j = dIndex; j >= 0; j--) {
        steps.push({ msg: `SCANNING_SLOT: ${j + 1}`, state: { sorted, schedule: [...schedule], currentJob: i, currentSlot: j, profit: totalProfit, codeLine: 3 } });
        if (!schedule[j]) {
          schedule[j] = { ...job };
          totalProfit += parseInt(job.profit);
          placed = true;
          steps.push({ msg: `SUCCESS: ${job.id} -> SLOT_${j+1}`, state: { sorted, schedule: [...schedule], currentJob: i, currentSlot: j, profit: totalProfit, codeLine: 4 } });
          break;
        }
      }
      if (!placed) steps.push({ msg: `REJECTED: ${job.id}_EXPIRED`, state: { sorted, schedule: [...schedule], currentJob: i, currentSlot: -1, profit: totalProfit, codeLine: 5 } });
    });

    steps.push({ msg: "OPTIMIZATION_COMPLETE", state: { sorted, schedule, currentJob: -1, currentSlot: -1, profit: totalProfit, codeLine: 6 } });
    return steps;
  }, [jobs]);

  const currentFrame = timeline[stepIndex]?.state || timeline[0].state;

  useEffect(() => {
    let timer;
    if (isPlaying && stepIndex < timeline.length - 1) {
      timer = setInterval(() => setStepIndex(s => s + 1), speed);
    } else {
      setIsPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, stepIndex, timeline.length]);

  return (
    <div className="bg-[#050505] min-h-screen text-[#e5e5e5] p-6 md:p-12 overflow-x-hidden">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=Fira+Code:wght@400;500&display=swap');
        body { font-family: 'Space+Grotesk', sans-serif; letter-spacing: -0.02em; }
        .mono { font-family: 'Fira Code', monospace; }
        .glass { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(20px); border-radius: 32px; }
      `}</style>

      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div style={{ display: 'flex', marginBottom: '0px', alignItems: 'start', gap: '30px', background: 'rgba(11, 11, 11, 0.62)', padding: '30px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', width: '1200px' }}>
  {/* The Icon/Visualization */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
    <motion.div
      animate={{ scale: [1, 1.2, 1], backgroundColor: ['rgba(34,211,238,0.2)', '#22d3ee', 'rgba(34,211,238,0.2)'] }}
      transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
      style={{ width: '15px', height: '15px', borderRadius: '50%' }}
    />
    <div style={{ width: '4px', height: '100px', background: 'rgba(255,255,255,0.1)', marginLeft: '5px', borderRadius: '2px' }} />
  </div>

  {/* Content */}
  <div style={{ flex: 1 }}>
    <motion.h1 
      style={{
        fontSize: '3em',
        fontWeight: '900',
        textAlign: 'left',
        color: '#fff',
        margin: '0 0 10px 0',
        letterSpacing: '-1px'
      }}
    >
      Job Scheduling 
    </motion.h1>

    <motion.h2
      style={{
        fontSize: '0.95em',
        color: '#aaa',
        textAlign: 'left',
        letterSpacing: '1px',
        marginBottom: '20px'
      }}
    >
      Optimizing database query performance with square-root step calculation.
    </motion.h2>

    <motion.div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(0,0,0,0.3)', padding: '10px 15px', borderRadius: '4px' }}>
      <span style={{ fontSize: '1.4em', color: '#fff', fontWeight: 'bold' }}>√N</span>
      <span style={{ fontSize: '0.8em', color: '#777', textTransform: 'uppercase', letterSpacing: '2px' }}>Optimal calculation</span>
    </motion.div>
  </div>
</div>
          <div className="glass px-8 py-4 text-right">
            <p className="text-[10px] uppercase text-zinc-500 mono mb-1">Maximized_Profit</p>
            <p className="text-4xl font-bold mono leading-none tracking-tighter">${currentFrame.profit}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* REGISTRY */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="glass p-6 min-h-[400px]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2 tracking-tight uppercase">Registry</h3>
                <div className="flex gap-2">
                  <button onClick={generateRandomJobs} className="w-10 h-10 glass flex items-center justify-center hover:bg-white hover:text-black transition-all rounded-full" title="Randomize">
                    <Dice5 size={18}/>
                  </button>
                  <button onClick={() => setShowAddModal(true)} className="w-10 h-10 glass flex items-center justify-center hover:bg-white hover:text-black transition-all rounded-full">
                    <Plus size={18}/>
                  </button>
                </div>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                <AnimatePresence mode="popLayout">
                  {jobs.map((job, i) => {
                    const active = currentFrame.sorted[currentFrame.currentJob]?.id === job.id;
                    return (
                      <motion.div layout key={job.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 rounded-2xl border transition-all ${active ? "bg-white text-black border-white" : "bg-white/[0.03] border-white/5"}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-3">
                            <span className="mono text-[10px] opacity-30">0{i+1}</span>
                            <p className="font-bold">{job.id} <span className="font-normal opacity-50 ml-2 text-xs">T-{job.deadline}</span></p>
                          </div>
                          <p className="font-bold mono">${job.profit}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            <div className="glass p-6 bg-black/40 border-zinc-800/50">
              <p className="text-[10px] mono text-zinc-600 uppercase mb-4 flex items-center gap-2"><Terminal size={12}/> Logic_Trace</p>
              <div className="space-y-1 mono text-xs">
                {["01 sort_by_profit()", "02 for each job:", "03   check_free_slots()", "04   if found: allot()", "05   else: reject()", "06 return result"].map((line, idx) => (
                  <div key={idx} className={`p-1 rounded transition-colors ${currentFrame.codeLine === idx + 1 ? "bg-white/10 text-white" : "opacity-30"}`}>{line}</div>
                ))}
              </div>
            </div>
          </aside>

          {/* VISUALIZER */}
          <main className="lg:col-span-8 space-y-6">
            <div className="glass p-10 min-h-[480px] flex flex-col relative overflow-hidden">
              <h3 className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] mb-12 text-center mono">Allocation_Grid</h3>
              <div className="flex-1 flex items-center justify-center gap-6 flex-wrap">
                {currentFrame.schedule.map((slot, idx) => (
                  <motion.div key={idx} className={`w-36 h-48 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center relative ${currentFrame.currentSlot === idx ? "border-white/40 bg-white/5 shadow-2xl" : "border-white/5"}`}>
                    <span className="absolute top-4 text-[10px] mono text-zinc-700">POS_0{idx + 1}</span>
                    {slot ? (
                      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
                        <div className="w-16 h-16 glass bg-white/5 rounded-2xl flex items-center justify-center font-bold text-3xl mb-2">{slot.id}</div>
                        <p className="text-[10px] mono text-zinc-500 font-bold">${slot.profit}</p>
                      </motion.div>
                    ) : <Box size={32} className="text-zinc-900" />}
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
                <div className="flex gap-4">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl">
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                  </button>
                  <button onClick={() => {setStepIndex(0); setIsPlaying(false);}} className="w-16 h-16 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all shadow-xl"><RotateCcw size={20}/></button>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-1">
                    {timeline.map((_, i) => <div key={i} className={`h-1 rounded-full transition-all ${i <= stepIndex ? "w-4 bg-white" : "w-1 bg-zinc-800"}`} />)}
                  </div>
                  <p className="text-[10px] mono text-zinc-500 uppercase tracking-widest">{Math.round((stepIndex / (timeline.length - 1)) * 100)}% Complete</p>
                </div>
              </div>
            </div>

            {/* TELEMETRY */}
            <div className="glass p-6 flex flex-col md:flex-row items-center gap-6 overflow-hidden">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="p-3 bg-white/5 rounded-xl shrink-0"><Activity size={20} className="text-zinc-400"/></div>
                <div className="min-w-0">
                  <p className="text-[10px] mono text-zinc-500 uppercase">System_Status</p>
                  <p className="text-sm font-bold truncate text-white uppercase">{timeline[stepIndex]?.msg}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10 hidden md:block shrink-0" />
              <div className="flex gap-8 shrink-0">
                <div>
                  <p className="text-[10px] mono text-zinc-500 uppercase mb-1">Queue_Size</p>
                  <p className="text-xl font-bold mono">{jobs.length}</p>
                </div>
                <div>
                  <p className="text-[10px] mono text-zinc-500 uppercase mb-1">Avg_Yield</p>
                  <p className="text-xl font-bold mono">
                    ${currentFrame.schedule.filter(Boolean).length > 0 
                      ? (currentFrame.profit / currentFrame.schedule.filter(Boolean).length).toFixed(1) 
                      : "0.0"}
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10 hidden md:block shrink-0" />
              <button onClick={() => {setJobs([]); setStepIndex(0);}} className="px-6 py-3 rounded-xl border border-red-900/30 text-red-500 text-xs mono hover:bg-red-500 hover:text-white transition-all shrink-0">
                PURGE_CACHE
              </button>
            </div>
          </main>
        </div>

        {/* DOCUMENTATION INTEGRATION */}
        <DocsSection />
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.form initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass p-10 w-full max-w-lg bg-[#080808]" onSubmit={(e) => {
              e.preventDefault();
              setJobs([...jobs, { ...newJob, id: newJob.id.toUpperCase(), deadline: parseInt(newJob.deadline), profit: parseInt(newJob.profit) }]);
              setShowAddModal(false); setNewJob({ id: "", deadline: "", profit: "" }); setStepIndex(0);
            }}>
              <div className="flex justify-between mb-8"><h2 className="text-3xl font-bold tracking-tighter uppercase">Add_Job</h2><X className="cursor-pointer" onClick={() => setShowAddModal(false)} /></div>
              <div className="space-y-6">
                <input required placeholder="ID (E.G. J10)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-white mono" value={newJob.id} onChange={e => setNewJob({...newJob, id: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" placeholder="Deadline" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none mono" value={newJob.deadline} onChange={e => setNewJob({...newJob, deadline: e.target.value})} />
                  <input required type="number" placeholder="Profit" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none mono" value={newJob.profit} onChange={e => setNewJob({...newJob, profit: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:invert transition-all uppercase text-xs tracking-widest">Commit_Job</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobSchedulingSaaS;