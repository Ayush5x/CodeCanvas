import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../../hooks/use-mobile';
import { 
  Layers, Share2, Binary, GitBranch, Hash, Search, 
  MousePointer2, Database, Map as MapIcon, Layout, 
  ArrowDownUp, RefreshCcw, Zap, Network, Code, ChevronRight
} from 'lucide-react';
import Navbar from '../../../components/Navbar';

const QuizListPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");

  const topics = [
    { id: "arrays", title: "Array", count: 20, difficulty: "Beginner", icon: <Layers size={isMobile ? 18 : 22} />, desc: "Linear data traversal." },
    { id: "linkedlist", title: "LinkedList", count: 18, difficulty: "Intermediate", icon: <Share2 size={isMobile ? 18 : 22} />, desc: "Node pointer structures." },
    { id: "pointers", title: "Pointers", count: 12, difficulty: "Advanced", icon: <MousePointer2 size={isMobile ? 18 : 22} />, desc: "Memory address referencing." },
    { id: "stacks-queues", title: "Stacks & Queue", count: 15, difficulty: "Beginner", icon: <Database size={isMobile ? 18 : 22} />, desc: "LIFO and FIFO access." },
    { id: "trees", title: "Trees", count: 25, difficulty: "Advanced", icon: <GitBranch size={isMobile ? 18 : 22} />, desc: "Hierarchical data modeling." },
    { id: "pathfinding", title: "pathfinding", count: 10, difficulty: "Expert", icon: <MapIcon size={isMobile ? 18 : 22} />, desc: "Shortest path logic." },
    { id: "hashtables", title: "HashTables", count: 14, difficulty: "Intermediate", icon: <Hash size={isMobile ? 18 : 22} />, desc: "Key-value mapping." },
    { id: "graphs", title: "Graphs", count: 22, difficulty: "Expert", icon: <Network size={isMobile ? 18 : 22} />, desc: "Vertex connectivity." },
    { id: "ds2", title: "DS-2", count: 30, difficulty: "Advanced", icon: <Code size={isMobile ? 18 : 22} />, desc: "Extended structures." },
    { id: "flowcharts", title: "Flowcharts", count: 8, difficulty: "Beginner", icon: <Layout size={isMobile ? 18 : 22} />, desc: "Visual logic flow." },
    { id: "sorting-algorithms", title: "SortingAlgorithms", count: 20, difficulty: "Intermediate", icon: <ArrowDownUp size={isMobile ? 18 : 22} />, desc: "Dataset reorganization." },
    { id: "search-algorithms", title: "SearchAlgorithms", count: 15, difficulty: "Beginner", icon: <Search size={isMobile ? 18 : 22} />, desc: "Retrieval methods." },
    { id: "recursion", title: "Recursion", count: 12, difficulty: "Advanced", icon: <RefreshCcw size={isMobile ? 18 : 22} />, desc: "Self-referential logic." },
    { id: "greedy-algorithms", title: "GreedyAlgorithms", count: 18, difficulty: "Expert", icon: <Zap size={isMobile ? 18 : 22} />, desc: "Optimization strategies." }
  ];

  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVars = {
    animate: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVars = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white ${isMobile ? 'p-4' : 'p-8 md:p-16'} pt-32 font-sans overflow-x-hidden relative`}>
      <Navbar />
      
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
      </div>

      <div className={`max-w-7xl ${isMobile ? 'mt-8' : 'mt-12'} mx-auto relative z-10`}>
        {/* HUD Header */}
        <div className={`mb-12 flex flex-col ${isMobile ? 'items-center text-center' : 'md:flex-row md:items-end justify-between'} gap-8`}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            <div className={`flex items-center gap-3 mb-4 ${isMobile ? 'justify-center' : ''}`}>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-1.5 h-1.5  bg-[#468b75] rounded-full shadow-[0_0_10px_#468b75]" 
              />
              <span className="text-white/30 uppercase text-[8px] font-mono tracking-[0.5em]">System_Online</span>
            </div>
            <h1 className={`${isMobile ? 'text-4xl' : 'text-7xl'} font-black italic tracking-tighter uppercase leading-none`}>
              Select <span className="text-[#468b75] drop-shadow-[0_0_15px_rgba(70,139,117,0.3)]">Module</span>
            </h1>
          </motion.div>

          {/* Enhanced Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative group ${isMobile ? 'w-full' : ''}`}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#468b75]/50 to-transparent rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
            <div className="relative flex items-center">
              <Search className="absolute left-5 text-white/20 group-focus-within:text-[#468b75] transition-colors" size={isMobile ? 14 : 16} />
              <input 
                type="text"
                placeholder="FILTER_DOMAINS..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`bg-black border border-white/10 rounded-full py-4 md:py-5 pl-14 pr-8 text-[9px] tracking-[0.3em] uppercase focus:outline-none focus:border-[#468b75]/40 transition-all w-full md:w-96 backdrop-blur-xl`}
              />
            </div>
          </motion.div>
        </div>

        {/* Topics Grid */}
        <motion.div 
          variants={containerVars}
          initial="initial"
          animate="animate"
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6`}
        >
          <AnimatePresence mode="popLayout">
            {filteredTopics.map((topic) => (
              <motion.div
                layout
                key={topic.id}
                variants={cardVars}
                whileHover={!isMobile ? { y: -10, rotateX: 2, rotateY: -2 } : { scale: 0.98 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/activity/quiz/${topic.id}`)}
                className={`group cursor-pointer relative bg-white/[0.02] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] ${isMobile ? 'p-6' : 'p-10'} overflow-hidden backdrop-blur-md hover:bg-white/[0.04] transition-all duration-500`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div 
                   className="absolute inset-0 bg-gradient-to-tr from-[#468b75]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                />

                <div className="relative z-10 flex flex-col h-full pointer-events-none">
                  <div className="flex justify-between items-start mb-6 md:mb-10">
                    <motion.div 
                      className="text-white/40 group-hover:text-[#468b75] group-hover:drop-shadow-[0_0_8px_#468b75] transition-all duration-500"
                    >
                      {topic.icon}
                    </motion.div>
                    <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest px-3 md:px-4 py-1.5 rounded-full border ${
                      topic.difficulty === 'Expert' ? 'border-red-500/30 text-red-500 bg-red-500/5' : 'border-white/5 text-white/20'
                    }`}>
                      {topic.difficulty}
                    </span>
                  </div>

                  <h3 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-black tracking-tighter uppercase italic mb-3 md:mb-4 transition-transform duration-500`}>
                    {topic.title}
                  </h3>
                  
                  <p className={`text-white/30 ${isMobile ? 'text-[10px]' : 'text-xs'} leading-relaxed mb-6 md:mb-10 font-light tracking-wide`}>
                    {topic.desc}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6 md:pt-8">
                    <div className="flex flex-col">
                      <span className="text-[7px] font-mono text-white/10 uppercase tracking-tighter">Availability</span>
                      <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{topic.count} DATASETS</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-[#468b75]">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] hidden sm:block">Initialize</span>
                      <ChevronRight size={isMobile ? 14 : 18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {!isMobile && (
        <div className="fixed bottom-8 left-10 flex gap-10">
           <div className="flex flex-col gap-1">
              <span className="text-[7px] text-white/10 uppercase font-mono tracking-widest">Active_Kernel</span>
              <span className="text-[8px] text-[#468b75]/50 font-mono tracking-widest uppercase">4.0.2 // STABLE</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default QuizListPage;