import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaSync, FaLayerGroup, FaHistory, FaMapMarkerAlt, FaBullseye } from 'react-icons/fa';
import PathFindingExplainer from './PathfindingExplainer'
import Header from '../../../components/Header';
import { motion } from 'framer-motion';
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap');

  body { margin: 0; background: #000; font-family: 'Space Grotesk', sans-serif; color: #fff; overflow-y: auto; }
  .app-container { min-height: 100vh; display: flex; flex-direction: column; padding: 25px; box-sizing: border-box; background: #000; }

  .glass-nav {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    margin-bottom: 25px;
  }

  .logo { font-size: 1.4rem; font-weight: 700; letter-spacing: 5px; color: #fff; text-transform: uppercase; }
  .controls-group { display: flex; gap: 20px; align-items: center; }

  .custom-select {
    background: #000; color: #fff; border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 10px 15px; border-radius: 8px; font-family: inherit; cursor: pointer;
  }

  .btn {
    padding: 12px 25px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05); color: #fff; cursor: pointer;
    font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
    transition: 0.3s; display: flex; align-items: center; gap: 8px;
  }

  .btn-primary { background: #fff; color: #000; border: none; font-weight: 800; }
  .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255,255,255,0.3); }

  .stats-hub { display: flex; justify-content: center; gap: 40px; margin-bottom: 25px; }
  .stat-card {
    background: rgba(255,255,255,0.02); padding: 10px 20px; border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 12px;
    font-size: 0.9rem; color: rgba(255,255,255,0.6);
  }
  .stat-card b { color: #fff; font-size: 1.2rem; }

  .grid-canvas { display: flex; justify-content: center; align-items: center; margin-bottom: 50px; }
  .node-grid { border-collapse: collapse; background: #141414be; }
  
  .node { width: 26px; height: 26px; border: 1px solid rgba(255, 255, 255, 0.04); transition: background 0.1s; position: relative; }

  /* Unique Start/End Markers */
  .node-start { background: rgba(0, 255, 136, 0.25) !important; display: flex; align-items: center; justify-content: center; cursor: grab; z-index: 20; }
  .node-end { background: rgba(255, 51, 102, 0.25) !important; display: flex; align-items: center; justify-content: center; cursor: grab; z-index: 20; }
  .node-start::after { content: 'S'; font-weight: 800; color: #00ff88; font-size: 13px; pointer-events: none; }
  .node-end::after { content: 'E'; font-weight: 800; color: #ff3366; font-size: 13px; pointer-events: none; }

  .node-wall { background: #fff; border-color: #fff; animation: wallPulse 0.2s ease forwards; }

  .node-visited-dijkstra { animation: dijkstraWave 0.8s ease-out forwards; }
  .node-visited-astar { animation: astarWave 0.8s ease-out forwards; }
  .node-path { animation: pathPulse 0.4s ease-out forwards; border: none !important; z-index: 15; }

  @keyframes wallPulse { 0% { transform: scale(0.4); } 100% { transform: scale(1); } }
  @keyframes dijkstraWave {
    0% { background: rgba(0, 212, 255, 1); transform: scale(0.3); border-radius: 100%; }
    100% { background: rgba(0, 212, 255, 0.15); transform: scale(1); border: 1px solid rgba(0, 212, 255, 0.3); }
  }
  @keyframes astarWave {
    0% { background: rgba(188, 19, 254, 1); transform: scale(0.3); border-radius: 100%; }
    100% { background: rgba(188, 19, 254, 0.15); transform: scale(1); border: 1px solid rgba(188, 19, 254, 0.3); }
  }
  @keyframes pathPulse {
    0% { background: #ffd700; transform: scale(0.5); }
    100% { background: #ffd700; transform: scale(1); box-shadow: 0 0 20px #ffd700; }
  }

  /* Documentation Styles */
  .documentation {
    max-width: 900px; margin: 0 auto 50px auto; padding: 40px;
    background: rgba(255, 255, 255, 0.02); border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.05); line-height: 1.6;
  }
  .doc-title { font-size: 2rem; color: #fff; margin-bottom: 20px; border-left: 4px solid #fff; padding-left: 15px; }
  .doc-section { margin-bottom: 30px; }
  .doc-section h3 { color: rgba(255, 255, 255, 0.9); margin-bottom: 10px; }
  .doc-section p { color: rgba(255, 255, 255, 0.6); }
  .algo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .algo-card { padding: 20px; background: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); }
  .highlight { color: #ffd700; font-weight: 500; }
`;

export default function PremiumPathfinder() {
  const [grid, setGrid] = useState([]);
  const [algo, setAlgo] = useState('Dijkstra');
  const [stats, setStats] = useState({ visited: 0, path: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [dragType, setDragType] = useState(null); 
  const [startPos, setStartPos] = useState({ r: 7, c: 5 });
  const [endPos, setEndPos] = useState({ r: 7, c: 30 });

  // Soft reset when algo changes
  useEffect(() => { 
    if (!isAnimating) softReset(); 
  }, [algo]);

  // Full Grid Sync when Start/End moves
  useEffect(() => { 
    if (!isAnimating) softReset();
  }, [startPos, endPos]);

  useEffect(() => { 
    fullInit();
  }, []);

  const fullInit = () => {
    const initialGrid = [];
    for (let r = 0; r < 15; r++) {
      const row = [];
      for (let c = 0; c < 38; c++) {
        row.push({ 
          r, c, 
          isStart: r === startPos.r && c === startPos.c, 
          isEnd: r === endPos.r && c === endPos.c, 
          isWall: false, 
          distance: Infinity, 
          isVisited: false, 
          previous: null 
        });
      }
      initialGrid.push(row);
    }
    setGrid(initialGrid);
  };

  const softReset = () => {
    setGrid(prev => prev.map(row => row.map(node => ({
      ...node,
      isStart: node.r === startPos.r && node.c === startPos.c,
      isEnd: node.r === endPos.r && node.c === endPos.c,
      distance: Infinity,
      isVisited: false,
      previous: null
    }))));
    setStats({ visited: 0, path: 0 });
    document.querySelectorAll('.node').forEach(n => {
      n.classList.remove('node-visited-dijkstra', 'node-visited-astar', 'node-path');
    });
  };

  const onMouseDown = (r, c) => {
    if (isAnimating) return;
    setIsMousePressed(true);
    if (r === startPos.r && c === startPos.c) {
      setDragType('start');
    } else if (r === endPos.r && c === endPos.c) {
      setDragType('end');
    } else {
      setDragType('wall');
      toggleWall(r, c);
    }
  };

  const onMouseEnter = (r, c) => {
    if (!isMousePressed || isAnimating) return;
    if (dragType === 'start') {
      if (r === endPos.r && c === endPos.c) return; // Prevent overlapping
      setStartPos({ r, c });
    } else if (dragType === 'end') {
      if (r === startPos.r && c === startPos.c) return; // Prevent overlapping
      setEndPos({ r, c });
    } else if (dragType === 'wall') {
      toggleWall(r, c);
    }
  };

  const onMouseUp = () => {
    setIsMousePressed(false);
    setDragType(null);
  };

  const toggleWall = (r, c) => {
    if ((r === startPos.r && c === startPos.c) || (r === endPos.r && c === endPos.c)) return;
    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[r][c].isWall = !newGrid[r][c].isWall;
      return newGrid;
    });
  };

  const run = () => {
    if (isAnimating) return;
    softReset();
    setIsAnimating(true);
    // Important: Pass fresh grid copies for algorithm calculation
    const workingGrid = grid.map(row => row.map(node => ({ ...node })));
    const { visitedNodes, endNodeFound } = solve(workingGrid, startPos, endPos, algo);
    const path = endNodeFound ? backtrack(endNodeFound) : null;
    animate(visitedNodes, path);
  };

  const animate = (visited, path) => {
    const vClass = algo === 'Dijkstra' ? 'node-visited-dijkstra' : 'node-visited-astar';
    visited.forEach((node, i) => {
      setTimeout(() => {
        if (!node.isStart && !node.isEnd) {
          const el = document.getElementById(`node-${node.r}-${node.c}`);
          if (el) el.className = `node ${vClass}`;
        }
        setStats(s => ({ ...s, visited: i + 1 }));
        if (i === visited.length - 1) path ? animatePath(path) : setIsAnimating(false);
      }, 10 * i);
    });
  };

  const animatePath = (path) => {
    path.forEach((node, i) => {
      setTimeout(() => {
        if (!node.isStart && !node.isEnd) {
          const el = document.getElementById(`node-${node.r}-${node.c}`);
          if (el) el.className = 'node node-path';
        }
        setStats(s => ({ ...s, path: i + 1 }));
        if (i === path.length - 1) setIsAnimating(false);
      }, 50 * i);
    });
  };

  return (



    <div className="app-container" onMouseUp={onMouseUp}>
      <Header></Header>
      <div className="relative py-0 flex flex-col items-center justify-center text-center overflow-hidden w-full">
  {/* Decorative Background Element */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#00ffcc]/5 blur-[120px] rounded-full pointer-events-none" />

  <div className="relative z-10">
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="h-[1px] w-8 bg-zinc-800" />
      <span className="text-[10px] font-mono tracking-[0.6em] text-zinc-500 uppercase">Architecture // V2</span>
      <div className="h-[1px] w-8 bg-zinc-800" />
    </div>
    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic">
      Pathfinding<span className="text-[#00ffcc] not-italic">.</span>
    </h1>
    
    <p className="mt-6 max-w-lg mx-auto text-zinc-400 text-sm leading-relaxed font-light tracking-wide">
      A high-fidelity environment for <span className="text-white">algorithmic exploration</span>. 
      Optimized for structural transparency and real-time computation.
    </p>
  </div>
</div>
      <style>{STYLES}</style>
      <header className="glass-nav" style={{marginTop:"50px"}}>
        <div className="logo">Path<span style={{fontWeight: 300}}>Lab</span></div>
        <div className="controls-group">
          <select className="custom-select" value={algo} onChange={(e) => setAlgo(e.target.value)}>
            <option value="Dijkstra">Dijkstra [Wide Search]</option>
            <option value="AStar">A* [Focused Heuristic]</option>
          </select>
          <button className="btn" onClick={() => window.location.reload()}><FaSync /> Full Reset</button>
          <button className="btn btn-primary" onClick={run} disabled={isAnimating}><FaPlay /> Visualize</button>
        </div>
      </header>

      <div className="stats-hub">
        <div className="stat-card"><FaLayerGroup /> Visited: <b>{stats.visited}</b></div>
        <div className="stat-card"><FaHistory /> Path: <b>{stats.path}</b></div>
        <div className="stat-card"><FaMapMarkerAlt /> {algo} Mode</div>
      </div>

      <div className="grid-canvas">
        <table className="node-grid">
          <tbody>
            {grid.map((row, rid) => (
              <tr key={rid}>
                {row.map((node, cid) => (
                  <td key={`${rid}-${cid}`} id={`node-${rid}-${cid}`} 
                      className={`node ${node.isStart ? 'node-start' : node.isEnd ? 'node-end' : node.isWall ? 'node-wall' : ''}`}
                      onMouseDown={() => onMouseDown(rid, cid)} onMouseEnter={() => onMouseEnter(rid, cid)} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>


        
      
          <PathFindingExplainer/>
  

      
      </div>
   
  );
}

// Logic implementations
function solve(grid, start, end, mode) {
  const visitedNodes = [];
  const startNode = grid[start.r][start.c];
  startNode.distance = 0;
  const unvisitedNodes = grid.flat();

  while (unvisitedNodes.length) {
    unvisitedNodes.sort((a, b) => {
      const aH = mode === 'AStar' ? Math.abs(end.r - a.r) + Math.abs(end.c - a.c) : 0;
      const bH = mode === 'AStar' ? Math.abs(end.r - b.r) + Math.abs(end.c - b.c) : 0;
      return (a.distance + aH) - (b.distance + bH);
    });
    const closest = unvisitedNodes.shift();
    if (closest.isWall || closest.distance === Infinity) return { visitedNodes, endNodeFound: null };
    closest.isVisited = true;
    visitedNodes.push(closest);
    if (closest.r === end.r && closest.c === end.c) return { visitedNodes, endNodeFound: closest };
    
    const neighbors = [];
    const {r, c} = closest;
    if (r > 0) neighbors.push(grid[r-1][c]);
    if (r < grid.length-1) neighbors.push(grid[r+1][c]);
    if (c > 0) neighbors.push(grid[r][c-1]);
    if (c < grid[0].length-1) neighbors.push(grid[r][c+1]);

    for (const n of neighbors.filter(x => !x.isVisited)) {
      const d = closest.distance + 1;
      if (d < n.distance) { n.distance = d; n.previous = closest; }
    }
  }
}

function backtrack(target) {
  const path = [];
  let curr = target;
  while (curr) { path.unshift(curr); curr = curr.previous; }
  return path;
}