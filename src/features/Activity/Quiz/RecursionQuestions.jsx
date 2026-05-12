import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../../hooks/use-mobile';
import { 
  Timer, Target, ChevronRight, RotateCcw, 
  BarChart3, Activity, Terminal, 
  Hash, Clock, CheckCircle2, AlertCircle, ShieldCheck
} from 'lucide-react';
import Navbar from '../../../components/Navbar';

const RECURSION_MASTER_DATA = [
  { id: 1, q: "What is the primary requirement for a recursive function to terminate?", options: ["A loop", "A base case", "A global variable", "A return type"], correct: 1, logic: "Without a base case, the function calls itself indefinitely, leading to a stack overflow." },
  { id: 2, q: "What data structure is internally used by the system to manage recursive calls?", options: ["Queue", "Heap", "Stack", "Linked List"], correct: 2, logic: "The 'Call Stack' stores the state of each active function call (winding and unwinding)." },
  { id: 3, q: "What is the time complexity of the standard recursive Fibonacci sequence?", options: ["O(n)", "O(log n)", "O(2^n)", "O(n^2)"], correct: 2, logic: "Due to redundant sub-problems, the growth is exponential as each call branches into two more." },
  { id: 4, q: "What error occurs when recursion goes too deep and exhausts memory?", options: ["Memory Leak", "Segmentation Fault", "Stack Overflow", "Buffer Underflow"], correct: 2, logic: "Every call consumes stack memory; exceeding the allocated limit triggers a Stack Overflow." },
  { id: 5, q: "Which technique is used to optimize recursion by storing previous results?", options: ["Hashing", "Memoization", "Indexing", "Paging"], correct: 1, logic: "Memoization avoids redundant calculations by caching results of sub-problems (Top-Down DP)." },
  { id: 6, q: "In recursion, 'winding' refers to:", options: ["Returning from calls", "The process of making calls", "Sorting data", "Base case execution"], correct: 1, logic: "Winding is the build-up of calls; 'unwinding' is when the functions start returning values." },
  { id: 7, q: "What is the space complexity of a recursive function with depth 'n'?", options: ["O(1)", "O(n)", "O(n^2)", "O(log n)"], correct: 1, logic: "Each call adds a frame to the stack, so space is proportional to the maximum depth of the call tree." },
  { id: 8, q: "Tail recursion is optimized by compilers because:", options: ["It uses less CPU", "The call is the last action", "It avoids base cases", "It uses a Queue"], correct: 1, logic: "Modern compilers can reuse the current stack frame for tail calls, converting it to iteration internally." },
  { id: 9, q: "Which problem is most naturally solved using recursion?", options: ["Linear Search", "Tree Traversal", "Array Reversal", "Matrix Addition"], correct: 1, logic: "Trees are recursive data structures, making recursive traversal (DFS) highly efficient to implement." },
  { id: 10, q: "Can every recursive function be converted into an iterative one?", options: ["No", "Only if it's tail-recursive", "Yes", "Only in low-level languages"], correct: 2, logic: "Theoretically, any recursion can be replaced with iteration by using an explicit Stack data structure." },
];

