import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../../hooks/use-mobile';
import { 
  Timer, Target, Terminal, ChevronRight, 
  RotateCcw, BarChart3, ShieldCheck, 
  Clock, Hash, Search, Zap, Focus
} from 'lucide-react';
import Navbar from '../../../components/Navbar';

const SEARCH_MASTER_DATA = [
  { id: 1, q: "What is the primary prerequisite for performing a Binary Search on an array?", options: ["Array must be unsorted", "Array must be sorted", "Array must contain only integers", "Array size must be a power of 2"], correct: 1, logic: "Binary Search relies on the order of elements to eliminate half of the search space in each step." },
  { id: 2, q: "In the worst-case scenario, how many comparisons does Linear Search perform for an array of size $n$?", options: ["$\log n$", "$n/2$", "$n$", "$n^2$"], correct: 2, logic: "In a linear search, the target might be at the very last position or not present at all, requiring $n$ checks." },
  { id: 3, q: "Binary Search operates on which algorithmic principle?", options: ["Greedy approach", "Dynamic Programming", "Divide and Conquer", "Backtracking"], correct: 2, logic: "It divides the problem into smaller sub-problems by comparing the target with the middle element." },
  { id: 4, q: "What is the time complexity of Binary Search?", options: ["$O(n)$", "$O(n \log n)$", "$O(\log n)$", "$O(1)$"], correct: 2, logic: "Since the search space is halved every iteration, the complexity is logarithmic." },
  { id: 5, q: "What happens to Binary Search if the array is sorted in descending order?", options: ["It won't work", "It needs to check 'greater than' instead of 'less than'", "Complexity becomes $O(n)$", "It becomes faster"], correct: 1, logic: "The logic just needs to be flipped: if target > mid, search the left half instead of the right." },
  { id: 6, q: "Which search is most efficient for an infinite list or a stream of data where the size is unknown?", options: ["Linear Search", "Binary Search", "Exponential Search", "Jump Search"], correct: 2, logic: "Exponential search finds a range where the element might exist by doubling the index ($1, 2, 4, 8...$) and then performs binary search." },
  { id: 7, q: "Interpolation Search is an improvement over Binary Search for which type of data?", options: ["Randomly distributed", "Uniformly distributed", "Reverse sorted", "Exponentially distributed"], correct: 1, logic: "If data is uniform, Interpolation Search can guess the position more accurately, achieving $O(\log(\log n))$." },
  { id: 8, q: "What is the recurrence relation for Binary Search?", options: ["$T(n) = T(n-1) + O(1)$", "$T(n) = T(n/2) + O(1)$", "$T(n) = 2T(n/2) + O(n)$", "$T(n) = T(n/3) + O(1)$"], correct: 1, logic: "One subproblem of half size is solved, and the comparison takes constant time." },
  { id: 9, q: "Which search algorithm is used as a 'second step' in Jump Search?", options: ["Linear Search", "Binary Search", "DFS", "BFS"], correct: 0, logic: "Jump search moves ahead by fixed steps and then performs a linear search backward once the range is found." },
  { id: 10, q: "What is the optimal 'Jump' block size for Jump Search on an array of size $n$?", options: ["$\log n$", "$\sqrt{n}$", "$n/2$", "2"], correct: 1, logic: "The mathematical optimum to minimize comparisons in Jump Search is $\sqrt{n}$." },
];

const SearchingQuest = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [gameState, setGameState] = useState('config');
  const [config, setConfig] = useState({ qCount: 10, timeLimit: 8 });
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
    const shuffled = [...SEARCH_MASTER_DATA]
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
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10"><Search size={isMobile ? 20 : 24} /></div>
              <div>
                <h2 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-black italic uppercase tracking-tighter`}>Initialize_Search</h2>
                <p className="text-white/30 text-[9px] font-mono tracking-[0.2em]">DOMAIN: DATA_RETRIEVAL_DYNAMICS</p>
              </div>
            </div>

            <div className={isMobile ? 'space-y-8' : 'space-y-12'}>
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Hash size={14} className="text-white/40" />
                  <label className="text-[9px] uppercase tracking-[0.2em] text-white/40">Query_Depth</label>
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
                    <label className="text-[9px] uppercase tracking-[0.2em] text-white/40">Search_Window</label>
                  </div>
                  <span className="font-mono text-[10px]">{config.timeLimit}:00 MIN</span>
                </div>
                <input 
                  type="range" min="2" max="30" step="2"
                  value={config.timeLimit}
                  onChange={(e) => setConfig({...config, timeLimit: parseInt(e.target.value)})}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </section>

              <button 
                onClick={startMission}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.15em] rounded-2xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                Scan Space <Zap size={18} />
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
                  <p className="text-[8px] uppercase tracking-widest text-white/10 font-mono">Time_Left</p>
                  <p className={`text-lg font-bold font-mono ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{formatTime(timeLeft)}</p>
                </div>
              </div>
              <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl flex items-center gap-4">
                <Target className="text-white/40" size={16}/>
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/10 font-mono">Efficiency</p>
                  <p className="text-lg font-bold font-mono text-white">{accuracy}%</p>
                </div>
              </div>
              <div className={`${isMobile ? '' : 'md:col-span-2'} bg-white/[0.02] border border-white/10 p-4 rounded-xl`}>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-[8px] uppercase tracking-widest text-white/10 font-mono">Exploration</p>
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
                        <Focus size={10}/> 0x{currentIdx.toString(16).toUpperCase()}
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
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Analysis</span>
                </div>
                {isLocked ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <p className="text-xs text-white/50 leading-relaxed italic border-l border-white/20 pl-3">
                      {activeQuestions[currentIdx]?.logic}
                    </p>
                  </motion.div>
                ) : (
                  <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest">Awaiting match...</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* RESULTS SCREEN */}
        {gameState === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`max-w-4xl mx-auto text-center ${isMobile ? 'mt-24' : 'mt-10'}`}>
            <BarChart3 className="mx-auto text-white/10 mb-6" size={isMobile ? 40 : 48}/>
            <h1 className={`${isMobile ? 'text-4xl' : 'text-7xl'} font-black italic uppercase tracking-tighter mb-4`}>Search_Final</h1>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'md:grid-cols-3 gap-6'} mb-12 mt-8`}>
              <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl">
                <p className="text-[8px] uppercase tracking-widest text-white/10 mb-2 font-mono">Found</p>
                <h3 className="text-3xl font-black italic text-white">{score}/{config.qCount}</h3>
              </div>
              <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl">
                <p className="text-[8px] uppercase tracking-widest text-white/10 mb-2 font-mono">Accuracy</p>
                <h3 className="text-3xl font-black italic text-white">{accuracy}%</h3>
              </div>
              <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl">
                <p className="text-[8px] uppercase tracking-widest text-white/10 mb-2 font-mono">Rank</p>
                <h3 className="text-3xl font-black italic text-white">{accuracy > 85 ? 'O(LOGN)' : accuracy > 50 ? 'SCANNER' : 'MISS'}</h3>
              </div>
            </div>

            <div className={`flex ${isMobile ? 'flex-col' : 'gap-4'}`}>
              <button onClick={() => setGameState('config')} className={`flex-1 py-5 bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 ${isMobile ? 'mb-3' : ''}`}>
                <RotateCcw size={18}/> New Query
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

export default SearchingQuest;