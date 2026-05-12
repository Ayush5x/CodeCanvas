import React, { useState, useEffect, useRef, useCallback } from 'react';
import './BstVisualizer.css';
import { 
  FaPlay, FaPause, FaStepForward, FaRandom, FaSearch, 
  FaRedo, FaPlus
} from 'react-icons/fa';
import { useIsMobile } from '../../../hooks/use-mobile';

const BST_CODE_SNIPPET = [
  { id: 1, text: "function search(root, target) {" },
  { id: 2, text: "  if (root === null) {" },
  { id: 3, text: "    return null; // Base case: not found" },
  { id: 4, text: "  }" },
  { id: 5, text: "  if (root.val === target) {" },
  { id: 6, text: "    return root; // Found target!" },
  { id: 7, text: "  }" },
  { id: 8, text: "  if (target < root.val) {" },
  { id: 9, text: "    return search(root.left, target);" },
  { id: 10, text: "  } else {" },
  { id: 11, text: "    return search(root.right, target);" },
  { id: 12, text: "  }" },
  { id: 13, text: "}" }
];

// Tree Node Structure
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.id = Math.random().toString(36).substr(2, 9);
    // For visualization
    this.x = 0;
    this.y = 0;
  }
}

const BstVisualizer = () => {
  const isMobile = useIsMobile();
  const [root, setRoot] = useState(null);
  const [flatNodes, setFlatNodes] = useState([]); // Nodes as a flat list for easier rendering
  const [edges, setEdges] = useState([]);
  
  // Search state
  const [searchTarget, setSearchTarget] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentLine, setCurrentLine] = useState(null);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [searchPath, setSearchPath] = useState([]); // List of node IDs in path
  const [foundStatus, setFoundStatus] = useState(null); // 'found', 'not-found', or null
  const [activeEdgeId, setActiveEdgeId] = useState(null); // For directional pulse
  
  const generatorRef = useRef(null);
  const timeoutRef = useRef(null);
  const canvasRef = useRef(null);

  // --- Tree Construction Logic ---
  const insertNode = (root, val) => {
    if (!root) return new TreeNode(val);
    if (val < root.val) {
      root.left = insertNode(root.left, val);
    } else if (val > root.val) {
      root.right = insertNode(root.right, val);
    }
    return root;
  };

  const buildTreeFromList = (vals) => {
    let newRoot = null;
    vals.forEach(v => {
      newRoot = insertNode(newRoot, v);
    });
    return newRoot;
  };

  // --- Layout Calculation ---
  const calculateLayout = useCallback((node, depth = 0, x = 400, xOffset = 200) => {
    if (!node) return [];
    
    node.x = x;
    node.y = depth * 80 + 50;
    
    let result = [node];
    let leftNodes = calculateLayout(node.left, depth + 1, x - xOffset, xOffset / 2);
    let rightNodes = calculateLayout(node.right, depth + 1, x + xOffset, xOffset / 2);
    
    return [...result, ...leftNodes, ...rightNodes];
  }, []);

  const updateTreeState = (newRoot) => {
    const flattened = calculateLayout(newRoot);
    const newEdges = [];
    
    const findEdges = (node) => {
      if (!node) return;
      if (node.left) {
        newEdges.push({ from: node, to: node.left, id: `${node.id}-${node.left.id}` });
        findEdges(node.left);
      }
      if (node.right) {
        newEdges.push({ from: node, to: node.right, id: `${node.id}-${node.right.id}` });
        findEdges(node.right);
      }
    };
    
    findEdges(newRoot);
    setRoot(newRoot);
    setFlatNodes(flattened);
    setEdges(newEdges);
    resetSearchState();
  };

  const generateRandomTree = () => {
    const vals = [];
    while (vals.length < 10) {
      const v = Math.floor(Math.random() * 99) + 1;
      if (!vals.includes(v)) vals.push(v);
    }
    const newRoot = buildTreeFromList(vals);
    updateTreeState(newRoot);
  };

  const resetSearchState = () => {
    setIsSearching(false);
    setIsPlaying(false);
    setCurrentLine(null);
    setCurrentNodeId(null);
    setSearchPath([]);
    setFoundStatus(null);
    setActiveEdgeId(null);
    generatorRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    generateRandomTree();
  }, []);

  // --- Search Algorithm Generator ---
  function* searchGenerator(node, target) {
    yield { line: 1, nodeId: node ? node.id : null };
    
    yield { line: 2, nodeId: node ? node.id : null };
    if (!node) {
      yield { line: 3, nodeId: null, status: 'not-found' };
      return;
    }
    yield { line: 4, nodeId: node.id };
    
    yield { line: 5, nodeId: node.id };
    if (node.val === target) {
      yield { line: 6, nodeId: node.id, status: 'found' };
      return;
    }
    yield { line: 7, nodeId: node.id };
    
    yield { line: 8, nodeId: node.id };
    if (target < node.val) {
      const edgeId = node.left ? `${node.id}-${node.left.id}` : null;
      yield { line: 9, nodeId: node.id, activeEdgeId: edgeId };
      yield* searchGenerator(node.left, target);
    } else {
      const edgeId = node.right ? `${node.id}-${node.right.id}` : null;
      yield { line: 10, nodeId: node.id };
      yield { line: 11, nodeId: node.id, activeEdgeId: edgeId };
      yield* searchGenerator(node.right, target);
    }
    yield { line: 12, nodeId: node ? node.id : null };
  }

  // --- Control Handlers ---
  const handleSearch = () => {
    const val = parseInt(searchTarget);
    if (isNaN(val)) return;
    
    resetSearchState();
    setIsSearching(true);
    generatorRef.current = searchGenerator(root, val);
    // Auto start
    stepForward();
  };

  const stepForward = useCallback(() => {
    if (!generatorRef.current) return null;
    
    const { value, done } = generatorRef.current.next();
    if (done) {
      setIsPlaying(false);
      return null;
    }
    
    setCurrentLine(value.line);
    setCurrentNodeId(value.nodeId);
    if (value.nodeId && !searchPath.includes(value.nodeId)) {
      setSearchPath(prev => [...prev, value.nodeId]);
    }
    if (value.status) setFoundStatus(value.status);
    if (value.activeEdgeId) {
      setActiveEdgeId(value.activeEdgeId);
      // Clear edge pulse after a short delay
      setTimeout(() => setActiveEdgeId(null), 500);
    }
    
    return value;
  }, [searchPath]);

  const togglePlay = () => {
    if (!isSearching) {
      handleSearch();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      const run = () => {
        const val = stepForward();
        if (val && !val.status) {
          timeoutRef.current = setTimeout(run, 1000 / playbackSpeed);
        } else {
          setIsPlaying(false);
        }
      };
      timeoutRef.current = setTimeout(run, 1000 / playbackSpeed);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [isPlaying, playbackSpeed, stepForward]);

  return (
    <div className={`bst-visualizer-container ${isMobile ? 'mobile-view' : ''}`}>
      <div className={`bst-header ${isMobile ? 'flex-col gap-4 text-center' : ''}`}>
        <h1 className={`${isMobile ? 'text-lg flex-wrap' : 'text-2xl'} font-bold tracking-tight text-white flex items-center gap-3 ${isMobile ? 'justify-center w-full' : 'w-max'}`}>
          <span className="text-[#00f3ff]">BST</span> VISUALIZER
        </h1>
        
        <div className={`bst-controls w-full flex ${isMobile ? 'flex-col gap-4' : 'justify-between'}`}>
          <div className={`flex flex-wrap gap-4 items-center ${isMobile ? 'justify-center w-full' : ''}`}>
            <div className={`control-group ${isMobile ? 'w-full justify-center' : ''}`}>
              <span className="control-label">Tree:</span>
              <button className="bst-btn" onClick={generateRandomTree}>
                <FaRandom /> Random
              </button>
            </div>
            
            <div className="control-group">
              <span className="control-label">Search:</span>
              <input 
                type="text" 
                className="bst-input" 
                placeholder="Val"
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="bst-btn primary" onClick={handleSearch}>
                <FaSearch /> Find
              </button>
            </div>
            
            <div className={`control-group ${isMobile ? 'w-full justify-center' : ''}`}>
              <span className="control-label">Speed: {playbackSpeed}x</span>
              <input 
                type="range" 
                className={`bst-slider ${isMobile ? 'flex-1' : ''}`}
                min="0.5" 
                max="3" 
                step="0.5" 
                value={playbackSpeed} 
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              />
            </div>
          </div>
          
          <div className={`control-group ${isMobile ? 'w-full justify-center mt-2' : 'ml-auto'}`} style={{background: 'transparent', border: 'none'}}>
            <button className="bst-btn" onClick={resetSearchState}>
              <FaRedo /> Reset
            </button>
            <button className="bst-btn primary" onClick={togglePlay}>
              {isPlaying ? <FaPause /> : <FaPlay />} {isPlaying ? "Pause" : "Play"}
            </button>
            <button className="bst-btn" onClick={stepForward} disabled={isPlaying || foundStatus}>
              <FaStepForward /> Step
            </button>
          </div>
        </div>
      </div>

      <div className="bst-main">
        <div className="bst-viz-panel">
          <svg className="bst-tree-svg" viewBox="0 0 800 600">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Render Edges */}
            {edges.map((edge) => {
              const isActive = activeEdgeId === edge.id;
              const isPath = searchPath.includes(edge.from.id) && searchPath.includes(edge.to.id);
              
              return (
                <line
                  key={edge.id}
                  x1={edge.from.x}
                  y1={edge.from.y}
                  x2={edge.to.x}
                  y2={edge.to.y}
                  className={`bst-edge ${isActive ? 'directional-pulse' : ''} ${isPath ? 'edge-path' : ''}`}
                />
              );
            })}
            
            {/* Render Nodes */}
            {flatNodes.map((node) => {
              const isActive = currentNodeId === node.id;
              const isPath = searchPath.includes(node.id);
              const isFound = foundStatus === 'found' && node.id === currentNodeId;
              
              let nodeClass = "bst-node-group";
              if (isFound) nodeClass += " node-success";
              else if (isActive) nodeClass += " node-active";
              else if (isPath) nodeClass += " node-path";
              
              return (
                <g key={node.id} transform={`translate(${node.x},${node.y})`} className={nodeClass}>
                  <circle r="22" className="bst-node-circle" />
                  <text className="bst-node-text">{node.val}</text>
                </g>
              );
            })}
            
            {/* Null Indicator if applicable */}
            {foundStatus === 'not-found' && (
               <g transform={`translate(400, 500)`} className="node-null">
                  <circle r="22" className="bst-node-circle" fill="rgba(255,0,0,0.1)" />
                  <text className="bst-node-text" fill="#ff3e3e">NULL</text>
               </g>
            )}
          </svg>
        </div>

        <div className="bst-side-panel">
          <div className="bst-code-panel">
            {BST_CODE_SNIPPET.map((line) => (
              <div 
                key={line.id} 
                className={`code-line ${currentLine === line.id ? 'active' : ''}`}
              >
                <div className="code-line-number">{line.id}</div>
                <div className="code-content" style={{ whiteSpace: 'pre' }}>{line.text}</div>
              </div>
            ))}
          </div>

          <div className="bst-state-panel">
            <div className="state-title">Search Telemetry</div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-xs text-gray-400">Target Value</span>
                <span className="text-lg font-bold text-[#00f3ff]">{searchTarget || '-'}</span>
              </div>
              
              <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-xs text-gray-400">Nodes Traversed</span>
                <span className="text-lg font-bold text-white">{searchPath.length}</span>
              </div>
              
              <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-xs text-gray-400">Status</span>
                <span className={`text-sm font-bold px-3 py-1 rounded ${
                  foundStatus === 'found' ? 'bg-green-500/20 text-green-400' : 
                  foundStatus === 'not-found' ? 'bg-red-500/20 text-red-400' : 
                  isSearching ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500'
                }`}>
                  {foundStatus === 'found' ? 'TARGET FOUND' : 
                   foundStatus === 'not-found' ? 'NOT FOUND' : 
                   isSearching ? 'SEARCHING...' : 'IDLE'}
                </span>
              </div>
            </div>
            
            {foundStatus === 'found' && (
              <div className="mt-2 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center font-bold animate-pulse">
                ELEMENT {searchTarget} DISCOVERED
              </div>
            )}
            
            {foundStatus === 'not-found' && (
              <div className="mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center font-bold">
                ELEMENT NOT IN TREE
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BstVisualizer;