const RecursionQuiz = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [gameState, setGameState] = useState('config');
  const [config, setConfig] = useState({ qCount: 10, timeLimit: 10 });
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const accuracy = useMemo(() => 
    currentIdx === 0 ? 0 : Math.round((score / currentIdx) * 100), 
  [score, currentIdx]);

  const progress = useMemo(() => 
    ((currentIdx) / config.qCount) * 100, 
  [currentIdx, config.qCount]);

  const startMission = () => {
    const shuffled = [...RECURSION_MASTER_DATA]
      .sort(() => 0.5 - Math.random())
      .slice(0, config.qCount);
    setActiveQuestions(shuffled);
    setTimeLeft(config.timeLimit * 60);
    setGameState('active');
  };

  useEffect(() => {
    let timer;
    if (gameState === 'active' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'active') {
      setGameState('results');
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (idx) => {
    if (isLocked) return;
    setSelectedAnswer(idx);
    setIsLocked(true);
    if (idx === activeQuestions[currentIdx].correct) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentIdx < activeQuestions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelectedAnswer(null);
        setIsLocked(false);
      } else {
        setGameState('results');
      }
    }, 1500);
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white ${isMobile ? 'p-4' : 'p-6'} font-sans selection:bg-white selection:text-black`}>
      <Navbar />
      <AnimatePresence mode="wait">
        
        {/* CONFIGURATION TERMINAL */}
        {gameState === 'config' && (
          <motion.div 
            key="config"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`max-w-xl mx-auto ${isMobile ? 'mt-24 p-6' : 'mt-20 p-10'} bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-[2rem] shadow-2xl`}
          >
            <div className={`flex items-center gap-4 ${isMobile ? 'mb-8' : 'mb-12'}`}>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10"><Terminal size={isMobile ? 20 : 24} /></div>
              <div>
                <h2 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-black italic uppercase tracking-tighter`}>Stack_Init</h2>
                <p className="text-white/30 text-[9px] font-mono tracking-[0.2em]">RECURSION_PROTOCOL_V2</p>
              </div>
            </div>

            <div className={isMobile ? 'space-y-8' : 'space-y-12'}>
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Hash size={14} className="text-white/40" />
                  <label className="text-[9px] uppercase tracking-[0.2em] text-white/40">Stack_Depth</label>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 30, 50].map(num => (
                    <button 
                      key={num}
                      onClick={() => setConfig({...config, qCount: num})}
                      className={`py-3 rounded-xl border transition-all duration-300 font-bold ${config.qCount === num ? 'bg-white text-black border-white' : 'border-white/10 text-white/30'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-white/40" />
                    <label className="text-[9px] uppercase tracking-[0.2em] text-white/40">Execution_Limit</label>
                  </div>
                  <span className="font-mono text-[10px]">{config.timeLimit}:00 MIN</span>
                </div>
                <input 
                  type="range" min="5" max="60" step="5"
                  value={config.timeLimit}
                  onChange={(e) => setConfig({...config, timeLimit: parseInt(e.target.value)})}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </section>

              <button 
                onClick={startMission}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.15em] rounded-2xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                Launch Recursion <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ACTIVE QUIZ ENGINE */}
        {gameState === 'active' && activeQuestions.length > 0 && (
          <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`max-w-7xl mx-auto ${isMobile ? 'pt-24' : 'pt-10'}`}>
            <div className={`grid grid-cols-1 ${isMobile ? 'gap-2' : 'md:grid-cols-4 gap-4'} mb-8`}>
              <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl flex items-center gap-4">
                <Timer className="text-white/40" size={16}/>
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/10 font-mono">Time_Clock</p>
                  <p className={`text-lg font-bold font-mono ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{formatTime(timeLeft)}</p>
                </div>
              </div>
              <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl flex items-center gap-4">
                <Target className="text-white/40" size={16}/>
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/10 font-mono">Precision</p>
                  <p className="text-lg font-bold font-mono text-white">{accuracy}%</p>
                </div>
              </div>
              <div className={`${isMobile ? '' : 'md:col-span-2'} bg-white/[0.02] border border-white/10 p-4 rounded-xl`}>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-[8px] uppercase tracking-widest text-white/10 font-mono">Winding_Progress</p>
                  <p className="text-[10px] font-mono">{currentIdx + 1} / {config.qCount}</p>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${progress}%` }} className="h-full bg-white" />
                </div>
              </div>
            </div>

            <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-3'} gap-8`}>
              <div className={isMobile ? '' : 'lg:col-span-2'}>
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentIdx}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className={isMobile ? 'space-y-8' : 'space-y-12'}
                  >
                    <div>
                      <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em] flex items-center gap-2 mb-3">
                        <Activity size={10}/> STACK_FRAME_0X{currentIdx + 1}
                      </span>
                      <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold italic uppercase leading-tight tracking-tighter`}>
                        {activeQuestions[currentIdx].q}
                      </h2>
                    </div>

                    <div className="grid gap-3">
                      {activeQuestions[currentIdx].options.map((opt, i) => {
                        const isCorrect = i === activeQuestions[currentIdx].correct;
                        const isUserSelected = selectedAnswer === i;
                        
                        let btnStyle = "border-white/10 bg-white/[0.02]";
                        let idxStyle = "border-white/10 text-white/20";

                        if (isLocked) {
                          if (isCorrect) {
                            btnStyle = "border-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]";
                            idxStyle = "bg-white text-black border-white";
                          } else if (isUserSelected && !isCorrect) {
                            btnStyle = "border-red-500/50 bg-red-500/10";
                            idxStyle = "bg-red-500 text-white border-red-500";
                          } else {
                            btnStyle = "border-white/5 bg-transparent opacity-10";
                          }
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            disabled={isLocked}
                            className={`group relative ${isMobile ? 'p-4' : 'p-6'} rounded-xl border text-left transition-all duration-300 ${btnStyle}`}
                          >
                            <div className="flex items-center gap-4">
                              <span className={`w-7 h-7 rounded flex items-center justify-center text-[9px] font-mono border transition-colors ${idxStyle}`}>
                                0{i + 1}
                              </span>
                              <span className={`${isMobile ? 'text-sm' : 'text-lg'} font-medium text-white/80`}>{opt}</span>
                            </div>
                            {isLocked && isCorrect && <CheckCircle2 size={16} className="text-white" />}
                            {isLocked && isUserSelected && !isCorrect && <AlertCircle size={16} className="text-red-500" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className={`bg-white/[0.02] border border-white/10 rounded-[1.5rem] ${isMobile ? 'p-6' : 'p-8'} h-fit backdrop-blur-sm`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Stack_Trace</span>
                </div>
                {isLocked ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <p className="text-xs text-white/50 leading-relaxed italic border-l border-white/20 pl-3">
                      {activeQuestions[currentIdx]?.logic}
                    </p>
                  </motion.div>
                ) : (
                  <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest">Awaiting base case...</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* RESULTS SCREEN */}
        {gameState === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`max-w-4xl mx-auto text-center ${isMobile ? 'mt-24' : 'mt-10'}`}>
            <BarChart3 className="mx-auto text-white/10 mb-6" size={isMobile ? 40 : 48}/>
            <h1 className={`${isMobile ? 'text-4xl' : 'text-7xl'} font-black italic uppercase tracking-tighter mb-4`}>Unwound_Report</h1>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'md:grid-cols-3 gap-6'} mb-12 mt-8`}>
              <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl">
                <p className="text-[8px] uppercase tracking-widest text-white/10 mb-2 font-mono">Score</p>
                <h3 className="text-3xl font-black italic text-white">{score}/{config.qCount}</h3>
              </div>
              <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl">
                <p className="text-[8px] uppercase tracking-widest text-white/10 mb-2 font-mono">Accuracy</p>
                <h3 className="text-3xl font-black italic text-white">{accuracy}%</h3>
              </div>
              <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl">
                <p className="text-[8px] uppercase tracking-widest text-white/10 mb-2 font-mono">Rank</p>
                <h3 className="text-3xl font-black italic text-white">{accuracy > 85 ? 'OPTIMAL' : accuracy > 50 ? 'STACK' : 'OVERFLOW'}</h3>
              </div>
            </div>

            <div className={`flex ${isMobile ? 'flex-col' : 'gap-4'}`}>
              <button onClick={() => setGameState('config')} className={`flex-1 py-5 bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 ${isMobile ? 'mb-3' : ''}`}>
                <RotateCcw size={18}/> Re-Recurse
              </button>
              <button onClick={() => navigate('/')} className="flex-1 py-5 bg-white text-black hover:bg-white/90 transition-all font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-3">
                <ShieldCheck size={18}/> Secure Exit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecursionQuiz;