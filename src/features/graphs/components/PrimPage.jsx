import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLink, FaRandom, FaBolt, FaTree, FaProjectDiagram, FaDatabase, FaMicrochip, FaCode, FaNetworkWired, FaTools, FaSearch 
} from 'react-icons/fa';
import Header from '../../../components/Header';

const PrimIndustrialTerminal = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mstEdges, setMstEdges] = useState([]);
  const [visited, setVisited] = useState(new Set());
  const [activeNode, setActiveNode] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [density, setDensity] = useState(2);
  
  // New State for Live Telemetry
  const [telemetry, setTelemetry] = useState({ minWeight: 0, currentEdge: "NULL", status: "IDLE" });
  const [logs, setLogs] = useState(["CORE_STABLE", "V_3.0_LIVE_TELEMETRY"]);

  const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 6));

  const generateAdvancedMesh = () => {
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
      const neighbors = [...newNodes]
        .filter(n => n.id !== i)
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
    setVisited(new Set());
    setTotalCost(0);
    setTelemetry({ minWeight: 0, currentEdge: "NULL", status: "READY" });
    addLog(`GRID_SYNC: DENSITY_${density}`);
  };

  const runPrim = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setMstEdges([]);
    setTotalCost(0);
    setTelemetry(prev => ({ ...prev, status: "SCANNING" }));
    
    let v = new Set([0]);
    let mst = [];
    let currentCost = 0;
    setVisited(new Set(v));

    while (v.size < nodes.length) {
      let minEdge = null;
      let minWeight = Infinity;

      for (let edge of edges) {
        const fromV = v.has(edge.from);
        const toV = v.has(edge.to);
        if (fromV !== toV && edge.weight < minWeight) {
          minWeight = edge.weight;
          minEdge = edge;
          // Update telemetry during scan
          setTelemetry(t => ({ ...t, minWeight: edge.weight, currentEdge: `${edge.from} ↔ ${edge.to}` }));
        }
      }

      if (minEdge) {
        const nextNode = v.has(minEdge.from) ? minEdge.to : minEdge.from;
        setActiveNode(nextNode);
        await new Promise(r => setTimeout(r, 800 / speed));

        v.add(nextNode);
        mst.push(minEdge);
        currentCost += minEdge.weight;

        setVisited(new Set(v));
        setMstEdges([...mst]);
        setTotalCost(currentCost);
        addLog(`ATTACH: NODE_0${nextNode} (W: ${minEdge.weight})`);
      } else break;
    }
    setActiveNode(null);
    setIsProcessing(false);
    setTelemetry({ minWeight: 0, currentEdge: "COMPLETE", status: "OPTIMIZED" });
    addLog("NETWORK_OPTIMIZED");
  };

  useEffect(() => { generateAdvancedMesh(); }, [density]);

  return (
    <><div className="flex flex-col md:flex-row justify-between items-center m-[40px] border-b border-white/10 pb-10">
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
        Prim's Algorithm . <br />Minimum Spanning Tree construction by growing a tree from a starting vertex based on edge weights.
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
        .terminal-container { background: #000; color: #fff; min-height: 100vh; font-family: 'Inter', sans-serif; padding-bottom: 6rem; }
        .content-wrap { padding: 2rem 2.5rem; max-width: 1800px; margin: 0 auto; }
        
        .glass-header {
          background: rgba(15, 15, 15, 0.95); border: 1px solid #222;
          border-radius: 14px; padding: 1.2rem; margin-bottom: 2rem;
          display: flex; align-items: center; justify-content: space-between;
          backdrop-filter: blur(12px);
        }

        .viz-surface {
          height: 520px; background: #040404; border-radius: 20px;
          border: 1px solid #1a1a1a; position: relative; overflow: hidden;
        }

        .node-ring {
          width: 44px; height: 44px; border: 2px solid #333;
          background: #000; border-radius: 50%; position: absolute;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 0.8rem; z-index: 10; transition: 0.4s;
        }

        .edge-path { position: absolute; height: 1.5px; background: #1a1a1a; transform-origin: left center; z-index: 1; }
        .edge-mst { background: #fff !important; height: 3px !important; box-shadow: 0 0 15px rgba(255,255,255,0.4); z-index: 2; }
        
        .weight-pill {
          position: absolute; background: rgba(0, 0, 0, 0.8); color: #fff; font-size: 0.6rem;
          padding: 2px 8px; border-radius: 4px; border: 1px solid #333;
          transform: translate(-50%, -50%); z-index: 5; font-weight: 800;
        }

        /* Stats & Telemetry Styles */
        .stats-monitor {
          position: absolute; top: 20px; right: 20px; width: 180px;
          background: rgba(10, 10, 10, 0.9); border: 1px solid #222;
          padding: 15px; border-radius: 10px; backdrop-filter: blur(10px); z-index: 40;
        }

        .telemetry-bar {
          position: absolute; bottom: 0; left: 0; right: 0; height: 45px;
          background: #0a0a0a; border-top: 1px solid #222;
          display: flex; align-items: center; padding: 0 25px; gap: 40px;
          font-family: monospace; z-index: 40;
        }

        .tel-item { display: flex; gap: 10px; align-items: center; font-size: 0.65rem; color: #555; }
        .tel-val { color: #fff; font-weight: 900; letter-spacing: 1px; }

        .btn-industrial { background: #fff; color: #000; border: none; padding: 10px 22px; border-radius: 6px; font-weight: 900; font-size: 0.7rem; cursor: pointer; transition: 0.2s; }
        .btn-ghost { background: transparent; color: #fff; border: 1px solid #333; padding: 10px 18px; border-radius: 6px; font-weight: 900; font-size: 0.65rem; cursor: pointer; }
        
        .doc-card { background: #080808; border: 1px solid #111; padding: 2rem; border-radius: 12px; height: 100%; }
        .complexity-tag { background: #111; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 0.7rem; border: 1px solid #222; font-family: monospace; }
      `}</style>

      <Header></Header>
            

      <div className="content-wrap" style={{ marginTop: "50px" }}>
        <div className="glass-header">
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-industrial" onClick={runPrim} disabled={isProcessing}>
              <FaMicrochip style={{ marginRight: '8px' }} /> COMPUTE_MST
            </button>
            <button className="btn-ghost" onClick={generateAdvancedMesh}>
              <FaRandom style={{ marginRight: '8px' }} /> REGEN_MESH
            </button>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', borderLeft: '1px solid #222', paddingLeft: '20px' }}>
            <span style={{ fontSize: '0.6rem', color: '#555', fontWeight: 900 }}>DENSITY</span>
            <input type="range" min="1" max="4" value={density} onChange={(e) => setDensity(parseInt(e.target.value))} style={{ accentColor: '#fff', width: '80px' }} />
          </div>
          
          <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '1px' }}>ACCUMULATED_WEIGHT</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>{totalCost}</div>
            </div>
          </div>
        </div>

        <div className="viz-surface">
          <div className="stats-monitor">
            <div style={{ color: '#fff', fontSize: '0.6rem', borderBottom: '1px solid #222', paddingBottom: '8px', marginBottom: '10px' }}>VISITED_ACTIVE_NODES</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {Array.from(visited).map(v => (
                <span key={v} style={{ background: '#fff', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 900 }}>0{v}</span>
              ))}
            </div>
          </div>

          {/* NEW TELEMETRY BAR */}
          <div className="telemetry-bar">
            <div className="tel-item"><FaSearch /> ENGINE_STATUS: <span className="tel-val" style={{color: isProcessing ? '#fff' : '#444'}}>{telemetry.status}</span></div>
            <div className="tel-item"><FaBolt /> MIN_WEIGHT_DETECTED: <span className="tel-val">{telemetry.minWeight}</span></div>
            <div className="tel-item"><FaLink /> ACTIVE_CANDIDATE: <span className="tel-val">{telemetry.currentEdge}</span></div>
          </div>

          {edges.map((edge, i) => {
            const from = nodes.find(n => n.id === edge.from);
            const to = nodes.find(n => n.id === edge.to);
            if (!from || !to) return null;
            const dx = to.x - from.x, dy = to.y - from.y;
            const dist = Math.sqrt(dx * dx + dy * dy), angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const isMST = mstEdges.some(e => (e.from === edge.from && e.to === edge.to));

            return (
              <React.Fragment key={i}>
                <div className={`edge-path ${isMST ? 'edge-mst' : ''}`} style={{
                  width: `${dist}px`, left: `${from.x + 22}px`, top: `${from.y + 22}px`, transform: `rotate(${angle}deg)`
                }} />
                <div className="weight-pill" style={{ left: (from.x + to.x) / 2 + 22, top: (from.y + to.y) / 2 + 22 }}>{edge.weight}</div>
              </React.Fragment>
            );
          })}

          {nodes.map(node => (
            <motion.div
              key={node.id} className="node-ring"
              style={{ 
                left: node.x, top: node.y,
                background: activeNode === node.id ? '#fff' : '#000',
                color: activeNode === node.id ? '#000' : (visited.has(node.id) ? '#fff' : '#444'),
                borderColor: visited.has(node.id) ? '#fff' : '#1a1a1a'
              }}
              animate={{ scale: activeNode === node.id ? 1.2 : 1 }}
            >{node.id}</motion.div>
          ))}
        </div>

        <motion.section style={{ marginTop: '5rem' }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{ borderLeft: '4px solid #fff', paddingLeft: '1.5rem', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900 }}>INDUSTRIAL_MANUAL: PRIM'S PROTOCOL</h2>
            <p style={{ color: '#555', fontSize: '0.9rem' }}>Comprehensive breakdown of Greedy Minimum Spanning Tree logic.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <div className="doc-card">
              <FaCode style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.2rem' }} />
              <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.8rem' }}>ALGORITHM_LOGIC</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.8' }}>
                The engine utilizes a <b>Greedy Strategy</b>. It maintains a set of explored nodes and, in every iteration, evaluates every incident edge to unvisited vertices, selecting the absolute minimum weight available to ensure global optimization.
              </p>
            </div>

            <div className="doc-card">
              <FaNetworkWired style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.2rem' }} />
              <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.8rem' }}>COMPLEXITY_ANALYSIS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Time (Adj Matrix)</span>
                  <span className="complexity-tag">O(V²)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Time (Min-Heap)</span>
                  <span className="complexity-tag">O(E log V)</span>
                </div>
              </div>
            </div>

            <div className="doc-card">
              <FaTools style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.2rem' }} />
              <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.8rem' }}>ADVANCED_USE_CASES</h3>
              <ul style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.8', paddingLeft: '1.2rem' }}>
                <li><b>Network Design:</b> Laying cable/pipe systems with minimal material.</li>
                <li><b>Approximation:</b> Provides a 2-approximation for the Traveling Salesperson Problem.</li>
                <li><b>Clustering:</b> Fundamental in MST-based data grouping.</li>
              </ul>
            </div>
          </div>
        </motion.section>
      </div>
    </div></>
  );
};

export default PrimIndustrialTerminal;