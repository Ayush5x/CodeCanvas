import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, FaPause, FaRedo, FaCode, FaTerminal, FaCogs, 
  FaChartBar, FaPlus, FaEraser, FaArrowDown, FaInfoCircle, FaBolt, FaLayerGroup 
} from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../../../components/Header';
import { useIsMobile } from '../../../hooks/use-mobile';

const ExponentialSearchVisualizer = () => {
  const isMobile = useIsMobile();
  const [array, setArray] = useState([2, 10, 15, 25, 30, 45, 62, 70, 88, 95, 120, 150]);
  const [target, setTarget] = useState(70);
  const [inputVal, setInputVal] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [speed] = useState(800);

  const generateSteps = useCallback(() => {
    const s = [];
    const n = array.length;
    if (n === 0) return [{ action: "System Error: Empty Array.", line: 1 }];
    s.push({ phase: 'init', i: 0, action: `Initial Check: array[0] is ${array[0]}`, line: 2 });
    if (array[0] === target) {
      s.push({ phase: 'binary', mid: 0, found: true, action: "Found target at base index 0!", line: 2 });
      return s;
    }
    let i = 1;
    while (i < n && array[i] <= target) {
      s.push({ phase: 'doubling', i: i, action: `Index ${i} (${array[i]}) ≤ ${target}. Doubling reach...`, line: 6 });
      if (array[i] === target) break;
      i = i * 2;
    }
    const low = Math.floor(i / 2);
    const high = Math.min(i, n - 1);
    s.push({ phase: 'range-found', low, high, action: `Range defined: [${low} to ${high}]. Initiating Binary Search.`, line: 9 });
    let l = low;
    let r = high;
    while (l <= r) {
      let mid = Math.floor(l + (r - l) / 2);
      const isFound = array[mid] === target;
      s.push({ phase: 'binary', low: l, high: r, mid: mid, action: isFound ? `Target ${target} extracted at index ${mid}!` : `Binary Probe: index ${mid} (${array[mid]})`, found: isFound, line: 9 });
      if (isFound) return s;
      if (array[mid] < target) l = mid + 1;
      else r = mid - 1;
    }
    s.push({ phase: 'not-found', action: `Execution Finished: ${target} not found.`, line: 10 });
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
  }, [isPlaying, currentStep, steps, speed]);

  const currentData = useMemo(() => steps[currentStep] || {}, [steps, currentStep]);

  const handleAdd = () => {
    const val = parseInt(inputVal);
    if (!isNaN(val)) {
      setArray(prev => [...prev, val].sort((a, b) => a - b));
      setInputVal("");
    }
  };

  const handleShuffle = () => {
    const newArr = Array.from({ length: isMobile ? 8 : 12 }, () => Math.floor(Math.random() * 200)).sort((a, b) => a - b);
    setArray(newArr);
  };

  return (
    <div className={`cc-root ${isMobile ? 'mobile-mode' : ''}`}>
      <style>{`
        .cc-root { background: #000; color: #fff; min-height: 100vh; padding: 0 2.5rem 2.5rem 2.5rem; font-family: 'Inter', sans-serif; }
        .cc-glass { 
          background: rgba(255, 255, 255, 0.02); 
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.06); 
          border-radius: 12px; 
          overflow: hidden; 
          position: relative; 
          margin-bottom: 1.5rem; 
        }

        .cc-layout { display: grid; grid-template-columns: 1fr 420px; gap: 1.5rem; max-width: 1550px; margin: 0 auto; }
        .cc-node-view { display: flex; justify-content: center; gap: 14px; padding: 6rem 1rem; flex-wrap: wrap; }
        .cc-node { 
          width: 58px; height: 78px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255, 255, 255, 0.06); 
          border-radius: 8px; display: flex; align-items: center; justify-content: center; 
          font-weight: 700; transition: 0.4s cubic-bezier(0.23, 1, 0.32, 1); position: relative; 
        }

        .cc-node.jump { border-color: #fff; background: rgba(255,255,255,0.05); transform: translateY(-5px); box-shadow: 0 5px 15px rgba(255,255,255,0.05); }
        .cc-node.in-range { border-color: #3f3f46; background: rgba(255,255,255,0.04); }
        .cc-node.active-mid { border-color: #fff; background: rgba(255,255,255,0.08); transform: translateY(-8px); box-shadow: 0 0 20px rgba(255,255,255,0.1); }
        .cc-node.found { background: #fff; color: #000; border-color: #fff; box-shadow: 0 0 30px rgba(255,255,255,0.3); transform: scale(1.1); }
        .cc-node.dim { opacity: 0.15; filter: grayscale(1) blur(1px); }

        .cc-btn-main { background: #fff; color: #000; padding: 12px 28px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; display: flex; align-items: center; gap: 10px; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em; }
        .cc-btn-icon { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #fff; width: 44px; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        
        .cc-label { padding: 0.9rem 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.65rem; color: #52525b; text-transform: uppercase; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .cc-trace { color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; padding: 1.5rem; line-height: 1.5; }
        .cc-input { background: #000; border: 1px solid rgba(255,255,255,0.06); color: #fff; padding: 10px; border-radius: 6px; width: 80px; outline: none; }

        .cc-doc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; padding: 1.5rem; }
        .cc-doc-card { background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.06); padding: 1.2rem; border-radius: 8px; }
        .cc-math { color: #fff; font-family: 'JetBrains Mono'; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; font-weight: 600; }

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
      `}</style>
      <Header />

      {/* Industrial Page Header */}
      <div className={`page-header-wrap ${isMobile ? 'px-4 text-center' : 'p-10 border-b-4 border-white'}`} style={{ position: 'relative', overflow: 'hidden', marginBottom: '40px' }}>
        <h1 className={`absolute -top-10 ${isMobile ? 'left-1/2 -translate-x-1/2 text-[5rem]' : '-left-5 text-[12rem]'} font-black text-white/[0.03] pointer-events-none select-none uppercase italic`}>
          2^K
        </h1>

        <div className={`relative z-10 flex flex-col ${isMobile ? 'gap-4 items-center' : 'gap-6'}`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.4em] text-zinc-500 uppercase">Exponential Engine Active</span>
          </div>

          <div className={`flex ${isMobile ? 'flex-col items-center gap-2' : 'flex-row items-center gap-6'}`}>
            <motion.h1 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`${isMobile ? 'text-4xl' : 'text-8xl'} font-black tracking-tighter text-white uppercase italic`}
            >
              EXPO
            </motion.h1>
            <motion.div 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              className={`${isMobile ? 'h-10 w-2' : 'h-24 w-2'} bg-white`}
            />
            <motion.h1 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`${isMobile ? 'text-4xl' : 'text-8xl'} font-black tracking-tighter text-white uppercase italic`}
              style={{ WebkitTextStroke: '1px #fff', color: 'transparent' }}
            >
              NENTIAL
            </motion.h1>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white text-black px-4 py-1 font-black text-xs uppercase tracking-widest transform -rotate-1"
          >
            Logarithmic Reach 
          </motion.div>
        </div>
      </div>

      <div className="cc-layout">
        <div className="cc-main-col">
          <div className="cc-glass">
            <div className="cc-label"><FaChartBar /> Live Execution Visualization</div>
            <div className="cc-node-view">
              <AnimatePresence>
                {array.map((val, i) => {
                  const isJump = currentData.phase === 'doubling' && i === currentData.i;
                  const inRange = (currentData.phase === 'binary' || currentData.phase === 'range-found') && (i >= currentData.low && i <= currentData.high);
                  const isMid = currentData.phase === 'binary' && i === currentData.mid;
                  const isFound = isMid && currentData.found;
                  const isDimmed = currentData.phase && currentData.phase !== 'init' && !isJump && !inRange && !isFound;

                  return (
                    <motion.div 
                      key={i} layout 
                      className={`cc-node ${isJump ? 'jump' : ''} ${inRange ? 'in-range' : ''} ${isMid ? 'active-mid' : ''} ${isFound ? 'found' : ''} ${isDimmed ? 'dim' : ''}`}
                    >
                      {val}
                      <span style={{ position: 'absolute', bottom: isMobile ? -18 : -24, fontSize: '0.6rem', color: '#52525b' }}>[{i}]</span>
                      {(isJump || isMid) && !isFound && <FaArrowDown style={{ position: 'absolute', top: isMobile ? -20 : -28, color: '#fff', fontSize: '0.8rem' }} />}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            <div className="controls-stack" style={{ padding: isMobile ? '1rem' : '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button className="cc-btn-icon" onClick={handleShuffle} title="Random Sorted Array"><FaRedo /></button>
              <button className="cc-btn-main" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <><FaPause /> Pause</> : <><FaPlay /> Start</>}
              </button>
              <button className="cc-btn-icon" onClick={() => setCurrentStep(s => Math.min(steps.length-1, s+1))} title="Step Forward"><FaChartBar style={{opacity: 0.5}} /></button>
              <button className="cc-btn-icon" style={{color: '#ef4444'}} onClick={() => setArray([])} title="Clear Array"><FaEraser /></button>
            </div>
          </div>

          <div className="config-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
            <div className="cc-glass">
              <div className="cc-label"><FaTerminal /> Logic Trace</div>
              <div className="cc-trace">{`> ${currentData.action || 'System standby.'}`}</div>
            </div>
            <div className="cc-glass">
              <div className="cc-label"><FaCogs /> Engine Config</div>
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
          <div className="cc-label"><FaCode /> exponential_search.c</div>
          <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '1.5rem', fontSize: '0.85rem' }} wrapLines={true} lineProps={line => (line === currentData.line ? { style: { background: 'rgba(255, 255, 255, 0.05)', display: 'block', borderLeft: '3px solid #fff' } } : {})}>
{`int search(int arr[], int n, int x) {
  if (arr[0] == x) return 0;
  int i = 1;
  while (i < n && arr[i] <= x)
    i = i * 2;
  return binarySearch(arr, i/2, 
         min(i, n-1), x);
}`}
          </SyntaxHighlighter>
        </div>
      </div>

      <div className="cc-glass" style={{ maxWidth: '1550px', margin: '1.5rem auto 0' }}>
        <div className="cc-label"><FaInfoCircle /> Technical Docs</div>
        <div className="cc-doc-grid">
          <div className="cc-doc-card">
            <h4><FaBolt /> Logic</h4>
            <p>Combines range jumps with binary extraction. Effectiveness for <strong>Unbounded Search</strong>.</p>
          </div>
          <div className="cc-doc-card">
            <h4><FaChartBar /> Complexity</h4>
            <p>Time: <span className="cc-math">O(log i)</span>. Space: <span className="cc-math">O(1)</span>.</p>
          </div>
          <div className="cc-doc-card">
            <h4><FaLayerGroup /> Constraints</h4>
            <p>Requires <strong>strictly sorted</strong> dataset.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExponentialSearchVisualizer;