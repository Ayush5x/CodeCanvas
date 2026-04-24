import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Header from '../../../components/Header';
import { motion } from 'framer-motion';
const KleePremiumVisualizer = () => {
  // --- CORE STATE ---
  const [segments, setSegments] = useState(() => {
    const saved = localStorage.getItem('klee_final_premium');
    return saved ? JSON.parse(saved) : [];
  });
  const [mode, setMode] = useState('IDLE'); 
  const [sweepX, setSweepX] = useState(null);
  const [unionIntervals, setUnionIntervals] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  
  // Interaction State
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [currentDragX, setCurrentDragX] = useState(null);
  const svgRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('klee_final_premium', JSON.stringify(segments));
  }, [segments]);

  // --- ALGORITHM LOGIC ---
  const events = useMemo(() => {
    let evs = [];
    segments.forEach(s => {
      evs.push({ x: Math.min(s.x1, s.x2), type: 1 });
      evs.push({ x: Math.max(s.x1, s.x2), type: -1 });
    });
    return evs.sort((a, b) => a.x - b.x);
  }, [segments]);

  const startVisualization = useCallback(() => {
    if (segments.length === 0) return;
    
    setMode('VISUALIZING');
    setUnionIntervals([]);
    let step = 0;

    const animate = () => {
      if (step >= events.length) {
        setMode('COMPLETED');
        setActiveCount(0);
        return;
      }

      const currentEvent = events[step];
      const nextEvent = events[step + 1];
      
      let count = 0;
      events.slice(0, step + 1).forEach(e => count += e.type);
      
      setActiveCount(count);
      setSweepX(currentEvent.x);

      if (count > 0 && nextEvent) {
        setUnionIntervals(prev => [...prev, {
          start: currentEvent.x,
          end: nextEvent.x,
          length: nextEvent.x - currentEvent.x
        }]);
      }

      step++;
      animationRef.current = setTimeout(animate, 500); // Smooth pacing
    };

    animate();
  }, [events, segments]);

  const generateRandom = () => {
    reset();
    const newSegs = Array.from({ length: 6 }, (_, i) => {
      const start = Math.random() * 800 + 50;
      return {
        id: Date.now() + i,
        x1: start,
        x2: start + (Math.random() * 250 + 80),
        y: 80 + (i * 60),
        color: '#FFFFFF'
      };
    });
    setSegments(newSegs);
  };

  const reset = () => {
    clearTimeout(animationRef.current);
    setSegments([]);
    setSweepX(null);
    setUnionIntervals([]);
    setActiveCount(0);
    setMode('IDLE');
  };

  // --- MOUSE HANDLERS ---
  const handleMouseDown = (e) => {
    if (mode !== 'IDLE') return;
    const rect = svgRef.current.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setIsDrawing(true);
    setDragStart(pos);
    setCurrentDragX(pos.x);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = svgRef.current.getBoundingClientRect();
    setCurrentDragX(e.clientX - rect.left);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    if (Math.abs(currentDragX - dragStart.x) > 10) {
      setSegments(prev => [...prev, {
        id: Date.now(),
        x1: dragStart.x,
        x2: currentDragX,
        y: dragStart.y,
        color: '#FFFFFF'
      }]);
    }
    setIsDrawing(false);
  };

  const totalLength = unionIntervals.reduce((acc, curr) => acc + curr.length, 0);
  const x={titleContainer: {
    padding: '20px 0 0px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
  },
  titleWrapper: {
    position: 'relative',
    textAlign: 'center',
    marginBottom: '0px'
  },
  bgWatermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -60%)',
    fontSize: '9rem',
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.03)',
    letterSpacing: '20px',
    zIndex: -1,
    pointerEvents: 'none',
    WebkitTextStroke: '1px rgba(255,255,255,0.05)',
  },
  mainTitle: {
    fontSize: '4.5rem',
    fontWeight: '900',
    letterSpacing: '8px',
    margin: 0,
    textTransform: 'uppercase',
    background: 'linear-gradient(180deg, #FFFFFF 0%, #888888 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  titleUnderline: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '10px'
  },
  accentLine: {
    height: '1px',
    background: 'rgba(255,255,255,0.4)',
  },
  subTitleCaps: {
    fontSize: '0.7rem',
    fontWeight: '800',
    letterSpacing: '4px',
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
  },
  descriptionText: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    maxWidth: '500px',
    lineHeight: '1.6',
    letterSpacing: '0.5px'
  },}
  return (
    
    <div style={s.page}>
     <Header></Header>
           
                  {/* --- NEW PREMIUM TITLE DESIGN --- */}
<div style={x.titleContainer}>
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={x.titleWrapper}
  >
    {/* Large decorative background text */}
    <span style={x.bgWatermark}>MEASURE</span>
    
    <motion.h1 
      whileHover={{ letterSpacing: '14px', transition: { duration: 0.4 } }}
      style={x.mainTitle}
    >
      KLEE’S <span style={{ fontWeight: 200, opacity: 0.6 }}>ALGORITHM</span>
    </motion.h1>
    
    <div style={x.titleUnderline}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: '100px' }}
        transition={{ delay: 0.5, duration: 1 }}
        style={x.accentLine} 
      />
      <p style={x.subTitleCaps}>
        UNION MEASURE ENGINE <span style={{ opacity: 0.3 }}>//</span> VOL. 1.0
      </p>
    </div>
  </motion.div>
  
</div>
      <div style={{marginTop:"0px"}}>
      <div style={s.ambientOrb} />
    <div style={{position:"relative" , top:"50px"}}>&gt;_</div>
      {/* 1. TOP NAV / CONTROLS */}
      <header style={s.nav}>
        
        <div style={s.logo}>KLEE <span style={s.logoAccent}>LABS_</span></div>
        <div style={s.navActions}>
          <button style={s.glassBtn} onClick={generateRandom}>RANDOM GENERATE</button>
          <button style={s.glassBtn} onClick={reset}>RESET</button>
          <button 
            style={s.primeBtn} 
            onClick={startVisualization} 
            disabled={mode === 'VISUALIZING' || segments.length === 0}
          >
            {mode === 'VISUALIZING' ? 'ANALYZING...' : 'VISUALIZE'}
          </button>
        </div>
      </header>

      {/* 2. MAIN INTERACTIVE AREA */}
      <div style={s.mainGrid}>
        <aside style={s.sidebar}>
          <div style={s.metricCard}>
            <label style={s.label}>TOTAL_UNION_MEASURE</label>
            <div style={s.bigNum}>{totalLength.toFixed(1)}<small>px</small></div>
          </div>

          <div style={s.glassCard}>
            <label style={s.label}>ENGINE_LOAD</label>
            <div style={s.statusVal}>{segments.length} Segments Active</div>
            <div style={s.statusVal}><small style={{color: '#555'}}>{activeCount} Overlaps Currently</small></div>
          </div>

          <div style={s.instructionBox}>
            <label style={s.label}>NEWBIE_GUIDE</label>
            <p style={s.guideText}>
              <b>Manual Draw:</b> Click and drag on the grid to place segments.<br/><br/>
              <b>Randomize:</b> Use the top button to generate complex overlaps automatically.<br/><br/>
              <b>Visualize:</b> Watch the sweep-line calculate the total length in real-time.
            </p>
          </div>
        </aside>

        <main style={s.canvasContainer}>
          <svg 
            ref={svgRef} 
            style={s.svg}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <defs>
              <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.08)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />

            {/* Thick Static Segments */}
            {segments.map(seg => (
              <g key={seg.id}>
                {/* Glow effect for line */}
                <line x1={seg.x1} y1={seg.y} x2={seg.x2} y2={seg.y} stroke="rgba(255,255,255,0.1)" strokeWidth="12" strokeLinecap="round" />
                <line x1={seg.x1} y1={seg.y} x2={seg.x2} y2={seg.y} stroke="#fff" strokeWidth="5" strokeLinecap="round" />
                <circle cx={seg.x1} cy={seg.y} r="5" fill="#fff" />
                <circle cx={seg.x2} cy={seg.y} r="5" fill="#fff" />
              </g>
            ))}

            {/* Union Areas (The Result) */}
            {unionIntervals.map((it, i) => (
              <rect key={i} x={Math.min(it.start, it.end)} y={0} width={it.length} height="100%" fill="rgba(255,255,255,0.04)" />
            ))}

            {/* Ghost Line (Drawing) */}
            {isDrawing && (
              <line x1={dragStart.x} y1={dragStart.y} x2={currentDragX} y2={dragStart.y} stroke="rgba(255,255,255,0.5)" strokeWidth="4" strokeDasharray="8,4" />
            )}

            {/* Sweep Line */}
            {sweepX && (
              <g>
                <line x1={sweepX} y1="0" x2={sweepX} y2="100%" stroke="#fff" strokeWidth="2" />
                <rect x={sweepX - 40} y="10" width="80" height="20" rx="4" fill="#fff" />
                <text x={sweepX} y="24" fill="#000" fontSize="10" fontWeight="900" textAnchor="middle">X: {sweepX.toFixed(0)}</text>
              </g>
            )}
          </svg>
        </main>
      </div>
<div style={ds.container}>
      {/* 1. THEORY HEADER */}
      <section style={ds.section}>
        <div style={ds.badge}>ALGORITHM_CORE</div>
        <h2 style={ds.title}>The Measure Problem</h2>
        <p style={ds.text}>
          Klee's algorithm calculates the total length covered by multiple overlapping line segments. 
          Simply adding lengths leads to errors due to overlaps. We solve this using a <b>Sweep-Line</b> 
          approach, processing the axis as a sequence of events.
        </p>
      </section>

      {/* 2. CONCRETE EXAMPLE BOX */}
      <div style={ds.exampleGrid}>
        <div style={ds.glassCard}>
          <h3 style={ds.subTitle}>01 / Input Segments</h3>
          <div style={ds.codeSnippet}>
            A: [100, 300] <br />
            B: [250, 450] <br />
            C: [500, 600]
          </div>
          <p style={ds.smallText}>Notice A and B overlap by 50px.</p>
        </div>

        <div style={ds.glassCard}>
          <h3 style={ds.subTitle}>02 / Sorted Events</h3>
          <p style={ds.smallText}>Convert to (x, type) where +1 is START and -1 is END:</p>
          <div style={ds.codeSnippet}>
            (100,+1), (250,+1), (300,-1), (450,-1), (500,+1), (600,-1)
          </div>
        </div>

        <div style={ds.highlightCard}>
          <h3 style={ds.subTitleDark}>03 / Final Result</h3>
          <div style={ds.bigValue}>450.0<span style={ds.unit}>px</span></div>
          <p style={ds.smallTextDark}>
            Measure = (450 - 100) + (600 - 500) <br />
            Total = 350 + 100 = 450
          </p>
        </div>
      </div>

      {/* 3. PERFORMANCE METRICS */}
      <section style={ds.tableContainer}>
        <table style={ds.table}>
          <thead>
            <tr>
              <th style={ds.th}>PROCESS</th>
              <th style={ds.th}>COMPLEXITY</th>
              <th style={ds.th}>DETAIL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={ds.td}>Endpoint Sorting</td>
              <td style={ds.td}>$O(n \log n)$</td>
              <td style={ds.td}>Requires sorting $2n$ endpoints.</td>
            </tr>
            <tr>
              <td style={ds.td}>Linear Sweep</td>
              <td style={ds.td}>$O(n)$</td>
              <td style={ds.td}>Single pass to sum non-zero gaps.</td>
            </tr>
            <tr style={ds.totalRow}>
              <td style={ds.td}><b>Total Effort</b></td>
              <td style={ds.td}><b>$O(n \log n)$</b></td>
              <td style={ds.td}><b>Optimal for 1D geometry.</b></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
    </div>
   
    </div>
  );
};

// --- STYLING (Premium Glassmorphism) ---
const s = {
  page: { backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: '"Inter", sans-serif', padding: '0 5%', position: 'relative', overflowX: 'hidden' },
  ambientOrb: { position: 'absolute', top: '10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 },
  nav: { height: '120px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 2 },
  logo: { fontWeight: '900', letterSpacing: '5px', fontSize: '1.2rem' },
  logoAccent: { color: '#333' },
  navActions: { display: 'flex', gap: '20px' },
  glassBtn: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', color: '#888', padding: '12px 24px', borderRadius: '14px', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer', transition: '0.2s' },
  primeBtn: { background: '#fff', color: '#000', border: 'none', padding: '12px 35px', borderRadius: '14px', fontSize: '0.7rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255,255,255,0.1)' },
  
  mainGrid: { display: 'grid', gridTemplateColumns: '340px 1fr', gap: '40px', marginTop: '50px', position: 'relative', zIndex: 2 },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '25px' },
  metricCard: { background: '#fff', padding: '35px', borderRadius: '32px', color: '#000', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' },
  glassCard: { background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.1)', padding: '30px', borderRadius: '32px' },
  label: { fontSize: '0.65rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', display: 'block', marginBottom: '15px' },
  statusVal: { fontSize: '1.1rem', fontWeight: '700', marginBottom: '5px' },
  bigNum: { fontSize: '3.5rem', fontWeight: '200', letterSpacing: '-3px' },
  instructionBox: { padding: '30px', background: 'rgba(255,255,255,0.01)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.03)' },
  guideText: { fontSize: '0.85rem', color: '#666', lineHeight: '1.7' },
  
  canvasContainer: { background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '40px', height: '600px', overflow: 'hidden', boxShadow: 'inset 0 0 100px rgba(255,255,255,0.02)' },
  svg: { width: '100%', height: '100%', cursor: 'crosshair' },

  docSection: { marginTop: '100px', paddingBottom: '100px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '80px' },
  docGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' },
  docCard: { padding: '20px' },
};
const ds = {
  container: { marginTop: '80px', paddingBottom: '100px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '80px' },
  section: { marginBottom: '50px' },
  badge: { fontSize: '0.6rem', fontWeight: '900', color: '#888', letterSpacing: '2px', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '15px' },
  title: { fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px', letterSpacing: '-1px' },
  text: { color: '#666', lineHeight: '1.8', fontSize: '1.1rem', maxWidth: '800px' },
  exampleGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '60px' },
  glassCard: { background: 'rgba(255, 255, 255, 0.02)', padding: '30px', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.05)' },
  highlightCard: { background: '#fff', padding: '30px', borderRadius: '32px', color: '#000' },
  subTitle: { fontSize: '0.8rem', fontWeight: '900', marginBottom: '20px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' },
  subTitleDark: { fontSize: '0.8rem', fontWeight: '900', marginBottom: '10px', color: 'rgba(0,0,0,0.4)', letterSpacing: '1px' },
  codeSnippet: { background: '#000', padding: '15px', borderRadius: '14px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '15px' },
  smallText: { fontSize: '0.8rem', color: '#444' },
  smallTextDark: { fontSize: '0.8rem', color: '#666' },
  bigValue: { fontSize: '3rem', fontWeight: '200', letterSpacing: '-3px' },
  unit: { fontSize: '0.9rem', marginLeft: '5px' },
  tableContainer: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.7rem', color: '#444', textTransform: 'uppercase', letterSpacing: '1px' },
  td: { padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#888', fontSize: '0.9rem' },
  totalRow: { background: 'rgba(255,255,255,0.02)' }
};

export default KleePremiumVisualizer;