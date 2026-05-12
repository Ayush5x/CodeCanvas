import React from 'react';
import Header from '../../../components/Header';
import JobSchedulingVisualizer from '../../../dsa/greedy/job-scheduling/JobSchedulingVisualizer';
import { useIsMobile } from '../../../hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Code2, Cpu, Hash, BookOpen, ChevronRight } from 'lucide-react';

// --- SUB-COMPONENT: DOCUMENTATION ---
const DocsSection = () => {
  const [activeTab, setActiveTab] = React.useState("concept");

  const tabs = [
    { id: "concept", label: "01_CONCEPT", icon: <Info size={14} /> },
    { id: "logic", label: "02_ALGORITHM", icon: <Code2 size={14} /> },
    { id: "complexity", label: "03_PERFORMANCE", icon: <Cpu size={14} /> },
  ];

  const content = {
    concept: (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Hash className="text-[#22d3ee]" size={20} /> Problem_Objective
        </h3>
        <p className="text-zinc-400 leading-relaxed font-light text-lg">
          The <span className="text-white font-medium">Job Scheduling Problem</span> is a classic greedy challenge. 
          Given a set of tasks with deadlines and associated profits, we must schedule them to maximize total revenue, 
          ensuring each job is completed before its strict temporal limit.
        </p>
      </motion.div>
    ),
    logic: (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h3 className="text-2xl font-bold tracking-tight uppercase">Greedy_Strategy</h3>
        <div className="space-y-4">
          {[
            { title: "PROFIT_PRIORITY", desc: "Sort all jobs in descending order of profit. We prioritize high-value tasks." },
            { title: "TEMPORAL_FIT", desc: "For each job, find the latest available time slot that is $\leq$ its deadline." },
            { title: "SLOT_LOCKING", desc: "If a slot is found, mark it as occupied and commit the job. Otherwise, discard it." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
              <div className="mono text-zinc-700 text-xs mt-1">[{i+1}]</div>
              <div>
                <h4 className="font-bold text-xs tracking-widest uppercase mb-1 group-hover:text-[#22d3ee] transition-colors">{item.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    ),
    complexity: (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <h3 className="text-2xl font-bold tracking-tight">System_Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.02]">
            <p className="text-[10px] mono text-zinc-500 uppercase mb-4 tracking-widest">Time_Complexity</p>
            <p className="text-5xl font-bold mono tracking-tighter">$O(n^2)$</p>
            <p className="text-xs text-zinc-600 mt-6 leading-relaxed">
              Nested loops iterate over jobs and their potential slots. Optimized versions using DSU can reach $O(n \log n)$.
            </p>
          </div>
          <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.02]">
            <p className="text-[10px] mono text-zinc-500 uppercase mb-4 tracking-widest">Space_Complexity</p>
            <p className="text-5xl font-bold mono tracking-tighter">$O(n)$</p>
            <p className="text-xs text-zinc-600 mt-6 leading-relaxed">
              Linear space is required to maintain the schedule array and store the input jobs.
            </p>
          </div>
        </div>
      </motion.div>
    )
  };

  return (
    <div className="mt-24 border-t border-white/5 pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
          <BookOpen className="text-zinc-500" size={20} />
          <h2 className="text-sm mono text-zinc-500 uppercase tracking-[0.5em]">System_Documentation</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full group flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 ${
                  activeTab === tab.id
                    ? "bg-[#22d3ee] text-black border-[#22d3ee] shadow-2xl"
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

const JobSchedulingPage = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`js-page-root ${isMobile ? 'mobile-view' : ''}`}>
      <Header />
      
      <style>{`
        .js-page-root {
          background: #000;
          min-height: 100vh;
          color: #fff;
          font-family: 'Inter', sans-serif;
          padding: 0 40px 40px 40px;
        }
        .mobile-view {
          padding: 0 15px 15px 15px;
        }
        .page-header-wrap {
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 24px;
          position: relative;
          margin-bottom: 40px;
          max-width: 1700px;
          margin-inline: auto;
        }
        .mobile-view .page-header-wrap {
          padding: 20px 10px;
          border-left: none;
        }
        .hero-title-container {
          display: flex;
          flex-direction: column;
        }
        .ref-badge {
          font-size: 10px;
          font-family: 'JetBrains Mono', monospace;
          color: rgba(255, 255, 255, 0.3);
          margin-bottom: 8px;
          letter-spacing: 0.2em;
        }
        .main-h1 {
          font-size: 4rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
        }
        .mobile-view .main-h1 {
          font-size: 2rem;
        }
        .hero-description {
          margin-top: 24px;
          max-width: 600px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 1rem;
          line-height: 1.6;
        }
      `}</style>

      <div className={`page-header-wrap ${isMobile ? 'mobile-industrial' : ''}`}>
        <div className="relative overflow-hidden w-full">
          {/* Background Watermark */}
          <h1 className={`absolute -top-10 ${isMobile ? 'left-1/2 -translate-x-1/2 text-[5rem]' : '-left-5 text-[10rem]'} font-black text-white/[0.02] pointer-events-none select-none`}>
            GREEDY
          </h1>

          <div className={`relative z-10 flex flex-col ${isMobile ? 'gap-4 items-center' : 'gap-6'}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#22d3ee] rounded-full animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.4em] text-zinc-500 uppercase">Schedule Sync Active</span>
            </div>

            <div className={`flex ${isMobile ? 'flex-col items-center gap-2' : 'flex-col md:flex-row md:items-end gap-4'}`}>
              <h1 className={`${isMobile ? 'text-3xl' : 'text-7xl'} font-light tracking-tighter text-white uppercase`}>
                JOB_ <br /> SCHEDULING<span className="font-black text-[25px] text-[#22d3ee]">_SYNC</span>
              </h1>
            </div>

            <p className={`text-zinc-400 text-sm leading-relaxed ${isMobile ? 'border-t border-zinc-800 pt-4 px-2 max-w-[90%] text-center' : 'max-w-md border-l-2 border-[#22d3ee]/30 pl-4'}`}>
              Maximize throughput by strategically allotting time-sensitive tasks. A core greedy paradigm used in CPU scheduling and process optimization.
            </p>

            <div className={`flex flex-wrap gap-4 items-center ${isMobile ? 'justify-center mt-2' : ''}`}>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <div className="w-2 h-2 bg-[#22d3ee] rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#22d3ee]">Time: O(n²)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <div className="w-2 h-2 bg-[#f472b6] rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#f472b6]">Space: O(n)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto">
        <JobSchedulingVisualizer />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <DocsSection />
        </motion.div>
      </div>
    </div>
  );
};

export default JobSchedulingPage;