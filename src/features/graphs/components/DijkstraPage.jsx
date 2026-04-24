import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, FaRandom, FaRoute, FaSearch, 
  FaPlus, FaMinus, FaCheckCircle, FaBolt, FaInfoCircle, FaCodeBranch 
} from 'react-icons/fa';
import Header from '../../../components/Header';
const DijkstraIndustrialTerminal = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [visited, setVisited] = useState(new Set());
  const [activeNode, setActiveNode] = useState(null);
  const [distances, setDistances] = useState({});
  const [shortestPath, setShortestPath] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [logs, setLogs] = useState(["DIJKSTRA_READY", "AWAITING_SOURCE_INIT..."]);

  const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 5));

  const generateWeightedGraph = () => {
    const count = 6;
    const newNodes = [];
    const minDistance = 120;

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
      newEdges.push({ 
        from: Math.floor(Math.random() * i), 
        to: i, 
        weight: Math.floor(Math.random() * 9) + 1 
      });
    }
    newEdges.push({ from: 1, to: 4, weight: 3 });
    newEdges.push({ from: 0, to: 3, weight: 7 });
    
    setNodes(newNodes);
    setEdges(newEdges);
    setVisited(new Set());
    setDistances({});
    setShortestPath([]);
    addLog("NETWORK_TOPOLOGY_SYNCED");
  };

  const runDijkstra = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setVisited(new Set());
    setShortestPath([]);
    
    let dists = {};
    let parents = {}; 
    nodes.forEach(n => dists[n.id] = Infinity);
    dists[0] = 0;
    setDistances({...dists});
    
    let pq = [0];
    let v = new Set();

    addLog("COMPUTING_ALL_PATHS...");

    while (pq.length > 0) {
      pq.sort((a, b) => dists[a] - dists[b]);
      let curr = pq.shift();

      if (v.has(curr)) continue;
      v.add(curr);
      setVisited(new Set(v));
      setActiveNode(curr);

      await new Promise(r => setTimeout(r, 800 / speed));

      const adjEdges = edges.filter(e => e.from === curr || e.to === curr);
      for (let edge of adjEdges) {
        let neighbor = edge.from === curr ? edge.to : edge.from;
        let newDist = dists[curr] + edge.weight;

        if (newDist < dists[neighbor]) {
          dists[neighbor] = newDist;
          parents[neighbor] = curr;
          setDistances({...dists});
          pq.push(neighbor);
          addLog(`RELAXED: NODE_0${neighbor} @ ${newDist}`);
          await new Promise(r => setTimeout(r, 300 / speed));
        }
      }
    }

    let path = [];
    let crawl = 5; 
    path.push(crawl);
    while (parents[crawl] !== undefined) {
      path.push(parents[crawl]);
      crawl = parents[crawl];
    }
    setShortestPath(path.reverse());
    setActiveNode(null);
    setIsProcessing(false);
    addLog(`PATH_FOUND: ${path.join(' -> ')}`);
  };

  useEffect(() => { generateWeightedGraph(); }, []);

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
        Dijkstra Algorithm . <br />Greedy weight-based optimization finding the most efficient path between network nodes in weighted graphs.
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
        .terminal-container { background: #000; color: #fff; min-height: 100vh; font-family: 'Inter', sans-serif; padding-bottom: 5rem; }
        .content-wrap { padding: 2rem 2.5rem; max-width: 1800px; margin: 0 auto; }
        
        .glass-header {
          background: rgba(20, 20, 20, 0.95); border: 1px solid #333;
          border-radius: 14px; padding: 1rem; margin-bottom: 2rem;
          display: flex; align-items: center; justify-content: space-between;
          backdrop-filter: blur(10px); 
        }

        .viz-surface {
          height: 480px; background: #050505; border-radius: 20px;
          border: 2px solid #1a1a1a; position: relative; overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .node-ring {
          width: 44px; height: 44px; border: 4px solid #333;
          background: #000; border-radius: 50%; position: absolute;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 0.85rem; z-index: 10; transition: 0.4s;
        }

        .winner-glow { border-color: #fff !important; box-shadow: 0 0 20px rgba(255,255,255,0.4); }

        .edge-path { position: absolute; height: 2px; background: #222; transform-origin: left center; z-index: 1; transition: 0.4s; }
        .edge-winning { background: #fff !important; height: 4px !important; box-shadow: 0 0 15px #fff; z-index: 2; }
        
        .weight-tag {
          position: absolute; background: #111; color: #444; font-size: 0.6rem;
          padding: 2px 5px; border-radius: 4px; font-weight: 900; z-index: 5;
          transform: translate(-50%, -50%); border: 1px solid #222;
        }

        .dist-monitor {
          position: absolute; top: 20px; right: 20px; width: 170px;
          background: rgba(255, 255, 255, 0.03); border: 1px solid #222;
          padding: 15px; font-size: 0.65rem; z-index: 40; border-radius: 8px;
        }

        .btn-noir-sm { background: #fff; color: #000; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 900; font-size: 0.7rem; cursor: pointer; transition: 0.2s; }
        .btn-noir-sm:hover { opacity: 0.8; }
        .btn-ghost-sm { background: transparent; color: #fff; border: 1px solid #444; padding: 8px 12px; border-radius: 6px; font-weight: 900; font-size: 0.65rem; cursor: pointer; }

        /* Doc Section Styles */
        .doc-card {
          background: #0a0a0a; border: 1px solid #1a1a1a; padding: 1.5rem; border-radius: 12px;
          transition: border 0.3s;
        }
        .doc-card:hover { border-color: #333; }
        .doc-icon { color: #555; margin-bottom: 1rem; font-size: 1.2rem; }
        .doc-title { font-size: 0.9rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px; }
        .doc-desc { font-size: 0.85rem; color: #888; line-height: 1.6; }
      `}</style>

      <Header></Header>
            
                    

      <div className="content-wrap" style={{ marginTop: "50px" }}>
        <div className="glass-header">
          <div className="ui-group" style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-noir-sm" onClick={runDijkstra} disabled={isProcessing}>
              <FaBolt style={{ marginRight: '6px' }} /> RUN_ENGINE
            </button>
            <button className="btn-ghost-sm" onClick={generateWeightedGraph}>SCRAMBLE_MAP</button>
          </div>
          
          <div className="ui-group" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button className="btn-ghost-sm" onClick={() => {setVisited(new Set()); setShortestPath([]); setDistances({});}}>SYSTEM_RESET</button>
          </div>
        </div>

        <div className="viz-surface">
          <div className="dist-monitor">
            <div style={{ color: '#fff', marginBottom: '10px', borderBottom: '1px solid #222', fontWeight: 800 }}>LIVE_COST_LOG</div>
            {nodes.map(n => (
              <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', color: distances[n.id] === Infinity ? '#333' : (shortestPath.includes(n.id) ? '#fff' : '#666'), marginBottom: '2px' }}>
                <span>ADDR_0{n.id}</span>
                <span>{distances[n.id] === Infinity ? '∞' : distances[n.id]}</span>
              </div>
            ))}
          </div>

          {edges.map((edge, i) => {
            const from = nodes.find(n => n.id === edge.from);
            const to = nodes.find(n => n.id === edge.to);
            if (!from || !to) return null;
            const dx = to.x - from.x, dy = to.y - from.y;
            const dist = Math.sqrt(dx * dx + dy * dy), angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const isWinningEdge = shortestPath.some((id, idx) => (id === edge.from && shortestPath[idx + 1] === edge.to) || (id === edge.to && shortestPath[idx + 1] === edge.from));

            return (
              <React.Fragment key={i}>
                <div className={`edge-path ${isWinningEdge ? 'edge-winning' : ''}`} style={{ width: `${dist}px`, left: `${from.x + 22}px`, top: `${from.y + 22}px`, transform: `rotate(${angle}deg)` }} />
                <div className="weight-tag" style={{ left: (from.x + to.x) / 2 + 22, top: (from.y + to.y) / 2 + 22, color: isWinningEdge ? '#fff' : '#444' }}>{edge.weight}</div>
              </React.Fragment>
            );
          })}

          {nodes.map(node => (
            <motion.div key={node.id} className={`node-ring ${shortestPath.includes(node.id) ? 'winner-glow' : ''}`} style={{ left: node.x, top: node.y, background: activeNode === node.id ? '#fff' : '#000', color: activeNode === node.id ? '#000' : (shortestPath.includes(node.id) ? '#fff' : '#666'), borderColor: visited.has(node.id) ? '#666' : '#222' }} animate={{ scale: activeNode === node.id ? 1.2 : 1 }}>{node.id}</motion.div>
          ))}
        </div>

        {/* Results Stream */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: '#080808', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
              <div style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '2px' }}>CALCULATED_PATH</div>
              <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, marginTop: '0.5rem' }}>
                {shortestPath.length > 0 ? shortestPath.join(' → ') : "---"}
              </div>
            </div>
            <div style={{ background: '#080808', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
              <div style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '2px' }}>MINIMUM_COST</div>
              <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, marginTop: '0.5rem' }}>
                {shortestPath.length > 0 ? distances[shortestPath[shortestPath.length - 1]] : "0.00"}
              </div>
            </div>
          </div>
        </section>

        {/* BEGINNER FRIENDLY DOC SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="doc-section"
        >
          <div style={{ borderLeft: '3px solid #fff', paddingLeft: '1rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase' }}>Protocol_Documentation</h2>
            <p style={{ color: '#555', fontSize: '0.8rem' }}>Understanding the logic behind the shortest path engine.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            <motion.div className="doc-card" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <FaInfoCircle className="doc-icon" />
              <h3 className="doc-title">What is Dijkstra?</h3>
              <p className="doc-desc">
                Think of Dijkstra as a smart GPS. It finds the shortest distance between a starting point and all other points in a weighted map. It's used in Google Maps, network routing, and flight booking.
              </p>
            </motion.div>

            <motion.div className="doc-card" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <FaBolt className="doc-icon" />
              <h3 className="doc-title">The "Greedy" Logic</h3>
              <p className="doc-desc">
                The algorithm is "Greedy." This means it always picks the closest unvisited node first, assuming that the best immediate choice will lead to the best overall path.
              </p>
            </motion.div>

            <motion.div className="doc-card" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <FaCodeBranch className="doc-icon" />
              <h3 className="doc-title">Edge Relaxation</h3>
              <p className="doc-desc">
                If the engine finds a new way to reach a node that is "cheaper" than the previous path, it "relaxes" that edge and updates the distance. This ensures the result is always the absolute minimum.
              </p>
            </motion.div>

          </div>
        </motion.section>
      </div>
    </div></>
  );
};

export default DijkstraIndustrialTerminal;