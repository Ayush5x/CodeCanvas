import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Trash2, Activity } from 'lucide-react';
import BoyerMooreDocs from './BoyerMooreDocs';
import { motion, AnimatePresence } from "framer-motion";
import Header from '../../../components/Header';

const BoyerMooreSaaS = () => {
  const [array, setArray] = useState([2, 1, 1, 2, 2, 3, 2, 2]);
  const [index, setIndex] = useState(-1);
  const [candidate, setCandidate] = useState(null);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState("System Ready");

  const timerRef = useRef(null);

  const candidateRef = useRef(candidate);
  const countRef = useRef(count);

  useEffect(() => {
    candidateRef.current = candidate;
    countRef.current = count;
  }, [candidate, count]);


  const executeStep = useCallback(() => {
    if (array.length === 0) return;
    setIndex((prevIndex) => {
      const nextIdx = prevIndex + 1;

      if (nextIdx >= array.length) {
        setIsPlaying(false);

        const finalCandidate = candidateRef.current;
        const occurrence = array.filter(v => v === finalCandidate).length;

        if (occurrence > Math.floor(array.length / 2)) {
          setStatus(`Majority Element Found: ${finalCandidate} (Count: ${occurrence})`);
        } else {
          setStatus(
            `No Majority Element (Candidate ${finalCandidate} appears ${occurrence} times)`
          );
        }

        return prevIndex;
      }

      const currentVal = array[nextIdx];
      let currCandidate = candidateRef.current;
      let currCount = countRef.current;

      if (currCount === 0) {
        currCandidate = currentVal;
        currCount = 1;
        setStatus(`Counter zero. New candidate: ${currentVal}`);
      } else if (currentVal === currCandidate) {
        currCount += 1;
        setStatus(`${currentVal} matches candidate. Increment.`);
      } else {
        currCount -= 1;
        setStatus(`${currentVal} conflicts. Decrement.`);
      }

      setCandidate(currCandidate);
      setCount(currCount);

      return nextIdx;
    });
  }, [array]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(executeStep, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, executeStep]);

const reset = () => {
  setIsPlaying(false);
  clearInterval(timerRef.current);

  setArray([]); // 🔥 ACTUAL CLEAR
  setIndex(-1);
  setCandidate(null);
  setCount(0);
  setStatus("Array Cleared");
};

  const generateRandom = () => {
    reset();
    const fresh = Array.from({ length: 8 }, () => Math.floor(Math.random() * 3) + 1);
    setArray(fresh);
  };

  return (
    <div className="visualizer-root">
      <Header></Header>
      <style>{`
        .visualizer-root {
          background: #000;
          min-height: 100vh;
          color: #fff;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0px 20px 0 20px;
        }

        .container {
          width: 100%;
          max-width: 1800px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 30px;
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand h1 {
          font-size: 1.4rem;
          font-weight: 800;
        }

        .brand span {
          color: #888;
        }

        .array-container {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin: 40px 0;
        }

        .node {
          width: 65px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          font-size: 1.5rem;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .node.active {
          background: #fff;
          color: #000;
          transform: translateY(-6px) scale(1.05);
          box-shadow: 0 10px 30px rgba(255,255,255,0.2);
        }

        .hud-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .stat-card {
          background: rgba(255,255,255,0.04);
          padding: 20px;
          border-radius: 16px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .label {
          font-size: 0.7rem;
          color: #aaa;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .value {
          font-size: 1.8rem;
          font-weight: 800;
        }

        .controls-footer {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .play-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: none;
          background: #fff;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.3s;
        }

        .play-btn:hover {
          transform: scale(1.1);
        }

        .icon-btn {
          background: none;
          border: none;
          color: #aaa;
          cursor: pointer;
        }

        .icon-btn:hover {
          color: #fff;
        }

        .status-bar {
          margin-top: 20px;
          padding: 14px 20px;
          background: rgba(255,255,255,0.05);
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: #ddd;
          border: 1px solid rgba(255,255,255,0.08);
        }

        /* 🔥 Console Heading */
        .console-heading {
          width: 100%;
          max-width: 900px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 14px 18px;
          font-family: monospace;
          color: #0f0;
          margin-top: 40px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        }

        .console-heading::before {
          content: "> ";
          color: #888;
        }
      `}</style>

      {/* MAIN VISUALIZER */}
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0px', fontFamily: '"Inter", sans-serif', padding: '8px', background: 'black', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.13)' }}>
  {/* Data Flow Visualization */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '25px', color: '#666' }}>
    <motion.div style={{ fontSize: '0.8em', textTransform: 'uppercase', letterSpacing: '2px', marginRight: '10px' }}>Analyzing</motion.div>
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ 
          opacity: [0.1, 1, 0.1],
          backgroundColor: i === 4 ? '#22d3ee' : '#666',
        }}
        transition={{ delay: i * 0.2, duration: 1.2, repeat: Infinity }}
        style={{ width: '12px', height: '12px', borderRadius: '50%' }}
      />
    ))}
    {/* Final 'Index' point */}
    <motion.div 
      animate={{ scale: [1, 1.2, 1], boxShadow: ['0 0 0px #22d3ee', '0 0 10px #22d3ee', '0 0 0px #22d3ee'] }} 
      transition={{ duration: 1, delay: 1.4, repeat: Infinity, repeatDelay: 1 }}
      style={{ marginLeft: '10px', fontSize: '1.2em' }}
    >
      🔍
    </motion.div>
  </div>

  <motion.h1 
    style={{
      fontSize: '3.8em',
      fontWeight: '800',
      textAlign: 'center',
      color: '#fff',
      letterSpacing: '-2px',
      marginBottom: '10px',
    }}
  >
    Gready Algo .
  </motion.h1>

  <motion.h2
    style={{
      fontSize: '0.9em',
      color: '#aaa',
      textAlign: 'center',
      letterSpacing: '5px',
      textTransform: 'uppercase',
      borderTop: '1px solid #333',
      paddingTop: '10px',
      width: '100%',
      maxWidth: '250px'
    }}
  >
    STEP SIZE = √N
  </motion.h2>
