import React, { useState, useEffect, useRef, useCallback } from 'react';
import './KruskalVisualizer.css';
import { 
  FaPlay, FaPause, FaStepForward, FaRandom, FaSearch, 
  FaRedo
} from 'react-icons/fa';
import { useIsMobile } from '../../../hooks/use-mobile';

const KRUSKAL_CODE_SNIPPET = [
  { id: 1, text: "function kruskalMST(edges, startNode, targetNode) {" },
  { id: 2, text: "  let parent = {}; let mst = []; let totalWeight = 0;" },
  { id: 3, text: "  for (let i = 0; i < numNodes; i++) parent[i] = i;" },
  { id: 4, text: "  const find = (i) => (parent[i]===i ? i : parent[i]=find(parent[i]));" },
  { id: 5, text: "  let sortedEdges = [...edges].sort((a,b) => a.weight - b.weight);" },
  { id: 6, text: "  for (let edge of sortedEdges) {" },
  { id: 7, text: "    let {from: u, to: v, weight} = edge;" },
  { id: 8, text: "    let rootU = find(u);" },
  { id: 9, text: "    let rootV = find(v);" },
  { id: 10, text: "    if (rootU !== rootV) {" },
  { id: 11, text: "      parent[rootU] = rootV;" },
  { id: 12, text: "      mst.push(edge);" },
  { id: 13, text: "      totalWeight += weight;" },
  { id: 14, text: "      if (targetNode !== null && find(startNode) === find(targetNode)) {" },
  { id: 15, text: "        return reconstructPath(startNode, targetNode);" },
  { id: 16, text: "      }" },
  { id: 17, text: "    } else {" },
  { id: 18, text: "      // Cycle detected, discard edge" },
  { id: 19, text: "    }" },
  { id: 20, text: "  }" },
  { id: 21, text: "  return totalWeight;" },
  { id: 22, text: "}" }
];

function* kruskalGenerator(startNodeId, targetNodeId, edges, nodes) {
  yield { line: 1 };
  
  let parent = {};
  let mst = [];
  let totalWeight = 0;
  yield { line: 2, parent: {...parent}, mst: [...mst], totalWeight };
  
  for (let i = 0; i < nodes.length; i++) {
    parent[nodes[i].id] = nodes[i].id;
  }
  yield { line: 3, parent: {...parent} };
  
  const find = (i) => {
    if (parent[i] === i) return i;
    return parent[i] = find(parent[i]);
  };
  yield { line: 4 };
  
  let sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  // Give each edge a unique ID for tracking in UI
  sortedEdges = sortedEdges.map((e, idx) => ({...e, uid: idx}));
  
  let discardedEdges = [];
  yield { line: 5, sortedEdges: [...sortedEdges] };

  for (let i = 0; i < sortedEdges.length; i++) {
    let edge = sortedEdges[i];
    yield { line: 6, currentEdge: edge };
    
    let u = edge.from;
    let v = edge.to;
    let weight = edge.weight;
    yield { line: 7, currentEdge: edge, checkU: u, checkV: v };
    
    let rootU = find(u);
    yield { line: 8, currentEdge: edge, checkU: u, checkV: v, rootU };
    
    let rootV = find(v);
    yield { line: 9, currentEdge: edge, checkU: u, checkV: v, rootU, rootV };
    
    yield { line: 10, currentEdge: edge, checkU: u, checkV: v, rootU, rootV };
    if (rootU !== rootV) {
      parent[rootU] = rootV;
      yield { line: 11, parent: {...parent}, currentEdge: edge, checkU: u, checkV: v };
      
      mst.push(edge);
      yield { line: 12, mst: [...mst], currentEdge: edge, checkU: u, checkV: v };
      
      totalWeight += weight;
      yield { line: 13, totalWeight, currentEdge: edge, checkU: u, checkV: v };
      
      yield { line: 14, currentEdge: edge, checkU: u, checkV: v };
      if (targetNodeId !== null && find(startNodeId) === find(targetNodeId)) {
        
        // Reconstruct path inside the MST using BFS to find path from start to target
        let adj = {};
        for(let e of mst) {
          if (!adj[e.from]) adj[e.from] = [];
          if (!adj[e.to]) adj[e.to] = [];
          adj[e.from].push(e.to);
          adj[e.to].push(e.from);
        }
        
        let q = [startNodeId];
        let visited = new Set([startNodeId]);
        let backtrackParent = {};
        let found = false;
        
        while(q.length > 0) {
          let curr = q.shift();
          if (curr === targetNodeId) {
            found = true;
            break;
          }
          if (adj[curr]) {
            for (let n of adj[curr]) {
              if (!visited.has(n)) {
                visited.add(n);
                backtrackParent[n] = curr;
                q.push(n);
              }
            }
          }
        }
        
        let path = [];
        if (found) {
          let c = targetNodeId;
          while(c !== undefined && c !== startNodeId) {
            path.unshift(c);
            c = backtrackParent[c];
          }
          path.unshift(startNodeId);
        }

        yield { line: 15, targetFound: true, backtrackPath: path, currentEdge: null, checkU: null, checkV: null };
        return { found: true };
      }
      yield { line: 16 };
    } else {
      yield { line: 17, currentEdge: edge, checkU: u, checkV: v, cycle: true };
      discardedEdges.push(edge);
      yield { line: 18, discardedEdges: [...discardedEdges], currentEdge: edge, checkU: u, checkV: v, cycle: true };
      yield { line: 19 };
    }
    yield { line: 20 };
  }
  
  yield { line: 21 };
  yield { line: 22, finished: true, currentEdge: null, checkU: null, checkV: null };
  return { found: false };
}

