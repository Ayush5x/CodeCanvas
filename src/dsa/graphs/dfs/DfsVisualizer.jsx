import React, { useState, useEffect, useRef, useCallback } from 'react';
import './DfsVisualizer.css';
import { 
  FaPlay, FaPause, FaStepForward, FaRandom, FaSearch, 
  FaRedo
} from 'react-icons/fa';
import { useIsMobile } from '../../../hooks/use-mobile';

const DFS_CODE_SNIPPET = [
  { id: 1, text: "function dfs(node, targetNode, visited, stack) {" },
  { id: 2, text: "  visited.add(node);" },
  { id: 3, text: "  stack.push(node);" },
  { id: 4, text: "  if (node === targetNode) return true;" },
  { id: 5, text: "  for (let neighbor of getNeighbors(node)) {" },
  { id: 6, text: "    if (!visited.has(neighbor)) {" },
  { id: 7, text: "      let found = dfs(neighbor, targetNode, visited, stack);" },
  { id: 8, text: "      if (found) return true;" },
  { id: 9, text: "    }" },
  { id: 10, text: "  }" },
  { id: 11, text: "  stack.pop();" },
  { id: 12, text: "  return false;" },
  { id: 13, text: "}" }
];

function* dfsGenerator(currentNode, targetNode, edges, visited, stack, timeTracker, traversedEdges) {
  // Discovery time
  timeTracker.time++;
  let dTime = timeTracker.time;
  
  yield { line: 1, currentNode, discoveryTime: { node: currentNode, time: dTime } };
  
  visited.add(currentNode);
  yield { line: 2, visited: new Set(visited), currentNode };
  
  stack.push(currentNode);
  yield { line: 3, stack: [...stack], currentNode };
  
  yield { line: 4, currentNode };
  if (targetNode !== null && currentNode === targetNode) {
    yield { line: 4, targetFound: true, currentNode };
    return true;
  }
  
  // Find neighbors (undirected graph)
  const neighbors = edges
    .filter(e => e.from === currentNode || e.to === currentNode)
    .map(e => (e.from === currentNode ? e.to : e.from));
    
  // Sort neighbors for deterministic traversal
  neighbors.sort((a, b) => a - b);
    
  yield { line: 5, neighbors: [...neighbors], currentNode };
  
  for (let neighbor of neighbors) {
    yield { line: 6, checkNeighbor: neighbor, currentNode };
    
    if (!visited.has(neighbor)) {
      traversedEdges.push({ from: currentNode, to: neighbor });
      yield { line: 7, checkNeighbor: neighbor, currentNode, traversedEdges: [...traversedEdges] };
      
      const found = yield* dfsGenerator(neighbor, targetNode, edges, visited, stack, timeTracker, traversedEdges);
      
      // Restored context after returning from the recursion
      yield { line: 7, checkNeighbor: neighbor, currentNode, isBacktracking: true };
      yield { line: 8, checkNeighbor: neighbor, currentNode };
      if (found) {
        return true;
      }
    } else {
      // Visual feedback that the condition was false and we skipped the block
      yield { line: 9, checkNeighbor: neighbor, currentNode };
    }
  }
  
  yield { line: 10, currentNode };
  
  stack.pop();
  timeTracker.time++;
  let fTime = timeTracker.time;
  
  yield { line: 11, stack: [...stack], currentNode, finishTime: { node: currentNode, time: fTime } };
  yield { line: 12, currentNode };
  return false;
}

