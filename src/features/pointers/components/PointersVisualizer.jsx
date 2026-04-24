import React, { useState, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  useNodesState, 
  useEdgesState, 
  ReactFlowProvider,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaCode, FaMemory, FaLink, FaTrashAlt, FaInfoCircle, FaBookOpen, FaTerminal } from 'react-icons/fa';
import { useIsMobile } from '../../../hooks/use-mobile';

// --- System Configuration ---
const MEMORY_POOL_SIZE = 6;
const VAL_ADDRESSES = Array(MEMORY_POOL_SIZE).fill().map((_, i) => `0x${(1000 + i * 4).toString(16).toUpperCase()}`);
const PTR_ADDRESSES = Array(MEMORY_POOL_SIZE).fill().map((_, i) => `0x${(2000 + i * 8).toString(16).toUpperCase()}`);

const pointerNames = ['ptr_A', 'ptr_B', 'ptr_C', 'ptr_D'];
const valueNames = ['var_x', 'var_y', 'var_z', 'var_w'];

const pointerColors = ['#00ffcc', '#ffaa00', '#ff00ff', '#0088ff'];

// --- Beginner Tutorial Steps ---
const tutorialSteps = [
  "STEP 1: Allocate a Variable (Think of it as renting a locker to store a number).",
  "STEP 2: Allocate a Pointer (A special locker that stores the ADDRESS of another locker).",
  "STEP 3: Link them! Use the dropdown to make the Pointer store the Variable's address.",
  "STEP 4: Pass by Ref vs. Val. See how the C code changes when you pass the Pointer.",
  "SYSTEM READY. Explore memory allocation."
];

const PointersCore = () => {
  const isMobile = useIsMobile();
  const [values, setValues] = useState([]);
  const [customValue, setCustomValue] = useState('');
  const [pointers, setPointers] = useState([]); 
  const [activePointerIdx, setActivePointerIdx] = useState(0);
  
  const [tutorialStep, setTutorialStep] = useState(0);
  const [mode, setMode] = useState('address'); 

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // --- Handlers ---
  const handleAddValue = () => {
    if (values.length < valueNames.length) {
      setValues([...values, parseInt(customValue) || Math.floor(Math.random() * 100)]);
      setCustomValue('');
      if (tutorialStep === 0) setTutorialStep(1);
    }
  };

  const handleAddPointer = () => {
    if (pointers.length < pointerNames.length) {
      const newPointers = [...pointers, { target: 'null' }];
      setPointers(newPointers);
      setActivePointerIdx(newPointers.length - 1);
      if (tutorialStep === 1) setTutorialStep(2);
    }
  };

  const handlePointerChange = (ptrIdx, targetStr) => {
    const newPointers = [...pointers];
    newPointers[ptrIdx].target = targetStr;
    setPointers(newPointers);
    if (tutorialStep === 2) setTutorialStep(3);
  };

  const handleClearSystem = () => {
    setValues([]);
    setPointers([]);
    setCustomValue('');
    setTutorialStep(0);
  };

  // --- Graph Builder ---
  useEffect(() => {
    const nodeWidth = isMobile ? 110 : 130;
    const nodeHeight = isMobile ? 75 : 85;
    const gap = isMobile ? 20 : 30;
    
    const newNodes = [];
    
    // Variables (Bottom Row)
    const valTotalWidth = values.length * nodeWidth + Math.max(0, values.length - 1) * gap;
    const valStartX = -valTotalWidth / 2; // Center based on 0
    
    values.forEach((val, idx) => {
      newNodes.push({
        id: `val-${idx}`,
        position: { x: valStartX + idx * (nodeWidth + gap), y: 150 },
        data: {
          label: (
            <div className="os-node value-node">
              <div className="node-header">{valueNames[idx]}</div>
              <div className="node-address">{VAL_ADDRESSES[idx]}</div>
              <div className="node-data">{val}</div>
            </div>
          )
        },
        style: { width: nodeWidth, height: nodeHeight, background: 'transparent', border: 'none', padding: 0 }
      });
    });

    // Pointers (Top Row)
    const ptrTotalWidth = pointers.length * nodeWidth + Math.max(0, pointers.length - 1) * gap;
    const ptrStartX = -ptrTotalWidth / 2;

    pointers.forEach((ptr, pIdx) => {
      const pColor = pointerColors[pIdx % pointerColors.length];
      let storedValueStr = "0x00000000"; 
      let storedValueColor = "#555";
      
      if (ptr.target.startsWith('val-')) {
        storedValueStr = VAL_ADDRESSES[parseInt(ptr.target.split('-')[1])];
        storedValueColor = pColor;
      }

      newNodes.push({
        id: `ptr-${pIdx}`,
        position: { x: ptrStartX + pIdx * (nodeWidth + gap), y: -50 },
        data: {
          label: (
            <div className="os-node pointer-node" style={{ borderLeftColor: pColor }}>
              <div className="node-header" style={{ color: pColor }}>
                {pointerNames[pIdx]} 
                <span style={{color: 'rgba(255,255,255,0.3)', marginLeft: '4px'}}>
                  {ptr.target === 'null' ? '(NULL)' : '*'}
                </span>
              </div>
              <div className="node-address">{PTR_ADDRESSES[pIdx]}</div>
              <div className="node-data" style={{ color: storedValueColor, fontSize: isMobile ? '12px' : '14px' }}>
                {ptr.target === 'null' ? 'NULL' : storedValueStr}
              </div>
            </div>
          )
        },
        style: { width: nodeWidth, height: nodeHeight, background: 'transparent', border: 'none', padding: 0 }
      });
    });

    setNodes(newNodes);

    // Edges
    const newEdges = [];
    pointers.forEach((ptr, pIdx) => {
      if (ptr.target === 'null') return;
      const pColor = pointerColors[pIdx % pointerColors.length];
      newEdges.push({
        id: `e-ptr${pIdx}-${ptr.target}`,
        source: `ptr-${pIdx}`,
        target: ptr.target,
        type: 'smoothstep',
        animated: true,
        style: { stroke: pColor, strokeWidth: 2, opacity: 0.8 },
        markerEnd: { type: MarkerType.ArrowClosed, color: pColor, width: 20, height: 20 },
      });
    });

    setEdges(newEdges);
  }, [values, pointers, setNodes, setEdges, isMobile]);

  // --- C Code Generator ---
  const generateCode = () => {
    let code = `#include <stdio.h>\n\n`;
    
    if (mode === 'address') {
       code += `// Function takes a POINTER\n`;
       code += `void modifyData(int *p) {\n`;
       code += `    *p = 999; // Changes original!\n`;
       code += `}\n\n`;
    } else {
       code += `// Function takes a VARIABLE\n`;
       code += `void modifyData(int v) {\n`;
       code += `    v = 999; // Changes copy.\n`;
       code += `}\n\n`;
    }

    code += `int main() {\n`;
    values.forEach((v, i) => {
      code += `    int ${valueNames[i]} = ${v};\n`;
    });
    
    pointers.forEach((ptr, pIdx) => {
      let targetStr = 'NULL';
      if (ptr.target.startsWith('val-')) {
        targetStr = `&${valueNames[parseInt(ptr.target.split('-')[1])]}`;
      }
      code += `    int *${pointerNames[pIdx]} = ${targetStr};\n`;
    });

    if (pointers.length > 0 && pointers[0].target !== 'null') {
       const targetName = valueNames[parseInt(pointers[0].target.split('-')[1])];
       if (mode === 'address') code += `    modifyData(${pointerNames[0]});\n`;
       else code += `    modifyData(${targetName});\n`;
    }

    code += `    return 0;\n}`;
    return code;
  };

  return (
    <div className="os-pointers-layout">
      <style>{`
        /* Responsive Variables & Base */
        .os-pointers-layout { 
          display: flex; flex-direction: column; gap: 20px; color: white; 
          font-family: 'Inter', sans-serif; padding: ${isMobile ? '10px' : '20px'}; width: 100%;
          max-width: 1400px; margin: 0 auto;
        }
        
        /* Premium Glassmorphism */
        .panel-glass { 
          background: rgba(18, 18, 22, 0.6); 
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08); 
          border-radius: 20px; 
          padding: ${isMobile ? '12px' : '24px'}; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        
        /* Headers & Tutorials */
        .top-header { display: flex; flex-direction: ${isMobile ? 'column' : 'row'}; justify-content: space-between; align-items: ${isMobile ? 'flex-start' : 'center'}; gap: 10px; margin-bottom: ${isMobile ? '15px' : '20px'}; }
        .tutorial-text { 
          font-size: ${isMobile ? '9px' : '11px'}; color: #9CA3AF; display: flex; align-items: center; gap: 8px; 
          background: rgba(255,255,255,0.03); padding: ${isMobile ? '8px 12px' : '10px 15px'}; border-radius: 12px; 
          border: 1px solid rgba(255,255,255,0.05);
          width: ${isMobile ? '100%' : 'auto'};
        }
        
        /* Control Bar */
        .control-bar { 
          display: flex; flex-wrap: wrap; gap: 10px; align-items: center; 
          background: rgba(0, 0, 0, 0.2); padding: 12px; border-radius: 16px; 
          border: 1px solid rgba(255,255,255,0.02);
        }
        
        /* Inputs & Selects */
        .os-input, .os-select { 
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); 
          color: white; padding: ${isMobile ? '8px 12px' : '10px 15px'}; border-radius: 10px; font-family: 'Space Mono', monospace; 
          font-size: ${isMobile ? '10px' : '12px'}; outline: none; transition: all 0.3s ease; 
        }
        
        /* Premium Buttons */
        .os-btn { 
          background: rgba(255,255,255,0.05); 
          border: 1px solid rgba(255,255,255,0.1); 
          color: #e0e0e0; padding: ${isMobile ? '8px 12px' : '10px 18px'}; border-radius: 10px; font-size: ${isMobile ? '9px' : '10px'}; 
          font-weight: 700; text-transform: uppercase; cursor: pointer; 
          display: flex; align-items: center; gap: 8px; 
          transition: all 0.2s ease;
          letter-spacing: 1px;
        }
        .os-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
        .os-btn.active { background: #fff; color: #000; border-color: #fff; }
        .os-btn.danger { color: #f87171; border-color: rgba(248,113,113,0.2); }

        /* Nodes */
        .os-node { 
          background: rgba(15, 15, 18, 0.9); border: 1px solid rgba(255, 255, 255, 0.1); 
          border-radius: 12px; padding: 10px; width: 100%; height: 100%; display: flex; 
          flex-direction: column; justify-content: center; align-items: center; 
          box-shadow: 0 10px 20px rgba(0,0,0,0.5);
        }
        .node-header { font-size: 9px; color: #6B7280; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; }
        .node-address { font-size: 8px; color: #4B5563; font-family: monospace; background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 4px; margin-bottom: 6px; }
        .node-data { font-size: ${isMobile ? '14px' : '16px'}; font-weight: 800; color: white; }

        /* Code Block */
        .code-block { 
          background: rgba(0, 0, 0, 0.4); padding: 16px; border-radius: 16px; 
          border: 1px solid rgba(255,255,255,0.03); font-size: ${isMobile ? '10px' : '11px'}; line-height: 1.6; 
          color: #9CA3AF; overflow-x: auto; white-space: pre-wrap; height: 100%; 
          font-family: 'Space Mono', monospace;
        }
        
        .main-workspace {
          display: grid; gap: 20px; grid-template-columns: 1fr;
        }
        .canvas-container { min-height: 300px; height: ${isMobile ? '40vh' : '50vh'}; overflow: hidden; position: relative; }
        
        @media (min-width: 1024px) {
          .main-workspace { grid-template-columns: 3fr 2fr; }
          .canvas-container { height: 500px; }
        }

        /* Documentation */
        .doc-section { margin-top: 10px; }
        .doc-title { font-size: ${isMobile ? '14px' : '18px'}; color: #fff; margin-bottom: 20px; font-weight: 900; display: flex; align-items: center; gap: 12px; text-transform: uppercase; letter-spacing: 2px; }
        .doc-text { font-size: ${isMobile ? '12px' : '14px'}; color: #9CA3AF; line-height: 1.8; margin-bottom: 15px; }
        .doc-highlight { color: white; background: rgba(255, 255, 255, 0.1); padding: 2px 6px; border-radius: 6px; }
        .doc-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 768px) { .doc-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>

      {/* Hero Section */}
      <div className={`relative ${isMobile ? 'py-4' : 'py-16'} flex flex-col items-center justify-center text-center overflow-hidden w-full`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#00ffcc]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4 md:mb-6"
          >
            <div className="h-[1px] w-6 md:w-8 bg-zinc-800" />
            <span className="text-[8px] md:text-[10px] font-mono tracking-[0.6em] text-zinc-500 uppercase">Architecture // POINTER_V3</span>
            <div className="h-[1px] w-6 md:w-8 bg-zinc-800" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${isMobile ? 'text-4xl' : 'text-8xl'} font-black tracking-tighter text-white uppercase italic`}
          >
            Pointer<span className="text-[#00ffcc] not-italic">.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`mt-4 md:mt-6 max-w-lg mx-auto text-zinc-400 ${isMobile ? 'text-[10px]' : 'text-sm'} leading-relaxed font-light tracking-wide px-4`}
          >
            A high-fidelity environment for <span className="text-white">algorithmic exploration</span>. 
            Visualizing memory addresses and dereferencing logic in real-time.
          </motion.p>
        </div>
      </div>

      {/* Control Panel */}
      <motion.div className="panel-glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="top-header">
          <h2 style={{ fontSize: isMobile ? '12px' : '16px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <FaTerminal style={{color: '#00ffcc'}} /> System_Registry
          </h2>
          <AnimatePresence mode="wait">
            <motion.div 
              key={tutorialStep}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="tutorial-text"
            >
              <FaInfoCircle size={isMobile ? 12 : 14} color="#00ffcc" /> {tutorialSteps[tutorialStep]}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="control-bar" style={{ justifyContent: isMobile ? 'center' : 'flex-start' }}>
          <div style={{ display: 'flex', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
            <input 
              type="number" 
              className="os-input" 
              placeholder="Val" 
              value={customValue} 
              onChange={e => setCustomValue(e.target.value)} 
              style={{ flex: 1, minWidth: '50px' }}
            />
            <motion.button className="os-btn" whileTap={{ scale: 0.95 }} onClick={handleAddValue}>
              <FaPlus /> VAR
            </motion.button>
          </div>
          
          <motion.button className="os-btn" whileTap={{ scale: 0.95 }} onClick={handleAddPointer}>
            <FaPlus /> PTR
          </motion.button>
          
          {pointers.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
              <select className="os-select" style={{ flex: 1 }} value={activePointerIdx} onChange={e => setActivePointerIdx(Number(e.target.value))}>
                {pointers.map((_, idx) => <option key={idx} value={idx}>{pointerNames[idx]}</option>)}
              </select>
              <FaLink style={{ color: '#4B5563' }} />
              <select className="os-select" style={{ flex: 1 }} value={pointers[activePointerIdx].target} onChange={e => handlePointerChange(activePointerIdx, e.target.value)}>
                <option value="null">NULL</option>
                {values.map((_, idx) => <option key={`val-${idx}`} value={`val-${idx}`}>&{valueNames[idx]}</option>)}
              </select>
            </div>
          )}
          
          {!isMobile && <div style={{ flex: 1 }}></div>}
          <motion.button className="os-btn danger" style={{ width: isMobile ? '100%' : 'auto', justifyContent: 'center' }} onClick={handleClearSystem}>
            <FaTrashAlt /> RESET
          </motion.button>
        </div>
      </motion.div>

      {/* Main Workspace */}
      <div className="main-workspace">
        <motion.div className="panel-glass canvas-container" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            fitViewOptions={{ padding: isMobile ? 0.3 : 0.2 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="rgba(255,255,255,0.03)" gap={20} size={1} />
          </ReactFlow>
        </motion.div>

        <motion.div className="panel-glass" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: '900', letterSpacing: '1px' }}>
              <FaCode /> SOURCE_BUFFER.C
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className={`os-btn ${mode === 'address' ? 'active' : ''}`} onClick={() => setMode('address')}>REF</button>
              <button className={`os-btn ${mode === 'value' ? 'active' : ''}`} onClick={() => setMode('value')}>VAL</button>
            </div>
          </div>
          
          <pre className="code-block">
            <code dangerouslySetInnerHTML={{ 
              __html: generateCode()
                .replace(/int/g, '<span style="color:#60A5FA;">int</span>')
                .replace(/void/g, '<span style="color:#60A5FA;">void</span>')
                .replace(/NULL/g, '<span style="color:#F87171;">NULL</span>') 
            }} />
          </pre>
        </motion.div>
      </div>

      {/* Documentation */}
      <motion.div className="panel-glass doc-section">
        <div className="doc-title">
          <FaBookOpen style={{ color: '#00ffcc' }} /> Manual_Extract
        </div>
        
        <p className="doc-text">
          Computer memory is like an array of slots. Every variable occupies a slot with a unique <span className="doc-highlight">Address</span>. 
          A <strong style={{color: '#fff'}}>Pointer</strong> is simply a variable that stores one of these addresses.
        </p>

        <div className="doc-grid">
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <h4 style={{ color: '#fff', fontSize: '12px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '900' }}>Reference (&)</h4>
            <p className="doc-text" style={{ fontSize: '12px' }}>
              The address-of operator returns the memory location of a variable.
            </p>
            <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', fontSize: '10px', color: '#9CA3AF', fontFamily: 'Space Mono' }}>
              int x = 10;<br/>
              int *ptr = &x;
            </pre>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <h4 style={{ color: '#fff', fontSize: '12px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '900' }}>Dereference (*)</h4>
            <p className="doc-text" style={{ fontSize: '12px' }}>
              The asterisk operator accesses the value stored at the address a pointer holds.
            </p>
            <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', fontSize: '10px', color: '#9CA3AF', fontFamily: 'Space Mono' }}>
              *ptr = 20; // x is now 20
            </pre>
          </div>
        </div>
      </motion.div>
      <div style={{ height: '60px' }} />
    </div>
  );
};

export default function PointersVisualizer() {
  return (
    <ReactFlowProvider>
      <PointersCore />
    </ReactFlowProvider>
  );
}