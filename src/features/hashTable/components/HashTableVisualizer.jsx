import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Header from '../../../components/Header';

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;600;700&display=swap');

    :root {
      --bg: #000000;
      --surface: rgba(255, 255, 255, 0.03);
      --border: rgba(255, 255, 255, 0.12);
      --os-white: #ffffff;
      --os-black: #000000;
      --text-dim: #666666;
    }

    * { box-sizing: border-box; }
    body { 
      margin: 0; 
      background: var(--bg); 
      color: white; 
      font-family: 'Inter', sans-serif; 
    }

    .os-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 40px;
      gap: 25px;
      background: radial-gradient(circle at 50% 10%, #111 0%, #000 80%);
    }

    .os-header {
      text-align: center;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 5px;
      text-transform: uppercase;
      font-size: 1.2rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 20px;
    }

    .control-panel {
      background: var(--surface);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 30px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .config-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .config-item { display: flex; flex-direction: column; gap: 8px; }
    .config-item label { font-size: 0.65rem; color: var(--text-dim); text-transform: uppercase; font-family: 'JetBrains Mono'; }

    select, input {
      background: #000;
      border: 1px solid var(--border);
      color: white;
      padding: 12px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      outline: none;
    }

    .action-row { display: flex; justify-content: center; gap: 12px; margin-top: 10px; }

    .btn-os {
      background: var(--os-white);
      color: var(--os-black);
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 800;
      font-size: 0.75rem;
      cursor: pointer;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
    }

    .btn-os::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8), transparent);
      transform: skewX(-25deg);
    }

    .btn-os:hover::before { left: 150%; transition: all 0.6s ease; }
    .btn-os:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2); }

    .os-stats {
      display: flex;
      justify-content: center;
      gap: 30px;
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 15px;
      border-radius: 8px;
      font-family: 'JetBrains Mono';
      font-size: 0.75rem;
      color: var(--text-dim);
    }
    .os-stats span { color: var(--os-white); font-weight: bold; }

    .hash-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
      gap: 15px;
      width: 100%;
      max-width: 1100px;
      margin: 20px auto;
    }

    .slot {
      height: 100px;
      border: 1px solid var(--border);
      background: var(--surface);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .slot.active { border-color: var(--os-white); }
    .slot.found { border-color: #00ff88; box-shadow: 0 0 15px rgba(0,255,136,0.2); }
    .slot.deleted { border-color: #ff4444; box-shadow: 0 0 15px rgba(255,68,68,0.2); }

    .slot-idx { position: absolute; top: 8px; left: 8px; font-size: 0.6rem; color: var(--text-dim); }
    .slot-val { flex: 1; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 700; font-family: 'JetBrains Mono'; }

    .beginner-guide {
      background: rgba(255,255,255,0.05);
      border: 1px dashed var(--border);
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.75rem;
      color: var(--os-white);
      text-align: center;
      margin: 10px 0;
    }

    .os-docs {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 30px;
      margin-top: 40px;
    }

    .doc-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }

    .doc-item h4 { font-family: 'JetBrains Mono'; font-size: 0.8rem; color: var(--os-white); text-transform: uppercase; border-left: 2px solid var(--os-white); padding-left: 10px; margin-bottom: 10px;}
    .doc-item p { font-size: 0.85rem; color: var(--text-dim); line-height: 1.6; margin: 0;
    .os-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 0 40px 40px 40px; /* Removed top padding to let Navbar handle it */
      gap: 35px; /* Increased gap between components */
      background: radial-gradient(circle at 50% 10%, #111 0%, #000 80%);
    } }
  `}</style>
);

const HashVisualizerOS = () => {
  const [size, setSize] = useState(11);
  const [func, setFunc] = useState('division');
  const [collision, setCollision] = useState('linear');
  const [input, setInput] = useState('');
  const [table, setTable] = useState(Array(11).fill(null));
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [matchIndex, setMatchIndex] = useState(null);
  const [deletedIndex, setDeletedIndex] = useState(null);
  const [message, setMessage] = useState("SYSTEM_READY");

  useEffect(() => {
    setTable(Array(size).fill(null));
    resetStates();
  }, [size]);

  const resetStates = () => {
    setActiveIndex(null);
    setMatchIndex(null);
    setDeletedIndex(null);
    setIsAnimating(false);
  };

  const getHash = (key) => {
    if (func === 'division') return key % size;
    if (func === 'midSquare') {
      const s = (key * key).toString();
      return (parseInt(s.substr(Math.floor(s.length/2)-1, 2)) || key) % size;
    }
    return (key.toString().split('').reduce((a,b) => a + parseInt(b), 0)) % size;
  };

  const getProbe = (h, i, key) => {
    if (collision === 'linear') return (h + i) % size;
    if (collision === 'quadratic') return (h + i * i) % size;
    const h2 = 7 - (key % 7);
    return (h + i * h2) % size;
  };

  const handleInsert = async () => {
    const key = parseInt(input);
    if (isNaN(key)) return;
    setIsAnimating(true);
    setInput('');
    let h = getHash(key);
    for (let i = 0; i < size; i++) {
      let pos = getProbe(h, i, key);
      setActiveIndex(pos);
      setMessage(`PROBING_MEMORY: 0x${pos.toString(16).toUpperCase()}`);
      await new Promise(r => setTimeout(r, 500));
      if (table[pos] === null || table[pos] === 'DEL') {
        const newTable = [...table];
        newTable[pos] = key;
        setTable(newTable);
        setMatchIndex(pos);
        setMessage(`WRITE_SUCCESS: VAL_${key}_AT_${pos}`);
        break;
      }
    }
    setTimeout(resetStates, 1500);
  };

  const handleSearch = async () => {
    const key = parseInt(input);
    if (isNaN(key)) return;
    setIsAnimating(true);
    setInput('');
    let h = getHash(key);
    for (let i = 0; i < size; i++) {
      let pos = getProbe(h, i, key);
      setActiveIndex(pos);
      setMessage(`SCANNING_REGISTRY: 0x${pos.toString(16).toUpperCase()}`);
      await new Promise(r => setTimeout(r, 500));
      if (table[pos] === key) {
        setMatchIndex(pos);
        setMessage(`MATCH_FOUND: INDEX_${pos}`);
        break;
      }
      if (table[pos] === null) {
        setMessage(`STATUS_404: KEY_NOT_PRESENT`);
        break;
      }
    }
    setTimeout(resetStates, 1500);
  };

  const handleDelete = async () => {
    const key = parseInt(input);
    if (isNaN(key)) return;
    setIsAnimating(true);
    setInput('');
    let h = getHash(key);
    for (let i = 0; i < size; i++) {
      let pos = getProbe(h, i, key);
      setActiveIndex(pos);
      setMessage(`TARGETING_INDEX: 0x${pos.toString(16).toUpperCase()}`);
      await new Promise(r => setTimeout(r, 500));
      if (table[pos] === key) {
        const newTable = [...table];
        newTable[pos] = 'DEL';
        setTable(newTable);
        setDeletedIndex(pos);
        setMessage(`ERASE_SUCCESS: INDEX_${pos}`);
        break;
      }
      if (table[pos] === null) {
        setMessage(`DELETE_ERROR: KEY_ABSENT`);
        break;
      }
    }
    setTimeout(resetStates, 1500);
  };

  return (
    <>
    <div className="relative py-5 flex flex-col items-center justify-center text-center overflow-hidden w-full">
      {/* Decorative Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#00ffcc]/5 blur-[120px] rounded-full pointer-events-none" />
    
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-8 bg-zinc-800" />
          <span className="text-[10px] font-mono tracking-[0.6em] text-zinc-500 uppercase">Architecture // V2</span>
          <div className="h-[1px] w-8 bg-zinc-800" />
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic">
          Hash<span className="text-[#00ffcc] not-italic">.</span>Table
        </h1>
        
        <p className="mt-6 max-w-lg mx-auto text-zinc-400 text-sm leading-relaxed font-light tracking-wide">
          A high-fidelity environment for <span className="text-white">algorithmic exploration</span>. 
          Optimized for structural transparency and real-time computation.
        </p>
      </div>
    </div>
    <div className="os-wrapper">
      <Styles />
    <Header></Header>
                
                            


      <div className="control-panel " style={{marginTop:'50px'}}>
        <div className="config-row">
          <div className="config-item">
            <label>Hash Function</label>
            <select value={func} onChange={e => setFunc(e.target.value)} disabled={isAnimating}>
              <option value="division">Division Method</option>
              <option value="midSquare">Mid-Square</option>
              <option value="folding">Folding</option>
            </select>
          </div>
          <div className="config-item">
            <label>Collision Resolution</label>
            <select value={collision} onChange={e => setCollision(e.target.value)} disabled={isAnimating}>
              <option value="linear">Linear Probing</option>
              <option value="quadratic">Quadratic Probing</option>
              <option value="double">Double Hashing</option>
            </select>
          </div>
          <div className="config-item">
            <label>Table Size</label>
            <select value={size} onChange={e => setSize(parseInt(e.target.value))} disabled={isAnimating}>
              {[7, 11, 13, 17].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <input 
            type="number" 
            placeholder="INPUT_KEY" 
            style={{ width: '280px', textAlign: 'center' }}
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isAnimating}
          />
          <div className="action-row">
            <button className="btn-os" onClick={handleInsert} disabled={isAnimating || !input}>+ Insert</button>
            <button className="btn-os" onClick={handleSearch} disabled={isAnimating || !input}>Search</button>
            <button className="btn-os" onClick={handleDelete} disabled={isAnimating || !input}>Delete</button>
            <button className="btn-os" onClick={() => setTable(Array(size).fill(null))} disabled={isAnimating}>Clear</button>
          </div>
        </div>
      </div>

      <div className="beginner-guide">
        {isAnimating ? "KERNEL EXECUTING..." : "GUIDE: Enter Key → Choose Logic → Execute Action."}
      </div>

      <div className="os-stats">
        <div>USAGE: <span>{((table.filter(x => x && x !== 'DEL').length / size) * 100).toFixed(1)}%</span></div>
        <div>KERNEL: <span>{func.toUpperCase()}</span></div>
        <div>STATUS: <span>{message}</span></div>
      </div>

      <div className="hash-grid">
        {table.map((val, i) => (
          <motion.div 
            key={i} 
            className={`slot ${activeIndex === i ? 'active' : ''} ${matchIndex === i ? 'found' : ''} ${deletedIndex === i ? 'deleted' : ''}`}
            animate={{ scale: activeIndex === i ? 1.05 : 1 }}
          >
            <div className="slot-idx">{i}</div>
            <div className="slot-val">
              <AnimatePresence mode="wait">
                {val !== null && (
                  <motion.span key={val} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: val === 'DEL' ? '#444' : 'white' }}>
                    {val}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="os-docs">
        <h3 style={{fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: 'white', marginBottom: '20px', textTransform: 'uppercase'}}>System Documentation</h3>
        <div className="doc-grid">
          <div className="doc-item">
            <h4>Hash Mapping</h4>
            <p>Mathematical transformation of numeric keys into a fixed-size table. Provides O(1) average time complexity for data operations.</p>
          </div>
          <div className="doc-item">
            <h4>Open Addressing</h4>
            <p>Collision strategy where the system probes for the next available slot. Selecting Linear, Quadratic, or Double Hashing changes the probe sequence.</p>
          </div>
          <div className="doc-item">
            <h4>Tombstone Markers</h4>
            <p>When an item is deleted, it is replaced with a "DEL" marker. This ensures that the search path remains continuous for other items in the collision chain.</p>
          </div>
          <div className="doc-item">
            <h4>Load Management</h4>
            <p>The system tracks real-time usage. Keeping the load factor below 70% is recommended to prevent excessive probing and maintain kernel performance.</p>
          </div>
        </div>
      </section>
    </div>
    </>

  );
};

export default HashVisualizerOS;