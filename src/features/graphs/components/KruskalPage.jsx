import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLink, FaRandom, FaBolt, FaLayerGroup, FaProjectDiagram, FaDatabase, FaMicrochip, FaCode, FaSearch, FaExclamationTriangle, FaServer, FaCogs 
} from 'react-icons/fa';
import Header from '../../../components/Header';
const KruskalIndustrialTerminal = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mstEdges, setMstEdges] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [density, setDensity] = useState(2);
  const [telemetry, setTelemetry] = useState({ currentEdge: "NULL", status: "IDLE", clusters: 0 });
  const [logs, setLogs] = useState(["KRUSKAL_CORE_READY", "DSU_INITIALIZED"]);

  const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 8));

  // --- DSU (Disjoint Set Union) Logic ---
  const find = (parent, i) => {
    if (parent[i] === i) return i;
    return find(parent, parent[i]);
  };

  const union = (parent, rank, x, y) => {
    let rootX = find(parent, x);
    let rootY = find(parent, y);
    if (rootX !== rootY) {
      if (rank[rootX] < rank[rootY]) parent[rootX] = rootY;
      else if (rank[rootX] > rank[rootY]) parent[rootY] = rootX;
      else {
        parent[rootY] = rootX;
        rank[rootX]++;
      }
      return true;
    }
    return false;
  };

  const generateMesh = () => {
    const nodeCount = 7;
    const newNodes = [];
    const minDistance = 110;
    for (let i = 0; i < nodeCount; i++) {
      let placed = false;
      while (!placed) {
        const x = 80 + Math.random() * 600;
        const y = 60 + Math.random() * 320;
        if (!newNodes.some(n => Math.sqrt((n.x-x)**2 + (n.y-y)**2) < minDistance)) {
          newNodes.push({ id: i, x, y });
          placed = true;
        }
      }
    }

    const newEdges = [];
    newNodes.forEach((node, i) => {
      const neighbors = [...newNodes].filter(n => n.id !== i)
        .sort((a, b) => Math.sqrt((a.x-node.x)**2 + (a.y-node.y)**2) - Math.sqrt((b.x-node.x)**2 + (b.y-node.y)**2))
        .slice(0, density);
      neighbors.forEach(nb => {
        if (!newEdges.some(e => (e.from === nb.id && e.to === i) || (e.from === i && e.to === nb.id))) {
          newEdges.push({ from: i, to: nb.id, weight: Math.floor(Math.random() * 15) + 1 });
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
    setMstEdges([]);
    setTotalCost(0);
    setTelemetry({ currentEdge: "NULL", status: "READY", clusters: nodeCount });
    addLog("MESH_REGENERATED");
  };

  const runKruskal = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setMstEdges([]);
    setTotalCost(0);
    
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    addLog("PARSING_EDGES: WEIGHT_ASCENDING");

    const parent = nodes.map(n => n.id);
    const rank = nodes.map(() => 0);
    let mst = [];
    let cost = 0;

    for (let edge of sortedEdges) {
      setTelemetry({ currentEdge: `0${edge.from} <-> 0${edge.to}`, status: "COMPUTING", clusters: nodes.length - mst.length });
      await new Promise(r => setTimeout(r, 1000 / speed));

      if (union(parent, rank, edge.from, edge.to)) {
        mst.push(edge);
        cost += edge.weight;
        setMstEdges([...mst]);
        setTotalCost(cost);
        addLog(`SYNC_SUCCESS: ${edge.from}-${edge.to} [W:${edge.weight}]`);
      } else {
        addLog(`SYNC_HALTED: ${edge.from}-${edge.to} [CYCLE_DETECTED]`);
      }
      
      if (mst.length === nodes.length - 1) break;
    }

    setIsProcessing(false);
    setTelemetry(t => ({ ...t, status: "OPTIMIZED" }));
    addLog("OPTIMIZATION_COMPLETE");
  };

  useEffect(() => { generateMesh(); }, [density]);

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
          Graph<span className="font-black text-[25px]  text-[#f0e7e7]"></span>
        </h1>
      </div>

      <p className="max-w-md text-zinc-400 text-sm leading-relaxed border-l-2 border-zinc-800 pl-4">
        Kruskal's Algorithm . <br />Edge-based MST generation utilizing Union-Find structures. Efficient for sparse graph implementations.
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
        .terminal-container { background: #000; color: #fff; min-height: 100vh; font-family: 'Inter', sans-serif; padding-bottom: 6rem; overflow-x: hidden; }
        .content-wrap { padding: 2rem 2.5rem; max-width: 1800px; margin: 0 auto; }
        .glass-header { background: rgba(15, 15, 15, 0.95); border: 1px solid #222; border-radius: 14px; padding: 1.2rem; display: flex; align-items: center; justify-content: space-between; backdrop-filter: blur(12px); margin-bottom: 2rem; }
        .viz-surface {  height: 520px; background: #040404; border-radius: 20px; border: 1px solid #1a1a1a; position: relative; overflow: hidden; }
        .node-ring { width: 44px; height: 44px; border: 2px solid #333; background: #000; border-radius: 50%; position: absolute; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.8rem; z-index: 10; transition: 0.4s; }
        .edge-path { position: absolute; height: 1.5px; background: #151515; transform-origin: left center; z-index: 1; transition: 0.3s; }
        .edge-mst { background: #fff !important; height: 3px !important; box-shadow: 0 0 15px rgba(255,255,255,0.4); z-index: 2; }
        .weight-pill { position: absolute; background: rgba(0, 0, 0, 0.9); color: #fff; font-size: 0.6rem; padding: 2px 8px; border-radius: 4px; border: 1px solid #333; transform: translate(-50%, -50%); z-index: 5; font-weight: 800; border: 1px solid #222; }
        .telemetry-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 45px; background: #0a0a0a; border-top: 1px solid #222; display: flex; align-items: center; padding: 0 25px; gap: 40px; font-family: monospace; z-index: 40; }
        .tel-item { display: flex; gap: 10px; align-items: center; font-size: 0.65rem; color: #555; text-transform: uppercase; letter-spacing: 1px; }
        .tel-val { color: #fff; font-weight: 900; }
        .btn-industrial { background: #fff; color: #000; border: none; padding: 10px 22px; border-radius: 6px; font-weight: 900; font-size: 0.7rem; cursor: pointer; transition: 0.3s; }
        .btn-industrial:hover { background: #ccc; transform: translateY(-2px); }
        .doc-card { background: #080808; border: 1px solid #111; padding: 2.5rem; border-radius: 16px; transition: 0.4s; position: relative; overflow: hidden; }
        .doc-card:hover { border-color: #444; background: #0c0c0c; }
        .complexity-tag { background: #1a1a1a; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 0.7rem; border: 1px solid #333; font-family: monospace; }
      `}</style>

      <Header></Header>
            

      <motion.div 
        className="content-wrap" 
        style={{ marginTop: "50px" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass-header">
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-industrial" onClick={runKruskal} disabled={isProcessing}>
              <FaLayerGroup style={{ marginRight: '8px' }} /> COMPUTE_KRUSKAL
            </button>
            <button 
              className="btn-ghost" 
              onClick={generateMesh} 
              style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '10px 18px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer' }}
            >
              <FaRandom style={{ marginRight: '8px' }} /> REGEN_MESH
            </button>
          </div>

          <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '1px' }}>SYSTEM_TOTAL_COST</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>{totalCost}</div>
            </div>
          </div>
        </div>

        <div className="viz-surface">
          <div className="telemetry-bar">
            <div className="tel-item"><FaSearch /> ENGINE_STATE: <span className="tel-val">{telemetry.status}</span></div>
            <div className="tel-item"><FaLink /> BUFFER_SCAN: <span className="tel-val">{telemetry.currentEdge}</span></div>
            <div className="tel-item"><FaProjectDiagram /> DISJOINT_SETS: <span className="tel-val">{telemetry.clusters}</span></div>
          </div>

          {edges.map((edge, i) => {
            const from = nodes.find(n => n.id === edge.from);
            const to = nodes.find(n => n.id === edge.to);
            if (!from || !to) return null;
            const dist = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
            const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);
            const isMST = mstEdges.some(e => (e.from === edge.from && e.to === edge.to));

            return (
              <React.Fragment key={i}>
                <motion.div 
                  className={`edge-path ${isMST ? 'edge-mst' : ''}`} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ width: `${dist}px`, left: `${from.x + 22}px`, top: `${from.y + 22}px`, transform: `rotate(${angle}deg)` }} 
                />
                <div className="weight-pill" style={{ left: (from.x + to.x) / 2 + 22, top: (from.y + to.y) / 2 + 22 }}>
                  {edge.weight}
                </div>
              </React.Fragment>
            );
          })}

          {nodes.map(node => (
            <motion.div 
              key={node.id} 
              className="node-ring" 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ left: node.x, top: node.y }}
            >
              {node.id}
            </motion.div>
          ))}
        </div>

        {/* LOG SECTION */}
        <div style={{ marginTop: '1.5rem', background: '#080808', padding: '1rem', borderRadius: '10px', border: '1px solid #111' }}>
          <h4 style={{ fontSize: '0.6rem', color: '#444', marginBottom: '0.5rem', letterSpacing: '2px' }}>TERMINAL_OUTPUT</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {logs.slice(0, 4).map((log, i) => (
              <div key={i} style={{ fontSize: '0.65rem', color: '#666', fontFamily: 'monospace' }}>_ {log}</div>
            ))}
          </div>
        </div>

        {/* EXTENDED DOCUMENTATION SECTION */}
        <div style={{ marginTop: '5rem' }}>
          <motion.div 
            style={{ borderLeft: '4px solid #fff', paddingLeft: '1.5rem', marginBottom: '3rem' }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>KRUSKAL_PROTOCOL: SPECIFICATIONS</h2>
            <p style={{ color: '#555', fontSize: '0.9rem' }}>Detailed analysis of Edge-List Greedy Spanning logic.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <motion.div className="doc-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <FaCode style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem', letterSpacing: '1px' }}>01_ALGORITHM_CORE</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                Kruskal's is an edge-centric algorithm. It converts a connected graph into a Minimum Spanning Tree by treating every node as a distinct forest and merging them.
              </p>
              <ul style={{ fontSize: '0.8rem', color: '#888', paddingLeft: '1.2rem', lineHeight: '2' }}>
                <li>Global sorting of all edge weights.</li>
                <li>Selection of edges with minimal cost.</li>
                <li>Cycle prevention via Disjoint Set Union (DSU).</li>
              </ul>
            </motion.div>

            <motion.div className="doc-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <FaServer style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem', letterSpacing: '1px' }}>02_COMPLEXITY_STATS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Sorting Complexity</span>
                  <span className="complexity-tag">O(E log E)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Union-Find Operations</span>
                  <span className="complexity-tag">O(E α(V))</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Total Operational Cost</span>
                  <span className="complexity-tag">O(E log V)</span>
                </div>
              </div>
            </motion.div>

            <motion.div className="doc-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <FaCogs style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem', letterSpacing: '1px' }}>03_INDUSTRIAL_USE</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.8' }}>
                Kruskal’s is preferred for **sparse graphs** where the number of edges is relatively low compared to nodes.
              </p>
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid #1a1a1a', paddingTop: '1.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#444', marginBottom: '0.5rem' }}>APPLICATION_DOMAINS:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['LAN_SETUP', 'CIVIL_PIPING', 'CIRCUIT_DESIGN', 'OCEANIC_CABLES'].map(tag => (
                    <span key={tag} style={{ fontSize: '0.6rem', color: '#fff', border: '1px solid #222', padding: '2px 8px', borderRadius: '4px' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div></>
  );
};

export default KruskalIndustrialTerminal;