</div>
        <header className="header">
          <div className="brand">
            <h1>BOYER MOORE <span style={{color:"cyan"}}>MAJORITY</span></h1>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button className="icon-btn" onClick={generateRandom}>
              <RotateCcw size={20} />
            </button>
            <button className="icon-btn" onClick={reset}>
              <Trash2 size={20} />
            </button>
          </div>
        </header>

        <main className="glass-card">
          <div className="array-container">
            {array.map((val, i) => (
              <div key={i} className={`node ${i === index ? 'active' : ''}`}>
                {val}
              </div>
            ))}
          </div>

          <div className="hud-row">
            <div className="stat-card">
              <div className="label">Current Candidate</div>
              <div className="value">{candidate ?? '—'}</div>
            </div>

            <div className="stat-card">
              <div className="label">Votes Counter</div>
              <div className="value">{count}</div>
            </div>
          </div>

          <div className="controls-footer">
           <button
  className="play-btn"
  onClick={() => {
    // If finished → restart properly
    if (index >= array.length - 1) {
      setIndex(-1);
      setCandidate(null);
      setCount(0);
      setStatus("Restarting Visualization...");
    }
    setIsPlaying((prev) => !prev);
  }}
>
              {isPlaying ? <Pause fill="black" /> : <Play fill="black" />}
            </button>
          </div>
        </main>

        <div className="status-bar">
          <Activity size={16} />
          <span>{status}</span>
        </div>
      </div>

      {/* 🔥 CONSOLE HEADING */}
      <div className="console-heading">
        Boyer Moore Algorithm Documentation Loaded...
      </div>

      {/* 📘 DOCS SECTION (PERFECTLY ALIGNED) */}
      <div className="container">
        <BoyerMooreDocs />
      </div>
    </div>
  );
};

export default BoyerMooreSaaS;