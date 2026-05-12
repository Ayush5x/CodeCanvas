import React, { useState, useEffect, useRef, useCallback } from 'react';
import './PrimVisualizer.css';
import { 
  FaPlay, FaPause, FaStepForward, FaRandom, FaSearch, 
  FaRedo
} from 'react-icons/fa';
import { useIsMobile } from '../../../hooks/use-mobile';

const PRIM_CODE_SNIPPET = [
  { id: 1, text: "function primMST(startNode, targetNode) {" },
  { id: 2, text: "  let inMST = new Set(); let key = {}; let parent = {};" },
  { id: 3, text: "  let pq = new PriorityQueue(); let totalWeight = 0;" },
  { id: 4, text: "  key[startNode] = 0; pq.push({node: startNode, w: 0});" },
  { id: 5, text: "  while (!pq.isEmpty()) {" },
  { id: 6, text: "    let {node: u, w} = pq.pop();" },
  { id: 7, text: "    if (inMST.has(u)) continue;" },
  { id: 8, text: "    inMST.add(u);" },
  { id: 9, text: "    if (parent[u] !== undefined) totalWeight += key[u];" },
  { id: 10, text: "    if (u === targetNode) return reconstructPath(u);" },
  { id: 11, text: "    for (let {node: v, weight} of getNeighbors(u)) {" },
  { id: 12, text: "      if (!inMST.has(v) && weight < (key[v] ?? Infinity)) {" },
  { id: 13, text: "        key[v] = weight;" },
  { id: 14, text: "        parent[v] = u;" },
  { id: 15, text: "        pq.push({node: v, w: weight});" },
  { id: 16, text: "      }" },
  { id: 17, text: "    }" },
  { id: 18, text: "  }" },
  { id: 19, text: "  return totalWeight;" },
  { id: 20, text: "}" }
];

function* primGenerator(startNodeId, targetNodeId, edges) {
  yield { line: 1 };
  
  let inMST = new Set();
  let key = { [startNodeId]: 0 };
  let parent = {};
  yield { line: 2, inMST: new Set(inMST), key: {...key}, parent: {...parent} };
  
  let pq = [{ node: startNodeId, weight: 0 }];
  let totalWeight = 0;
  yield { line: 3, pq: [...pq], totalWeight };
  
  yield { line: 4, pq: [...pq], key: {...key} };
  
  let mstEdgesArray = [];

  while (pq.length > 0) {
    yield { line: 5 };
    
    // Sort to simulate Priority Queue (Min-Heap based on weight)
    pq.sort((a, b) => a.weight - b.weight);
    let currentItem = pq.shift();
    let u = currentItem.node;
    let w = currentItem.weight;
    
    yield { line: 6, pq: [...pq], currentNode: u };
    
    yield { line: 7, currentNode: u };
    if (inMST.has(u)) {
      yield { line: 5 }; // Visual skip
      continue;
    }
    
    inMST.add(u);
    yield { line: 8, inMST: new Set(inMST), currentNode: u };
    
    yield { line: 9, currentNode: u };
    if (parent[u] !== undefined) {
      totalWeight += key[u];
      mstEdgesArray.push({ from: parent[u], to: u });
      yield { line: 9, totalWeight, mstEdges: [...mstEdgesArray], currentNode: u };
    }
    
    yield { line: 10, currentNode: u };
    if (targetNodeId !== null && u === targetNodeId) {
      // Reconstruct path to show how we reached target
      let path = [];
      let curr = u;
      while (curr !== undefined && curr !== null) {
        path.unshift(curr);
        curr = parent[curr];
      }
      
      yield { line: 10, targetFound: true, currentNode: u, backtrackPath: path };
      return { found: true };
    }
    
    const neighbors = edges
      .filter(e => e.from === u || e.to === u)
      .map(e => ({
        node: e.from === u ? e.to : e.from,
        weight: e.weight
      }));
    neighbors.sort((a, b) => a.node - b.node);
      
    yield { line: 11, neighbors: [...neighbors], currentNode: u };
    
    for (let neighbor of neighbors) {
      let v = neighbor.node;
      let edgeWeight = neighbor.weight;
      
      yield { line: 11, checkNeighbor: v, currentNode: u };
      
      let currentKeyV = key[v] !== undefined ? key[v] : Infinity;
      yield { line: 12, checkNeighbor: v, currentNode: u };
      
      if (!inMST.has(v) && edgeWeight < currentKeyV) {
        key[v] = edgeWeight;
        yield { line: 13, key: {...key}, checkNeighbor: v, currentNode: u };
        
        parent[v] = u;
        yield { line: 14, parent: {...parent}, checkNeighbor: v, currentNode: u };
        
        pq.push({ node: v, weight: edgeWeight });
        yield { line: 15, pq: [...pq], checkNeighbor: v, currentNode: u };
        yield { line: 16, checkNeighbor: v, currentNode: u };
      } else {
        yield { line: 16, checkNeighbor: v, currentNode: u };
      }
    }
    yield { line: 17, currentNode: u };
  }
  yield { line: 18 };
  yield { line: 19, finished: true };
  return { found: false };
}

