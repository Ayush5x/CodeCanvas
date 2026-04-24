import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaSearch, FaRandom } from 'react-icons/fa';
import Header from '../../../components/Header';
import AVLExplanation from './AVLExplanation';

/* ================= PREMIUM STYLES (CLONED FROM BST) ================= */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=JetBrains+Mono:wght@400;700&display=swap');

  body { margin: 0; background: #000; font-family: 'Space Grotesk', sans-serif; color: #fff; overflow-x: hidden; }
  .tree-wrapper { min-height: 100vh; display: flex; flex-direction: column; padding: 25px; box-sizing: border-box; background: #000; }
  a:focus { outline: none !important; }
  .control-dock {
    display: flex; gap: 15px; background: rgba(255, 255, 255, 0.03);
    padding: 20px; border-radius: 18px; border: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 25px; align-items: center; flex-wrap: wrap;
    margin-top: 50px;
  }

  .input-bw {
    background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff; padding: 12px; border-radius: 10px; width: 90px;
    font-family: 'JetBrains Mono', monospace; outline: none;
  }

  .btn-bw {
    padding: 12px 24px; border-radius: 10px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; gap: 10px; font-size: 0.75rem;
    text-transform: uppercase; letter-spacing: 1px; transition: 0.3s;
  }
  .btn-main { background: #fff; color: #000; border: none; }
  .btn-outline { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.2); }
  .btn-bw:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(255,255,255,0.2); }

  .canvas-panel {
    flex: 1; position: relative; background: rgba(255, 255, 255, 0.06);
    border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.36);
    min-height: 550px; overflow: hidden;
  }

  .node-unit {
    position: absolute; width: 46px; height: 46px; border-radius: 50%;
    background: #000; border: 2px solid #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; z-index: 5;
    transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1), top 0.6s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s, border 0.3s;
  }

  .node-active { 
    background: #fff !important; 
    color: #000 !important; 
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
    border-color: #fff !important;
  }
  
  .node-target { 
    border-color: #00ff88 !important; 
    color: #00ff88 !important; 
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.4); 
  }

  .terminal-box {
    position: absolute; top: 20px; right: 20px; width: 260px;
    background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(15px);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
    padding: 15px; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;
    z-index: 10;
  }
  .term-line { margin-bottom: 5px; border-left: 2px solid #333; padding-left: 8px; color: rgba(255,255,255,0.4); }
  .term-high { color: #fff; border-color: #fff; }
`;

/* ================= AVL CORE LOGIC ================= */
class AVLNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.x = 0;
    this.y = 0;
  }
}

class AVLTree {
  height(n) { return n ? n.height : 0; }
  balance(n) { return n ? this.height(n.left) - this.height(n.right) : 0; }

  rotateRight(y) {
    let x = y.left;
    let t2 = x.right;
    x.right = y;
    y.left = t2;
    y.height = 1 + Math.max(this.height(y.left), this.height(y.right));
    x.height = 1 + Math.max(this.height(x.left), this.height(x.right));
    return x;
  }

  rotateLeft(x) {
    let y = x.right;
    let t2 = y.left;
    y.left = x;
    x.right = t2;
    x.height = 1 + Math.max(this.height(x.left), this.height(x.right));
    y.height = 1 + Math.max(this.height(y.left), this.height(y.right));
    return y;
  }

  insert(node, val) {
    if (!node) return new AVLNode(val);
    if (val < node.val) node.left = this.insert(node.left, val);
    else if (val > node.val) node.right = this.insert(node.right, val);
    else return node;

    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    let b = this.balance(node);

    if (b > 1 && val < node.left.val) return this.rotateRight(node);
    if (b < -1 && val > node.right.val) return this.rotateLeft(node);
    if (b > 1 && val > node.left.val) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (b < -1 && val < node.right.val) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }
    return node;
  }
}

/* ================= UI COMPONENT ================= */
export default function AdvancedAVL() {
  const [root, setRoot] = useState(null);
  const [flatNodes, setFlatNodes] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [highlighted, setHighlighted] = useState(null);
  const [targetFound, setTargetFound] = useState(null);
  const [logs, setLogs] = useState(["KERNEL INITIALIZED"]);

  const addLog = (msg) => {
    setLogs(prev => [msg.toUpperCase(), ...prev].slice(0, 5));
  };

  const calculatePositions = useCallback((node, x, y, offset) => {
    if (!node) return;
    node.x = x;
    node.y = y;
    calculatePositions(node.left, x - offset, y + 100, offset / 1.7);
    calculatePositions(node.right, x + offset, y + 100, offset / 1.7);
  }, []);

  const flatten = useCallback((node, list = []) => {
    if (!node) return list;
    list.push({ val: node.val, x: node.x, y: node.y, left: node.left, right: node.right });
    flatten(node.left, list);
    flatten(node.right, list);
    return list;
  }, []);

  const updateTreeUI = (newRoot) => {
    calculatePositions(newRoot, window.innerWidth / 2.5, 80, window.innerWidth / 6);
    setRoot(newRoot);
    setFlatNodes(flatten(newRoot));
  };

  // Helper to animate traversal before insertion
  const animatePath = async (val) => {
    let curr = root;
    while (curr) {
      setHighlighted(curr.val);
      await new Promise(r => setTimeout(r, 500));
      if (val < curr.val) {
        addLog(`${val} < ${curr.val}: LEFT`);
        if (!curr.left) break;
        curr = curr.left;
      } else if (val > curr.val) {
        addLog(`${val} > ${curr.val}: RIGHT`);
        if (!curr.right) break;
        curr = curr.right;
      } else {
        addLog("DUPLICATE_FOUND: SKIPPING");
        return false;
      }
    }
    return true;
  };

  const handleInsert = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val) || isBusy) return;
    setIsBusy(true);
    setInputValue('');
    setTargetFound(null);
    addLog(`INIT_INSERT: ${val}`);

    const shouldInsert = await animatePath(val);
    
    if (shouldInsert) {
      const avl = new AVLTree();
      const newRoot = avl.insert(root, val);
      addLog("REBALANCING_KERNEL...");
      updateTreeUI(newRoot);
      // Brief glow on the newly added node
      setHighlighted(val);
      await new Promise(r => setTimeout(r, 600));
    }

    setHighlighted(null);
    setIsBusy(false);
  };

  const handleSearch = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val) || isBusy) return;
    setIsBusy(true);
    setInputValue('');
    setTargetFound(null);
    addLog(`SEARCH_MODE: ${val}`);

    let curr = root;
    while (curr) {
      setHighlighted(curr.val);
      await new Promise(r => setTimeout(r, 600));
      if (val === curr.val) {
        setTargetFound(curr.val);
        addLog("MATCH_LOCATED");
        break;
      }
      curr = val < curr.val ? curr.left : curr.right;
    }
    if (!curr) addLog("NODE_NOT_IN_MEMORY");
    
    setHighlighted(null);
    setIsBusy(false);
  };

  const generateRandom = async () => {
    if (isBusy) return;
    setIsBusy(true);
    setRoot(null);
    setFlatNodes([]);
    addLog("GENERATING_RANDOM_AVL...");

    let tempRoot = null;
    const avl = new AVLTree();
    const vals = [];
    while(vals.length < 6) {
      const r = Math.floor(Math.random() * 90) + 1;
      if(!vals.includes(r)) vals.push(r);
    }
    
    for (const v of vals) {
      addLog(`PROCESSING: ${v}`);
      
      // For random, we do a faster traversal highlight
      let curr = tempRoot;
      while(curr) {
        setHighlighted(curr.val);
        await new Promise(r => setTimeout(r, 200));
        curr = v < curr.val ? curr.left : curr.right;
      }

      tempRoot = avl.insert(tempRoot, v);
      updateTreeUI(tempRoot);
      setHighlighted(v); // Glow new node
      await new Promise(r => setTimeout(r, 300));
    }

    setHighlighted(null);
    setIsBusy(false);
    addLog("AVL_SYNC_COMPLETE");
  };

  return (
    <div className="tree-wrapper">
      <style>{STYLES}</style>

      <Header></Header>
      
                   <div className="flex flex-col md:flex-row justify-between items-center w-full border-b border-white/10 pb-10">
  <div className="relative overflow-hidden">
    <h1 className="absolute -top-10 -left-5 text-[10rem] font-black text-white/[0.02] pointer-events-none select-none">
      SORT
    </h1>

    <div className="relative z-10 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-[#f0e7e7] rounded-full animate-pulse" />
        <span className="text-xs font-mono tracking-[0.4em] text-zinc-500 uppercase">System Active</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <h1 className="text-7xl font-light tracking-tighter text-white">
          AVL<span className="font-black text-[25px]  text-[#f0e7e7]">_Tree</span>
        </h1>
      </div>

      <p className="max-w-md text-zinc-400 text-sm leading-relaxed border-l-2 border-zinc-800 pl-4">
        Automated rotational corrections—Single (LL, RR) or Double (LR, RL)—instantly fix balance violations. These O(1) pointer shifts guarantee a stable O(log n)height, ensuring peak lookup performance without manual re-indexing.
      </p>
    </div>
  </div>
  <div className="py-10 text-right"> 
    <div className="flex items-baseline justify-end gap-4">
      <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-800">
        Ds
      </h1>
    </div>
  </div>
</div>
      
      <div className="control-dock">
        <input 
          className="input-bw" 
          type="number" 
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)} 
          placeholder="00" 
        />
        <button className="btn-bw btn-main focus:outline-none" onClick={handleInsert} disabled={isBusy}>
          <FaPlus /> Insert
        </button>
        <button className="btn-bw btn-outline focus:outline-none" onClick={handleSearch} disabled={isBusy}>
          <FaSearch /> Search
        </button>
        <button className="btn-bw btn-outline focus:outline-none" onClick={generateRandom} disabled={isBusy}>
          <FaRandom /> Random
        </button>
        <button 
          className="btn-bw  btn-outline focus:outline-none  " 
          style={{marginLeft: 'auto'}} 
          onClick={() => {setRoot(null); setFlatNodes([]); addLog("MEMORY_PURGED");}}
        >
          <FaTrash /> Wipe
        </button>
      </div>

      <div className="canvas-panel">
        <div className="terminal-box">
          <div style={{color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', marginBottom: '10px'}}>KERNEL_LOG</div>
          {logs.map((l, i) => (
            <div key={i} className={`term-line ${i === 0 ? 'term-high' : ''}`}>
              {`> ${l}`}
            </div>
          ))}
        </div>

        <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
          {flatNodes.map(n => (
            <React.Fragment key={`line-${n.val}`}>
              {n.left && (
                <motion.line 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  x1={n.x} y1={n.y} x2={n.left.x} y2={n.left.y} 
                  stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" 
                />
              )}
              {n.right && (
                <motion.line 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  x1={n.x} y1={n.y} x2={n.right.x} y2={n.right.y} 
                  stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" 
                />
              )}
            </React.Fragment>
          ))}
        </svg>

        <AnimatePresence>
          {flatNodes.map(n => (
            <motion.div
              key={n.val}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                left: n.x - 23, 
                top: n.y - 23 
              }}
              exit={{ scale: 0, opacity: 0 }}
              className={`node-unit ${highlighted === n.val ? 'node-active' : ''} ${targetFound === n.val ? 'node-target' : ''}`}
            >
              {n.val}
            </motion.div>
          ))}
        </AnimatePresence>

        {flatNodes.length === 0 && !isBusy && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.1, letterSpacing: '5px', fontSize: '0.8rem' }}>
            AWAITING_DATA_INPUT
          </div>
        )}
      </div>

      <div style={{}}>
        <AVLExplanation/>
      </div>
    </div>


  );
}