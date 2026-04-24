import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, FaPause, FaRedo, FaCode, FaTerminal, FaCogs, 
  FaChartBar, FaStepForward, FaStepBackward, FaPlus, FaTrash, FaEraser, FaEdit
} from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../../../components/Header';
import { div } from 'framer-motion/client';
const LinearSearchVisualizer = () => {
  // --- STATE ---
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90, 5, 77, 30]);
  const [target, setTarget] = useState(22);
  const [inputVal, setInputVal] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(600);

  // --- LOGIC GENERATOR ---
  const generateSteps = useCallback(() => {
    const searchSteps = [{ currentIndex: -1, action: "Initialized search environment.", found: false, line: 1 }];
    
    for (let i = 0; i < array.length; i++) {
      searchSteps.push({ 
        currentIndex: i, 
        action: `Checking index ${i}: Is ${array[i]} == ${target}?`, 
        found: false,
        line: 3 
      });
      
      if (array[i] === target) {
        searchSteps.push({ 
          currentIndex: i, 
          action: `Target ${target} found at index ${i}!`, 
          found: true,
          line: 4 
        });
        return searchSteps;
      }
    }
    
    searchSteps.push({ currentIndex: -1, action: "Target not found in full scan.", found: false, line: 6 });
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
    return steps[currentStep] || { currentIndex: -1, action: "Preparing...", found: false, line: 1 };
  }, [steps, currentStep]);

  // --- HANDLERS ---
  const addElement = () => {
    const val = parseInt(inputVal);
    if (!isNaN(val) && array.length < 15) {
      setArray([...array, val]);
      setInputVal("");
    }
  };

  const removeElement = () => {
    if (array.length > 0) setArray(array.slice(0, -1));
  };

  const clearAll = () => {
    setArray([]);
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleBulkSubmit = () => {
    const newArr = bulkInput
      .split(',')
      .map(item => parseInt(item.trim()))
      .filter(num => !isNaN(num))
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
          padding: 2rem;
          font-family: 'Inter', sans-serif;
        }

        .layout-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 1.5rem;
          max-width: 1400px;
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
          align-items: center;
          gap: 8px;
        }

        /* CARD VISUALIZER STYLING */
        .viz-card-area {
          min-height: 220px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 2rem 0;
        }

        .card-node {
          width: 70px;
          height: 90px;
          background: #09090b;
          border: 1px solid var(--border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          font-weight: 800;
          color: #fff;
          position: relative;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .card-node.active {
          border-color: var(--accent);
          background: rgba(0, 242, 255, 0.05);
          box-shadow: 0 0 20px rgba(0, 242, 255, 0.15);
        }

        .card-node.found {
          background: var(--accent);
          color: #000;
          border-color: var(--accent);
          box-shadow: 0 0 30px rgba(0, 242, 255, 0.4);
        }

        .index-label {
          position: absolute;
          bottom: -25px;
          font-size: 0.7rem;
          color: var(--text-dim);
          font-weight: 600;
        }

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
        .input-bulk {
          width: 100%; margin-top: 10px; font-size: 0.8rem;
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

<Header></Header>
        {/* --- BRUTALIST SPLIT-HEADER --- */}
{/* --- BRUTALIST SPLIT-HEADER --- */}
<div style={{ 
  position: 'relative', 
  padding: '30px 0', 
  marginBottom: '40px',
  borderBottom: '4px solid #fff',
  overflow: 'hidden'
}}>
  {/* The "Binary" Background text */}
  <div style={{
    position: 'absolute',
    top: -20,
    left: 0,
    fontSize: '12rem',
    fontWeight: '900',
    color: 'rgba(255,255,255,0.03)',
    userSelect: 'none',
    lineHeight: 1
  }}>
    0101
  </div>

  <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      
      {/* Left Half */}
      <motion.h1 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        style={{
          fontSize: '5rem',
          margin: 0,
          fontWeight: '900',
          letterSpacing: '-4px',
          color: '#fff'
        }}
      >
        LIN
      </motion.h1>

      {/* The "Divider" - Visualizes the Mid-point search */}
      <motion.div 
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          width: '8px',
          height: '80px',
          background: 'var(--accent)',
          transformOrigin: 'center'
        }}
      />

      {/* Right Half */}
      <motion.h1 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        style={{
          fontSize: '5rem',
          margin: 0,
          fontWeight: '900',
          letterSpacing: '-4px',
          color: 'transparent',
          WebkitTextStroke: '1px #fff'
        }}
      >
        EAR
      </motion.h1>
    </div>

    {/* The Subtitle Tag */}
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8 }}
      style={{
        marginTop: '-10px',
        background: 'var(--accent)',
        color: '#000',
        padding: '5px 15px',
        fontWeight: '900',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        transform: 'rotate(-1deg)'
      }}
    >
      Algorithm Visualizer 
    </motion.div>
  </div>

  {/* Decorative "Array Indices" along the bottom */}
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    width: '100%', 
    position: 'absolute', 
    bottom: '10px', 
    padding: '0 20px',
    fontFamily: 'monospace',
    fontSize: '0.7rem',
    color: 'var(--text-dim)'
  }}>
    {[...Array(10)].map((_, i) => (
      <span key={i}>0{i}</span>
    ))}
  </div>
