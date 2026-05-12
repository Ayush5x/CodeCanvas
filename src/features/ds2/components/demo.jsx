import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaHome, FaCode,FaSearch, FaArrowRight,FaChartLine, FaRocket, FaProjectDiagram, FaTerminal, FaMicrochip, FaCogs 
} from 'react-icons/fa';
import Navbar from "../../../components/Navbar";
import {
  ArrowRight,
  ArrowLeftRight,
  Scan,
  ListPlus,
  GitPullRequest,
  Zap,
  Activity,
  Binary,
} from "lucide-react";
const SortingAlgoHome = () => {
  const ds2Algorithms = [
    {
         id: 'klee',
         title: "KLEE'S ALGORITHM",
         description: 'Find the total length covered by a union of intervals using a high-efficiency sweep line scan.',
         complexity: 'O(N LOG N)',
         icon: <FaMicrochip />,
         features: ['SWEEP_LINE', 'INTERVAL_UNION', 'GEOMETRY_ENGINE'],
         link: '/dsa/ds2/klee',
         status: 'available'
       },
       {
         id: 'coming-soon-1',
         title: 'SYSTEM_UPGRADE',
         description: 'Additional ICS 215 modules are currently in the compilation phase. Awaiting data injection.',
         complexity: 'VAR_COMPLEXITY',
         icon: <FaRocket />,
         features: ['ADV_GRAPHS', 'COMP_GEOMETRY', 'ICS_215_CORE'],
         link: null,
         status: 'coming-soon'
       }
    
  ];

  return (
    <div className="ds2-terminal-root">
      <style>{`
        .ds2-terminal-root { 
          background: #000; 
          color: #fff; 
          min-height: 100vh; 
          font-family: 'Inter', monospace; 
          padding-bottom: 5rem;
          overflow-x: hidden;
        }
        .ds2-bg-grid {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 0;
          opacity: 0.3;
        }
        .content-wrap { position: relative; z-index: 1; padding: 2rem 2.5rem; max-width: 1800px; margin: 0 auto; }
        
        /* Glass Header */
        .industrial-header { 
          background: rgba(29, 28, 28, 0.53);
          border: 1px solid #222;
          border-radius: 12px;
          padding: 2rem;
          backdrop-filter: blur(15px);
          margin: 60px 0 3rem 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Algorithm Cards */
        .algo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }
        .glass-card {
          background: rgba(15, 15, 15, 0.6);
          border: 1px solid #1a1a1a;
          border-radius: 16px;
          padding: 2.5rem;
          backdrop-filter: blur(10px);
          transition: 0.4s;
          position: relative;
          overflow: hidden;
        }
        .glass-card:hover {
          border-color: #444;
          background: rgba(20, 20, 20, 0.8);
        }
        .glass-card.available:hover {
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.05);
        }
        .glass-card.coming-soon { opacity: 0.5; cursor: not-allowed; }

        /* HUD Badges */
        .hud-badge {
          font-size: 0.65rem;
          font-family: monospace;
          background: #111;
          color: #888;
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid #222;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .status-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #fff;
          display: inline-block;
          margin-right: 10px;
          box-shadow: 0 0 10px #fff;
        }
        .feature-chip {
          font-size: 0.6rem;
          border: 1px solid #222;
          padding: 3px 8px;
          border-radius: 3px;
          color: #555;
          margin-right: 8px;
        }
        .btn-action {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.75rem;
          font-weight: 900;
          color: #fff;
          text-transform: uppercase;
          margin-top: 2rem;
          text-decoration: none;
        }
        .btn-action:hover span { text-decoration: underline; }
      `}</style>

      <div className="ds2-bg-grid" />
      <Navbar />

      <div className="content-wrap">
        {/* Header HUD */}
        <motion.header 
          className="industrial-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="hud-badge" style={{ marginBottom: '10px' }}>
              <FaTerminal style={{ marginRight: '8px' }} />  ACADEMIC_RESOURCES / ICS_215
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px' }}>
             DATA_STRUCTURES_2.0
            </h1>
            <p style={{ color: '#444', fontSize: '0.9rem', marginTop: '5px' }}>
              Advanced Computational Geometry & Algorithmic Modules
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="hud-badge">CORE_STABILITY: 100%</div>
            <div style={{ color: '#222', fontSize: '0.6rem', marginTop: '10px' }}>IIIT_KOTTAYAM_V2.0</div>
          </div>
        </motion.header>

        {/* Algorithm Modules */}
        <div className="algo-grid">
          {ds2Algorithms.map((algo, index) => (
            <motion.div
              key={algo.id}
              className={`glass-card ${algo.status}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '2.5rem', color: '#fff' }}>{algo.icon}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="hud-badge">{algo.complexity}</span>
                  <span className="hud-badge">ICS_215</span>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '1px' }}>
                  {algo.status === 'available' && <span className="status-dot" />}
                  {algo.title}
                </h3>
                <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: '1.6', marginTop: '1rem', minHeight: '3.2rem' }}>
                  {algo.description}
                </p>
                
                <div style={{ marginTop: '1.5rem', display: 'flex' }}>
                  {algo.features.map((f, i) => (
                    <span key={i} className="feature-chip">{f}</span>
                  ))}
                </div>

                {algo.status === 'available' ? (
                  <Link to={algo.link} className="btn-action">
                    <span>INITIALIZE_VISUALIZER</span> <FaArrowRight fontSize="0.7rem" />
                  </Link>
                ) : (
                  <div className="btn-action" style={{ color: '#333',backgroundColor:"white", width:"200px" ,padding:"5px", border:"1px solid white", borderRadius:"30px"}}>
                    <FaCogs /> <span>UNDER_CONSTRUCTION</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Documentation */}
        <motion.div 
          style={{ marginTop: '5rem', borderTop: '1px solid #111', paddingTop: '3rem' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem' }}>
            <div>
              <h4 style={{ fontSize: '0.7rem', color: '#444', letterSpacing: '2px', marginBottom: '1rem' }}>MODULE_SUMMARY</h4>
              <p style={{ fontSize: '0.8rem', color: '#555', lineHeight: '1.8' }}>
                The ICS 215 curriculum focuses on the mathematical optimization of data structures. This interface serves as a visual bridge between theoretical complexity and physical execution.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '40px' }}>
               <div>
                 <h5 style={{ fontSize: '0.65rem', color: '#fff', marginBottom: '0.5rem' }}>GEOMETRY</h5>
                 <p style={{ fontSize: '0.65rem', color: '#333' }}>Sweep-Line<br/>Interval Trees<br/>Convex Hulls</p>
               </div>
               <div>
                 <h5 style={{ fontSize: '0.65rem', color: '#fff', marginBottom: '0.5rem' }}>GRAPHS</h5>
                 <p style={{ fontSize: '0.65rem', color: '#333' }}>Network Flow<br/>Bipartite Matching<br/>Spanning Trees</p>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SortingAlgoHome;