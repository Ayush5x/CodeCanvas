import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from '../../../components/Header';
import { FaArrowRight, FaTrash, FaPlus, FaMicrochip, FaCode, FaMemory, FaTerminal, FaLayerGroup, FaSyncAlt } from 'react-icons/fa';

// --- Global Configuration (Hex Addresses) ---
const MEMORY_POOL_SIZE = 12;
const MEMORY_ADDRESSES = Array(MEMORY_POOL_SIZE).fill().map((_, i) => 
  `0x${(i * 128).toString(16).toUpperCase().padStart(4, '0')}`
);

const CircularLinkedListOS = () => {
  const [nodes, setNodes] = useState([]);
  const [memoryPool, setMemoryPool] = useState(() => 
    Array(MEMORY_POOL_SIZE).fill().map((_, index) => ({
      address: MEMORY_ADDRESSES[index],
      inUse: false,
      index
    }))
  );
  
  const [inputValue, setInputValue] = useState('');
  const [positionInput, setPositionInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeLogicLine, setActiveLogicLine] = useState(-1);
  const [statusMsg, setStatusMsg] = useState('SYSTEM_READY');
  const [animationSpeed, setAnimationSpeed] = useState(600);

  const currentLogic = useMemo(() => ([
    "1. Temp *newNode = allocate(data)",
    "2. newNode->next = head",
    "3. TRAVERSE to Tail (last.next == head)",
    "4. Tail->next = newNode",
    "5. SYNC_CIRCULAR_POINTER_MAP()"
  ]), []);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const triggerError = (msg) => { setError(msg); setTimeout(() => setError(''), 4000); };

  const allocateMemory = useCallback((data) => {
    const availableIndex = memoryPool.findIndex(slot => !slot.inUse);
    if (availableIndex === -1) return null;
    setMemoryPool(prev => {
      const next = [...prev];
      next[availableIndex].inUse = true;
      return next;
    });
    return { data, address: MEMORY_ADDRESSES[availableIndex], memoryIndex: availableIndex, next: null, isNew: true };
  }, [memoryPool]);

  const freeMemory = useCallback((index) => {
    setMemoryPool(prev => {
      const next = [...prev];
      if (next[index]) next[index].inUse = false;
      return next;
    });
  }, []);

  const operation = async (type, mode = null) => {
    if (type === 'insert' && !inputValue) return triggerError("ERR_INVALID_DATA");
    setIsLoading(true);
    setStatusMsg(`EXEC.CIRCULAR_${type.toUpperCase()}`);
    setActiveLogicLine(0);
    await sleep(animationSpeed);

    let updatedNodes = [...nodes];
    let targetNode = null;

    if (type === 'insert') {
      targetNode = allocateMemory(inputValue);
      if (!targetNode) { triggerError("MEMORY_FULL"); setIsLoading(false); return; }
      setActiveLogicLine(1);
      await sleep(animationSpeed);

      if (mode === 'start') {
        targetNode.next = nodes.length > 0 ? nodes[0].memoryIndex : targetNode.memoryIndex;
        updatedNodes = [targetNode, ...nodes];
        if (updatedNodes.length > 1) {
            updatedNodes[updatedNodes.length - 1].next = targetNode.memoryIndex;
        }
      } else if (mode === 'end') {
        targetNode.next = nodes.length > 0 ? nodes[0].memoryIndex : targetNode.memoryIndex;
        if (updatedNodes.length > 0) updatedNodes[updatedNodes.length - 1].next = targetNode.memoryIndex;
        updatedNodes.push(targetNode);
      } else {
        const index = isNaN(parseInt(positionInput)) ? 0 : Math.min(parseInt(positionInput), nodes.length);
        if (index === 0) {
            targetNode.next = nodes.length > 0 ? nodes[0].memoryIndex : targetNode.memoryIndex;
            updatedNodes = [targetNode, ...nodes];
            if (updatedNodes.length > 1) updatedNodes[updatedNodes.length - 1].next = targetNode.memoryIndex;
        } else {
            targetNode.next = nodes[index] ? nodes[index].memoryIndex : updatedNodes[0].memoryIndex;
            updatedNodes[index-1].next = targetNode.memoryIndex;
            updatedNodes.splice(index, 0, targetNode);
        }
      }
      setActiveLogicLine(3);
    } else {
      if (nodes.length === 0) { triggerError("UNDERFLOW"); setIsLoading(false); return; }
      const index = mode === 'start' ? 0 : mode === 'end' ? nodes.length - 1 : parseInt(positionInput);
      if (isNaN(index) || index < 0 || index >= nodes.length) { triggerError("ERR_BOUNDS"); setIsLoading(false); return; }
      
      targetNode = updatedNodes[index];
      if (updatedNodes.length > 1) {
        const prevIdx = index === 0 ? updatedNodes.length - 1 : index - 1;
        const nextIdx = index === updatedNodes.length - 1 ? 0 : index + 1;
        updatedNodes[prevIdx].next = updatedNodes[nextIdx].memoryIndex;
      }
      updatedNodes.splice(index, 1);
      await sleep(animationSpeed);
      freeMemory(targetNode.memoryIndex);
    }

    setNodes(updatedNodes);
    setActiveLogicLine(4);
    await sleep(animationSpeed);
    setInputValue(''); setPositionInput('');
    setActiveLogicLine(-1); setIsLoading(false); setStatusMsg("READY");
  };

  return (
    <div className="os-container">
      <style>{`
        :root {
          --bg: #030303;
          --glass: rgba(15, 15, 15, 0.9);
          --glass-border: rgba(255, 255, 255, 0.08);
          --accent: #ffffff;
          --cyan: #00ffcc;
          --text-bright: #f0f0f0;
        }

        /* Fixed Navbar Fix */
        .navbar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 9999;
          background: rgba(3, 3, 3, 0.8);
          backdrop-filter: blur(10px);
        }

        .os-container { 
          min-height: 100vh; 
          background: var(--bg); 
          color: var(--text-bright); 
          font-family: 'Space Mono', monospace; 
          /* Top padding (100px) creates space for the fixed navbar */
          padding: 40px 1.5rem 1.5rem 1.5rem; 
          display: flex; 
          flex-direction: column; 
          gap: 20px; 
          box-sizing: border-box; 
          background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.02) 1px, transparent 0);
          background-size: 40px 40px;
        }

        /* Prevent blue click highlight */
        .os-container a, button, .node-box {
          outline: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        
        .main-layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; flex: 1; align-items: start; }
        @media (min-width: 1200px) { .main-layout { grid-template-columns: 380px 1fr 340px; } }

        .panel { 
            background: var(--glass); 
            backdrop-filter: blur(50px); 
            border: 1px solid var(--glass-border); 
            border-radius: 24px; 
            padding: 25px; 
            display: flex; 
            flex-direction: column; 
            height: auto; 
            min-height: 100%; 
            box-shadow: 0 25px 50px rgba(0,0,0,0.5); 
            z-index: 1;
        }

        .brand { font-size: 1.5rem; font-weight: 700; margin-bottom: 25px; border-left: 5px solid var(--cyan); padding-left: 15px; }
        .label { font-size: 10px; color: var(--accent); font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; opacity: 0.8; }
        
        .input-row { display: flex; gap: 12px; margin-bottom: 20px; }
        input { flex: 1; background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border); padding: 16px; color: white; border-radius: 12px; outline: none; font-size: 14px; width: 0; min-width: 80px; }
        input:focus { border-color: var(--cyan); background: rgba(0, 255, 204, 0.05); }

        .btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        button { background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); color: var(--text-bright); padding: 14px; border-radius: 12px; cursor: pointer; font-size: 11px; font-weight: 700; transition: all 0.3s; white-space: nowrap; }
        button:hover:not(:disabled) { background: var(--accent); color: black; box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
        
        .canvas { display: flex; align-items: center; overflow-x: auto; overflow-y: hidden; padding: 60px 40px; max-height: 450px; background: rgba(0,0,0,0.4); border-radius: 20px; border: 1px solid var(--glass-border); position: relative; scroll-behavior: smooth; }
        .node-box { width: 105px; background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 40%, rgba(0,0,0,0.2) 100%); backdrop-filter: blur(15px); border: 1px solid var(--glass-border); border-top: 1px solid rgba(255,255,255,0.3); border-radius: 12px; padding: 12px; flex-shrink: 0; text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.5); }
        .data-val { font-size: 1.1rem; font-weight: 800; margin: 6px 0; color: white; text-shadow: 0 0 10px rgba(255,255,255,0.3); }
        .next-ptr { font-size: 7px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; color: var(--cyan); font-weight: bold; }

        .loop-return { position: absolute; bottom: 20px; left: 50px; right: 50px; height: 35px; border: 2px dashed rgba(0,255,204,0.3); border-top: none; border-radius: 0 0 40px 40px; display: flex; justify-content: center; align-items: flex-end; padding-bottom: 5px; font-size: 9px; color: var(--cyan); letter-spacing: 2px; pointer-events: none; }

        .logic-line { font-size: 0.85rem; padding: 12px; border-radius: 10px; color: #777; transition: 0.3s; margin-bottom: 6px; }
        .logic-line.active { background: white; color: black; font-weight: bold; }

        .ram-footer { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; }
        .ram-slot { padding: 15px; border-radius: 14px; border: 1px solid var(--glass-border); font-size: 11px; text-align: center; background: rgba(255,255,255,0.02); font-weight: bold; }
        .ram-slot.active { background: linear-gradient(135deg, var(--cyan), #0088ff); border-color: transparent; color: black; box-shadow: 0 0 20px rgba(0,255,204,0.4); }

        .speed-bar { width: 100%; accent-color: white; height: 6px; margin-top: 15px; cursor: pointer; }
        .canvas::-webkit-scrollbar { height: 8px; }
        .canvas::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        @keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
      `}</style>

      
       <Header></Header>
      
             <div className="flex flex-col md:flex-row justify-between items-center w-full border-b border-white/10 pb-10">
  <div className="relative overflow-hidden">
    <h1 className="absolute -top-10 -left-5 text-[10rem] font-black text-white/[0.02] pointer-events-none select-none">
      SORT
    </h1>

    <div className="relative z-10 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-[#00ffcc] rounded-full animate-pulse" />
        <span className="text-xs font-mono tracking-[0.4em] text-zinc-500 uppercase">System Active</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <h1 className="text-7xl font-light tracking-tighter text-white">
          Circular<span className="font-black text-[25px]  text-[#00ffcc]">_List</span>
        </h1>
      </div>

      <p className="max-w-md text-zinc-400 text-sm leading-relaxed border-l-2 border-zinc-800 pl-4">
        An infinite loop structure where the tail connects back to the head. Backbone of round-robin algorithms.
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

      <div className="main-layout">
        <aside className="panel">
          <div className="brand">CIRCULAR<span>_LIST.OS</span></div>
          <span className="label">System Input</span>
          <div className="input-row">
            <input placeholder="Value" value={inputValue} onChange={e => setInputValue(e.target.value)} />
            <input placeholder="Idx" type="number" value={positionInput} onChange={e => setPositionInput(e.target.value)} />
          </div>
          <div className="btn-grid">
            <button onClick={() => operation('insert', 'start')}><FaPlus /> AT_HEAD</button>
            <button onClick={() => operation('insert', 'end')}><FaPlus /> AT_TAIL</button>
            <button style={{ gridColumn: 'span 2' }} onClick={() => operation('insert', 'pos')}><FaLayerGroup /> INSERT_AT_POSITION</button>
            <button onClick={() => operation('delete', 'start')}><FaTrash /> DEL_HEAD</button>
            <button onClick={() => operation('delete', 'end')}><FaTrash /> DEL_TAIL</button>
            <button style={{ gridColumn: 'span 2' }} onClick={() => operation('delete', 'pos')}><FaTrash /> DELETE_AT_POSITION</button>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '30px' }}>
            <span className="label">Execution Velocity: {animationSpeed}ms</span>
            <input type="range" className="speed-bar" min="100" max="1500" value={animationSpeed} onChange={e => setAnimationSpeed(parseInt(e.target.value))} />
          </div>
        </aside>

        <main className="panel canvas">
          {nodes.length === 0 ? <div style={{opacity: 0.2, margin: 'auto', letterSpacing: '5px'}}>SYSTEM_IDLE</div> : nodes.map((node, i) => (
            <div key={node.address} style={{display: 'flex', alignItems: 'center'}}>
              <div className="node-box">
                <div style={{fontSize: '7px', color: '#888', fontWeight: 'bold'}}>{node.address}</div>
                <div className="data-val">{node.data}</div>
                <div className="next-ptr">NEXT → {node.next !== null ? MEMORY_ADDRESSES[node.next] : 'HEAD'}</div>
              </div>
              {i < nodes.length - 1 && <FaArrowRight style={{margin: '0 20px', opacity: 0.4, fontSize: '24px'}} />}
            </div>
          ))}
          {nodes.length > 1 && (
            <div className="loop-return">
                <FaSyncAlt style={{marginRight: '8px', animation: 'spin 4s linear infinite'}}/> CIRCULAR_LINK_ACTIVE (TAIL ⟷ HEAD)
            </div>
          )}
        </main>

        <aside className="panel">
          <span className="label"><FaCode /> Runtime Logic</span>
          <div style={{flex: 1}}>
            {currentLogic.map((line, i) => (
              <div key={i} className={`logic-line ${activeLogicLine === i ? 'active' : ''}`}>{line}</div>
            ))}
          </div>
          <div style={{marginTop: '20px', fontSize: '11px', color: '#00ffcc', borderTop: '1px solid #222', paddingTop: '15px'}}>
            <FaTerminal /> STATUS: {statusMsg}
          </div>
        </aside>
      </div>

      <footer className="panel">
        <span className="label"><FaMemory /> Physical_RAM_Allocation (Circular_Map)</span>
        <div className="ram-footer">
          {memoryPool.map((slot, i) => (
            <div key={i} className={`ram-slot ${slot.inUse ? 'active' : ''}`}>
              {slot.address}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default CircularLinkedListOS;