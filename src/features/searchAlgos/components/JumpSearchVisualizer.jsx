import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, FaPause, FaRedo, FaCode, FaTerminal, FaCogs, 
  FaChartBar, FaStepForward, FaStepBackward, FaPlus, FaEraser, FaArrowDown, FaEdit,
  FaInfoCircle, FaBolt, FaLayerGroup
} from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../../../components/Header';
import { useIsMobile } from '../../../hooks/use-mobile';

const JumpSearchVisualizer = () => {
  const isMobile = useIsMobile();
  const [array, setArray] = useState([12, 25, 33, 40, 55, 68, 72, 89, 94, 101]);
  const [target, setTarget] = useState(68);
  const [inputVal, setInputVal] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [speed] = useState(700);

  const generateSteps = useCallback(() => {
    if (array.length === 0) return [{ phase: 'init', action: "Empty array.", line: 1 }];
    const s = [];
    const n = array.length;
    let m = Math.floor(Math.sqrt(n));
    let prev = 0;
    let step = m;

    s.push({ phase: 'init', prev: 0, step: m, current: -1, action: `Jump size (√n) = ${m}`, line: 2 });

    while (array[Math.min(step, n) - 1] < target) {
      s.push({
        phase: 'jumping',
        prev: prev,
        step: Math.min(step, n),
        current: Math.min(step, n) - 1,
        action: `Index ${Math.min(step, n)-1} < ${target}. Jumping...`,
        line: 4
      });
      prev = step;
      step += m;
      if (prev >= n) break;
    }

    s.push({ phase: 'linear-init', prev, step: Math.min(step, n), current: -1, action: `Linear scan in range [${prev}, ${Math.min(step, n)-1}]`, line: 9 });

    for (let i = prev; i < Math.min(step, n); i++) {
      const isFound = array[i] === target;
      s.push({
        phase: 'linear', prev: prev, step: Math.min(step, n), current: i,
        action: isFound ? `Found ${target} at index ${i}!` : `Scanning: ${array[i]}`,
        found: isFound, line: isFound ? 13 : 10
      });
      if (isFound) return s;
      if (array[i] > target) break; 
    }

    s.push({ phase: 'not-found', prev: -1, step: -1, current: -1, action: "Value not present.", line: 14 });
    return s;
  }, [array, target]);

  useEffect(() => {
    setSteps(generateSteps());
    setCurrentStep(0);
    setIsPlaying(false);
  }, [generateSteps]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(c => c + 1), speed);
    } else { setIsPlaying(false); }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  const currentData = useMemo(() => steps[currentStep] || {}, [steps, currentStep]);

  const handleAdd = () => {
    const val = parseInt(inputVal);
    if (!isNaN(val)) {
      setArray(prev => [...prev, val].sort((a, b) => a - b));
      setInputVal("");
    }
  };

  const handleShuffle = () => {
    const newArr = Array.from({length: isMobile ? 7 : 10}, () => Math.floor(Math.random() * 100))
      .sort((a, b) => a - b);
    setArray(newArr);
  };

  return (
    <div className={`cc-root ${isMobile ? 'mobile-mode' : ''}`}>
      <style>{`
        .cc-root { background: #000; color: #fff; min-height: 100vh; padding: 0 2.5rem 2.5rem 2.5rem; font-family: 'Inter', sans-serif; }
        .cc-glass { background: #09090b; border: 1px solid #18181b; border-radius: 12px; position: relative; overflow: hidden; }
        .cc-layout { display: grid; grid-template-columns: 1fr 400px; gap: 1.5rem; max-width: 1550px; margin: 0 auto; }
        
        .cc-header h1 { font-size: 2.4rem; font-weight: 400; letter-spacing: -0.02em; margin-bottom: 0.2rem; }
        .cc-header span { color: #22d3ee; }
        .cc-sub { color: #52525b; font-size: 0.95rem; margin-bottom: 3rem; }

        .cc-node-view { display: flex; justify-content: center; gap: 14px; padding: 6rem 1rem; flex-wrap: wrap; }
        .cc-node { 
          width: 62px; height: 82px; background: rgba(255,255,255,0.02); border: 1px solid #18181b; 
          border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; 
          font-weight: 700; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; font-size: 1.1rem;
        }
        .cc-node.in-block { border-color: #27272a; background: #111113; }
        .cc-node.active { border-color: #22d3ee; background: rgba(34, 211, 238, 0.05); transform: translateY(-8px); box-shadow: 0 0 20px rgba(34, 211, 238, 0.1); }
        .cc-node.found { background: #22d3ee; color: #000; border-color: #22d3ee; box-shadow: 0 0 30px rgba(34, 211, 238, 0.4); }
        .cc-node.dim { opacity: 0.15; filter: grayscale(1); }

        .cc-btn-main { background: #fff; color: #000; padding: 12px 28px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; display: flex; align-items: center; gap: 10px; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.02em; }
        .cc-btn-icon { background: #18181b; border: 1px solid #27272a; color: #fff; width: 44px; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .cc-btn-icon:hover { background: #27272a; }
        
        .cc-label { padding: 0.9rem 1.2rem; border-bottom: 1px solid #18181b; font-size: 0.65rem; color: #52525b; text-transform: uppercase; font-weight: 600; display: flex; align-items: center; gap: 8px; letter-spacing: 0.05em; }
        .cc-trace { color: #22d3ee; font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; padding: 1.5rem; }
        .cc-input { background: #000; border: 1px solid #27272a; color: #fff; padding: 10px; border-radius: 6px; width: 85px; outline: none; transition: 0.2s; }
        .cc-input:focus { border-color: #52525b; }

        @media (max-width: 1024px) {
          .cc-root { padding: 0 1rem 1rem 1rem; }
          .cc-layout { grid-template-columns: 1fr; gap: 1rem; }
          .cc-node-view { padding: 3rem 0; gap: 8px; }
          .cc-node { width: 45px; height: 60px; font-size: 1rem; border-radius: 8px; }
          .cc-btn-main { flex: 1; justify-content: center; }
          .cc-btn-icon { width: 40px; height: 40px; }
          .controls-stack { flex-wrap: wrap; gap: 8px; width: 100%; }
          .config-grid { grid-template-columns: 1fr !important; }
          .cc-doc-grid { grid-template-columns: 1fr; }
        }
        
        .cc-doc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; padding: 1.5rem; }
        .cc-doc-card { background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.06); padding: 1.2rem; border-radius: 12px; }
        .cc-doc-card h4 { color: #fff; font-size: 0.85rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 8px; text-transform: uppercase; }
        .cc-doc-card p { color: #a1a1aa; font-size: 0.85rem; line-height: 1.6; }
        .cc-math { color: #fff; font-family: 'JetBrains Mono'; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; font-weight: 600; }
      `}</style>
      <Header />

      {/* Industrial Page Header */}
      <div className={`page-header-wrap ${isMobile ? 'px-4 text-center' : 'p-10 border-b-4 border-white'}`} style={{ position: 'relative', overflow: 'hidden', marginBottom: '40px' }}>
        <h1 className={`absolute -top-10 ${isMobile ? 'left-1/2 -translate-x-1/2 text-[5rem]' : '-left-5 text-[12rem]'} font-black text-white/[0.03] pointer-events-none select-none uppercase italic`}>
          SQRT
        </h1>

        <div className={`relative z-10 flex flex-col ${isMobile ? 'gap-4 items-center' : 'gap-6'}`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.4em] text-zinc-500 uppercase">Searching Engine Active</span>
          </div>

          <div className={`flex ${isMobile ? 'flex-col items-center gap-2' : 'flex-row items-center gap-6'}`}>
            <motion.h1 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`${isMobile ? 'text-4xl' : 'text-8xl'} font-black tracking-tighter text-white uppercase italic`}
            >
              JUMP
            </motion.h1>
            <motion.div 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              className={`${isMobile ? 'h-10 w-2' : 'h-24 w-2'} bg-cyan-400`}
            />
            <motion.h1 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`${isMobile ? 'text-4xl' : 'text-8xl'} font-black tracking-tighter text-white uppercase italic`}
              style={{ WebkitTextStroke: '1px #fff', color: 'transparent' }}
            >
              SEARCH
            </motion.h1>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-cyan-400 text-black px-4 py-1 font-black text-xs uppercase tracking-widest transform -rotate-1"
          >
            Algorithm Visualizer 
          </motion.div>
        </div>
      </div>

      <div className="cc-layout">
        <div className="cc-main-col">
          <div className="cc-glass" style={{ marginBottom: '1.5rem' }}>
            <div className="cc-label"><FaChartBar /> Execution View</div>
            <div className="cc-node-view">
              <AnimatePresence>
                {array.map((val, i) => {
                  const isInBlock = i >= currentData.prev && i < currentData.step;
                  const isCurrent = i === currentData.current;
                  const isFound = currentData.found && isCurrent;
                  const isDimmed = currentData.phase && currentData.phase !== 'init' && !isInBlock && !isFound;
                  return (
                    <motion.div key={i} layout className={`cc-node ${isInBlock ? 'in-block' : ''} ${isCurrent ? 'active' : ''} ${isFound ? 'found' : ''} ${isDimmed ? 'dim' : ''}`}>
                      {val}
                      <span style={{ position: 'absolute', bottom: isMobile ? -18 : -24, fontSize: '0.65rem', color: '#52525b', fontWeight: 400 }}>[{i}]</span>
                      {isCurrent && !isFound && <FaArrowDown style={{ position: 'absolute', top: isMobile ? -20 : -28, color: '#22d3ee', fontSize: '0.9rem' }} />}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div className="controls-stack" style={{ padding: isMobile ? '1rem' : '2rem', borderTop: '1px solid #18181b', display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button className="cc-btn-icon" onClick={() => setCurrentStep(s => Math.max(0, s-1))}><FaStepBackward /></button>
              <button className="cc-btn-main" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <><FaPause /> Pause</> : <><FaPlay /> Start</>}
              </button>
              <button className="cc-btn-icon" onClick={() => setCurrentStep(s => Math.min(steps.length-1, s+1))}><FaStepForward /></button>
              <button className="cc-btn-icon" onClick={handleShuffle}><FaRedo /></button>
              <button className="cc-btn-icon" style={{color: '#ef4444'}} onClick={() => setArray([])}><FaEraser /></button>
            </div>
          </div>

          <div className="config-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
            <div className="cc-glass">
              <div className="cc-label"><FaTerminal /> Logic Trace</div>
              <div className="cc-trace">{`> ${currentData.action}`}</div>
            </div>
            <div className="cc-glass">
              <div className="cc-label"><FaCogs /> Configuration</div>
              <div style={{ padding: '1.2rem', display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                  <span style={{fontSize:'0.6rem', color:'#52525b', fontWeight: 700}}>TARGET</span>
                  <input type="number" className="cc-input" value={target} onChange={e => setTarget(parseInt(e.target.value))} style={{ width: isMobile ? '70px' : '85px' }} />
                </div>
                <div style={{display:'flex', gap:'8px', alignItems: 'flex-end'}}>
                   <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                     <span style={{fontSize:'0.6rem', color:'#52525b', fontWeight: 700}}>SINGLE</span>
                     <input type="number" placeholder="Val" className="cc-input" style={{width: isMobile ? '70px' : '80px'}} value={inputVal} onChange={e => setInputVal(e.target.value)} />
                   </div>
                   <button className="cc-btn-icon" style={{ width: 42, height: 42, flexShrink: 0 }} onClick={handleAdd}><FaPlus /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cc-glass">
          <div className="cc-label"><FaCode /> Implementation</div>
          <SyntaxHighlighter 
            language="c" 
            style={vscDarkPlus} 
            customStyle={{ background: 'transparent', padding: '1.5rem', fontSize: '0.82rem', lineHeight: '1.6' }} 
            wrapLines={true} 
            lineProps={line => {
              if (line === currentData.line) return { style: { background: 'rgba(34, 211, 238, 0.08)', display: 'block', borderLeft: '3px solid #22d3ee' } };
              return {};
            }}
          >
{`int search(int arr[], int n, int x) {
  int m = sqrt(n);
  int prev = 0;
  
  while (arr[min(m, n)-1] < x) {
    prev = m;
    m += sqrt(n);
    if (prev >= n) return -1;
  }
  
  while (arr[prev] < x) {
    prev++;
    if (prev == min(m, n)) return -1;
  }
  
  if (arr[prev] == x) return prev;
  return -1;
}`}
          </SyntaxHighlighter>
        </div>
      </div>
      <div className="cc-glass" style={{ maxWidth: '1550px', margin: '1.5rem auto 0' }}>
        <div className="cc-label"><FaInfoCircle /> Technical Docs</div>
        <div className="cc-doc-grid">
          <div className="cc-doc-card">
            <h4><FaBolt /> Logic</h4>
            <p>Jumps through blocks of fixed size <span className="cc-math">√n</span>. Once a block containing the target is found, a linear search is performed within that block.</p>
          </div>
          <div className="cc-doc-card">
            <h4><FaChartBar /> Complexity</h4>
            <p>Time: <span className="cc-math">O(√n)</span>. Space: <span className="cc-math">O(1)</span>. Optimal block size is always <span className="cc-math">√n</span>.</p>
          </div>
          <div className="cc-doc-card">
            <h4><FaLayerGroup /> Constraints</h4>
            <p>Requires a <strong>sorted</strong> dataset. More efficient than Linear Search but less efficient than Binary Search for very large arrays.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JumpSearchVisualizer;