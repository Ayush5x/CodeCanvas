import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRightLeft, Users, Zap, RotateCcw, Play, Pause, 
  Terminal, Activity, BookOpen, CheckCircle2, Cpu, 
  Layers, ChevronRight, Binary
} from "lucide-react";
import Header from "../../../components/Header";
// --- SUB-COMPONENT: DOCUMENTATION ---
const StableMatchingDocs = () => {
  const [activeTab, setActiveTab] = useState("theory");

  const sections = {
    theory: (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Binary className="text-white" size={20} /> Mathematical_Stability
        </h3>
        <p className="text-zinc-400 leading-relaxed font-light">
          In a monochromatic system, stability is defined as the absence of 
          <span className="text-white font-medium"> Blocking Pairs</span>. 
          A matching is stable when there is no man and woman who both prefer each other over their current assignments.
        </p>
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
          <h4 className="text-[10px] mono uppercase text-zinc-500 mb-2 tracking-widest">Convergence_Property</h4>
          <p className="text-sm text-zinc-300 italic">
            "The algorithm terminates in at most $n^2$ iterations, ensuring a system-wide equilibrium."
          </p>
        </div>
      </motion.div>
    ),
    logic: (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <h3 className="text-2xl font-bold tracking-tight text-white uppercase">State_Machine_Flow</h3>
        {[
          { step: "REQUEST", desc: "Free Proposer sends a connection request to the highest-ranked Receiver." },
          { step: "VALIDATE", desc: "Receiver compares Request_ID against current Active_Session." },
          { step: "RE-ROUTE", desc: "If Request_ID rank is higher, previous session is terminated and returned to pool." },
          { step: "COMMIT", desc: "New session is locked until a superior request is received." }
        ].map((item, i) => (
          <div key={i} className="flex gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-2xl group hover:bg-white/5 transition-all">
            <div className="mono text-white text-xs mt-1">[{i}]</div>
            <div>
              <h4 className="font-bold text-xs tracking-widest uppercase mb-1 group-hover:translate-x-1 transition-transform">{item.step}</h4>
              <p className="text-zinc-500 text-sm font-light">{item.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>
    )
  };

  return (
    <div className="mt-20 border-t border-white/5 pt-16 pb-20">
      <div className="flex gap-2 mb-8">
        {Object.keys(sections).map(key => (
          <button 
            key={key} 
            onClick={() => setActiveTab(key)}
            className={`px-6 py-2 rounded-xl text-[10px] mono uppercase tracking-widest transition-all ${activeTab === key ? "bg-white text-black font-bold" : "bg-white/5 text-zinc-500 hover:text-white"}`}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="glass p-10 min-h-[300px] bg-white/[0.01]">
        {sections[activeTab]}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const StableMatching = () => {
  const [menPrefs, setMenPrefs] = useState([
    [0, 1, 2, 3], [2, 1, 0, 3], [1, 3, 0, 2], [1, 3, 0, 2]
  ]);
  const [womenPrefs, setWomenPrefs] = useState([
    [3, 2, 1, 0], [0, 3, 2, 1], [3, 2, 1, 0], [2, 1, 0, 3]
  ]);

  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const speed = 1000;

  const timeline = useMemo(() => {
    const steps = [];
    const n = 4;
    let menFree = [0, 1, 2, 3];
    let womenPartners = new Array(n).fill(null);
    let nextProposal = new Array(n).fill(0);
    
    steps.push({ msg: "INIT_SEQUENCE", state: { menFree: [...menFree], womenPartners: [...womenPartners], currentMan: null, currentWoman: null, rejectedMan: null }, codeLine: 1 });

    while (menFree.length > 0) {
      let m = menFree[0];
      let w = menPrefs[m][nextProposal[m]];
      nextProposal[m]++;

      steps.push({ msg: `SIGNAL: M${m} → W${w}`, state: { menFree: [...menFree], womenPartners: [...womenPartners], currentMan: m, currentWoman: w, rejectedMan: null }, codeLine: 2 });

      if (womenPartners[w] === null) {
        womenPartners[w] = m;
        menFree.shift();
        steps.push({ msg: `ACK: W${w} CONNECTED M${m}`, state: { menFree: [...menFree], womenPartners: [...womenPartners], currentMan: m, currentWoman: w, rejectedMan: null }, codeLine: 3 });
      } else {
        let mCurrent = womenPartners[w];
        if (womenPrefs[w].indexOf(m) < womenPrefs[w].indexOf(mCurrent)) {
          womenPartners[w] = m;
          menFree.shift();
          menFree.push(mCurrent);
          steps.push({ msg: `OVERRIDE: W${w} SWAP ${mCurrent}→${m}`, state: { menFree: [...menFree], womenPartners: [...womenPartners], currentMan: m, currentWoman: w, rejectedMan: mCurrent }, codeLine: 4 });
        } else {
          steps.push({ msg: `REJECT: M${m} DISCONNECTED`, state: { menFree: [...menFree], womenPartners: [...womenPartners], currentMan: m, currentWoman: w, rejectedMan: m }, codeLine: 5 });
        }
      }
    }
    steps.push({ msg: "STABLE_STATE_REACHED", state: { menFree: [], womenPartners, currentMan: null, currentWoman: null, rejectedMan: null }, codeLine: 6 });
    return steps;
  }, [menPrefs, womenPrefs]);

  const currentFrame = timeline[stepIndex] || timeline[0];

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
    <div>
      <Header></Header>
     
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=Fira+Code:wght@400;500&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.02em; }
        .mono { font-family: 'Fira Code', monospace; }
        .glass { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(25px); border-radius: 24px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="max-w-[1400px] mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10">
         <div style={{ display: 'flex', marginBottom: '0px', alignItems: 'flex-start', background: '#000000', padding: '6px', borderRadius: '12px', gap: '40px' }}>
      
      {/* Abstract Animated Element on the Left */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5, ease: 'easeOut' }}
            style={{ 
              width: '25px', 
              height: '25px', 
              borderRadius: '4px',
              backgroundColor: i === 2 ? '#22d3ee' : 'rgba(255,255,255,0.08)',
              rotate: '45deg', // Rotated for abstract feel
            }}
          />
        ))}
      </div>

      {/* Text Content on the Right */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            fontSize: '4.2em',
            fontWeight: '800',
            textAlign: 'left',
            margin: '0 0 8px 0',
            lineHeight: '1.1',
            background: 'linear-gradient(180deg, #fff 40%, #555 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Stable<br />Matching
          
        </motion.h1>
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold tracking-tighter uppercase leading-none">G-SHAPLEY<span className="font-thin opacity-20 italic">v2</span></h1>
            </div>
            <p className="text-zinc-500 mono text-[10px] uppercase tracking-[0.5em]">Monochromatic Scheduling Engine // Stable Matching</p>
          </motion.div>
        
      </div>
    </div>
          
          <div className="glass px-10 py-6 text-right hidden md:block">
            <p className="text-[10px] uppercase text-zinc-600 mono mb-1 tracking-widest">System_Integrity</p>
            <p className={`text-2xl font-bold mono ${stepIndex === timeline.length - 1 ? "text-white" : "text-zinc-500 animate-pulse"}`}>
              {stepIndex === timeline.length - 1 ? "100%_STABLE" : "SYNCING..."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* REGISTRY: PREFERENCES */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="glass p-8">
              <h3 className="text-sm font-bold mb-8 flex items-center gap-3 uppercase tracking-[0.2em] text-zinc-400">
                <Cpu size={16}/> Preference_Registry
              </h3>
              
              <div className="space-y-10">
                <div>
                  <p className="text-[9px] mono text-zinc-600 mb-4 uppercase tracking-[0.3em]">Proposer_Input (M)</p>
                  <div className="space-y-3">
                    {menPrefs.map((pref, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <span className="mono text-[10px] opacity-20">0{i}</span>
                        <input 
                          className="flex-1 bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2 mono text-xs focus:bg-white/10 focus:border-white/20 outline-none transition-all"
                          value={pref.join(", ")}
                          onChange={(e) => {
                            const newP = [...menPrefs];
                            newP[i] = e.target.value.split(",").map(v => parseInt(v.trim()) || 0);
                            setMenPrefs(newP); setStepIndex(0);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[9px] mono text-zinc-600 mb-4 uppercase tracking-[0.3em]">Receiver_Input (W)</p>
                  <div className="space-y-3">
                    {womenPrefs.map((pref, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <span className="mono text-[10px] opacity-20">0{i}</span>
                        <input 
                          className="flex-1 bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2 mono text-xs focus:bg-white/10 focus:border-white/20 outline-none transition-all"
                          value={pref.join(", ")}
                          onChange={(e) => {
                            const newP = [...womenPrefs];
                            newP[i] = e.target.value.split(",").map(v => parseInt(v.trim()) || 0);
                            setWomenPrefs(newP); setStepIndex(0);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-6 bg-black">
              <p className="text-[10px] mono text-zinc-600 uppercase mb-4 flex items-center gap-2 tracking-widest"><Terminal size={12}/> Kernel_Trace</p>
              <div className="space-y-1 mono text-[10px]">
                {["Init_Stack", "Propose_Loop", "Compare_Ranks", "Assign_Partner", "Return_To_Queue", "Halt_Stable"].map((line, idx) => (
                  <div key={idx} className={`p-1 flex items-center gap-3 transition-all ${currentFrame.codeLine === idx + 1 ? "bg-white text-black font-bold" : "opacity-20"}`}>
                    <span className="opacity-50">0{idx+1}</span> {line}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* VISUALIZER: CORE ENGINE */}
          <main className="lg:col-span-8 space-y-8">
            <div className="glass p-12 min-h-[550px] relative flex flex-col items-center justify-center">
              
              <div className="w-full grid grid-cols-2 gap-24 relative max-w-3xl">
                {/* PROPOSERS */}
                <div className="space-y-4">
                  <h4 className="text-[10px] mono text-zinc-600 uppercase tracking-[0.4em] mb-10 text-center">Nodes_Proposer</h4>
                  {Array.from({ length: 4 }).map((_, i) => {
                    const isCurrent = currentFrame.state.currentMan === i;
                    const isFree = currentFrame.state.menFree.includes(i);
                    return (
                      <motion.div 
                        key={i} 
                        animate={{ x: isCurrent ? 15 : 0, scale: isCurrent ? 1.05 : 1 }}
                        className={`p-5 rounded-xl border flex items-center justify-between transition-all duration-500 ${isCurrent ? "bg-white text-black border-white shadow-[0_0_50px_rgba(255,255,255,0.15)]" : isFree ? "bg-white/5 border-white/5 text-zinc-500" : "bg-white/[0.02] border-white/20 text-white"}`}
                      >
                        <span className="font-bold mono uppercase tracking-tighter">Node_M{i}</span>
                        {isCurrent && <Zap size={14} className="fill-current animate-pulse"/>}
                      </motion.div>
                    );
                  })}
                </div>

                {/* RECEIVERS */}
                <div className="space-y-4">
                  <h4 className="text-[10px] mono text-zinc-600 uppercase tracking-[0.4em] mb-10 text-center">Nodes_Receiver</h4>
                  {currentFrame.state.womenPartners.map((partner, i) => {
                    const isCurrent = currentFrame.state.currentWoman === i;
                    return (
                      <motion.div 
                        key={i}
                        animate={{ x: isCurrent ? -15 : 0 }}
                        className={`p-5 rounded-xl border flex items-center justify-between transition-all duration-500 ${isCurrent ? "bg-white/10 border-white text-white shadow-[0_0_40px_rgba(255,255,255,0.1)]" : partner !== null ? "bg-white/[0.02] border-white/20 text-white" : "bg-white/5 border-white/5 text-zinc-700"}`}
                      >
                        <span className="font-bold mono uppercase tracking-tighter">Node_W{i}</span>
                        <span className="text-[9px] mono font-bold uppercase">
                          {partner !== null ? `→ M${partner}` : "IDLE"}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* DYNAMIC STATUS OVERLAY */}
              <div className="absolute top-8 right-8">
                <div className="flex items-center gap-3 glass py-2 px-4 rounded-full border-white/10">
                   <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                   <span className="mono text-[10px] uppercase tracking-widest">{currentFrame.msg}</span>
                </div>
              </div>

              {/* PLAYBACK CONTROLS */}
              <div className="mt-20 w-full flex items-center justify-between border-t border-white/5 pt-10">
                <div className="flex gap-4">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center hover:invert transition-all">
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                  </button>
                  <button onClick={() => {setStepIndex(0); setIsPlaying(false);}} className="w-16 h-16 rounded-2xl glass flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <RotateCcw size={20}/>
                  </button>
                </div>
                <div className="text-right">
                  <div className="flex gap-1 mb-3 justify-end">
                    {timeline.map((_, i) => <div key={i} className={`h-1 transition-all duration-500 ${i <= stepIndex ? "w-6 bg-white" : "w-1 bg-zinc-800"}`} />)}
                  </div>
                  <p className="text-[10px] mono text-zinc-600 uppercase tracking-[0.3em]">Step {stepIndex + 1} of {timeline.length}</p>
                </div>
              </div>
            </div>

            {/* TELEMETRY BAR */}
            <div className="glass p-8 flex flex-col md:flex-row items-center gap-10">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-4 bg-white/5 rounded-2xl"><Activity size={20} className="text-white"/></div>
                <div>
                  <p className="text-[9px] mono text-zinc-600 uppercase tracking-widest mb-1">Process_Log</p>
                  <p className="text-sm font-medium tracking-tight text-white">{currentFrame.msg}</p>
                </div>
              </div>
              <div className="flex gap-12">
                <div className="text-center">
                  <p className="text-[9px] mono text-zinc-600 uppercase mb-1">Engagements</p>
                  <p className="text-2xl font-bold mono">{currentFrame.state.womenPartners.filter(p => p !== null).length}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] mono text-zinc-600 uppercase mb-1">Sync_Rate</p>
                  <p className="text-2xl font-bold mono">1.0s</p>
                </div>
              </div>
            </div>
          </main>
        </div>

        <StableMatchingDocs />

      </div>
    </div>
  );
};

export default StableMatching;