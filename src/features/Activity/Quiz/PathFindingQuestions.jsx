import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../../hooks/use-mobile';
import { 
  Timer, Target, Terminal, ChevronRight, 
  RotateCcw, BarChart3, ShieldCheck, 
  Clock, Hash, Navigation
} from 'lucide-react';
import Navbar from '../../../components/Navbar';

const PATHFINDING_MASTER_DATA = [
  { id: 1, q: "Dijkstra's algorithm is an example of which algorithmic approach?", options: ["Divide and Conquer", "Greedy", "Dynamic Programming", "Backtracking"], correct: 1, logic: "Dijkstra's is greedy because it always picks the nearest unvisited vertex to explore next." },
  { id: 2, q: "What is the primary difference between A* and Dijkstra?", options: ["Dijkstra is faster", "A* uses a heuristic", "Dijkstra uses a priority queue", "A* only works on trees"], correct: 1, logic: "A* improves on Dijkstra by using a heuristic function h(n) to estimate the distance to the goal." },
  { id: 3, q: "In A*, what does the function f(n) = g(n) + h(n) represent?", options: ["Total nodes", "Estimated total path cost", "Heuristic only", "Edge weight"], correct: 1, logic: "g(n) is the cost from start to current node, and h(n) is the estimated cost to the goal." },
  { id: 4, q: "Which data structure is most efficient for implementing Dijkstra?", options: ["Stack", "Simple Array", "Priority Queue (Min-Heap)", "Linked List"], correct: 2, logic: "A Min-Heap allows extraction of the minimum distance node in logarithmic time." },
  { id: 5, q: "Dijkstra's algorithm fails or may give incorrect results if:", options: ["The graph is directed", "The graph has cycles", "There are negative edge weights", "The graph is too large"], correct: 2, logic: "Negative weights break the greedy assumption; a visited node might actually have a cheaper path discovered later." },
  { id: 6, q: "A heuristic in A* is 'admissible' if it:", options: ["Never underestimates the cost", "Never overestimates the cost", "Is always zero", "Equals the actual cost"], correct: 1, logic: "Admissibility ensures A* never 'overlooks' the optimal path by being too pessimistic about the distance." },
  { id: 7, q: "If the heuristic h(n) in A* is always 0, what does the algorithm become?", options: ["BFS", "Dijkstra's Algorithm", "DFS", "Greedy Best-First"], correct: 1, logic: "When h(n) = 0, the search depends entirely on g(n), which is the definition of Dijkstra/Uniform Cost Search." },
  { id: 8, q: "Which distance metric is used for A* on a grid with 4-way movement?", options: ["Euclidean", "Manhattan", "Chebyshev", "Hamming"], correct: 1, logic: "Manhattan distance (L1 norm) perfectly represents the 'taxicab' geometry of a 4-directional grid." },
  { id: 9, q: "In Dijkstra, what does 'Relaxing' an edge mean?", options: ["Deleting it", "Updating the shortest distance", "Ignoring weight", "Closing the node"], correct: 1, logic: "Relaxation checks if the path to node V through node U is shorter than the currently recorded distance to V." },
  { id: 10, q: "Complexity of Dijkstra using a Fibonacci Heap?", options: ["O(V^2)", "O(E + V log V)", "O(E log V)", "O(V log E)"], correct: 1, logic: "Fibonacci heaps offer O(1) amortized time for decrease-key operations, optimizing the edge relaxation phase." },
];

const PathfindingQuestion = () => {
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
    const shuffled = [...PATHFINDING_MASTER_DATA]
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
                <h2 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-black italic uppercase tracking-tighter`}>Initialize_Module</h2>
                <p className="text-white/30 text-[9px] font-mono tracking-[0.2em]">DOMAIN: PATHFINDING_LOGIC</p>
              </div>
            </div>

            <div className={isMobile ? 'space-y-8' : 'space-y-12'}>
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Hash size={14} className="text-white/40" />
                  <label className="text-[9px] uppercase tracking-[0.2em] text-white/40">Query_Complexity</label>
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
                    <label className="text-[9px] uppercase tracking-[0.2em] text-white/40">Time_Constraint</label>
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
                Launch Module <ChevronRight size={18} />
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
                  <p className={`text-lg font-bold font-mono ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{formatTime(timeLeft)}</p>
                </div>
              </div>
              <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl flex items-center gap-4">
                <Target className="text-white/40" size={16}/>
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/10 font-mono">Accuracy</p>
                  <p className="text-lg font-bold font-mono text-white">{accuracy}%</p>
                </div>
              </div>
              <div className={`${isMobile ? '' : 'md:col-span-2'} bg-white/[0.02] border border-white/10 p-4 rounded-xl`}>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-[8px] uppercase tracking-widest text-white/10 font-mono">Progress</p>
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
                        <Navigation size={10}/> 0x{currentIdx.toString(16).toUpperCase()}
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
                  <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest">Waiting for input...</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* RESULTS SCREEN */}
        {gameState === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`max-w-4xl mx-auto text-center ${isMobile ? 'mt-24' : 'mt-10'}`}>
            <BarChart3 className="mx-auto text-white/10 mb-6" size={isMobile ? 40 : 48}/>
            <h1 className={`${isMobile ? 'text-4xl' : 'text-7xl'} font-black italic uppercase tracking-tighter mb-4`}>Nav_Report</h1>
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
                <h3 className="text-3xl font-black italic text-white">{accuracy > 85 ? 'OPTIMAL' : accuracy > 50 ? 'GRID' : 'STUCK'}</h3>
              </div>
            </div>

            <div className={`flex ${isMobile ? 'flex-col' : 'gap-4'}`}>
              <button onClick={() => setGameState('config')} className={`flex-1 py-5 bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 ${isMobile ? 'mb-3' : ''}`}>
                <RotateCcw size={18}/> Reinitialize
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

export default PathfindingQuestion;