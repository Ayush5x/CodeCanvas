import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../../components/Header';
import BSTExplainner from "./BSTExplanner"

// Ensure these paths are correct for your project structure
// import Navbar from "../../linkedList/components/Navbar";
// import BSTDocumentation from './BSTDocumentaion';
import { 
  FaHome, FaPlus, FaTrash, FaSearch, 
  FaMicrochip, FaTerminal, FaCode, FaHistory, FaRandom 
} from 'react-icons/fa';

// --- PREMIUM B&W GLASS STYLES ---
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=JetBrains+Mono:wght@400;700&display=swap');

  body { margin: 0; background: #000; font-family: 'Space Grotesk', sans-serif; color: #fff; overflow-x: hidden; }
  .tree-wrapper { min-height: 100vh; display: flex; flex-direction: column; padding: 25px; box-sizing: border-box; background: #000; }

  .glass-header {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 15px 40px;
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  }

  .control-dock {
    display: flex; gap: 15px; background: rgba(255, 255, 255, 0.03);
    padding: 20px; border-radius: 18px; border: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 25px; align-items: center;
    flex-wrap: wrap;
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
    border-radius: 30px;border: 1px solid rgba(255, 255, 255, 0.36);
    min-height: 550px; overflow: hidden;
  }

  .node-unit {
    position: absolute; width: 46px; height: 46px; border-radius: 50%;
    background: #000; border: 2px solid #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; z-index: 5;
  }

  .node-active { background: #fff !important; color: #000 !important; box-shadow: 0 0 25px #fff; }
  .node-target { border-color: #00ff88; color: #00ff88; box-shadow: 0 0 15px rgba(0, 255, 136, 0.4); }

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

class BSTNode {
  constructor(val, x, y, level) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.x = x;
    this.y = y;
    this.level = level;
  }
}

export default function AdvancedBST() {
  const [tree, setTree] = useState(null);
  const [flatNodes, setFlatNodes] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [highlighted, setHighlighted] = useState(null);
  const [targetFound, setTargetFound] = useState(null);
  const [logs, setLogs] = useState(["SYSTEM INITIALIZED"]);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const getFlatNodes = useCallback((node, list = []) => {
    if (!node) return list;
    list.push(node);
    getFlatNodes(node.left, list);
    getFlatNodes(node.right, list);
    return list;
  }, []);

  const refreshUI = (rootNode) => {
    setTree(rootNode);
    setFlatNodes([...getFlatNodes(rootNode)]);
  };

  // The core insertion logic separated to be reused by the random generator
  const insertNodeLogic = async (root, val) => {
    let curr = root;
    let level = 0;
    const initialSpread = window.innerWidth / 6;

    while (curr) {
      setHighlighted(curr.val);
      // Faster animation for random generation
      await new Promise(r => setTimeout(r, 400));

      const offset = initialSpread / Math.pow(1.6, level);

      if (val < curr.val) {
        addLog(`${val} < ${curr.val}: LEFT`);
        if (!curr.left) {
          curr.left = new BSTNode(val, curr.x - offset, curr.y + 100, level + 1);
          addLog("PLACEMENT_FOUND");
          return true;
        }
        curr = curr.left;
      } else if (val > curr.val) {
        addLog(`${val} > ${curr.val}: RIGHT`);
        if (!curr.right) {
          curr.right = new BSTNode(val, curr.x + offset, curr.y + 100, level + 1);
          addLog("PLACEMENT_FOUND");
          return true;
        }
        curr = curr.right;
      } else {
        addLog(`SKIP DUPLICATE: ${val}`);
        return false;
      }
      level++;
    }
  };

  const performInsert = async (val) => {
    addLog(`INIT_INSERT: ${val}`);
    let currentTree = tree;

    if (!currentTree) {
      const newRoot = new BSTNode(val, window.innerWidth / 2.5, 80, 0);
      refreshUI(newRoot);
      addLog("ROOT_CREATED");
    } else {
      await insertNodeLogic(currentTree, val);
      refreshUI({ ...currentTree });
    }
  };

  const generateRandomBST = async () => {
    if (isBusy) return;
    setIsBusy(true);
    // Clear current tree first
    setTree(null);
    setFlatNodes([]);
    addLog("GENERATING RANDOM KERNEL...");
    
    // Generate 7-10 random unique values
    const randomValues = [];
    while(randomValues.length < 7) {
      const r = Math.floor(Math.random() * 99) + 1;
      if(!randomValues.includes(r)) randomValues.push(r);
    }

    let tempRoot = null;
    for (const val of randomValues) {
      if (!tempRoot) {
        tempRoot = new BSTNode(val, window.innerWidth / 2.5, 80, 0);
        setTree(tempRoot);
        setFlatNodes([tempRoot]);
        addLog(`RANDOM_ROOT: ${val}`);
      } else {
        await insertNodeLogic(tempRoot, val);
        refreshUI({ ...tempRoot });
      }
      await new Promise(r => setTimeout(r, 200));
    }
    
    setIsBusy(false);
    setHighlighted(null);
    addLog("RANDOM_BST_COMPLETE");
  };

  const handleAction = async (actionType) => {
    if (actionType === 'random') {
      await generateRandomBST();
      return;
    }

    const val = parseInt(inputValue);
    if (isNaN(val) || isBusy) return;
    setIsBusy(true);
    setInputValue('');
    setTargetFound(null);

    if (actionType === 'insert') await performInsert(val);
    if (actionType === 'search') await performSearch(val);

    setIsBusy(false);
    setHighlighted(null);
  };

  const performSearch = async (val) => {
    addLog(`SEARCH_MODE: ${val}`);
    let curr = tree;
    while (curr) {
      setHighlighted(curr.val);
      await new Promise(r => setTimeout(r, 600));
      if (val === curr.val) {
        setTargetFound(curr.val);
        addLog("MATCH_LOCATED");
        return;
      }
      curr = val < curr.val ? curr.left : curr.right;
    }
    addLog("NODE_NOT_IN_MEMORY");
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
          Bineary<span className="font-black text-[25px]  text-[#f0e7e7]">_Tree</span>
        </h1>
      </div>

      <p className="max-w-md text-zinc-400 text-sm leading-relaxed border-l-2 border-zinc-800 pl-4">
        Discrete hierarchical ordering where left - root - right . This recursive property ensures every node maintains a sorted path, enabling efficient searching and seamless dynamic updates.
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

         

      <div className="control-dock" style={{marginTop:"50px"}}>
        <input className="input-bw" type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="00" />
        <button className="btn-bw btn-main focus:outline-none" onClick={() => handleAction('insert')} disabled={isBusy}><FaPlus /> Insert</button>
        <button className="btn-bw btn-outline focus:outline-none" onClick={() => handleAction('search')} disabled={isBusy}><FaSearch /> Search</button>
        <button className="btn-bw btn-outline focus:outline-none" onClick={() => handleAction('random')} disabled={isBusy}><FaRandom /> Random</button>
        <button className="btn-bw btn-outline focus:outline-none" style={{marginLeft: 'auto'}} onClick={() => {setTree(null); setFlatNodes([]); addLog("MEMORY_PURGED");}}><FaTrash /> Wipe</button>
      </div>

      <div className="canvas-panel">
        <div className="terminal-box">
          <div style={{color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', marginBottom: '10px'}}>KERNEL_LOG</div>
          {logs.map((l, i) => <div key={i} className={`term-line ${i === 0 ? 'term-high' : ''}`}>{`> ${l}`}</div>)}
        </div>

        <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
          {flatNodes.map(n => (
            <React.Fragment key={`line-${n.val}`}>
              {n.left && <motion.line x1={n.x} y1={n.y} x2={n.left.x} y2={n.left.y} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />}
              {n.right && <motion.line x1={n.x} y1={n.y} x2={n.right.x} y2={n.right.y} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />}
            </React.Fragment>
          ))}
        </svg>

        <AnimatePresence>
          {flatNodes.map(n => (
            <motion.div
              key={n.val}
              initial={{ scale: 0 }}
              animate={{ scale: 1, left: n.x - 23, top: n.y - 23 }}
              className={`node-unit ${highlighted === n.val ? 'node-active' : ''} ${targetFound === n.val ? 'node-target' : ''}`}
            >
              {n.val}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* <BSTDocumentation/> */}
      <div style={{marginTop:'20px', padding:'20px', borderTop:'1px solid #222', color:'#444', fontSize:'0.8rem', textAlign:'center'}}>
          <BSTExplainner/>
      </div>
    </div>
  );
}