import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, FaRandom, FaSkullCrossbones, FaTerminal, 
  FaLevelDownAlt, FaPlus, FaMinus, FaSearch 
} from 'react-icons/fa';
import Header from '../../../components/Header';
const DFSRoundedTerminal = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [visited, setVisited] = useState(new Set());
  const [activeNode, setActiveNode] = useState(null);
  const [stack, setStack] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [searchTerm, setSearchTerm] = useState("");
  const [foundNode, setFoundNode] = useState(null);
  const [logs, setLogs] = useState(["DFS_ENGINE_INIT", "SYSTEM_READY"]);

  const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 5));

  const generateRandomGraph = () => {
    const count = 7;
    const newNodes = [];
    const minDistance = 110;

    for (let i = 0; i < count; i++) {
      let placed = false;
      while (!placed) {
        const x = 100 + Math.random() * 600;
        const y = 60 + Math.random() * 280;
        const collision = newNodes.some(n => 
          Math.sqrt(Math.pow(n.x - x, 2) + Math.pow(n.y - y, 2)) < minDistance
        );
        if (!collision) {
          newNodes.push({ id: i, x, y });
          placed = true;
        }
      }
    }

    const newEdges = [];
    for (let i = 1; i < newNodes.length; i++) {
      newEdges.push({ from: Math.floor(Math.random() * i), to: i });
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
    setVisited(new Set());
    setStack([]);
    setFoundNode(null);
    addLog("RANDOM_TOPOLOGY_GENERATED");
  };

  const handleSearch = () => {
    const id = parseInt(searchTerm);
    if (!isNaN(id) && nodes.some(n => n.id === id)) {
      setFoundNode(id);
      addLog(`NODE_LOCATED: ADDR_0${id}`);
      // Auto-clear highlight after 3s
      setTimeout(() => setFoundNode(null), 3000);
    } else {
      addLog("ERROR: ADDR_NOT_FOUND");
    }
  };

  const runDFS = async () => {
    if (isProcessing || nodes.length === 0) return;
    setIsProcessing(true);
    setVisited(new Set());
    setFoundNode(null);
    
    let localStack = [0]; 
    let v = new Set();

    while (localStack.length > 0) {
      let curr = localStack.pop();
      setStack([...localStack]);
      
      if (!v.has(curr)) {
        v.add(curr);
        setVisited(new Set(v));
        setActiveNode(curr);
        addLog(`PENETRATING_NODE_${curr}`);
        
        await new Promise(r => setTimeout(r, 900 / speed));

        const neighbors = edges
          .filter(e => e.from === curr || e.to === curr)
          .map(e => (e.from === curr ? e.to : e.from))
          .reverse();

        for (let n of neighbors) {
          if (!v.has(n)) {
            localStack.push(n);
            setStack([...localStack]);
            addLog(`STACK_PUSH: ${n}`);
          }
        }
      }
    }
    setActiveNode(null);
    setIsProcessing(false);
    addLog("TRAVERSAL_COMPLETE");
  };

  useEffect(() => { generateRandomGraph(); }, []);

  return (
    <> <div className="flex flex-col md:flex-row justify-between items-center m-[40px] border-b border-white/10 pb-10">
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
          DFS<span className="font-black text-[25px]  text-[#f0e7e7]"></span>
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
        .terminal-container { background: #000; color: #fff; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .content-wrap { padding: 2rem 2.5rem; }
        .glass-header {
          background: rgba(20, 20, 20, 0.95); border: 1px solid #333;
          border-radius: 14px; padding: 1rem; margin-bottom: 2rem;
          display: flex; align-items: center; justify-content: space-between;
          backdrop-filter: blur(10px);
        }
        .ui-group { display: flex; gap: 10px; align-items: center; }
        
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

        .viz-surface {
          height: 460px; background: #050505; border-radius: 20px;
          border: 2px solid #1a1a1a; position: relative; overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .node-ring {
          width: 44px; height: 44px; border: 4px solid #333;
          background: #000; border-radius: 50%; position: absolute;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 0.85rem; z-index: 10;
        }
        
        .search-pulse {
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.6);
          animation: pulse-ring 1s infinite; border-color: #fff !important;
        }
        @keyframes pulse-ring { to { box-shadow: 0 0 0 18px rgba(255, 255, 255, 0); } }

        .edge-path { position: absolute; height: 3px; background: #222; transform-origin: left center; z-index: 1; }
        .edge-flow {
          height: 4px; background: linear-gradient(90deg, #222 0%, #fff 50%, #222 100%);
          background-size: 200% 100%; animation: flow-line 1.5s linear infinite;
        }
        @keyframes flow-line { to { background-position: -200% 0; } }

        .stack-monitor {
          position: absolute; top: 20px; right: 20px; width: 140px;
          background: rgba(255, 255, 255, 0.03); border: 1px solid #222;
          padding: 15px; font-size: 0.65rem; z-index: 40; border-radius: 8px;
        }
        .btn-noir-sm { background: #fff; color: #000; border: none; padding: 8px 14px; border-radius: 6px; font-weight: 900; font-size: 0.65rem; cursor: pointer; }
        .btn-ghost-sm { background: transparent; color: #fff; border: 1px solid #444; padding: 8px 12px; border-radius: 6px; font-weight: 900; font-size: 0.65rem; cursor: pointer; }
        
        .doc-section { margin-top: 4rem; border-top: 1px solid #1a1a1a; padding-top: 2rem; }
        .doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .doc-card { background: #080808; border: 1px solid #1a1a1a; padding: 1.5rem; border-radius: 8px; }
        .doc-label { font-size: 0.6rem; color: #555; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 0.5rem; }
        .doc-text { font-size: 0.9rem; color: #999; line-height: 1.6; }
      `}</style>

     <Header></Header>
           
      <div className="content-wrap" style={{ marginTop: "50px" }}>
        <div className="glass-header">
          <div className="ui-group">
            <button className="btn-noir-sm" onClick={runDFS} disabled={isProcessing}>
              <FaLevelDownAlt style={{ marginRight: '6px' }} /> EXECUTE_DFS
            </button>
            <div className="search-module">
              <input 
                placeholder="NODE_ID" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="search-go" onClick={handleSearch}><FaSearch size={10} /></button>
            </div>
          </div>

          <div className="ui-group">
            <button className="btn-ghost-sm" onClick={generateRandomGraph}>SCRAMBLE</button>
            <button className="btn-ghost-sm" onClick={() => {setVisited(new Set()); setFoundNode(null); setStack([]);}}>FLUSH</button>
            <div className="ui-group" style={{ marginLeft: '10px' }}>
              <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: 900 }}>FREQ_{speed}X</span>
              <button className="btn-ghost-sm" style={{padding:'5px'}} onClick={() => setSpeed(s => Math.max(0.5, s-0.5))}><FaMinus size={8}/></button>
              <button className="btn-ghost-sm" style={{padding:'5px'}} onClick={() => setSpeed(s => Math.min(3, s+0.5))}><FaPlus size={8}/></button>
            </div>
          </div>
        </div>

        <div className="viz-surface">
          <div className="stack-monitor">
            <div style={{ color: '#fff', marginBottom: '10px', borderBottom: '1px solid #222', fontWeight: 800 }}>LIFO_STACK</div>
            <AnimatePresence>
              {stack.map((id, i) => (
                <motion.div key={`${id}-${i}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{color: '#666', marginBottom: '4px'}}>
                  {`> ADDR_0${id}`}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {edges.map((edge, i) => {
            const from = nodes.find(n => n.id === edge.from);
            const to = nodes.find(n => n.id === edge.to);
            if (!from || !to) return null;
            const dx = to.x - from.x, dy = to.y - from.y;
            const dist = Math.sqrt(dx * dx + dy * dy), angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const isActive = visited.has(from.id) && visited.has(to.id);

            return (
              <div key={i} className={`edge-path ${isActive ? 'edge-flow' : ''}`} style={{
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
                borderColor: visited.has(node.id) || foundNode === node.id ? '#fff' : '#333'
              }}
              animate={{ scale: activeNode === node.id ? 1.15 : 1 }}
            >
              {node.id}
            </motion.div>
          ))}
        </div>

        <section className="doc-section">
          <div className="doc-grid">
            <div className="doc-card">
              <div className="doc-label">Protocol_Logic</div>
              <h3 style={{ margin: '0.5rem 0' }}>Depth-First Traversal</h3>
              <p className="doc-text">
                DFS explores as far as possible along each branch before backtracking. 
                It utilizes a **Stack (LIFO)** data structure to track the next node to visit.
              </p>
            </div>
            <div className="doc-card">
              <div className="doc-label">Execution_Complexity</div>
              <h3 style={{ margin: '0.5rem 0' }}>Big O Metrics</h3>
              <p className="doc-text">
                **Time Complexity:** $O(V + E)$ — Every vertex and edge is evaluated once.<br/>
                **Space Complexity:** $O(V)$ — Worst case memory matches graph depth.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div></>
  );
};

export default DFSRoundedTerminal;