const DfsVisualizer = () => {
  const isMobile = useIsMobile();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  // Graph algorithm state
  const [stack, setStack] = useState([]);
  const [visited, setVisited] = useState(new Set());
  const [traversedEdges, setTraversedEdges] = useState([]);
  const [discoveryTimes, setDiscoveryTimes] = useState({});
  const [finishTimes, setFinishTimes] = useState({});
  
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
    
    // Create random nodes within 15% to 85% bounds
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
      newEdges.push({ from: Math.floor(Math.random() * i), to: i });
    }
    
    // Add some random extra edges
    const extraEdges = Math.floor(count / 2);
    for (let i = 0; i < extraEdges; i++) {
      const u = Math.floor(Math.random() * count);
      const v = Math.floor(Math.random() * count);
      if (u !== v && !newEdges.some(e => (e.from === u && e.to === v) || (e.from === v && e.to === u))) {
        newEdges.push({ from: u, to: v });
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
    setStack([]);
    setVisited(new Set());
    setTraversedEdges([]);
    setDiscoveryTimes({});
    setFinishTimes({});
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
    
    const timeTracker = { time: 0 };
    generatorRef.current = dfsGenerator(startNodeId, target, edges, new Set(), [], timeTracker, []);
  };

  const stepForward = useCallback(() => {
    if (!generatorRef.current) return null;
    
    const { value, done } = generatorRef.current.next();
    
    if (done) {
      setIsPlaying(false);
      setIsFinished(true);
      return null;
    }
    
    if (value.line) setCurrentLine(value.line);
    if (value.stack !== undefined) setStack(value.stack);
    if (value.visited !== undefined) setVisited(value.visited);
    if (value.traversedEdges !== undefined) setTraversedEdges(value.traversedEdges);
    if (value.currentNode !== undefined) setCurrentNode(value.currentNode);
    if (value.checkNeighbor !== undefined) setCheckNeighbor(value.checkNeighbor);
    if (value.targetFound) setTargetFound(true);
    
    if (value.discoveryTime) {
      setDiscoveryTimes(prev => ({...prev, [value.discoveryTime.node]: value.discoveryTime.time}));
    }
    if (value.finishTime) {
      setFinishTimes(prev => ({...prev, [value.finishTime.node]: value.finishTime.time}));
    }
    
    // If we've popped the last element and finished successfully without finding target
    if (value.line === 13) {
      setIsFinished(true);
    }
    
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
      if (!val || val.targetFound || val.line === 13 || isFinished) {
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
  }, [isPlaying, playbackSpeed, stepForward, isFinished]);

  useEffect(() => {
    // If targetSearch changes while not playing, auto-init to show it in the Variables panel
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
    let classes = ["dfs-node"];
    if (targetFound && id === currentNode) return classes.concat("target-found").join(" ");
    if (id === currentNode) return classes.concat("current").join(" ");
    if (stack.includes(id)) return classes.concat("in-stack").join(" ");
    if (finishTimes[id]) return classes.concat("fully-explored").join(" ");
    return classes.concat("unvisited").join(" ");
  };

  const isEdgeInStack = (from, to) => {
    for(let i = 0; i < stack.length - 1; i++) {
      if ((stack[i] === from && stack[i+1] === to) || 
          (stack[i+1] === from && stack[i] === to)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className={`dfs-visualizer-container ${isMobile ? 'mobile-view' : ''}`}>
      <div className={`dfs-header ${isMobile ? 'flex-col gap-4 text-center' : ''}`}>
        <h1 className={`${isMobile ? 'text-lg flex-wrap' : 'text-2xl'} font-bold tracking-tight text-white flex items-center gap-3 ${isMobile ? 'justify-center w-full' : 'w-max'}`}>
          <span className="text-[#c455ff]">DFS</span> VISUALIZER
        </h1>
        
        <div className={`dfs-controls w-full flex ${isMobile ? 'flex-col gap-4' : 'justify-between'}`}>
          <div className={`flex flex-wrap gap-4 items-center ${isMobile ? 'justify-center w-full' : ''}`}>
            <div className={`control-group ${isMobile ? 'w-full justify-center' : ''}`}>
              <span className="control-label">Graph:</span>
              <select 
                className="dfs-select" 
                value={nodeCount} 
                onChange={(e) => setNodeCount(parseInt(e.target.value))}
              >
                <option value={5}>5 Nodes</option>
                <option value={8}>8 Nodes</option>
                <option value={12}>12 Nodes</option>
                <option value={15}>15 Nodes</option>
              </select>
              <button className="dfs-btn" onClick={handleScramble}>
                <FaRandom /> Scramble
              </button>
            </div>
            
            <div className="control-group relative">
              <span className="control-label">Target:</span>
              <input 
                type="text" 
                className={`dfs-input w-16 ${targetSearch !== "" && parseInt(targetSearch) >= nodes.length ? 'border-red-500 text-red-400' : ''}`} 
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
                className={`dfs-slider ${isMobile ? 'flex-1' : ''}`}
                min="0.5" 
                max="3" 
                step="0.5" 
                value={playbackSpeed} 
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              />
            </div>
          </div>
          
          <div className={`control-group ${isMobile ? 'w-full justify-center mt-2' : 'ml-auto'}`} style={{background: 'transparent', border: 'none'}}>
            <button className="dfs-btn" onClick={() => { initGenerator(); setIsPlaying(false); }}>
              <FaRedo /> Reset
            </button>
            <button className="dfs-btn primary" onClick={togglePlay}>
              {isPlaying ? <FaPause /> : <FaPlay />} {isPlaying ? "Pause" : "Play"}
            </button>
            <button className="dfs-btn" onClick={executeStep} disabled={isPlaying || targetFound || isFinished}>
              <FaStepForward /> Step
            </button>
          </div>
        </div>
      </div>

      <div className="dfs-main">
        <div className="dfs-graph-container">
          {/* Edges */}
          {edges.map((edge, i) => {
            const from = nodes.find(n => n.id === edge.from);
            const to = nodes.find(n => n.id === edge.to);
            if (!from || !to) return null;
            
            const isAct = ((from.id === currentNode && to.id === checkNeighbor) || 
                           (to.id === currentNode && from.id === checkNeighbor));
            const inStack = isEdgeInStack(from.id, to.id);
            const isTraversed = traversedEdges.some(e => 
              (e.from === from.id && e.to === to.id) || (e.from === to.id && e.to === from.id)
            );
            
            let edgeColor = "rgba(255,255,255,0.1)";
            let edgeWidth = "2";
            let edgeFilter = "none";
            let zIndex = 1;
            
            if (isAct) {
              edgeColor = "#00ffff";
              edgeWidth = "4";
              edgeFilter = "drop-shadow(0 0 5px rgba(0,255,255,0.8))";
              zIndex = 3;
            } else if (inStack) {
              edgeColor = "#c455ff";
              edgeWidth = "4";
              edgeFilter = "drop-shadow(0 0 5px rgba(150,0,255,0.8))";
              zIndex = 2;
            } else if (isTraversed) {
              edgeColor = "rgba(150,0,255,0.4)";
              edgeWidth = "2";
            }
            
            return (
              <svg 
                key={`edge-${i}`}
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%', height: '100%',
                  pointerEvents: 'none',
                  zIndex: zIndex
                }}
              >
                <line 
                  x1={from.x} 
                  y1={from.y} 
                  x2={to.x} 
                  y2={to.y} 
                  stroke={edgeColor}
                  strokeWidth={edgeWidth}
                  style={{
                    filter: edgeFilter,
                    transition: "all 0.3s ease"
                  }}
                />
              </svg>
            );
          })}
          
          {/* Nodes */}
          {nodes.map((node) => (
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
              {(discoveryTimes[node.id] || finishTimes[node.id]) && (
                <div className="node-times">
                  {discoveryTimes[node.id] || '-'} / {finishTimes[node.id] || '-'}
                </div>
              )}
              {startNodeId === node.id && !isPlaying && !generatorRef.current && (
                <div style={{
                  position: 'absolute', 
                  top: '-25px', 
                  fontSize: '10px',
                  color: '#c455ff',
                  fontWeight: 'bold',
                  background: 'rgba(0,0,0,0.8)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>START</div>
              )}
            </div>
          ))}
        </div>

        <div className="dfs-side-panel">
          <div className="dfs-code-panel">
            {DFS_CODE_SNIPPET.map((line) => (
              <div 
                key={line.id} 
                className={`code-line ${currentLine === line.id ? 'active' : ''}`}
              >
                <div className="code-line-number">{line.id}</div>
                <div className="code-content" style={{ whiteSpace: 'pre' }}>{line.text}</div>
              </div>
            ))}
          </div>

          <div className="dfs-state-panel">
            <div>
              <div className="state-title">Recursion Stack</div>
              <div className="stack-container mt-2">
                {stack.length === 0 ? (
                  <span className="text-xs text-gray-600 text-center py-2">[Stack Empty]</span>
                ) : (
                  stack.map((sId, i) => (
                    <div key={`s-${i}`} className="stack-item">
                      dfs({sId})
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="mt-2">
              <div className="state-title">Variables</div>
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4 mt-2`}>
                <div className="flex flex-col bg-black/40 p-2 rounded border border-white/5">
                  <span className="text-xs text-gray-500">currentNode</span>
                  <span className={`text-lg font-bold ${currentNode !== null ? 'text-[#00ffff]' : 'text-gray-700'}`}>
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
                  Checking neighbor: <span className="font-bold text-white">{checkNeighbor}</span>
                </div>
              )}
            </div>
            
            {targetFound && (
              <div className="mt-2 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center font-bold animate-pulse">
                TARGET NODE {currentNode} FOUND!
              </div>
            )}
            
            {isFinished && !targetFound && targetNodeId !== null && (
              <div className="mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center font-bold">
                TARGET NOT FOUND IN GRAPH
              </div>
            )}
            
            {isFinished && targetNodeId === null && (
              <div className="mt-2 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 text-center font-bold">
                TRAVERSAL COMPLETE
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DfsVisualizer;