</div>
     

      <div className="layout-grid">
        <div className="left-side">
          <div className="panel">
            <div className="panel-header"><FaChartBar /> Execution View</div>
            <div className="viz-card-area">
              <AnimatePresence>
                {array.length > 0 ? array.map((val, i) => (
                  <motion.div 
                    key={`${i}-${val}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    className={`card-node ${currentData.currentIndex === i ? 'active' : ''} ${currentData.found && currentData.currentIndex === i ? 'found' : ''}`}
                  >
                    {val}
                    <span className="index-label">[{i}]</span>
                    {currentData.currentIndex === i && !currentData.found && (
                      <motion.div 
                        layoutId="pointer"
                        style={{ position: 'absolute', top: -15, color: 'var(--accent)', fontSize: '0.8rem' }}
                      >
                        ▼
                      </motion.div>
                    )}
                  </motion.div>
                )) : (
                  <div style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>Array is empty. Load elements to begin.</div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
              <button className="btn-action" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} title="Step Backward"><FaStepBackward /></button>
              <button className="btn-action btn-play" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <><FaPause /> PAUSE</> : <><FaPlay /> START SEARCH</>}
              </button>
              <button className="btn-action" onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} title="Step Forward"><FaStepForward /></button>
              <button className="btn-action" onClick={() => setArray(Array.from({length: 8}, () => Math.floor(Math.random()*90)+10))} title="Randomize"><FaRedo /></button>
              <button className="btn-action" style={{ color: '#ff4d4d' }} onClick={clearAll} title="Clear All"><FaEraser /></button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.5rem' }}>
            <div className="panel">
              <div className="panel-header"><FaTerminal /> Logic Trace</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem', color: '#fff', minHeight: '1.2rem' }}>
                <span style={{ color: 'var(--accent)' }}>&gt;</span> {currentData.action}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header"><FaCogs /> Configuration</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>TARGET</span>
                    <input type="number" className="input-dark" value={target} onChange={(e) => setTarget(parseInt(e.target.value) || 0)} />
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                     <div>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>SINGLE</span>
                        <input type="number" placeholder="Val" className="input-dark" value={inputVal} onChange={(e) => setInputVal(e.target.value)} style={{width: '65px'}} />
                     </div>
                    <button className="btn-action" style={{width: '40px', height: '40px', marginTop: '14px'}} onClick={addElement}><FaPlus /></button>
                    <button className="btn-action" style={{width: '40px', height: '40px', marginTop: '14px'}} onClick={removeElement}><FaTrash /></button>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                   <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>CUSTOM INPUT (CSV)</span>
                   <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      className="input-dark input-bulk" 
                      placeholder="e.g. 10, 22, 45" 
                      value={bulkInput} 
                      onChange={(e) => setBulkInput(e.target.value)} 
                    />
                    <button className="btn-action" style={{width: '40px', height: '36px', marginTop: '10px'}} onClick={handleBulkSubmit} title="Load Array"><FaEdit /></button>
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
                position: 'absolute',
                width: '100%',
                height: '24px',
                background: 'rgba(0, 242, 255, 0.08)',
                borderLeft: '3px solid var(--accent)',
                top: `${(currentData.line - 1) * 21 + 24}px`,
                transition: 'top 0.2s ease',
                pointerEvents: 'none'
              }} />

              <SyntaxHighlighter 
                language="cpp" 
                style={vscDarkPlus} 
                customStyle={{ background: 'transparent', padding: '1.5rem', fontSize: '0.85rem', lineHeight: '1.5' }}
              >
{`int search(int arr[], int n, int x) {
  for (int i = 0; i < n; i++) {
    if (arr[i] == x)
      return i; // FOUND
  }
  return -1; // NOT FOUND
}`}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinearSearchVisualizer;