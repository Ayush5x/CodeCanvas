import React, { useState, useEffect, useRef, useCallback } from 'react';
import './BfsVisualizer.css';
import { 
  FaPlay, FaPause, FaStepForward, FaRandom, FaSearch, 
  FaRedo
} from 'react-icons/fa';
import { useIsMobile } from '../../../hooks/use-mobile';

const BFS_CODE_SNIPPET = [
  { id: 1, text: "function bfs(startNode, targetNode) {" },
  { id: 2, text: "  let queue = [startNode];" },
  { id: 3, text: "  let visited = new Set([startNode]);" },
  { id: 4, text: "  while (queue.length > 0) {" },
  { id: 5, text: "    let currentNode = queue.shift();" },
  { id: 6, text: "    if (currentNode === targetNode) return true;" },
  { id: 7, text: "    for (let neighbor of getNeighbors(currentNode)) {" },
  { id: 8, text: "      if (!visited.has(neighbor)) {" },
  { id: 9, text: "        visited.add(neighbor);" },
  { id: 10, text: "        queue.push(neighbor);" },
  { id: 11, text: "      }" },
  { id: 12, text: "    }" },
  { id: 13, text: "  }" },
  { id: 14, text: "  return false;" },
  { id: 15, text: "}" }
];

function* bfsGenerator(startNodeId, targetNodeId, edges) {
  yield { line: 1 };
  
  let queue = [startNodeId];
  yield { line: 2, queue: [...queue] };
  
  let visited = new Set([startNodeId]);
  yield { line: 3, visited: new Set(visited) };
  
  let traversedEdges = [];

  while (queue.length > 0) {
    yield { line: 4 };
    
    let currentNode = queue.shift();
    yield { line: 5, queue: [...queue], currentNode };
    
    yield { line: 6 };
    if (targetNodeId !== null && currentNode === targetNodeId) {
      yield { line: 6, targetFound: true };
      return { found: true };
    }
    
    // Find neighbors (undirected graph)
    const neighbors = edges
      .filter(e => e.from === currentNode || e.to === currentNode)
      .map(e => (e.from === currentNode ? e.to : e.from));
      
    // Sort neighbors for deterministic traversal
    neighbors.sort((a, b) => a - b);
      
    yield { line: 7, neighbors: [...neighbors] };
    
    for (let neighbor of neighbors) {
      yield { line: 8, checkNeighbor: neighbor };
      
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        traversedEdges.push({ from: currentNode, to: neighbor });
        yield { line: 9, visited: new Set(visited), traversedEdges: [...traversedEdges] };
        
        queue.push(neighbor);
        yield { line: 10, queue: [...queue] };
        yield { line: 11, checkNeighbor: neighbor };
      } else {
        // Visual feedback that the condition was false and we skipped the block
        yield { line: 11, checkNeighbor: neighbor };
      }
    }
    yield { line: 12 };
  }
  yield { line: 13 };
  yield { line: 14, finished: true };
  return { found: false };
}

const BfsVisualizer = () => {
  const isMobile = useIsMobile();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  // Graph algorithm state
  const [queue, setQueue] = useState([]);
  const [visited, setVisited] = useState(new Set());
  const [traversedEdges, setTraversedEdges] = useState([]);
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
        // Keeping them within center bound to avoid clipping (15% to 85%)
        const x = 15 + Math.random() * 70;
        const y = 15 + Math.random() * 70;
        
        // Distance check using numeric px, py coordinates
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
    setQueue([]);
    setVisited(new Set());
    setTraversedEdges([]);
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
    generatorRef.current = bfsGenerator(startNodeId, target, edges);
  };

  const stepForward = useCallback(() => {
    if (!generatorRef.current) return null;
    
    const { value, done } = generatorRef.current.next();
    if (done) {
      setIsPlaying(false);
      return null;
    }
    
    if (value.line) setCurrentLine(value.line);
    if (value.queue !== undefined) setQueue(value.queue);
    if (value.visited !== undefined) setVisited(value.visited);
    if (value.traversedEdges !== undefined) setTraversedEdges(value.traversedEdges);
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
    let classes = ["bfs-node"];
    if (targetFound && id === currentNode) return classes.concat("target-found").join(" ");
    if (id === currentNode) return classes.concat("current").join(" ");
    if (queue.includes(id)) return classes.concat("queued").join(" ");
    if (visited.has(id)) return classes.concat("visited").join(" ");
    return classes.concat("unvisited").join(" ");
  };

  const isEdgeActive = (from, to) => {
    // Edge is active if we are currently checking it
    if ((from === currentNode && to === checkNeighbor) || 
        (to === currentNode && from === checkNeighbor)) {
      return true;
    }
    
    // Also glow if it's part of the actual BFS traversal tree
    return traversedEdges.some(e => 
      (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );
  };

  return (
    <div className={`bfs-visualizer-container ${isMobile ? 'mobile-view' : ''}`}>
      <div className={`bfs-header ${isMobile ? 'flex-col gap-4 text-center' : ''}`}>
        <h1 className={`${isMobile ? 'text-lg flex-wrap' : 'text-2xl'} font-bold tracking-tight text-white flex items-center gap-3 ${isMobile ? 'justify-center w-full' : 'w-max'}`}>
          <span className="text-[#00ffaa]">BFS</span> VISUALIZER
        </h1>
        
        <div className={`bfs-controls w-full flex ${isMobile ? 'flex-col gap-4' : 'justify-between'}`}>
          <div className={`flex flex-wrap gap-4 items-center ${isMobile ? 'justify-center w-full' : ''}`}>
            <div className={`control-group ${isMobile ? 'w-full justify-center' : ''}`}>
              <span className="control-label">Graph:</span>
              <select 
                className="bfs-select" 
                value={nodeCount} 
                onChange={(e) => setNodeCount(parseInt(e.target.value))}
              >
                <option value={5}>5 Nodes</option>
                <option value={8}>8 Nodes</option>
                <option value={12}>12 Nodes</option>
                <option value={15}>15 Nodes</option>
              </select>
              <button className="bfs-btn" onClick={handleScramble}>
                <FaRandom /> Scramble
              </button>
            </div>
            
            <div className="control-group relative">
              <span className="control-label">Target:</span>
              <input 
                type="text" 
                className={`bfs-input w-16 ${targetSearch !== "" && parseInt(targetSearch) >= nodes.length ? 'border-red-500 text-red-400' : ''}`} 
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
                className={`bfs-slider ${isMobile ? 'flex-1' : ''}`}
                min="0.5" 
                max="3" 
                step="0.5" 
                value={playbackSpeed} 
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              />
            </div>
          </div>
          
          <div className={`control-group ${isMobile ? 'w-full justify-center mt-2' : 'ml-auto'}`} style={{background: 'transparent', border: 'none'}}>
            <button className="bfs-btn" onClick={() => { initGenerator(); setIsPlaying(false); }}>
              <FaRedo /> Reset
            </button>
            <button className="bfs-btn primary" onClick={togglePlay}>
              {isPlaying ? <FaPause /> : <FaPlay />} {isPlaying ? "Pause" : "Play"}
            </button>
            <button className="bfs-btn" onClick={executeStep} disabled={isPlaying || targetFound || isFinished}>
              <FaStepForward /> Step
            </button>
          </div>
        </div>
      </div>

      <div className="bfs-main">
        <div className="bfs-graph-container">
          {/* Edges */}
          {edges.map((edge, i) => {
            const from = nodes.find(n => n.id === edge.from);
            const to = nodes.find(n => n.id === edge.to);
            if (!from || !to) return null;
            
            // Calculate absolute positions for SVG-like rendering, or use CSS transforms
            const isVis = isEdgeActive(from.id, to.id);
            
            return (
              <svg 
                key={`edge-${i}`}
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%', height: '100%',
                  pointerEvents: 'none',
                  zIndex: isVis ? 2 : 1
                }}
              >
                <line 
                  x1={from.x} 
                  y1={from.y} 
                  x2={to.x} 
                  y2={to.y} 
                  stroke={isVis ? "#00ffaa" : "rgba(255,255,255,0.1)"}
                  strokeWidth={isVis ? "4" : "2"}
                  style={{
                    filter: isVis ? "drop-shadow(0 0 5px rgba(0,255,170,0.8))" : "none",
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
              {node.id}
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
          ))}
        </div>

        <div className="bfs-side-panel">
          <div className="bfs-code-panel">
            {BFS_CODE_SNIPPET.map((line) => (
              <div 
                key={line.id} 
                className={`code-line ${currentLine === line.id ? 'active' : ''}`}
              >
                <div className="code-line-number">{line.id}</div>
                <div className="code-content" style={{ whiteSpace: 'pre' }}>{line.text}</div>
              </div>
            ))}
          </div>

          <div className="bfs-state-panel">
            <div>
              <div className="state-title">Data Structures</div>
              <div className="state-row mt-2">
                <span className="text-sm text-gray-400 w-16">Queue:</span>
                {queue.length === 0 ? (
                  <span className="text-xs text-gray-600">[Empty]</span>
                ) : (
                  queue.map((qId, i) => (
                    <div key={`q-${i}`} className="state-pill queue">{qId}</div>
                  ))
                )}
              </div>
              <div className="state-row mt-3">
                <span className="text-sm text-gray-400 w-16">Visited:</span>
                {visited.size === 0 ? (
                  <span className="text-xs text-gray-600">[Empty]</span>
                ) : (
                  Array.from(visited).map((vId) => (
                    <div key={`v-${vId}`} className="state-pill visited">{vId}</div>
                  ))
                )}
              </div>
            </div>
            
            <div className="mt-2">
              <div className="state-title">Variables</div>
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4 mt-2`}>
                <div className="flex flex-col bg-black/40 p-2 rounded border border-white/5">
                  <span className="text-xs text-gray-500">currentNode</span>
                  <span className={`text-lg font-bold ${currentNode !== null ? 'text-[#ff32ff]' : 'text-gray-700'}`}>
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

export default BfsVisualizer;
