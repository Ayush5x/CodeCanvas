import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BFSDocPage from './BFSExplanation';
import { 
  FaPlay, FaUndo, FaRandom, FaSearch, 
  FaPlus, FaMinus, FaChevronDown, FaCircle, FaDatabase 
} from 'react-icons/fa';
import Header from '../../../components/Header';

const BFSIndustrialTerminal = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [visited, setVisited] = useState(new Set());
  const [activeNode, setActiveNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [foundNode, setFoundNode] = useState(null);
  const [startNodeId, setStartNodeId] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  const generateGraph = () => {
    const count = 6;
    const newNodes = [];
    const minDistance = 120;

    for (let i = 0; i < count; i++) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const x = 100 + Math.random() * 600;
        const y = 60 + Math.random() * 280;
        const collision = newNodes.some(n => 
          Math.sqrt(Math.pow(n.x - x, 2) + Math.pow(n.y - y, 2)) < minDistance
        );
        if (!collision) {
          newNodes.push({ id: i, x, y });
          placed = true;
        }
        attempts++;
      }
    }
    
    const newEdges = [];
    for (let i = 1; i < newNodes.length; i++) {
      newEdges.push({ from: Math.floor(Math.random() * i), to: i });
    }
    setNodes(newNodes);
    setEdges(newEdges);
    resetSystem();
  };

  const executeSearch = () => {
    const id = parseInt(searchTerm);
    setFoundNode(!isNaN(id) && nodes.some(n => n.id === id) ? id : null);
  };

  const runBFS = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setVisited(new Set());
    
    let queue = [startNodeId]; 
    let v = new Set([startNodeId]);
    setVisited(new Set(v));

    while (queue.length > 0) {
      let curr = queue.shift();
      setActiveNode(curr);
      await new Promise(r => setTimeout(r, 800 / speed));

      const neighbors = edges
        .filter(e => e.from === curr || e.to === curr)
        .map(e => (e.from === curr ? e.to : e.from));

      for (let n of neighbors) {
        if (!v.has(n)) {
          v.add(n);
          queue.push(n);
          setVisited(new Set(v));
          await new Promise(r => setTimeout(r, 450 / speed));
        }
      }
    }
    setActiveNode(null);
    setIsProcessing(false);
  };

  const resetSystem = () => {
    setVisited(new Set());
    setActiveNode(null);
    setIsProcessing(false);
    setFoundNode(null);
    setSearchTerm("");
  };

  useEffect(() => { generateGraph(); }, []);

  return (
    <>
    
                   <div className="flex flex-col md:flex-row justify-between items-center m-[40px] border-b border-white/10 pb-10">
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
          BFS<span className="font-black text-[25px]  text-[#f0e7e7]"></span>
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
        Ds .
      </h1>
    </div>
  </div>
</div>
    <div className="terminal-container">
      <style>{`
        .terminal-container {
          background: #000; color: #fff; min-height: 100vh;
          padding: 0; font-family: 'Inter', sans-serif;
        }

        .top-nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1rem 2.5rem; border-bottom: 1px solid #1a1a1a;
          background: rgba(5, 5, 5, 0.8); backdrop-filter: blur(10px);
        }

        .nav-logo { font-weight: 900; font-size: 1.2rem; letter-spacing: 4px; }

        .status-pill {
          display: flex; align-items: center; gap: 8px; font-size: 0.65rem;
          font-weight: 800; color: #666; text-transform: uppercase;
        }

        .content-wrap { padding: 2rem 2.5rem; }

        .glass-header {
          background: rgba(20, 20, 20, 0.95); border: 1px solid #333;
          border-radius: 14px; padding: 1rem; margin-bottom: 2rem;
          display: flex; align-items: center; justify-content: space-between;
        }

        .ui-group { display: flex; gap: 10px; align-items: center; }

        .node-dropdown {
          background: #111; border: 1px solid #444; border-radius: 6px;
          padding: 6px 12px; display: flex; align-items: center; gap: 8px;
        }

        .node-dropdown select {
          background: transparent; border: none; color: #fff;
          font-size: 0.7rem; font-weight: 900; outline: none;
        }

        .search-module {
          display: flex; background: #111; border: 1px solid #444;
          border-radius: 6px; overflow: hidden;
        }

        .search-module input {
          background: transparent; border: none; color: #fff;
          padding: 6px 10px; font-size: 0.7rem; outline: none; width: 60px;
        }

        .search-go {
          background: #333; color: #fff; border: none;
          border-left: 1px solid #444; padding: 0 10px; cursor: pointer;
        }

        .btn-noir-sm {
          background: #fff; color: #000; border: none;
          padding: 8px 14px; border-radius: 6px;
          font-weight: 900; font-size: 0.65rem; cursor: pointer;
        }

        .btn-ghost-sm {
          background: transparent; color: #fff; border: 1px solid #444;
          padding: 8px 12px; border-radius: 6px;
          font-weight: 900; font-size: 0.65rem; cursor: pointer;
        }

        .viz-surface {
          height: 460px; background: #050505; border-radius: 20px;
          border: 2px solid #1a1a1a; position: relative; overflow: hidden;
          margin-bottom: 1.5rem;
        }

        /* Thicker Elements */
        .node-ring {
          width: 44px; height: 44px; border: 4px solid #333;
          background: #000; border-radius: 50%; position: absolute;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 0.85rem; z-index: 10;
        }

        .edge-path {
          position: absolute; height: 3px; background: #222;
          transform-origin: left center; z-index: 1;
        }

        .edge-flow {
          height: 4px; background: linear-gradient(90deg, #222 0%, #fff 50%, #222 100%);
          background-size: 200% 100%; animation: flow-line 1.5s linear infinite;
        }

        @keyframes flow-line { to { background-position: -200% 0; } }

       



        .search-pulse {
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.6);
          animation: pulse-ring 1s infinite; border-color: #fff;
        }
        @keyframes pulse-ring { to { box-shadow: 0 0 0 18px rgba(255, 255, 255, 0); } }
      `}</style>

    <Header></Header>
          
                  
      <div className="content-wrap" style={{marginTop:"50px"}}>
        <div className="glass-header">BFS
          <div className="ui-group">
            <button className="btn-noir-sm" onClick={runBFS} disabled={isProcessing}>
              <FaPlay size={8} style={{marginRight: '6px'}}/> START_BFS
            </button>
            
            <div className="node-dropdown">
              <span style={{fontSize: '0.6rem', color: '#666', fontWeight: 900}}>INIT:</span>
              <select value={startNodeId} onChange={(e) => setStartNodeId(parseInt(e.target.value))}>
                {nodes.map(n => <option key={n.id} value={n.id}>NODE_{n.id}</option>)}
              </select>
              <FaChevronDown size={8} style={{color: '#666'}}/>
            </div>
          </div>

          <div className="ui-group">
            <div className="search-module">
              <input placeholder="ID" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button className="search-go" onClick={executeSearch}><FaSearch size={10} /></button>
            </div>
            <button className="btn-ghost-sm" onClick={generateGraph}>SCRAMBLE</button>
            <button className="btn-ghost-sm" onClick={resetSystem}>FLUSH</button>
          </div>

          <div className="ui-group">
            <span style={{fontSize: '0.65rem', color: '#666', fontWeight: 900}}>FREQ_{speed}X</span>
            <button className="btn-ghost-sm" style={{padding: '5px'}} onClick={() => setSpeed(s => Math.max(0.5, s-0.5))}><FaMinus size={8}/></button>
            <button className="btn-ghost-sm" style={{padding: '5px'}} onClick={() => setSpeed(s => Math.min(3, s+0.5))}><FaPlus size={8}/></button>
          </div>
        </div>

        <div className="viz-surface">
          {edges.map((edge, i) => {
            const from = nodes.find(n => n.id === edge.from);
            const to = nodes.find(n => n.id === edge.to);
            if (!from || !to) return null;
            const dx = to.x - from.x, dy = to.y - from.y;
            const dist = Math.sqrt(dx*dx + dy*dy), angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const isVisitedEdge = visited.has(from.id) && visited.has(to.id);
            return (
              <div key={i} className={`edge-path ${isVisitedEdge ? 'edge-flow' : ''}`} style={{
                width: `${dist}px`, left: `${from.x + 22}px`, top: `${from.y + 22}px`,
                transform: `rotate(${angle}deg)`
              }} />
            );
          })}

          {nodes.map(node => (
            <motion.div
              key={node.id}
              className={`node-ring ${foundNode === node.id ? 'search-pulse' : ''}`}
              style={{ 
                left: node.x, top: node.y,
                background: activeNode === node.id ? '#fff' : '#000',
                color: activeNode === node.id ? '#000' : '#fff',
                borderColor: visited.has(node.id) ? '#fff' : (foundNode === node.id ? '#fff' : '#333')
              }}
              animate={{ scale: activeNode === node.id ? 1.15 : 1 }}
            >
              {node.id}
            </motion.div>
          ))}
        </div>

        <div>
         <BFSDocPage/>
         
          
        </div>
      </div>
    </div></>
  );
};

export default BFSIndustrialTerminal;