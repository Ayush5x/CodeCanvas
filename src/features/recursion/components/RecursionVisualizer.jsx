import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, FaPause, FaStepForward, FaStepBackward, 
  FaRedo, FaCode, FaLayerGroup, FaSitemap, FaTerminal 
} from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import Header from '../../../components/Header';
import RecursionDoc from './RecursionDocs';

const RecursionVisualizer = () => {
  const [n, setN] = useState(4);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState([]);
  const [speed] = useState(1000);
  const timerRef = useRef(null);

  // --- RECURSION TIMELINE GENERATOR ---
  const generateFibSteps = useCallback(() => {
    const timeline = [];
    let stack = [];
    let callCounter = 0;

    const fib = (num) => {
      const callId = ++callCounter;
      
      stack.push({ id: callId, val: num });
      timeline.push({ 
        stack: [...stack], 
        action: `ENTRY: fib(${num}) initiated. Allocating stack frame.`, 
        line: 1, 
        activeId: callId,
      });

      if (num <= 1) {
        timeline.push({ 
          stack: [...stack], 
          action: `BASE CASE: fib(${num}) hits terminal condition. Returning ${num}.`, 
          line: 2, 
          activeId: callId,
        });
        stack.pop();
        return num;
      }

      const a = fib(num - 1);
      const b = fib(num - 2);
      const result = a + b;

      timeline.push({ 
        stack: [...stack], 
        action: `RESOLVE: fib(${num}) calculated ${a} + ${b} = ${result}. Popping frame.`, 
        line: 4, 
        activeId: callId,
      });
      
      stack.pop();
      return result;
    };

    fib(n);
    return timeline;
  }, [n]);

  useEffect(() => {
    setSteps(generateFibSteps());
    setCurrentStep(0);
    setIsPlaying(false);
  }, [generateFibSteps]);

  useEffect(() => {
    if (isPlaying) {
      if (currentStep >= steps.length - 1) {
        setIsPlaying(false);
        return;
      }

      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, steps.length, speed, currentStep]);

  const state = useMemo(() => steps[currentStep] || { stack: [], action: "Engine Standby", line: 1 }, [steps, currentStep]);

  return (
    <div className="rv-root">
      <style>{`
        .rv-root { background: #000; color: #fff; min-height: 100vh; padding: 2.5rem; font-family: 'Inter', sans-serif; }
        .rv-glass { 
          background: rgba(255, 255, 255, 0.02); 
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.06); 
          border-radius: 12px; 
          overflow: hidden; 
        }
        .rv-layout { display: grid; grid-template-columns: 1fr 400px; gap: 1.5rem; max-width: 1600px; margin: 0 auto; }
        .rv-sub-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.5rem; }
        .rv-header { margin-bottom: 2.5rem; }
        .rv-header h1 { font-size: 2.2rem; font-weight: 900; letter-spacing: -0.03em; margin: 0; }
        .rv-header span { color: #52525b; font-weight: 400; }
        .rv-label { 
          padding: 0.9rem 1.2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06); 
          font-size: 0.65rem; color: #71717a; text-transform: uppercase; font-weight: 700; 
          display: flex; align-items: center; gap: 8px; letter-spacing: 0.05em;
        }
        .stack-view { padding: 1.5rem; display: flex; flex-direction: column-reverse; gap: 10px; height: 400px; overflow-y: auto; }
        .stack-frame { 
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1.2rem; border-radius: 8px; font-family: 'JetBrains Mono', monospace;
          display: flex; justify-content: space-between; align-items: center; transition: 0.3s;
        }
        .stack-frame.active { background: rgba(255, 255, 255, 0.1); border-color: #fff; transform: scale(1.02); }
        .rv-controls { 
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); 
          border-radius: 12px; padding: 1rem 1.5rem; display: flex; align-items: center; gap: 20px; margin-bottom: 1.5rem;
        }
        .rv-btn-main { 
          background: #fff; color: #000; border: none; padding: 10px 24px; border-radius: 6px;
          font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.75rem;
        }
        .rv-btn-icon {
          background: none; border: 1px solid rgba(255,255,255,0.1); color: #fff;
          width: 38px; height: 38px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        .rv-input-box { display: flex; align-items: center; gap: 10px; background: #000; border: 1px solid #27272a; padding: 4px 12px; border-radius: 6px; }
        .rv-input { background: transparent; border: none; color: #fff; width: 40px; font-weight: 700; outline: none; }
        .trace-text { padding: 1.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; color: #fff; line-height: 1.6; min-height: 80px; }
        .depth-tag { background: #fff; color: #000; padding: 2px 6px; border-radius: 4px; font-size: 0.6rem; font-weight: 900; }
      `}</style>

      <div>
        <Header/>
      </div>
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0px', fontFamily: '"Heebo", sans-serif' }}>
  {/* Ultra-minimal Indicator */}
  <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', height: '30px', alignItems: 'center' }}>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <motion.div
        key={i}
        animate={{ 
          height: i === 3 ? '30px' : '15px',
          backgroundColor: i === 3 ? '#22d3ee' : 'rgba(255,255,255,0.15)'
        }}
        transition={{ delay: i * 0.1, duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
        style={{ width: '1px' }}
      />
    ))}
  </div>

  <motion.h1 
    style={{
      fontSize: '3.5em',
      fontWeight: '300',
      textAlign: 'center',
      color: '#fff',
      letterSpacing: '-1px',
      marginBottom: '5px',
    }}
  >
    Recursion 
  </motion.h1>

  <motion.div style={{ width: '50px', height: '1px', background: 'rgba(255,255,255,0.2)', marginBottom: '15px' }} />

  <motion.h2
    style={{
      fontSize: '0.85em',
      color: '#888',
      fontWeight: '400',
      textAlign: 'center',
      letterSpacing: '4px'
    }}
  >
    STEP SIZE = √N
  </motion.h2>
</div>
      <header className="rv-header" style={{marginTop:"0px"}}>
        <h1> <span style={{color:'cyan'}}>Laboratory_V2</span></h1>
      </header>

      <div className="rv-controls rv-glass">
        <div className="rv-input-box">
          <span style={{fontSize: '0.65rem', color: '#52525b'}}>INPUT_N</span>
          <input type="number" className="rv-input" value={n} onChange={(e) => setN(Math.max(1, Math.min(6, parseInt(e.target.value) || 1)))} />
        </div>
        <div style={{width: '1px', height: '20px', background: '#27272a'}} />
        <button className="rv-btn-icon" onClick={() => { setIsPlaying(false); setCurrentStep(s => Math.max(0, s-1)); }}><FaStepBackward /></button>
        <button className="rv-btn-main" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <><FaPause /> PAUSE</> : <><FaPlay /> START ENGINE</>}
        </button>
        <button className="rv-btn-icon" onClick={() => { setIsPlaying(false); setCurrentStep(s => Math.min(steps.length-1, s+1)); }}><FaStepForward /></button>
        <button className="rv-btn-icon" onClick={() => { setIsPlaying(false); setCurrentStep(0); }}><FaRedo /></button>
        <div style={{marginLeft: 'auto', fontSize: '0.7rem', color: '#52525b', fontWeight: 600}}>
          STEP {currentStep + 1} / {steps.length}
        </div>
      </div>

      <div className="rv-layout">
        <div className="rv-main-col">
          <div className="rv-glass">
            <div className="rv-label"><FaTerminal /> Logic Trace</div>
            <div className="trace-text">
              <motion.div key={currentStep} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>
                <span style={{color: '#52525b'}}>&gt;</span> {state.action}
              </motion.div>
            </div>
          </div>

          <div className="rv-sub-grid">
            <div className="rv-glass" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
              <div className="rv-label"><FaLayerGroup /> Active Call Stack</div>
              <div className="stack-view">
                <AnimatePresence mode="popLayout">
                  {state.stack.map((frame, idx) => (
                    <motion.div 
                      key={frame.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`stack-frame ${idx === state.stack.length - 1 ? 'active' : ''}`}
                    >
                      <span style={{fontSize: '0.8rem'}}>fib({frame.val})</span>
                      <span className="depth-tag">DEPTH_{idx}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="rv-glass">
              <div className="rv-label"><FaCode /> recursive_function.js</div>
              <SyntaxHighlighter 
                language="javascript" 
                style={vscDarkPlus}
                customStyle={{background: 'transparent', padding: '1.5rem', fontSize: '0.8rem', lineHeight: '1.7'}}
                wrapLines={true}
                lineProps={line => (line === state.line ? { style: { background: 'rgba(255,255,255,0.06)', display: 'block', borderLeft: '3px solid #fff' } } : {})}
              >
{`function fibonacci(n) {
  if (n <= 1) return n;
  
  return fibonacci(n - 1) + 
         fibonacci(n - 2);
}`}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>

        <div className="rv-glass">
          <div className="rv-label"><FaSitemap /> Abstract Structure</div>
          <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
            <motion.div
              animate={{ 
                boxShadow: isPlaying ? ["0 0 20px rgba(255,255,255,0)", "0 0 40px rgba(255,255,255,0.1)", "0 0 20px rgba(255,255,255,0)"] : "0 0 0px #fff"
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                width: '140px', height: '140px', borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <span style={{fontSize: '0.6rem', color: '#52525b', fontWeight: 800}}>CURRENT_CALL</span>
              <span style={{fontSize: '1.8rem', fontWeight: 900}}>
                {state.stack[state.stack.length - 1]?.val ?? 'N/A'}
              </span>
            </motion.div>

            {/* RESTORED: Visual Depth Bars Section */}
            <div style={{ textAlign: 'center' }}>
              <div style={{fontSize: '0.65rem', color: '#52525b', marginBottom: '10px', fontWeight: 600, letterSpacing: '0.05em'}}>STREAMS_ACTIVE</div>
              <div style={{display: 'flex', gap: '8px', justifyContent: 'center'}}>
                {state.stack.length > 0 ? (
                  state.stack.map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      style={{ 
                        width: '4px', 
                        height: '24px', 
                        background: '#fff', 
                        borderRadius: '2px',
                        boxShadow: '0 0 10px rgba(255,255,255,0.3)' 
                      }} 
                    />
                  ))
                ) : (
                  <div style={{ height: '24px', width: '4px', background: 'rgba(255,255,255,0.05)' }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <RecursionDoc />
    </div>
  );
};

export default RecursionVisualizer;