const PrimVisualizer = () => {
  const isMobile = useIsMobile();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  // Graph algorithm state
  const [pq, setPq] = useState([]);
  const [key, setKey] = useState({});
  const [parent, setParent] = useState({});
  const [inMST, setInMST] = useState(new Set());
  const [mstEdges, setMstEdges] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [backtrackPath, setBacktrackPath] = useState([]);
  
  const [currentNode, setCurrentNode] = useState(null);
  const [currentLine, setCurrentLine] = useState(null);
  const [checkNeighbor, setCheckNeighbor] = useState(null);
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
    
    // Create random nodes
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
    
    // Ensure connectivity
    const newEdges = [];
    for (let i = 1; i < newNodes.length; i++) {
      newEdges.push({ 
        from: Math.floor(Math.random() * i), 
        to: i, 
        weight: Math.floor(Math.random() * 9) + 1 
      });
    }
    
    // Add some random extra edges for density
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
    setPq([]);
    setKey({});
    setParent({});
    setInMST(new Set());
    setMstEdges([]);
    setTotalWeight(0);
    setBacktrackPath([]);
    setCurrentNode(null);
    setCurrentLine(null);
    setCheckNeighbor(null);
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
    generatorRef.current = primGenerator(startNodeId, target, edges);
  };

  const stepForward = useCallback(() => {
    if (!generatorRef.current) return null;
    
    const { value, done } = generatorRef.current.next();
    if (done) {
      setIsPlaying(false);
      return null;
    }
    
    if (value.line) setCurrentLine(value.line);
    if (value.pq !== undefined) setPq(value.pq);
    if (value.key !== undefined) setKey(value.key);
    if (value.parent !== undefined) setParent(value.parent);
    if (value.inMST !== undefined) setInMST(value.inMST);
    if (value.mstEdges !== undefined) setMstEdges(value.mstEdges);
    if (value.totalWeight !== undefined) setTotalWeight(value.totalWeight);
    if (value.backtrackPath !== undefined) setBacktrackPath(value.backtrackPath);
    if (value.currentNode !== undefined) setCurrentNode(value.currentNode);
    if (value.checkNeighbor !== undefined) setCheckNeighbor(value.checkNeighbor);
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

  const getNodeClass = (id) => {
    let classes = ["prim-node"];
    
    if (backtrackPath.includes(id)) return classes.concat("path-node").join(" ");
    if (targetFound && id === currentNode) return classes.concat("target-found").join(" ");
    if (id === currentNode) return classes.concat("current").join(" ");
    if (inMST.has(id)) return classes.concat("in-mst").join(" ");
    if (pq.some(item => item.node === id)) return classes.concat("queued").join(" ");
    
    return classes.concat("unvisited").join(" ");
  };

  const isEdgeActive = (from, to) => {
    if ((from === currentNode && to === checkNeighbor) || 
        (to === currentNode && from === checkNeighbor)) {
      return true;
    }
    return false;
  };

  const isEdgeInBacktrack = (from, to) => {
    for (let i = 0; i < backtrackPath.length - 1; i++) {
      if ((backtrackPath[i] === from && backtrackPath[i+1] === to) || 
          (backtrackPath[i+1] === from && backtrackPath[i] === to)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className={`prim-visualizer-container ${isMobile ? 'mobile-view' : ''}`}>
      <div className={`prim-header ${isMobile ? 'flex-col gap-4 text-center' : ''}`}>
        <h1 className={`${isMobile ? 'text-lg flex-wrap' : 'text-2xl'} font-bold tracking-tight text-white flex items-center gap-3 ${isMobile ? 'justify-center w-full' : 'w-max'}`}>
          <span className="text-[#00ffaa]">PRIM'S</span> VISUALIZER
        </h1>
        
        <div className={`prim-controls w-full flex ${isMobile ? 'flex-col gap-4' : 'justify-between'}`}>
          <div className={`flex flex-wrap gap-4 items-center ${isMobile ? 'justify-center w-full' : ''}`}>
            <div className={`control-group ${isMobile ? 'w-full justify-center' : ''}`}>
              <span className="control-label">Graph:</span>
              <select 
                className="prim-select" 
                value={nodeCount} 
                onChange={(e) => setNodeCount(parseInt(e.target.value))}
              >
                <option value={5}>5 Nodes</option>
                <option value={8}>8 Nodes</option>
                <option value={12}>12 Nodes</option>
                <option value={15}>15 Nodes</option>
              </select>
              <button className="prim-btn" onClick={handleScramble}>
                <FaRandom /> Scramble
              </button>
            </div>
            
            <div className="control-group relative">
              <span className="control-label">Target:</span>
              <input 
                type="text" 
                className={`prim-input w-16 ${targetSearch !== "" && parseInt(targetSearch) >= nodes.length ? 'border-red-500 text-red-400' : ''}`} 
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
                className={`prim-slider ${isMobile ? 'flex-1' : ''}`}
                min="0.5" 
                max="3" 
                step="0.5" 
                value={playbackSpeed} 
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              />
            </div>
          </div>
          
          <div className={`control-group ${isMobile ? 'w-full justify-center mt-2' : 'ml-auto'}`} style={{background: 'transparent', border: 'none'}}>
            <button className="prim-btn" onClick={() => { initGenerator(); setIsPlaying(false); }}>
              <FaRedo /> Reset
            </button>
            <button className="prim-btn primary" onClick={togglePlay}>
              {isPlaying ? <FaPause /> : <FaPlay />} {isPlaying ? "Pause" : "Play"}
            </button>
            <button className="prim-btn" onClick={executeStep} disabled={isPlaying || targetFound || isFinished}>
              <FaStepForward /> Step
            </button>
          </div>
        </div>
      </div>

      <div className="prim-main">
        <div className="prim-graph-container">
          {/* Edges */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            {edges.map((edge, i) => {
              const from = nodes.find(n => n.id === edge.from);
              const to = nodes.find(n => n.id === edge.to);
              if (!from || !to) return null;
              
              const isChecking = isEdgeActive(from.id, to.id);
              const isBacktrack = isEdgeInBacktrack(from.id, to.id);
              const isInMST = mstEdges.some(e => 
                (e.from === from.id && e.to === to.id) || (e.from === to.id && e.to === from.id)
              );
              
              let edgeColor = "rgba(255,255,255,0.1)";
              let edgeWidth = "2";
              let edgeFilter = "none";
              
              if (isBacktrack) {
                edgeColor = "#ffd700";
                edgeWidth = "5";
                edgeFilter = "drop-shadow(0 0 8px rgba(255,215,0,0.8))";
              } else if (isChecking) {
                edgeColor = "#00ffaa";
                edgeWidth = "4";
                edgeFilter = "drop-shadow(0 0 5px rgba(0,255,170,0.8))";
              } else if (isInMST) {
                edgeColor = "rgba(0,255,170,0.8)";
                edgeWidth = "3";
                edgeFilter = "drop-shadow(0 0 3px rgba(0,255,170,0.5))";
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
                    fill={isChecking || isBacktrack || isInMST ? "#fff" : "rgba(255,255,255,0.6)"}
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
            const nodeKey = key[node.id] !== undefined ? key[node.id] : '∞';
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
                <div className="node-key">{nodeKey}</div>
                
                {startNodeId === node.id && !isPlaying && !generatorRef.current && (
                  <div style={{
                    position: 'absolute', 
                    top: '-25px', 
                    fontSize: '10px',
                    color: '#00ffaa',
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

        <div className="prim-side-panel">
          <div className="prim-code-panel">
            {PRIM_CODE_SNIPPET.map((line) => (
              <div 
                key={line.id} 
                className={`code-line ${currentLine === line.id ? 'active' : ''}`}
              >
                <div className="code-line-number">{line.id}</div>
                <div className="code-content" style={{ whiteSpace: 'pre' }}>{line.text}</div>
              </div>
            ))}
          </div>

          <div className="prim-state-panel">
            <div>
              <div className="state-title">Total MST Weight</div>
              <div className="text-3xl font-black text-[#00ffaa] drop-shadow-[0_0_8px_rgba(0,255,170,0.4)]">
                {totalWeight}
              </div>
            </div>

            <div>
              <div className="state-title">Min-Heap (Priority Queue)</div>
              <div className="state-row mt-2 min-h-[30px]">
                {pq.length === 0 ? (
                  <span className="text-xs text-gray-600">[Empty]</span>
                ) : (
                  [...pq].sort((a, b) => a.weight - b.weight).map((item, i) => (
                    <div key={`pq-${i}`} className="state-pill queue flex gap-2 border border-[#c455ff]/30">
                      <span>N:{item.node}</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-white font-bold">W:{item.weight}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="mt-2">
              <div className="state-title">Variables</div>
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4 mt-2`}>
                <div className="flex flex-col bg-black/40 p-2 rounded border border-white/5">
                  <span className="text-xs text-gray-500">currentNode (u)</span>
                  <span className={`text-lg font-bold ${currentNode !== null ? 'text-[#00ffaa]' : 'text-gray-700'}`}>
                    {currentNode !== null ? currentNode : 'null'}
                  </span>
                </div>
                <div className="flex flex-col bg-black/40 p-2 rounded border border-white/5">
                  <span className="text-xs text-gray-500">targetNode</span>
                  <span className={`text-lg font-bold ${targetNodeId !== null ? 'text-[#ffd700]' : 'text-gray-700'}`}>
                    {targetNodeId !== null ? targetNodeId : 'null'}
                  </span>
                </div>
              </div>
              {checkNeighbor !== null && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-300">
                  Checking neighbor (v): <span className="font-bold text-white text-lg">{checkNeighbor}</span>
                </div>
              )}
            </div>
            
            {targetFound && (
              <div className="mt-2 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center font-bold animate-pulse">
                TARGET NODE {currentNode} ADDED TO MST!
              </div>
            )}
            
            {isFinished && !targetFound && targetNodeId !== null && (
              <div className="mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center font-bold">
                TARGET NOT REACHABLE
              </div>
            )}
            
            {isFinished && targetNodeId === null && (
              <div className="mt-2 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 text-center font-bold">
                MST COMPLETION SUCCESS
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimVisualizer;
