import React, { useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTerminal, FaArrowRight, FaCogs, FaDatabase, FaProjectDiagram, FaBalanceScale 
} from 'react-icons/fa';
import BoyerMoorePage from './BoyerMoorePage';
import JobSchedulingPage from './JobScheduling';
import StableMatchingPage from './StableMatchingPage';
import Navbar from '../../linkedList/components/Navbar';
import { useIsMobile } from '../../../hooks/use-mobile';

function GreedyAlgorithms() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const algorithms = [
    {
      id: 'ALG-001',
      title: 'Boyer-Moore Majority Vote',
      description: 'Find the majority element using Boyer-Moore voting algorithm with O(n) time complexity.',
      link: 'boyer-moore',
      complexity: 'O(N)',
      icon: <FaDatabase />,
      features: ['STREAMING', 'VOTING_LOGIC', 'LINEAR_SCAN'],
      status: 'STABLE'
    },
    {
      id: 'ALG-002',
      title: 'Job Scheduling Problem',
      description: 'Maximize total profit by scheduling jobs within their deadlines using a greedy strategy.',
      link: 'job-scheduling',
      complexity: 'O(N^2)',
      icon: <FaProjectDiagram />,
      features: ['PROFIT_MAX', 'DEADLINE_SYNC', 'SORT_GREEDY'],
      status: 'ACTIVE'
    },
    {
      id: 'ALG-003',
      title: 'Stable Matching',
      description: 'Solve the Gale-Shapley algorithm to find stable pairs between two sets of preferences.',
      link: 'stable-recursive',
      complexity: 'O(N^2)',
      icon: <FaBalanceScale />,
      features: ['GALE_SHAPLEY', 'BIPARTITE', 'STABLE_STATE'],
      status: 'STABLE'
    },
  ];

  return (
     <div className="greedy-terminal-root">
      <style>{`
        .greedy-terminal-root { 
          background: #000; 
          color: #fff; 
          min-height: 100vh; 
          font-family: 'Inter', monospace; 
          padding-bottom: 5rem;
          overflow-x: hidden;
        }
        .greedy-bg-grid {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 0;
          opacity: 0.3;
        }
        .content-wrap { 
          position: relative; 
          z-index: 1; 
          padding: ${isMobile ? '1rem' : '2rem 2.5rem'}; 
          max-width: 1800px; 
          margin: 0 auto; 
        }
        
        .industrial-header { 
          background: rgba(29, 28, 28, 0.53);
          border: 1px solid #222;
          border-radius: 12px;
          padding: ${isMobile ? '1.5rem' : '2rem'};
          backdrop-filter: blur(15px);
          margin: ${isMobile ? '80px 0 2rem 0' : '60px 0 3rem 0'};
          display: flex;
          flex-direction: ${isMobile ? 'column' : 'row'};
          justify-content: space-between;
          align-items: ${isMobile ? 'flex-start' : 'center'};
          gap: ${isMobile ? '1.5rem' : '0'};
        }

        .algo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(${isMobile ? '100%' : '400px'}, 1fr));
          gap: 2rem;
        }
        .glass-card {
          background: rgba(15, 15, 15, 0.6);
          border: 1px solid #1a1a1a;
          border-radius: 20px;
          padding: ${isMobile ? '1.5rem' : '2.5rem'};
          backdrop-filter: blur(10px);
          transition: 0.4s;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: ${isMobile ? 'auto' : '340px'};
        }
        .glass-card:hover {
          border-color: #444;
          background: rgba(20, 20, 20, 0.8);
          transform: translateY(-5px);
        }

        .hud-badge {
          font-size: ${isMobile ? '0.55rem' : '0.65rem'};
          font-family: monospace;
          background: #111;
          color: #888;
          padding: 4px 12px;
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
          padding: 4px 10px;
          border-radius: 4px;
          color: #555;
          margin-right: 8px;
          margin-top: 5px;
        }
        .btn-action {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.8rem;
          font-weight: 800;
          color: #fff;
          text-transform: uppercase;
          margin-top: 2rem;
          text-decoration: none;
          letter-spacing: 0.1em;
        }
        .btn-action:hover span { text-decoration: underline; }
      `}</style>

      <div className="greedy-bg-grid" />

      <div className="content-wrap">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route index element={
             <>
              <Navbar />

              <motion.header 
                       className="industrial-header"
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                     >

                       <div>
                         <div className="hud-badge" style={{ marginBottom: '10px' }}>
                           <FaTerminal style={{ marginRight: '8px' }} /> OPTIMIZATION_LAB // VOL. 01
                         </div>
                         <h1 style={{ fontSize: isMobile ? '1.5rem' : '2.2rem', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.1 }}>
                           Greedy Logic<span style={{ color: '#3f3f46' }}> _</span>
                         </h1>
                         <p style={{ color: '#444', fontSize: isMobile ? '0.75rem' : '0.9rem', marginTop: '5px' }}>
                           Algorithms that make the locally optimal choice at each stage with the intent of finding a global optimum.
                         </p>
                       </div>
                       <div style={{ textAlign: isMobile ? 'left' : 'right', borderTop: isMobile ? '1px solid #222' : 'none', paddingTop: isMobile ? '1rem' : '0', width: isMobile ? '100%' : 'auto' }}>
                         <div className="hud-badge">SYSTEM_STABILITY: 100%</div>
                         <div style={{ color: '#222', fontSize: '0.6rem', marginTop: '10px' }}>VERSION 4.2.0</div>
                       </div>
                     </motion.header>
             
                     {/* Algorithm Modules */}
                     <div className="algo-grid">
                       {algorithms.map((algo, index) => (
                         <motion.div
                           key={algo.id}
                           className="glass-card"
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: index * 0.1 }}
                         >
                           <div>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                               <div style={{ fontSize: isMobile ? '2rem' : '2.5rem', color: '#fff' }}>{algo.icon}</div>
                               <div style={{ display: 'flex', gap: '8px' }}>
                                 <span className="hud-badge">{algo.complexity}</span>
                                 <span className="hud-badge" style={{ color: algo.status === 'STABLE' ? '#4ade80' : '#facc15' }}>
                                   {algo.status}
                                 </span>
                               </div>
                             </div>
             
                             <div style={{ marginTop: '2rem' }}>
                               <h3 style={{ fontSize: isMobile ? '1.2rem' : '1.4rem', fontWeight: 900, letterSpacing: '0.02em' }}>
                                 <span className="status-dot" />
                                 {algo.title}
                               </h3>
                               <p style={{ color: '#71717a', fontSize: isMobile ? '0.8rem' : '0.9rem', lineHeight: '1.6', marginTop: '1rem' }}>
                                 {algo.description}
                               </p>
                               
                               <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap' }}>
                                 {algo.features.map((f, i) => (
                                   <span key={i} className="feature-chip">{f}</span>
                                 ))}
                               </div>
                             </div>
                           </div>
             
                           <Link to={algo.link} className="btn-action">
                             <span>INITIALIZE_VISUALIZER</span> <FaArrowRight fontSize="0.7rem" />
                           </Link>
                         </motion.div>
                       ))}
                     </div>
             
                     {/* Industrial Footer Section */}
                     <motion.div 
                       style={{ marginTop: isMobile ? '3rem' : '6rem', borderTop: '1px solid #1a1a1a', paddingTop: '4rem' }}
                       initial={{ opacity: 0 }}
                       whileInView={{ opacity: 1 }}
                     >
                       <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: isMobile ? '2rem' : '4rem' }}>
                         <div>
                           <h4 style={{ fontSize: '0.75rem', color: '#52525b', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>ENGINEERING_REPORTS</h4>
                           <p style={{ fontSize: '0.85rem', color: '#3f3f46', lineHeight: '1.8' }}>
                             Greedy paradigms prioritize immediate benefits over long-term implications. While not always globally optimal, they provide high-performance solutions for complex scheduling and selection tasks.
                           </p>
                         </div>
                         <div style={{ display: 'flex', gap: isMobile ? '20px' : '60px', justifyContent: isMobile ? 'space-between' : 'flex-start' }}>
                            <div>
                              <h5 style={{ fontSize: '0.7rem', color: '#fff', marginBottom: '0.8rem', fontWeight: 'bold' }}>COMPLEXITY</h5>
                              <p style={{ fontSize: '0.7rem', color: '#27272a' }}>Time: O(N log N)<br/>Space: O(N)<br/>Paradigm: Greedy</p>
                            </div>
                            <div>
                              <h5 style={{ fontSize: '0.7rem', color: '#fff', marginBottom: '0.8rem', fontWeight: 'bold' }}>APPLICATIONS</h5>
                              <p style={{ fontSize: '0.7rem', color: '#27272a' }}>Job Sequencing<br/>Huffman Coding<br/>Prim's Algorithm</p>
                            </div>
                         </div>
                       </div>
                     </motion.div>
              </>
            } />
            
            {/* Sub-pages */}
            <Route path="boyer-moore" element={<BoyerMoorePage />} />
            <Route path="job-scheduling" element={<JobSchedulingPage />} />
            <Route path="stable-recursive" element={<StableMatchingPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default GreedyAlgorithms;