const KruskalVisualizer = () => {
  const isMobile = useIsMobile();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  // Graph algorithm state
  const [parent, setParent] = useState({});
  const [mst, setMst] = useState([]);
  const [sortedEdges, setSortedEdges] = useState([]);
  const [discardedEdges, setDiscardedEdges] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [backtrackPath, setBacktrackPath] = useState([]);
  
  const [currentEdge, setCurrentEdge] = useState(null);
  const [checkU, setCheckU] = useState(null);
  const [checkV, setCheckV] = useState(null);
  const [rootU, setRootU] = useState(null);
  const [rootV, setRootV] = useState(null);
  const [cycle, setCycle] = useState(false);
  
  const [currentLine, setCurrentLine] = useState(null);
  const [targetFound, setTargetFound] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // Controls
  const [startNodeId, setStartNodeId] = useState(0);
  const [targetSearch, setTargetSearch] = useState("");
  const [targetNodeId, setTargetNodeId] = useState(null);
  const [nodeCount, setNodeCount] = useState(8);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Refs for generator and timeout
  const generatorRef = useRef(null);
  const timeoutRef = useRef(null);

  const generateGraph = useCallback((count) => {
    const newNodes = [];
    
    for (let i = 0; i < count; i++) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const x = 15 + Math.random() * 70;
        const y = 15 + Math.random() * 70;
        
        const collision = newNodes.some(n => 
          Math.sqrt(Math.pow(n.px - x, 2) + Math.pow(n.py - y, 2)) < 15
        );
        
        if (!collision) {
          newNodes.push({ id: i, x: `${x}%`, y: `${y}%`, px: x, py: y });
          placed = true;
        }
        attempts++;
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
    
    const extraEdges = Math.floor(count * 0.8);
    for (let i = 0; i < extraEdges; i++) {
      const u = Math.floor(Math.random() * count);
      const v = Math.floor(Math.random() * count);
      if (u !== v && !newEdges.some(e => (e.from === u && e.to === v) || (e.from === v && e.to === u))) {
        newEdges.push({ 
          from: u, 
          to: v, 
          weight: Math.floor(Math.random() * 9) + 1 
        });
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
    resetState();
  }, []);

  useEffect(() => {
    generateGraph(nodeCount);
  }, [nodeCount, generateGraph]);

  const resetState = () => {
    setParent({});
    setMst([]);
    setSortedEdges([]);
    setDiscardedEdges([]);
    setTotalWeight(0);
    setBacktrackPath([]);
    setCurrentEdge(null);
    setCheckU(null);
    setCheckV(null);
    setRootU(null);
    setRootV(null);
    setCycle(false);
    setCurrentLine(null);
    setTargetFound(false);
    setIsFinished(false);
    setIsPlaying(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    generatorRef.current = null;
  };

  const handleScramble = () => {
    generateGraph(nodeCount);
  };

  const initGenerator = () => {
    let target = null;
    if (targetSearch !== "") {
      const parsed = parseInt(targetSearch);
      if (!isNaN(parsed) && parsed >= 0 && parsed < nodes.length) {
        target = parsed;
        setTargetNodeId(parsed);
      }
    } else {
      setTargetNodeId(null);
    }
    resetState();
    generatorRef.current = kruskalGenerator(startNodeId, target, edges, nodes);
  };

  const stepForward = useCallback(() => {
    if (!generatorRef.current) return null;
    
    const { value, done } = generatorRef.current.next();
    if (done) {
      setIsPlaying(false);
      return null;
    }
    
    if (value.line) setCurrentLine(value.line);
    if (value.parent !== undefined) setParent(value.parent);
    if (value.mst !== undefined) setMst(value.mst);
    if (value.sortedEdges !== undefined) setSortedEdges(value.sortedEdges);
    if (value.discardedEdges !== undefined) setDiscardedEdges(value.discardedEdges);
    if (value.totalWeight !== undefined) setTotalWeight(value.totalWeight);
    if (value.backtrackPath !== undefined) setBacktrackPath(value.backtrackPath);
    
    if (value.currentEdge !== undefined) setCurrentEdge(value.currentEdge);
    if (value.checkU !== undefined) setCheckU(value.checkU);
    if (value.checkV !== undefined) setCheckV(value.checkV);
    if (value.rootU !== undefined) setRootU(value.rootU);
    if (value.rootV !== undefined) setRootV(value.rootV);
    if (value.cycle !== undefined) setCycle(value.cycle);
    else if (value.cycle === undefined) setCycle(false); // Reset cycle each step unless specified
    
    if (value.targetFound) setTargetFound(true);
    if (value.finished) setIsFinished(true);
    
    return value;
  }, []);

  const executeStep = () => {
    if (!generatorRef.current) {
      initGenerator();
      setTimeout(() => stepForward(), 0);
      return;
    }
    stepForward();
  };

  useEffect(() => {
    const playNextFrame = () => {
      const val = stepForward();
      if (!val || val.targetFound || val.finished) {
        setIsPlaying(false);
      } else {
        timeoutRef.current = setTimeout(playNextFrame, 1000 / playbackSpeed);
      }
    };

    if (isPlaying) {
      timeoutRef.current = setTimeout(playNextFrame, 1000 / playbackSpeed);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying, playbackSpeed, stepForward]);

  useEffect(() => {
    if (!isPlaying && !generatorRef.current) {
      const parsed = parseInt(targetSearch);
      if (!isNaN(parsed) && parsed >= 0 && parsed < nodes.length) {
        setTargetNodeId(parsed);
      } else {
        setTargetNodeId(null);
      }
    }
  }, [targetSearch, isPlaying, nodes]);

  const togglePlay = () => {
    if (!generatorRef.current) initGenerator();
    setIsPlaying(!isPlaying);
  };

  // Helper to trace back the root to display DSU set in UI
  const getRoot = (i) => {
    if (parent[i] === undefined) return i;
    let curr = i;
    while(parent[curr] !== curr) {
      curr = parent[curr];
    }
    return curr;
  };

  const getNodeClass = (id) => {
    let classes = ["kruskal-node"];
    
    if (targetFound && backtrackPath.includes(id)) {
      if (id === targetNodeId) return classes.concat("target-found").join(" ");
      return classes.concat("path-node").join(" "); // Just using path-node if needed or could create new style
    }
    
    if (cycle && (id === checkU || id === checkV)) {
      return classes.concat("cycle").join(" ");
    }
    
    if (id === checkU || id === checkV) {
      return classes.concat("checking").join(" ");
    }
    
    return classes.concat("unvisited").join(" ");
  };

  const isEdgeActive = (from, to) => {
    if (currentEdge && 
        ((from === currentEdge.from && to === currentEdge.to) || 
         (to === currentEdge.from && from === currentEdge.to))) {
      return true;
    }
    return false;
  };

  const isEdgeInBacktrack = (from, to) => {
    if (!targetFound) return false;
    for (let i = 0; i < backtrackPath.length - 1; i++) {
      if ((backtrackPath[i] === from && backtrackPath[i+1] === to) || 
          (backtrackPath[i+1] === from && backtrackPath[i] === to)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className={`kruskal-visualizer-container ${isMobile ? 'mobile-view' : ''}`}>
      <div className={`kruskal-header ${isMobile ? 'flex-col gap-4 text-center' : ''}`}>
        <h1 className={`${isMobile ? 'text-lg flex-wrap' : 'text-2xl'} font-bold tracking-tight text-white flex items-center gap-3 ${isMobile ? 'justify-center w-full' : 'w-max'}`}>
          <span className="text-[#00bfff]">KRUSKAL'S</span> VISUALIZER
        </h1>
        
        <div className={`kruskal-controls w-full flex ${isMobile ? 'flex-col gap-4' : 'justify-between'}`}>
          <div className={`flex flex-wrap gap-4 items-center ${isMobile ? 'justify-center w-full' : ''}`}>
            <div className={`control-group ${isMobile ? 'w-full justify-center' : ''}`}>
              <span className="control-label">Graph:</span>
              <select 
                className="kruskal-select" 
                value={nodeCount} 
                onChange={(e) => setNodeCount(parseInt(e.target.value))}
              >
                <option value={5}>5 Nodes</option>
                <option value={8}>8 Nodes</option>
                <option value={12}>12 Nodes</option>
                <option value={15}>15 Nodes</option>
              </select>
              <button className="kruskal-btn" onClick={handleScramble}>
                <FaRandom /> Scramble
              </button>
            </div>
            
            <div className="control-group relative">
              <span className="control-label">Target:</span>
              <input 
                type="text" 
                className={`kruskal-input w-16 ${targetSearch !== "" && parseInt(targetSearch) >= nodes.length ? 'border-red-500 text-red-400' : ''}`} 
                placeholder="ID"
                value={targetSearch}
                onChange={(e) => {
                  setTargetSearch(e.target.value);
                  resetState(); // Reset if they change target
                }}
              />
              {targetSearch !== "" && parseInt(targetSearch) >= nodes.length && (
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-red-400 whitespace-nowrap bg-red-900/40 px-2 py-0.5 rounded border border-red-500/50">
                  Max ID: {nodes.length - 1}
                </div>
              )}
            </div>
            
            <div className={`control-group ${isMobile ? 'w-full justify-center' : ''}`}>
              <span className="control-label">Speed: {playbackSpeed}x</span>
              <input 
                type="range" 
                className={`kruskal-slider ${isMobile ? 'flex-1' : ''}`}
                min="0.5" 
                max="3" 
                step="0.5" 
                value={playbackSpeed} 
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              />
            </div>
          </div>
          
          <div className={`control-group ${isMobile ? 'w-full justify-center mt-2' : 'ml-auto'}`} style={{background: 'transparent', border: 'none'}}>
            <button className="kruskal-btn" onClick={() => { initGenerator(); setIsPlaying(false); }}>
              <FaRedo /> Reset
            </button>
            <button className="kruskal-btn primary" onClick={togglePlay}>
              {isPlaying ? <FaPause /> : <FaPlay />} {isPlaying ? "Pause" : "Play"}
            </button>
            <button className="kruskal-btn" onClick={executeStep} disabled={isPlaying || targetFound || isFinished}>
              <FaStepForward /> Step
            </button>
          </div>
        </div>
      </div>

      <div className="kruskal-main">
        <div className="kruskal-graph-container">
          {/* Edges */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            {edges.map((edge, i) => {
              const from = nodes.find(n => n.id === edge.from);
              const to = nodes.find(n => n.id === edge.to);
              if (!from || !to) return null;
              
              const isChecking = isEdgeActive(from.id, to.id);
              const isBacktrack = isEdgeInBacktrack(from.id, to.id);
              const isInMST = mst.some(e => (e.from === edge.from && e.to === edge.to));
              const isDiscarded = discardedEdges.some(e => (e.from === edge.from && e.to === edge.to));
              
              let edgeColor = "rgba(255,255,255,0.1)";
              let edgeWidth = "2";
              let edgeFilter = "none";
              
              if (isBacktrack) {
                edgeColor = "#ffd700";
                edgeWidth = "5";
                edgeFilter = "drop-shadow(0 0 8px rgba(255,215,0,0.8))";
              } else if (isChecking) {
                if (cycle) {
                  edgeColor = "#ff3232";
                  edgeWidth = "4";
                  edgeFilter = "drop-shadow(0 0 5px rgba(255,50,50,0.8))";
                } else {
                  edgeColor = "#ffff00";
                  edgeWidth = "4";
                  edgeFilter = "drop-shadow(0 0 5px rgba(255,255,0,0.8))";
                }
              } else if (isInMST) {
                edgeColor = "rgba(0,191,255,0.8)";
                edgeWidth = "3";
                edgeFilter = "drop-shadow(0 0 3px rgba(0,191,255,0.5))";
              } else if (isDiscarded) {
                edgeColor = "rgba(255,50,50,0.2)";
                edgeWidth = "1";
              }
              
              const midX = (from.px + to.px) / 2;
              const midY = (from.py + to.py) / 2;

              return (
                <g key={`edge-${i}`}>
                  <line 
                    x1={`${from.x}`} 
                    y1={`${from.y}`} 
                    x2={`${to.x}`} 
                    y2={`${to.y}`} 
                    stroke={edgeColor}
                    strokeWidth={edgeWidth}
                    style={{ filter: edgeFilter, transition: "all 0.3s ease" }}
                  />
                  <rect 
                    x={`${midX}%`} y={`${midY}%`} 
                    width="20" height="20" 
                    rx="4" ry="4" 
                    fill="rgba(0,0,0,0.7)" 
                    stroke="rgba(255,255,255,0.2)"
                    transform="translate(-10, -10)"
                  />
                  <text 
                    x={`${midX}%`} y={`${midY}%`} 
                    fill={isChecking || isBacktrack || isInMST ? "#fff" : (isDiscarded ? "rgba(255,50,50,0.4)" : "rgba(255,255,255,0.6)")}
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Nodes */}
          {nodes.map((node) => {
            const setRoot = getRoot(node.id);
            return (
              <div 
                key={node.id} 
                className={getNodeClass(node.id)}
                style={{ left: node.x, top: node.y }}
                onClick={() => {
                  if(!isPlaying && !generatorRef.current) {
                    setStartNodeId(node.id);
                  }
                }}
              >
                <div className="node-id">{node.id}</div>
                {/* DSU Root Display */}
                {Object.keys(parent).length > 0 && (
                  <div className="node-set">R:{setRoot}</div>
                )}
                
                {startNodeId === node.id && !isPlaying && !generatorRef.current && (
                  <div style={{
                    position: 'absolute', 
                    top: '-25px', 
                    fontSize: '10px',
                    color: '#00bfff',
                    fontWeight: 'bold',
                    background: 'rgba(0,0,0,0.8)',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>START</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="kruskal-side-panel">
          <div className="kruskal-code-panel">
            {KRUSKAL_CODE_SNIPPET.map((line) => (
              <div 
                key={line.id} 
                className={`code-line ${currentLine === line.id ? 'active' : ''}`}
              >
                <div className="code-line-number">{line.id}</div>
                <div className="code-content" style={{ whiteSpace: 'pre' }}>{line.text}</div>
              </div>
            ))}
          </div>

          <div className="kruskal-state-panel">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="state-title">Total MST Weight</div>
                <div className="text-3xl font-black text-[#00bfff] drop-shadow-[0_0_8px_rgba(0,191,255,0.4)]">
                  {totalWeight}
                </div>
              </div>
              <div>
                <div className="state-title">Edges in MST</div>
                <div className="text-3xl font-black text-white">
                  {mst.length} <span className="text-gray-500 text-lg">/ {nodes.length - 1}</span>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <div className="state-title">Variables</div>
              <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-2 mt-2`}>
                <div className="flex flex-col bg-black/40 p-2 rounded border border-white/5">
                  <span className="text-[10px] text-gray-500">u</span>
                  <span className={`text-sm font-bold text-white`}>{checkU !== null ? checkU : '-'}</span>
                </div>
                <div className="flex flex-col bg-black/40 p-2 rounded border border-white/5">
                  <span className="text-[10px] text-gray-500">v</span>
                  <span className={`text-sm font-bold text-white`}>{checkV !== null ? checkV : '-'}</span>
                </div>
                <div className="flex flex-col bg-black/40 p-2 rounded border border-white/5">
                  <span className="text-[10px] text-gray-500">find(u)</span>
                  <span className={`text-sm font-bold ${rootU !== null ? 'text-[#ffff00]' : 'text-gray-700'}`}>{rootU !== null ? rootU : '-'}</span>
                </div>
                <div className="flex flex-col bg-black/40 p-2 rounded border border-white/5">
                  <span className="text-[10px] text-gray-500">find(v)</span>
                  <span className={`text-sm font-bold ${rootV !== null ? 'text-[#ffff00]' : 'text-gray-700'}`}>{rootV !== null ? rootV : '-'}</span>
                </div>
              </div>
              {cycle && (
                <div className="mt-2 text-xs font-bold text-red-400 bg-red-900/30 p-2 rounded text-center border border-red-500/50">
                  CYCLE DETECTED: Discarding Edge
                </div>
              )}
            </div>

            <div>
              <div className="state-title">Sorted Edge List</div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                {sortedEdges.map((e, idx) => {
                  let statusClass = "";
                  if (currentEdge && currentEdge.uid === e.uid) statusClass = "checking";
                  else if (mst.some(m => m.uid === e.uid)) statusClass = "in-mst";
                  else if (discardedEdges.some(d => d.uid === e.uid)) statusClass = "discarded";
                  
                  return (
                    <div key={`se-${idx}`} className={`edge-list-item ${statusClass}`}>
                      <span>{e.from}-{e.to}</span>
                      <span className="text-gray-400">|</span>
                      <span>{e.weight}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {targetFound && (
              <div className="mt-2 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center font-bold animate-pulse">
                TARGET NODE {targetNodeId} SUCCESSFULLY UNIFIED INTO FOREST!
              </div>
            )}
            
            {isFinished && !targetFound && targetNodeId !== null && (
              <div className="mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center font-bold">
                TARGET UNREACHABLE / GRAPH DISCONNECTED
              </div>
            )}
            
            {isFinished && targetNodeId === null && (
              <div className="mt-2 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 text-center font-bold">
                KRUSKAL'S MST COMPLETION SUCCESS
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KruskalVisualizer;
