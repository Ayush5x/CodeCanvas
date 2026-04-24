import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, FaPause, FaRedo, FaCode, FaTerminal, FaCogs, 
  FaChartBar, FaStepForward, FaStepBackward, FaPlus, FaTrash, FaEraser, FaEdit
} from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../../../components/Header';
const BinarySearchVisualizer = () => {
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
    <div className="viz-container">
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
          padding: 2rem 1rem;
          font-family: 'Inter', sans-serif;
        }

        .layout-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 1100px) {
          .layout-grid {
            grid-template-columns: 1fr;
          }
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

        @media (max-width: 640px) {
          .card-node {
            width: 45px; height: 65px;
            font-size: 1rem;
          }
          .viz-container {
            padding: 1rem 0.5rem;
          }
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
          .bento-header {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
          }
          .bento-main-tile {
            grid-column: span 2;
          }
        }

        @media (max-width: 640px) {
          .bento-header {
            grid-template-columns: 1fr;
          }
          .bento-main-tile {
            grid-column: span 1;
          }
          .bento-tile-wide {
            grid-column: span 1 !important;
          }
        }
      `}</style>
<Header></Header>
      
             {/* --- BENTO BOX HEADER --- */}
<div className="bento-header">
  
  {/* Main Title Tile */}
  <motion.div 
    whileHover={{ y: -5 }}
    className="bento-main-tile"
    style={{
      gridRow: '1 / span 2',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '24px',
      padding: '30px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <div style={{ position: 'absolute', top: -20, right: -20, width: '150px', height: '150px', background: 'var(--accent)', filter: 'blur(100px)', opacity: 0.15 }} />
    <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', margin: 0, fontWeight: 800, letterSpacing: '-2px' }}>
      Binary<span style={{ color: 'var(--accent)' }}>Search</span>
    </h1>
    <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.9rem', fontFamily: 'JetBrains Mono' }}>
      // log₂(n) efficiency initialized
    </p>
  </motion.div>

  {/* Complexity Tile */}
  <div style={{
    background: 'rgba(0, 242, 255, 0.03)',
    border: '1px solid rgba(0, 242, 255, 0.2)',
    borderRadius: '24px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  }}>
    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', flexShrink: 0 }}>
      <FaChartBar style={{ margin: 'auto' }} />
    </div>
    <div>
      <div style={{ fontSize: '0.6rem', color: 'var(--accent)', fontWeight: 'bold' }}>COMPLEXITY</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>O(log n)</div>
    </div>
  </div>

  {/* Status Tile */}
  <div style={{
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border)',
    borderRadius: '24px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  }}>
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: 0, width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', animate: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
    </div>
    <div>
      <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>ENGINE</div>
      <div style={{ fontSize: '1rem', fontWeight: 'bold', letterSpacing: '1px' }}>READY</div>
    </div>
  </div>

  {/* Search Range Tile (Wide) */}
  <div className="bento-tile-wide" style={{
    gridColumn: '2 / span 2',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border)',
    borderRadius: '24px',
    padding: '15px 25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '60px'
  }}>
    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>[ LOW: 0 ]</span>
    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--accent), transparent)', margin: '0 20px' }} />
    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>[ HIGH: {array.length - 1} ]</span>
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
                      <span style={{ position: 'absolute', bottom: -20, fontSize: '0.6rem', color: 'var(--text-dim)' }}>[{i}]</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <button className="btn-action" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}><FaStepBackward /></button>
              <button className="btn-action btn-play" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <><FaPause /> PAUSE</> : <><FaPlay /> START SEARCH</>}
              </button>
              <button className="btn-action" onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}><FaStepForward /></button>
              <button className="btn-action" onClick={() => {
                 const rand = Array.from({length: 10}, () => Math.floor(Math.random()*90)+10).sort((a,b)=>a-b);
                 setArray(rand);
              }}><FaRedo /></button>
              <button className="btn-action" style={{ color: '#ff4d4d' }} onClick={() => {setArray([]); setSteps([])}}><FaEraser /></button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.5rem' }}>
            <div className="panel">
              <div className="panel-header"><FaTerminal /> Logic Trace</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--accent)' }}>&gt;</span> {currentData.action}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header"><FaCogs /> Configuration</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block' }}>TARGET</span>
                    <input type="number" className="input-dark" value={target} onChange={(e) => setTarget(parseInt(e.target.value) || 0)} />
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <input type="number" placeholder="Add" className="input-dark" value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
                    <button className="btn-action" onClick={addElement}><FaPlus /></button>
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
    </div>
  );
};

export default BinarySearchVisualizer;