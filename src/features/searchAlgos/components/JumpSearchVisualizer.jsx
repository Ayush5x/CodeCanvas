import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, FaPause, FaRedo, FaCode, FaTerminal, FaCogs, 
  FaChartBar, FaStepForward, FaStepBackward, FaPlus, FaEraser, FaArrowDown
} from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../../../components/Header';
const JumpSearchVisualizer = () => {
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
    const newArr = Array.from({length: 10}, () => Math.floor(Math.random() * 100))
      .sort((a, b) => a - b);
    setArray(newArr);
  };

  return (
    <div className="cc-root">
      <style>{`
        .cc-root { background: #000; color: #fff; min-height: 100vh; padding: 2.5rem; font-family: 'Inter', sans-serif; }
        .cc-glass { background: #09090b; border: 1px solid #18181b; border-radius: 12px; position: relative; overflow: hidden; }
        .cc-layout { display: grid; grid-template-columns: 1fr 400px; gap: 1.5rem; max-width: 1550px; margin: 0 auto; }
        
        .cc-header h1 { font-size: 2.4rem; font-weight: 400; letter-spacing: -0.02em; margin-bottom: 0.2rem; }
        .cc-header span { color: #22d3ee; }
        .cc-sub { color: #52525b; font-size: 0.95rem; margin-bottom: 3rem; }

        .cc-node-view { display: flex; justify-content: center; gap: 14px; padding: 6rem 1rem; }
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
      `}</style>
<Header></Header>

<div style={{ display: 'flex', marginBottom: '30px',flexDirection: 'column', alignItems: 'center' }}>
  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
    {[0, 1, 2, 3].map((i) => (
      <motion.div
        key={i}
        animate={{ 
          backgroundColor: i === 2 ? '#22d3ee92' : 'rgba(255,255,255,0.1)',
          scale: i === 2 ? [1, 1.2, 1] : 1
        }}
        transition={{ delay: i * 0.4, duration: 0.8, repeat: Infinity }}
        style={{ width: '40px', height: '10px', borderRadius: '2px' }}
      />
    ))}
  </div>
  
  <motion.h1 
    style={{
      fontSize: '4.5em',
      textAlign: 'center',
      background: 'linear-gradient(180deg, #fff 0%, #444 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  >
    Jump Search
  </motion.h1>
  
  <motion.h2
    style={{
      fontSize: '1em',
      color: '#888',
      textAlign: 'center',
      letterSpacing: '8px'
    }}
  >
    STEP SIZE = √N
  </motion.h2>
</div>
      
<header className="cc-header" style={{marginTop:"50px"}}>
        <h1>Search <span style={{color:"Cyan"}}>Engine</span></h1>
      </header>
      <div className="cc-layout">
        <div className="cc-main-col">
          <div className="cc-glass" style={{ marginBottom: '1.5rem' }}>
            <div className="cc-label"><FaChartBar /> Execution View</div>
            <div className="cc-node-view">
              {array.map((val, i) => {
                const isInBlock = i >= currentData.prev && i < currentData.step;
                const isCurrent = i === currentData.current;
                const isFound = currentData.found && isCurrent;
                const isDimmed = currentData.phase && currentData.phase !== 'init' && !isInBlock && !isFound;
                return (
                  <motion.div key={i} layout className={`cc-node ${isInBlock ? 'in-block' : ''} ${isCurrent ? 'active' : ''} ${isFound ? 'found' : ''} ${isDimmed ? 'dim' : ''}`}>
                    {val}
                    <span style={{ position: 'absolute', bottom: -24, fontSize: '0.65rem', color: '#52525b', fontWeight: 400 }}>[{i}]</span>
                    {isCurrent && !isFound && <FaArrowDown style={{ position: 'absolute', top: -28, color: '#22d3ee', fontSize: '0.9rem' }} />}
                  </motion.div>
                );
              })}
            </div>
            <div style={{ padding: '2rem', borderTop: '1px solid #18181b', display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button className="cc-btn-icon" onClick={() => setCurrentStep(s => Math.max(0, s-1))}><FaStepBackward /></button>
              <button className="cc-btn-main" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <><FaPause /> Pause</> : <><FaPlay /> Start Search</>}
              </button>
              <button className="cc-btn-icon" onClick={() => setCurrentStep(s => Math.min(steps.length-1, s+1))}><FaStepForward /></button>
              <button className="cc-btn-icon" onClick={handleShuffle}><FaRedo /></button>
              <button className="cc-btn-icon" style={{color: '#ef4444'}} onClick={() => setArray([])}><FaEraser /></button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
            <div className="cc-glass">
              <div className="cc-label"><FaTerminal /> Logic Trace</div>
              <div className="cc-trace">{`> ${currentData.action}`}</div>
            </div>
            <div className="cc-glass">
              <div className="cc-label"><FaCogs /> Configuration</div>
              <div style={{ padding: '1.2rem', display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                  <span style={{fontSize:'0.6rem', color:'#52525b'}}>TARGET</span>
                  <input type="number" className="cc-input" value={target} onChange={e => setTarget(parseInt(e.target.value))} />
                </div>
                <div style={{display:'flex', gap:'6px'}}>
                   <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                     <span style={{fontSize:'0.6rem', color:'#52525b'}}>SINGLE</span>
                     <input type="number" placeholder="Val" className="cc-input" style={{width:'70px'}} value={inputVal} onChange={e => setInputVal(e.target.value)} />
                   </div>
                   <button className="cc-btn-icon" style={{ width: 42, height: 42 }} onClick={handleAdd}><FaPlus /></button>
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
    </div>
  );
};

export default JumpSearchVisualizer;