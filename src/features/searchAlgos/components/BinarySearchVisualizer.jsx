import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, FaPause, FaRedo, FaCode, FaTerminal, FaCogs, 
  FaChartBar, FaStepForward, FaStepBackward, FaPlus, FaTrash, FaEraser, FaEdit,
  FaInfoCircle, FaBolt, FaLayerGroup
} from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../../../components/Header';
import { useIsMobile } from '../../../hooks/use-mobile';

const BinarySearchVisualizer = () => {
  const isMobile = useIsMobile();
  // --- STATE ---
  const [array, setArray] = useState([2, 8, 15, 22, 34, 45, 56, 67, 78, 90]);
  const [target, setTarget] = useState(22);
  const [inputVal, setInputVal] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(800);

  // --- LOGIC GENERATOR (Binary Search) ---
  const generateSteps = useCallback(() => {
    const searchSteps = [{ left: 0, right: array.length - 1, mid: -1, action: "Search started. Defining bounds [L, R].", found: false, line: 1 }];
    let l = 0;
    let r = array.length - 1;

    while (l <= r) {
      let m = Math.floor(l + (r - l) / 2);
      
      // Step: Identify Mid
      searchSteps.push({ left: l, right: r, mid: m, action: `Calculating mid: index ${m} (Value: ${array[m]})`, found: false, line: 3 });

      if (array[m] === target) {
        searchSteps.push({ left: l, right: r, mid: m, action: `Match! Target ${target} found at index ${m}.`, found: true, line: 4 });
        return searchSteps;
      }
      
      if (array[m] < target) {
        const prevM = m;
        l = m + 1;
        searchSteps.push({ left: l, right: r, mid: prevM, action: `${array[prevM]} < ${target}. Searching Right half.`, found: false, line: 5 });
      } else {
        const prevM = m;
        r = m - 1;
        searchSteps.push({ left: l, right: r, mid: prevM, action: `${array[prevM]} > ${target}. Searching Left half.`, found: false, line: 6 });
      }
    }

    searchSteps.push({ left: -1, right: -1, mid: -1, action: "Search exhausted. Target not found.", found: false, line: 8 });
    return searchSteps;
  }, [array, target]);

  useEffect(() => {
    const newSteps = generateSteps();
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [generateSteps]);

  // --- ANIMATION ENGINE ---
  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(prev => prev + 1), speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps, speed]);

  const currentData = useMemo(() => {
    return steps[currentStep] || { left: -1, right: -1, mid: -1, action: "Preparing...", found: false, line: 1 };
  }, [steps, currentStep]);

  // --- HANDLERS ---
  const addElement = () => {
    const val = parseInt(inputVal);
    if (!isNaN(val) && array.length < 15) {
      const newArr = [...array, val].sort((a, b) => a - b);
      setArray(newArr);
      setInputVal("");
    }
  };

  const removeElement = () => {
    if (array.length > 0) setArray(array.slice(0, -1));
  };

  const handleBulkSubmit = () => {
    const newArr = bulkInput
      .split(',')
      .map(item => parseInt(item.trim()))
      .filter(num => !isNaN(num))
      .sort((a, b) => a - b)
      .slice(0, 15);
    if (newArr.length > 0) {
      setArray(newArr);
      setBulkInput("");
    }
  };

  return (
    <div className={`viz-container ${isMobile ? 'mobile-mode' : ''}`}>
      <style>{`
        .viz-container {
          --bg: #000000;
          --glass: rgba(255, 255, 255, 0.03);
          --border: rgba(255, 255, 255, 0.08);
          --accent: #00f2ff;
          --text-dim: #71717a;
          background: var(--bg);
          color: white;
          min-height: 100vh;
          padding: 0 1rem 2rem 1rem;
          font-family: 'Inter', sans-serif;
        }

        .layout-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 1.5rem;
          max-width: 1550px;
          margin: 0 auto;
        }

        .panel {
          background: var(--glass);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .panel-header {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-dim);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center; gap: 8px;
        }

        .viz-card-area {
          min-height: 240px;
          display: flex; flex-wrap: wrap;
          align-items: center; justify-content: center;
          gap: 12px; padding: 2rem 0;
        }

        .card-node {
          width: 60px; height: 85px;
          background: #09090b; border: 1px solid var(--border);
          border-radius: 12px; display: flex;
          align-items: center; justify-content: center;
          font-size: 1.2rem; font-weight: 800;
          position: relative; transition: all 0.4s ease;
        }

        .card-node.out-range { opacity: 0.1; filter: grayscale(1); transform: scale(0.9); }
        .card-node.active-mid { border-color: var(--accent); box-shadow: 0 0 20px rgba(0, 242, 255, 0.2); transform: translateY(-10px); }
        .card-node.found { background: var(--accent); color: #000; border-color: var(--accent); box-shadow: 0 0 30px rgba(0, 242, 255, 0.4); }

        .ptr { position: absolute; top: -25px; font-size: 0.6rem; color: var(--accent); font-weight: 900; }

        .btn-action {
          width: 45px; height: 45px; border-radius: 12px;
          background: var(--glass); border: 1px solid var(--border);
          color: white; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: 0.2s;
        }
        .btn-action:hover { border-color: white; background: rgba(255,255,255,0.08); }
        .btn-play { background: white; color: black; border: none; font-weight: 700; padding: 0 20px; width: auto; }

        .input-dark {
          background: #111; border: 1px solid var(--border);
          color: white; padding: 10px; border-radius: 10px; width: 70px; outline: none;
        }
        .input-bulk { width: 100%; margin-top: 10px; font-size: 0.8rem; font-family: 'JetBrains Mono'; }
        
        .bento-header {
          display: grid; 
          grid-template-columns: 2fr 1fr 1fr; 
          grid-template-rows: 100px 60px; 
          gap: 12px; 
          max-width: 1400px; 
          margin: 0 auto 40px auto;
        }

        @media (max-width: 1024px) {
          .layout-grid { grid-template-columns: 1fr; gap: 1rem; }
          .viz-card-area { min-height: 150px; padding: 1rem 0; gap: 8px; }
          .card-node { width: 45px; height: 60px; font-size: 1rem; border-radius: 8px; }
          .ptr { top: -18px; font-size: 0.5rem; }
          .btn-action { width: 40px; height: 40px; }
          .btn-play { flex: 1; min-width: 120px; }
          .controls-stack { flex-wrap: wrap; gap: 8px; width: 100%; }
          .config-grid { grid-template-columns: 1fr !important; }
          .bento-header { display: none; }
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
        {/* Background Watermark */}
        <h1 className={`absolute -top-10 ${isMobile ? 'left-1/2 -translate-x-1/2 text-[5rem]' : '-left-5 text-[12rem]'} font-black text-white/[0.03] pointer-events-none select-none uppercase italic`}>
          LOG2
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
              BIN
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
              ARY
            </motion.h1>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-cyan-400 text-black px-4 py-1 font-black text-xs uppercase tracking-widest transform -rotate-1"
          >
            Divide & Conquer 
          </motion.div>
        </div>
      </div>
     
      <div className="layout-grid">
        <div className="left-side">
          <div className="panel">
            <div className="panel-header"><FaChartBar /> Execution View</div>
            <div className="viz-card-area">
              <AnimatePresence>
                {array.map((val, i) => {
                  const isInRange = i >= currentData.left && i <= currentData.right;
                  const isMid = i === currentData.mid;
                  const isFound = currentData.found && isMid;
                  return (
                    <motion.div 
                      key={`${i}-${val}`} layout
                      className={`card-node ${!isInRange ? 'out-range' : ''} ${isMid ? 'active-mid' : ''} ${isFound ? 'found' : ''}`}
                    >
                      {val}
                      {i === currentData.left && isInRange && <span className="ptr" style={{left: 0}}>L</span>}
                      {i === currentData.right && isInRange && <span className="ptr" style={{right: 0}}>R</span>}
                      <span style={{ position: 'absolute', bottom: isMobile ? -18 : -20, fontSize: '0.6rem', color: 'var(--text-dim)' }}>[{i}]</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="controls-stack" style={{ display: 'flex', justifyContent: 'center', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <button className="btn-action" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}><FaStepBackward /></button>
              <button className="btn-action btn-play" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <><FaPause /> PAUSE</> : <><FaPlay /> START</>}
              </button>
              <button className="btn-action" onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}><FaStepForward /></button>
              <button className="btn-action" onClick={() => {
                 const rand = Array.from({length: isMobile ? 7 : 10}, () => Math.floor(Math.random()*90)+10).sort((a,b)=>a-b);
                 setArray(rand);
              }}><FaRedo /></button>
              <button className="btn-action" style={{ color: '#ff4d4d' }} onClick={() => {setArray([]); setSteps([])}}><FaEraser /></button>
            </div>
          </div>

          <div className="config-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.5rem' }}>
            <div className="panel">
              <div className="panel-header"><FaTerminal /> Logic Trace</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--accent)' }}>&gt;</span> {currentData.action}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header"><FaCogs /> Configuration</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 700 }}>TARGET</span>
                    <input type="number" className="input-dark" value={target} onChange={(e) => setTarget(parseInt(e.target.value) || 0)} style={{ width: isMobile ? '70px' : '85px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 700 }}>SINGLE</span>
                      <input type="number" placeholder="Add" className="input-dark" value={inputVal} onChange={(e) => setInputVal(e.target.value)} style={{width: isMobile ? '70px' : '80px'}} />
                    </div>
                    <button className="btn-action" style={{ width: 42, height: 42, flexShrink: 0 }} onClick={addElement}><FaPlus /></button>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block' }}>BULK CSV</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" className="input-dark input-bulk" placeholder="10, 20, 30..." value={bulkInput} onChange={(e) => setBulkInput(e.target.value)} />
                    <button className="btn-action" onClick={handleBulkSubmit}><FaEdit /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-side">
          <div className="panel" style={{ padding: 0, height: '100%', overflow: 'hidden' }}>
            <div style={{ padding: '1.2rem', borderBottom: '1px solid var(--border)' }}>
              <div className="panel-header" style={{ margin: 0 }}><FaCode /> Implementation</div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', width: '100%', height: '21px', background: 'rgba(0, 242, 255, 0.1)',
                borderLeft: '3px solid var(--accent)', top: `${(currentData.line - 1) * 21 + 24}px`,
                transition: 'top 0.2s ease', pointerEvents: 'none'
              }} />
              <SyntaxHighlighter language="cpp" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '1.5rem', fontSize: '0.85rem' }}>
{`int search(int arr[], int l, int r, int x) {
  while (l <= r) {
    int m = l + (r - l) / 2;
    if (arr[m] == x) return m;
    if (arr[m] < x) l = m + 1;
    else r = m - 1;
  }
  return -1;
}`}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
      <div className="cc-glass" style={{ maxWidth: '1550px', margin: '1.5rem auto 0' }}>
        <div className="cc-label"><FaInfoCircle /> Technical Docs</div>
        <div className="cc-doc-grid">
          <div className="cc-doc-card">
            <h4><FaBolt /> Logic</h4>
            <p>Interval halving by repeatedly comparing the target to the middle element. Efficiently discards half of the search space in each step.</p>
          </div>
          <div className="cc-doc-card">
            <h4><FaChartBar /> Complexity</h4>
            <p>Time: <span className="cc-math">O(log n)</span>. Space: <span className="cc-math">O(1)</span> Iterative / <span className="cc-math">O(log n)</span> Recursive.</p>
          </div>
          <div className="cc-doc-card">
            <h4><FaLayerGroup /> Constraints</h4>
            <p>Dataset must be <strong>strictly sorted</strong>. Ideal for static or slowly changing datasets where search performance is critical.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinarySearchVisualizer;