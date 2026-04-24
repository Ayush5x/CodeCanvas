import React, { useState, useRef, useCallback } from "react";
import { FaPlay, FaRedo, FaPlus, FaTrash, FaLink, FaEdit, FaRandom, FaEraser, FaBook, FaTerminal, FaCode, FaCircle, FaServer, FaHistory, FaCube } from "react-icons/fa";
import Header from "../../../components/Header";

/* ------------------ CONSTANTS ------------------ */

const NODE_SIZES = {
  start: { w: 120, h: 50 },
  process: { w: 150, h: 60 },
  decision: { w: 120, h: 120 },
};

const PRESETS = {
  "Advanced Flow": {
    nodes: [
      { id: "n1", type: "start", label: "Start", x: 300, y: 50 },
      { id: "n2", type: "process", label: "Fetch Data", x: 300, y: 200 },
      { id: "n3", type: "decision", label: "Is Valid?", x: 300, y: 350 },
      { id: "n4", type: "process", label: "Process Data", x: 150, y: 550 },
      { id: "n5", type: "process", label: "Show Error", x: 450, y: 550 },
      { id: "n6", type: "start", label: "End", x: 300, y: 700 },
    ],
    edges: [
      { id: "e1", from: "n1", to: "n2" },
      { id: "e2", from: "n2", to: "n3" },
      { id: "e3", from: "n3", to: "n4", label: "Yes" },
      { id: "e4", from: "n3", to: "n5", label: "No" },
      { id: "e5", from: "n4", to: "n6" },
      { id: "e6", from: "n5", to: "n6" },
    ],
  },
};

/* ------------------ HELPERS ------------------ */

const getCenter = (n) => {
  if (!n) return { x: 0, y: 0 };
  const s = NODE_SIZES[n.type] || NODE_SIZES.process;
  return { x: n.x + s.w / 2, y: n.y + s.h / 2 };
};

const getBezierPath = (f, t) => {
  const dy = t.y - f.y;
  const curvature = 0.5;
  return `M ${f.x} ${f.y} C ${f.x} ${f.y + Math.abs(dy) * curvature}, ${t.x} ${t.y - Math.abs(dy) * curvature}, ${t.x} ${t.y}`;
};

/* ------------------ COMPONENT ------------------ */

export default function FlowchartUI() {
  const [nodes, setNodes] = useState(PRESETS["Advanced Flow"].nodes);
  const [edges, setEdges] = useState(PRESETS["Advanced Flow"].edges);
  const [activeNode, setActiveNode] = useState(null);
  const [activeEdge, setActiveEdge] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [newType, setNewType] = useState("process");
  const [linkFrom, setLinkFrom] = useState("");
  const [linkTo, setLinkTo] = useState("");

  const svgRef = useRef(null);
  const timeoutRef = useRef(null);

  /* --- Visualization Logic --- */
  const run = () => {
    clearTimeout(timeoutRef.current);
    setActiveNode(null);
    setActiveEdge(null);

    const incomingEdgesCount = {};
    nodes.forEach((n) => (incomingEdgesCount[n.id] = 0));
    edges.forEach((e) => {
      if (incomingEdgesCount[e.to] !== undefined) incomingEdgesCount[e.to]++;
    });

    let currentId = nodes.find((n) => n.type === "start" && incomingEdgesCount[n.id] === 0)?.id || nodes[0]?.id;
    if (!currentId) return;

    const step = (nodeId) => {
      setActiveNode(nodeId);
      const outgoingEdges = edges.filter((e) => e.from === nodeId);

      if (outgoingEdges.length === 0) {
        timeoutRef.current = setTimeout(() => {
          setActiveNode(null);
          setActiveEdge(null);
        }, 1000);
        return;
      }

      const nextEdge = outgoingEdges[Math.floor(Math.random() * outgoingEdges.length)];
      timeoutRef.current = setTimeout(() => {
        setActiveEdge(nextEdge.id);
        timeoutRef.current = setTimeout(() => {
          setActiveEdge(null);
          step(nextEdge.to);
        }, 500);
      }, 700);
    };
    step(currentId);
  };

  const reset = () => {
    clearTimeout(timeoutRef.current);
    setActiveNode(null);
    setActiveEdge(null);
    setSelectedNode(null);
  };

  const handleClearAll = () => {
    reset();
    setNodes([]);
    setEdges([]);
  };

  const generateRandomFlow = () => {
    handleClearAll();
    const newNodes = [];
    const newEdges = [];
    const steps = ["Auth", "Filter", "Validate", "Store", "Encrypt", "Dispatch"];
    
    newNodes.push({ id: "r1", type: "start", label: "Entry", x: 300, y: 50 });
    const middleCount = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < middleCount; i++) {
      const type = Math.random() > 0.7 ? "decision" : "process";
      newNodes.push({
        id: `r${i + 2}`,
        type: type,
        label: steps[Math.floor(Math.random() * steps.length)],
        x: 300 + (Math.random() * 100 - 50),
        y: (i + 1) * 150 + 50,
      });
      newEdges.push({ id: `re${i}`, from: `r${i + 1}`, to: `r${i + 2}` });
    }
    const lastNode = newNodes[newNodes.length - 1];
    newNodes.push({ id: "r_end", type: "start", label: "End", x: 300, y: lastNode.y + 150 });
    newEdges.push({ id: "re_end", from: lastNode.id, to: "r_end" });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleMouseDown = (e, id) => {
    if (e.button !== 0) return;
    setDraggingNode(id);
    setSelectedNode(id);
  };

  const handleMouseMove = useCallback((e) => {
    if (!draggingNode || !svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const nodeType = nodes.find((n) => n.id === draggingNode)?.type || "process";
    const s = NODE_SIZES[nodeType];
    const x = (e.clientX - svgRect.left) + svgRef.current.parentElement.scrollLeft - s.w / 2;
    const y = (e.clientY - svgRect.top) + svgRef.current.parentElement.scrollTop - s.h / 2;
    setNodes((prev) => prev.map((n) => (n.id === draggingNode ? { ...n, x, y } : n)));
  }, [draggingNode, nodes]);

  const handleMouseUp = () => setDraggingNode(null);

  const handleAddNode = () => {
    const id = `n${Date.now()}`;
    const newNode = { id, type: newType, label: newType === "decision" ? "Check" : "Step", x: 250, y: 250 };
    setNodes([...nodes, newNode]);
    setSelectedNode(id);
  };

  const handleDeleteNode = () => {
    if (!selectedNode) return;
    setNodes(nodes.filter((n) => n.id !== selectedNode));
    setEdges(edges.filter((e) => e.from !== selectedNode && e.to !== selectedNode));
    setSelectedNode(null);
  };

  const handleLinkNodes = () => {
    if (!linkFrom || !linkTo || linkFrom === linkTo) return;
    setEdges([...edges, { id: `e${Date.now()}`, from: linkFrom, to: linkTo }]);
    setLinkFrom(""); setLinkTo("");
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <Header />
      
      {/* --- BENTO BOX HEADER --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-[1800px] mx-auto px-6 mb-10 h-auto md:h-[180px]">
        
        {/* Main Title Tile */}
        <div 
          className="md:col-span-1 md:row-span-2 group bg-neutral-900/40 border border-white/10 rounded-[32px] p-8 flex flex-col justify-center relative overflow-hidden transition-all duration-500 hover:border-[#00E5FF]/30"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00E5FF] blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity" />
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase font-title leading-tight">
            Flow<br/><span className="text-[#00E5FF]">Visualizer</span>
          </h1>
          <p className="mt-2 text-neutral-500 text-[10px] font-mono uppercase tracking-[0.2em]">
            // logic.engine_v2.0
          </p>
        </div>

        {/* Complexity Tile */}
        <div className="bg-[#00E5FF]/[0.03] border border-[#00E5FF]/20 rounded-[28px] p-6 flex items-center gap-4 transition-all hover:bg-[#00E5FF]/[0.06]">
          <div className="w-12 h-12 rounded-2xl bg-[#00E5FF] flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            <FaCube className="text-xl" />
          </div>
          <div>
            <div className="text-[10px] font-black text-[#00E5FF] uppercase tracking-widest">Logic</div>
            <div className="text-xl font-bold font-title">O(N + E)</div>
          </div>
        </div>

        {/* Status Tile */}
        <div className="bg-neutral-900/40 border border-white/10 rounded-[28px] p-6 flex items-center gap-4 transition-all hover:border-white/20">
          <div className="relative flex items-center justify-center w-12 h-12">
            <div className="w-3 h-3 bg-[#00E5FF] rounded-full shadow-[0_0_15px_#00E5FF]" />
            <div className="absolute w-3 h-3 bg-[#00E5FF] rounded-full animate-ping opacity-40" />
          </div>
          <div>
            <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Engine</div>
            <div className="text-xl font-bold font-title tracking-wider">READY</div>
          </div>
        </div>

        {/* Info/Stats Tile (Wide) */}
        <div className="md:col-span-2 bg-neutral-900/40 border border-white/10 rounded-[28px] px-8 py-4 flex items-center justify-between transition-all hover:border-white/20 group">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-500 font-mono uppercase">Nodes Active</span>
            <span className="text-lg font-bold text-[#00E5FF]">{nodes.length}</span>
          </div>
          <div className="flex-1 max-w-[200px] h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent mx-8 group-hover:scale-x-110 transition-transform duration-700" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-neutral-500 font-mono uppercase">Edges Mapped</span>
            <span className="text-lg font-bold text-[#00E5FF]">{edges.length}</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE EDITOR */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-320px)] border-y border-white/5 mx-auto max-w-[1800px]">
        
        {/* SIDEBAR: CONTROLS */}
        <div className="w-full lg:w-[320px] p-6 border-r border-white/5 flex flex-col gap-6 bg-neutral-900/20 backdrop-blur-xl shrink-0 overflow-y-auto">
          <div className="flex flex-col gap-3">
            <button className="btn-primary" style={{backgroundColor:'#00E5FF'}} onClick={run}><FaPlay /> Run Simulation</button>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-secondary" onClick={generateRandomFlow}><FaRandom /> Random</button>
              <button className="btn-secondary text-red-400 border-red-900/20" onClick={handleClearAll}><FaEraser /> Reset</button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass p-5 rounded-2xl flex flex-col gap-4 border border-white/5">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
                <FaPlus className="text-[8px]" /> New Component
              </h2>
              <select 
                value={newType} 
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#00E5FF]/50 transition-colors"
              >
                <option value="process">Standard Step</option>
                <option value="decision">Logic Decision</option>
                <option value="start">Terminal Node</option>
              </select>
              <button onClick={handleAddNode} className="btn-secondary w-full py-3">Add to Canvas</button>
            </div>

            <div className="glass p-5 rounded-2xl flex flex-col gap-4 border border-white/5">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
                <FaLink className="text-[8px]" /> Connection
              </h2>
              <div className="flex gap-2">
                <select value={linkFrom} onChange={(e) => setLinkFrom(e.target.value)} className="w-1/2 bg-black/40 border border-white/10 rounded-xl p-2 text-xs">
                  <option value="">Source</option>
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                </select>
                <select value={linkTo} onChange={(e) => setLinkTo(e.target.value)} className="w-1/2 bg-black/40 border border-white/10 rounded-xl p-2 text-xs">
                  <option value="">Target</option>
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                </select>
              </div>
              <button onClick={handleLinkNodes} className="btn-secondary w-full py-3">Create Edge</button>
            </div>

            {selectedNode && (
              <div className="glass p-5 rounded-2xl flex flex-col gap-4 border-[#00E5FF]/30 border bg-[#00E5FF]/5">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
                  <FaEdit className="text-[8px]" /> Properties
                </h2>
                <input
                  type="text"
                  value={nodes.find(n => n.id === selectedNode)?.label || ""}
                  onChange={(e) => setNodes(nodes.map(n => n.id === selectedNode ? { ...n, label: e.target.value } : n))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-emerald-500/50"
                  placeholder="Node Label"
                />
                <button onClick={handleDeleteNode} className="btn-secondary w-full py-3 text-red-400 border-red-500/20 hover:bg-red-500/10"><FaTrash /> Delete Node</button>
              </div>
            )}
          </div>
        </div>

        {/* CANVAS */}
        <div className="flex-1 relative bg-[#050505] overflow-hidden">
          <svg 
            ref={svgRef} width="100%" height="100%"
            onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
            onMouseDown={(e) => e.target.tagName === 'svg' && setSelectedNode(null)}
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.05)" />
              </pattern>
              <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.3)" />
              </marker>
              <marker id="arrow-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="white" />
              </marker>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {edges.map((e) => {
              const f = getCenter(nodes.find(n => n.id === e.from));
              const t = getCenter(nodes.find(n => n.id === e.to));
              if (!f || !t) return null;
              const path = getBezierPath(f, t);
              const active = activeEdge === e.id;
              return (
                <path
                  key={e.id} d={path} fill="none"
                  stroke={active ? "white" : "rgba(255,255,255,0.1)"}
                  strokeWidth={active ? "3" : "1.5"}
                  markerEnd={active ? "url(#arrow-active)" : "url(#arrow)"}
                  style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                />
              );
            })}
            {nodes.map((n) => {
              const size = NODE_SIZES[n.type];
              const isSelected = selectedNode === n.id;
              const isActive = activeNode === n.id;
              const stateClass = isActive ? "fill-white/20 stroke-white" : isSelected ? "fill-white/10 stroke-white" : "fill-black/40 stroke-white/10";
              return (
                <g key={n.id} transform={`translate(${n.x},${n.y})`} onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, n.id); }} style={{ cursor: 'grab' }}>
                  {n.type === "process" && <rect width={size.w} height={size.h} rx="4" className={stateClass} strokeWidth="2" />}
                  {n.type === "start" && <rect width={size.w} height={size.h} rx="30" className={stateClass} strokeWidth="2" />}
                  {n.type === "decision" && (
                    <polygon points={`${size.w/2},0 ${size.w},${size.h/2} ${size.w/2},${size.h} 0,${size.h/2}`} className={stateClass} strokeWidth="2" />
                  )}
                  <text x={size.w / 2} y={size.h / 2} textAnchor="middle" dominantBaseline="middle" className="text-xs fill-white/80 uppercase tracking-tighter pointer-events-none">
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      {/* SECTION 2: SYSTEM ANALYSIS (Visible upon scrolling down) */}
      {/* SECTION 2: SYSTEM ANALYSIS */}
      <div className="bg-[#050505] py-20">
        <div className="max-w-[1800px] mx-auto px-6 flex flex-col gap-16">
          
          {/* TOP ROW: HEADERS */}
          <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1 flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                      <FaBook className="text-[#00E5FF]/40" />
                      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/90">System Manifest</h2>
                  </div>
                  <section className="glass p-8 rounded-3xl flex flex-col gap-6 border border-white/5 bg-white/[0.01]">
                      <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest">Operational Status</span>
                        <div className="flex items-center gap-2">
                            <FaCircle className={`text-[6px] ${activeNode ? 'text-[#00E5FF] animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'text-white/10'}`} />
                            <span className="text-[10px] font-mono tracking-tighter text-[#00E5FF]">{activeNode ? 'EXECUTING_LOGIC' : 'STANDBY'}</span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-neutral-400">
                        The rendering engine utilizes an SVG-based coordinate system. Node positions are persistent within the session state, mapped to a grid-constrained viewport with dynamic Bezier path calculation for edge connectivity.
                      </p>
                  </section>
              </div>

              <div className="w-full lg:w-[400px]">
                  <div className="flex items-center gap-2 mb-6">
                      <FaHistory className="text-[#00E5FF]/40 text-sm" />
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-[#00E5FF]/60">Execution Logs</h3>
                  </div>
                  <div className="h-[200px] bg-black/40 border border-white/5 rounded-2xl p-5 font-mono text-[11px] text-white/30 overflow-y-auto space-y-2 scrollbar-thin">
                      <p><span className="text-white/10">[03:10:01]</span> Kernel.Initialize: Done</p>
                      <p><span className="text-white/10">[03:10:02]</span> Canvas.RenderGrid: Success</p>
                      <p><span className="text-white/10">[03:10:05]</span> State.Sync: Active</p>
                      <p className="text-[#00E5FF]/50"><span className="text-[#00E5FF]/20">[03:10:45]</span> User.Action: Simulation_Triggered</p>
                  </div>
              </div>
          </div>

          {/* BOTTOM ROW: TABLES & GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* AUDIT TABLE */}
              <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                      <FaServer className="text-[#00E5FF]/40 text-sm" />
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-[#00E5FF]/60">Resource Audit</h3>
                  </div>
                  <div className="glass rounded-2xl overflow-hidden border border-white/5">
                      <table className="w-full text-left border-collapse">
                          <thead>
                          <tr className="bg-white/5 text-[9px] uppercase text-white/40 tracking-widest">
                              <th className="p-4 font-bold">Internal Metric</th>
                              <th className="p-4 font-bold">Measured Value</th>
                              <th className="p-4 font-bold">Safety Status</th>
                          </tr>
                          </thead>
                          <tbody className="text-[12px] font-mono text-white/60">
                          <tr className="border-b border-white/5 hover:bg-[#00E5FF]/5 transition-colors">
                              <td className="p-4">Heap Latency</td>
                              <td className="p-4 text-white">12.2ms</td>
                              <td className="p-4 text-[#00E5FF] font-bold">STABLE</td>
                          </tr>
                          <tr className="border-b border-white/5 hover:bg-[#00E5FF]/5 transition-colors">
                              <td className="p-4">Node Complexity</td>
                              <td className="p-4 text-white">{nodes.length} Elements</td>
                              <td className="p-4 text-[#00E5FF] font-bold">NOMINAL</td>
                          </tr>
                          <tr className="hover:bg-[#00E5FF]/5 transition-colors">
                              <td className="p-4">SVG Pathing</td>
                              <td className="p-4 text-white">Dynamic Bezier</td>
                              <td className="p-4 text-[#00E5FF]/40 uppercase">Active_Engine</td>
                          </tr>
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* DEPENDENCIES */}
              <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                      <FaCube className="text-[#00E5FF]/40 text-sm" />
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-[#00E5FF]/60">Tech Stack Manifest</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="glass p-6 rounded-2xl border-white/5 flex flex-col gap-1 hover:border-[#00E5FF]/20 transition-colors bg-white/[0.01]">
                          <p className="text-[9px] text-[#00E5FF]/40 uppercase font-black tracking-widest">Core</p>
                          <p className="text-sm text-white/80 font-medium">React 18 Engine</p>
                      </div>
                      <div className="glass p-6 rounded-2xl border-white/5 flex flex-col gap-1 hover:border-[#00E5FF]/20 transition-colors bg-white/[0.01]">
                          <p className="text-[9px] text-[#00E5FF]/40 uppercase font-black tracking-widest">Style</p>
                          <p className="text-sm text-white/80 font-medium">Tailwind CSS</p>
                      </div>
                      <div className="glass p-6 rounded-2xl border-white/5 flex flex-col gap-1 hover:border-[#00E5FF]/20 transition-colors bg-white/[0.01]">
                          <p className="text-[9px] text-[#00E5FF]/40 uppercase font-black tracking-widest">Icons</p>
                          <p className="text-sm text-white/80 font-medium">Lucide + React Icons</p>
                      </div>
                      <div className="glass p-6 rounded-2xl border-white/5 flex flex-col gap-1 hover:border-[#00E5FF]/20 transition-colors bg-white/[0.01]">
                          <p className="text-[9px] text-[#00E5FF]/40 uppercase font-black tracking-widest">Geometry</p>
                          <p className="text-sm text-white/80 font-medium">Native SVG API</p>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>

      <style>{`
        .glass { background: rgba(255,255,255,0.02); backdrop-filter: blur(20px); }
        .btn-primary { background: white; color: black; padding: 12px; border-radius: 6px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.85rem; font-weight: 800; text-transform: uppercase; transition: 0.2s; }
        .btn-primary:hover { background: #ccc; transform: translateY(-1px); }
        .btn-secondary { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 8px; border-radius: 6px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.75rem; transition: 0.2s; }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); }
        
        /* Custom Scrollbar for the whole page */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}