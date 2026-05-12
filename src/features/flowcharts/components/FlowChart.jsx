import React, { useState, useRef, useCallback, useEffect } from "react";
import { 
  FaPlay, FaRedo, FaPlus, FaTrash, FaLink, 
  FaEdit, FaRandom, FaEraser, FaTerminal, 
  FaBook, FaMicrochip, FaCircle 
} from "react-icons/fa";

/* ------------------ CONSTANTS ------------------ */

const NODE_SIZES = {
  start: { w: 120, h: 50 },
  process: { w: 150, h: 60 },
  decision: { w: 120, h: 120 },
};

const TASK_POOL = [
  "Initialize Kernel", "Fetch API Data", "Validate JWT", "Parsing JSON",
  "Encrypting Payload", "Compressing Assets", "Syncing Database", "Notify Webhook",
  "Checking Cache", "Authorize User", "Cleanup Files", "Ping Service"
];

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

/* ------------------ MAIN COMPONENT ------------------ */

export default function FlowchartUltra() {
  const [nodes, setNodes] = useState([
    { id: "n1", type: "start", label: "START", x: 350, y: 50 },
    { id: "n2", type: "process", label: "INITIALIZE", x: 350, y: 180 }
  ]);
  const [edges, setEdges] = useState([{ id: "e1", from: "n1", to: "n2" }]);
  
  const [activeNode, setActiveNode] = useState(null);
  const [activeEdge, setActiveEdge] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [logs, setLogs] = useState(["System ready...", "Kernel loaded."]);
  
  const [newType, setNewType] = useState("process");
  const [linkFrom, setLinkFrom] = useState("");
  const [linkTo, setLinkTo] = useState("");

  const svgRef = useRef(null);
  const timeoutRef = useRef(null);

  /* --- Logic: Execution --- */
  const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 10));

  const run = () => {
    clearTimeout(timeoutRef.current);
    addLog("Starting execution sequence...");
    
    let currentId = nodes.find(n => n.type === 'start')?.id || nodes[0]?.id;
    if (!currentId) return;

    const step = (nodeId) => {
      const node = nodes.find(n => n.id === nodeId);
      setActiveNode(nodeId);
      addLog(`Executing: ${node?.label || 'Unknown'}`);
      
      const outgoing = edges.filter(e => e.from === nodeId);
      if (outgoing.length === 0) {
        timeoutRef.current = setTimeout(() => {
          setActiveNode(null);
          addLog("Sequence complete.");
        }, 1000);
        return;
      }

      const nextEdge = outgoing[Math.floor(Math.random() * outgoing.length)];
      timeoutRef.current = setTimeout(() => {
        setActiveEdge(nextEdge.id);
        timeoutRef.current = setTimeout(() => {
          setActiveEdge(null);
          step(nextEdge.to);
        }, 600);
      }, 800);
    };
    step(currentId);
  };

  /* --- Logic: Generators --- */
  const clearAll = () => {
    clearTimeout(timeoutRef.current);
    setNodes([]);
    setEdges([]);
    setLogs(["Canvas wiped clean."]);
    setActiveNode(null);
    setSelectedNode(null);
  };

  const generateRandomFlow = () => {
    clearAll();
    const newNodes = [];
    const newEdges = [];
    
    newNodes.push({ id: "r1", type: "start", label: "ENTRY", x: 350, y: 50 });
    const count = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < count; i++) {
      const type = Math.random() > 0.7 ? "decision" : "process";
      newNodes.push({
        id: `r${i+2}`,
        type,
        label: TASK_POOL[Math.floor(Math.random() * TASK_POOL.length)],
        x: 350 + (Math.random() * 40 - 20),
        y: (i + 1) * 160 + 50
      });
      newEdges.push({ id: `re${i}`, from: `r${i+1}`, to: `r${i+2}` });
    }
    setNodes(newNodes);
    setEdges(newEdges);
    addLog("Randomized logic path generated.");
  };

  /* --- Logic: Interactions --- */
  const handleMouseDown = (e, id) => { if (e.button === 0) { setDraggingNode(id); setSelectedNode(id); } };
  
  const handleMouseMove = useCallback((e) => {
    if (!draggingNode || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const s = NODE_SIZES[nodes.find(n => n.id === draggingNode).type];
    setNodes(prev => prev.map(n => n.id === draggingNode ? { 
      ...n, x: e.clientX - rect.left - s.w/2, y: e.clientY - rect.top - s.h/2 
    } : n));
  }, [draggingNode, nodes]);

  const handleMouseUp = () => setDraggingNode(null);

  const handleLinkNodes = () => {
    if (!linkFrom || !linkTo || linkFrom === linkTo) return;
    setEdges([...edges, { id: `e${Date.now()}`, from: linkFrom, to: linkTo }]);
    addLog(`Link established: ${linkFrom} -> ${linkTo}`);
    setLinkFrom(""); setLinkTo("");
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-white flex font-sans overflow-hidden">
      
      {/* 1. LEFT SIDEBAR: CONTROLS */}
      <div className="w-[300px] p-6 border-r border-white/5 flex flex-col gap-6 bg-black/40 backdrop-blur-xl">
        <header>
          <h1 className="text-lg font-black tracking-widest text-white uppercase italic">
            Flow<span className="text-white/30 font-light">Engine</span>
          </h1>
          <p className="text-[10px] text-white/20 tracking-widest">B/W GLASS EDITION</p>
        </header>

        <div className="flex flex-col gap-2">
          <button className="btn-main" onClick={run}><FaPlay className="text-[10px]" /> Run Sequence</button>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-glass" onClick={generateRandomFlow}><FaRandom /> Random</button>
            <button className="btn-glass text-red-500 border-red-950/20" onClick={clearAll}><FaEraser /> Wipe</button>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl">
          <h2 className="panel-title"><FaPlus /> Construct</h2>
          <select value={newType} onChange={(e) => setNewType(e.target.value)} className="input-field mb-2">
            <option value="process">Action Node</option>
            <option value="decision">Logic Gate</option>
            <option value="start">Terminal</option>
          </select>
          <button onClick={() => {
            const id = `n${Date.now()}`;
            setNodes([...nodes, { id, type: newType, label: "NEW_NODE", x: 300, y: 300 }]);
            setSelectedNode(id);
          }} className="btn-glass w-full text-xs">Instantiate</button>
        </div>

        <div className="glass-panel p-4 rounded-xl">
          <h2 className="panel-title"><FaLink /> Connection</h2>
          <div className="flex gap-2 mb-2">
            <select value={linkFrom} onChange={(e) => setLinkFrom(e.target.value)} className="input-field text-[10px]">
              <option value="">Src</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
            <select value={linkTo} onChange={(e) => setLinkTo(e.target.value)} className="input-field text-[10px]">
              <option value="">Dest</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
          <button onClick={handleLinkNodes} className="btn-glass w-full text-xs">Bridge</button>
        </div>
      </div>

      {/* 2. CENTER: CANVAS */}
      <div className="flex-1 relative bg-[#020202]">
        <svg ref={svgRef} className="w-full h-full" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
          <defs>
            <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.03)" />
            </pattern>
            <marker id="arr" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill="rgba(255,255,255,0.15)" />
            </marker>
            <marker id="arr-active" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill="white" />
            </marker>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotGrid)" />

          {edges.map(e => {
            const f = getCenter(nodes.find(n => n.id === e.from));
            const t = getCenter(nodes.find(n => n.id === e.to));
            if (!f || !t) return null;
            const active = activeEdge === e.id;
            return (
              <path key={e.id} d={getBezierPath(f, t)} fill="none" 
                stroke={active ? "white" : "rgba(255,255,255,0.08)"}
                strokeWidth={active ? 3 : 1} markerEnd={active ? "url(#arr-active)" : "url(#arr)"}
                className="transition-all duration-300" 
              />
            );
          })}

          {nodes.map(n => {
            const size = NODE_SIZES[n.type];
            const active = activeNode === n.id;
            const selected = selectedNode === n.id;
            const baseStyles = `transition-all duration-300 cursor-grab ${
              active ? "fill-white/20 stroke-white" : selected ? "fill-white/10 stroke-white/60" : "fill-black stroke-white/10"
            }`;

            return (
              <g key={n.id} transform={`translate(${n.x},${n.y})`} onMouseDown={(e) => handleMouseDown(e, n.id)}>
                {n.type === "process" && <rect width={size.w} height={size.h} rx="4" className={baseStyles} strokeWidth="1.5" />}
                {n.type === "start" && <rect width={size.w} height={size.h} rx="25" className={baseStyles} strokeWidth="1.5" />}
                {n.type === "decision" && (
                  <polygon points={`${size.w/2},0 ${size.w},${size.h/2} ${size.w/2},${size.h} 0,${size.h/2}`} className={baseStyles} strokeWidth="1.5" />
                )}
                <text x={size.w/2} y={size.h/2} textAnchor="middle" dominantBaseline="middle" className="text-[10px] fill-white/80 font-bold tracking-widest uppercase pointer-events-none">
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 3. RIGHT SIDEBAR: DOCS & MONITOR */}
      <div className="w-[350px] p-6 border-l border-white/5 flex flex-col gap-6 bg-black/40 backdrop-blur-xl">
        
        {/* EXECUTION MONITOR */}
        <section className="glass-panel p-5 rounded-2xl border-white/10 bg-white/5">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <FaTerminal className="text-white/40 text-xs" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Monitor</h3>
            </div>
            <div className="flex items-center gap-2 text-[9px] text-white/40">
              <FaCircle className={activeNode ? "text-white animate-pulse" : "text-white/10"} />
              {activeNode ? "ACTIVE" : "IDLE"}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-[9px] text-white/30 uppercase mb-1">Instruction Pipe</p>
              <div className="bg-black/40 p-2 rounded border border-white/5 font-mono text-[11px] text-white/90">
                {activeNode ? `EXEC >> ${nodes.find(n => n.id === activeNode)?.label}` : "NULL_PTR"}
              </div>
            </div>
            
            <div className="bg-black/20 rounded p-2 overflow-hidden h-32 flex flex-col gap-1 font-mono text-[9px]">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2 opacity-60">
                  <span className="text-white/20">[{i}]</span>
                  <span className="truncate text-white/80">&gt; {log}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DOCUMENTATION SECTION */}
        <section className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <FaBook className="text-white/40 text-xs" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Documentation</h3>
          </div>

          <article className="text-[11px] leading-relaxed text-white/50 space-y-4">
            <div className="space-y-1">
              <h4 className="text-white/80 font-bold uppercase tracking-tighter text-[10px]">Graph Engine v1.0</h4>
              <p>This engine utilizes a <strong>Directed Acyclic Graph (DAG)</strong> structure. Every node is an object in a state-array connected by edge pointers.</p>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="font-bold text-white mb-1 tracking-tighter">Node Types:</p>
              <ul className="space-y-1 list-disc list-inside opacity-80">
                <li><span className="text-white">Terminal:</span> Rounded entry points.</li>
                <li><span className="text-white">Action:</span> Logical task units.</li>
                <li><span className="text-white">Gate:</span> Decision/Branch points.</li>
              </ul>
            </div>

            <div className="space-y-1">
              <h4 className="text-white/80 font-bold uppercase tracking-tighter text-[10px]">Hotkeys & Controls</h4>
              <p>Drag nodes to update spatial coordinates. Use the <strong>Instantiate</strong> panel to inject new logical steps into the grid.</p>
            </div>
          </article>
        </section>

        {/* EDIT PANEL (Contextual) */}
        {selectedNode && (
          <div className="mt-auto p-4 rounded-xl border border-white/20 bg-white/5 animate-in slide-in-from-bottom-4 duration-300">
             <div className="flex justify-between items-center mb-3">
               <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Edit Node</span>
               <button onClick={() => {
                 setNodes(nodes.filter(n => n.id !== selectedNode));
                 setEdges(edges.filter(e => e.from !== selectedNode && e.to !== selectedNode));
                 setSelectedNode(null);
               }} className="text-red-500 text-xs"><FaTrash /></button>
             </div>
             <input 
               type="text" 
               className="input-field mb-2" 
               value={nodes.find(n => n.id === selectedNode)?.label || ""}
               onChange={(e) => setNodes(nodes.map(n => n.id === selectedNode ? {...n, label: e.target.value} : n))}
             />
          </div>
        )}
      </div>

      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .panel-title {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 900;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.3);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-main {
          background: white; color: black; padding: 12px; border-radius: 6px;
          font-size: 11px; font-weight: 900; text-transform: uppercase;
          letter-spacing: 1px; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .btn-main:hover { background: #bbb; transform: translateY(-1px); }
        .btn-glass {
          background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
          color: white; padding: 10px; border-radius: 6px; font-size: 10px; 
          font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; transition: 0.2s;
        }
        .btn-glass:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.2); }
        .input-field {
          width: 100%; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 6px; padding: 10px; font-size: 12px; color: white; outline: none;
        }
        .input-field:focus { border-color: rgba(255, 255, 255, 0.2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}