import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, FaPause, FaRedo, FaCode, FaTerminal, FaCogs, 
  FaChartBar, FaPlus, FaEraser, FaArrowDown, FaInfoCircle, FaBolt, FaLayerGroup 
} from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../../../components/Header';

const ExponentialSearchVisualizer = () => {
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
    const newArr = Array.from({ length: 12 }, () => Math.floor(Math.random() * 200)).sort((a, b) => a - b);
    setArray(newArr);
  };

  return (
    <div className="cc-root">
      <style>{`
        .cc-root { background: #000; color: #fff; min-height: 100vh; padding: 2.5rem; font-family: 'Inter', sans-serif; }
        
        /* Modern Monochromatic Glassmorphism */
        .cc-glass { 
          background: rgba(255, 255, 255, 0.02); 
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.06); 
          border-radius: 12px; 
          overflow: hidden; 
          position: relative; 
          margin-bottom: 1.5rem; 
        }

        .cc-layout { display: grid; grid-template-columns: 1fr 420px; gap: 1.5rem; max-width: 1550px; margin: 0 auto; }
        .cc-header h1 { font-size: 2.4rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.2rem; }
        .cc-header span { color: #888; } /* Monochromatic accent */
        .cc-sub { color: #52525b; font-size: 0.95rem; margin-bottom: 2.5rem; }

        .cc-node-view { display: flex; justify-content: center; gap: 14px; padding: 6rem 1rem; flex-wrap: wrap; }
        .cc-node { 
          width: 58px; height: 78px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255, 255, 255, 0.06); 
          border-radius: 8px; display: flex; align-items: center; justify-content: center; 
          font-weight: 700; transition: 0.4s cubic-bezier(0.23, 1, 0.32, 1); position: relative; 
        }

        /* Monochromatic Node States */
        .cc-node.jump { border-color: #fff; background: rgba(255,255,255,0.05); transform: translateY(-5px); box-shadow: 0 5px 15px rgba(255,255,255,0.05); }
        .cc-node.in-range { border-color: #3f3f46; background: rgba(255,255,255,0.04); }
        .cc-node.active-mid { border-color: #fff; background: rgba(255,255,255,0.08); transform: translateY(-8px); box-shadow: 0 0 20px rgba(255,255,255,0.1); }
        .cc-node.found { background: #fff; color: #000; border-color: #fff; box-shadow: 0 0 30px rgba(255,255,255,0.3); transform: scale(1.1); }
        .cc-node.dim { opacity: 0.15; filter: grayscale(1) blur(1px); }

        /* High-Contrast Monochromatic Buttons */
        .cc-btn-main { 
          background: #fff; color: #000; padding: 12px 28px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; 
          display: flex; align-items: center; gap: 10px; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em; 
        }
        .cc-btn-main:hover { background: #ddd; transform: translateY(-1px); }

        .cc-btn-icon { 
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #fff; 
          width: 44px; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center; 
          cursor: pointer; transition: 0.2s; 
        }
        .cc-btn-icon:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.2); }
        
        .cc-label { padding: 0.9rem 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.65rem; color: #52525b; text-transform: uppercase; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .cc-trace { color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; padding: 1.5rem; line-height: 1.5; }
        .cc-input { background: #000; border: 1px solid rgba(255,255,255,0.06); color: #fff; padding: 10px; border-radius: 6px; width: 80px; outline: none; }
        .cc-input:focus { border-color: #fff; }

        .cc-doc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; padding: 1.5rem; }
        .cc-doc-card { background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.06); padding: 1.2rem; border-radius: 8px; transition: 0.3s; }
        .cc-doc-card h4 { color: #fff; font-size: 0.85rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 8px; text-transform: uppercase; }
        .cc-doc-card p { color: #a1a1aa; font-size: 0.85rem; line-height: 1.6; }
        .cc-math { color: #fff; font-family: 'JetBrains Mono'; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; font-weight: 600; }
      `}</style>
<div>
  <Header></Header>
</div>
      <div style={{ position: 'relative',margin:'0 0 30px 0', display: 'inline-block', padding: '20px' }}>
  {/* Corner Brackets */}
  <motion.div 
    initial={{ width: 0, height: 0 }}
    whileInView={{ width: '20px', height: '20px' }}
    style={{ position: 'absolute', top: 0, left: 0, borderTop: '2px solid #555', borderLeft: '2px solid #555' }} 
  />
  <motion.div 
    initial={{ width: 0, height: 0 }}
    whileInView={{ width: '20px', height: '20px' }}
    style={{ position: 'absolute', bottom: 0, right: 0, borderBottom: '2px solid #555', borderRight: '2px solid #555' }} 
  />

  <motion.h1 
    whileHover={{ letterSpacing: '5px' }}
    style={{
      fontSize: '4em',
      margin: 0,
      fontFamily: '"Courier New", monospace',
      color: '#fff',
      fontWeight: '100',
      textTransform: 'uppercase',
    }}
  >
    exponential_search
  </motion.h1>
  
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
    <motion.div 
      animate={{ width: ['0%', '100%', '0%'] }} 
      transition={{ repeat: Infinity, duration: 3 }}
      style={{ height: '1px', background: '#22d3ee39', flexGrow: 1 }} 
    />
    <span style={{ fontSize: '0.7em', color: '#22d3ee', fontFamily: 'monospace' }}>AREA_51_DEV</span>
  </div>
</div>

      <div className="cc-layout">
        <div className="cc-main-col">
          <div className="cc-glass">
            <div className="cc-label"><FaChartBar /> Live Execution Visualization</div>
            <div className="cc-node-view">
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
                    <span style={{ position: 'absolute', bottom: -24, fontSize: '0.6rem', color: '#52525b' }}>[{i}]</span>
                    {(isJump || isMid) && !isFound && <FaArrowDown style={{ position: 'absolute', top: -28, color: '#fff', fontSize: '0.8rem' }} />}
                  </motion.div>
                );
              })}
            </div>
            
            <div style={{ padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button className="cc-btn-icon" onClick={handleShuffle} title="Random Sorted Array"><FaRedo /></button>
              <button className="cc-btn-main" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <><FaPause /> Pause</> : <><FaPlay /> Start Engine</>}
              </button>
              <button className="cc-btn-icon" onClick={() => setCurrentStep(s => Math.min(steps.length-1, s+1))} title="Step Forward"><FaChartBar style={{opacity: 0.5}} /></button>
              <button className="cc-btn-icon" style={{color: '#ef4444'}} onClick={() => setArray([])} title="Clear Array"><FaEraser /></button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
            <div className="cc-glass">
              <div className="cc-label"><FaTerminal /> Logic Trace</div>
              <div className="cc-trace">{`> ${currentData.action || 'System standby.'}`}</div>
            </div>
            <div className="cc-glass">
              <div className="cc-label"><FaCogs /> Engine Config</div>
              <div style={{ padding: '1.2rem', display: 'flex', gap: '12px' }}>
                <input type="number" className="cc-input" value={target} onChange={e => setTarget(parseInt(e.target.value))} />
                <input type="number" placeholder="Add" className="cc-input" value={inputVal} onChange={e => setInputVal(e.target.value)} />
                <button className="cc-btn-icon" onClick={handleAdd}><FaPlus /></button>
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
        <div className="cc-label"><FaInfoCircle /> Extended Technical Documentation</div>
        <div className="cc-doc-grid">
          <div className="cc-doc-card">
            <h4><FaBolt /> Logic Mechanics</h4>
            <p>Exponential search combines repeated range jumps with binary surgical extraction. By jumping in powers of 2 (<span className="cc-math">2^k</span>), the algorithm rapidly brackets the target range, which is highly effective for <strong>Unbounded Search Problems</strong> where array boundaries are unknown.</p>
          </div>
          <div className="cc-doc-card">
            <h4><FaChartBar /> Complexity</h4>
            <p>The time complexity is <span className="cc-math">O(log i)</span>, where <span className="cc-math">i</span> is the index of the element being sought. Standard auxiliary space is <span className="cc-math">O(1)</span>. It is superior to standard Binary Search when the target appears early in the massive array.</p>
          </div>
          <div className="cc-doc-card">
            <h4><FaLayerGroup /> Constraints</h4>
            <p>The system requires the dataset to be <strong>strictly sorted</strong>. Unlike Jump Search which uses fixed block sizes (<span className="cc-math">√n</span>), Exponential Search adapts its jump adapting dynamically allowing for logarithmic growth of the search boundary. Perfect for real-time data streams.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExponentialSearchVisualizer;