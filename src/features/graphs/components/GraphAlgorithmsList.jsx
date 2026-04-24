import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../../components/Navbar';
import { useIsMobile } from '../../../hooks/use-mobile';

import { 
  FaArrowRight,
  FaTerminal,
  FaNetworkWired,
  FaProjectDiagram,
  FaClock,
  FaTree,
  FaRoute
} from 'react-icons/fa';

const graphCards = [
  {
    id: 'bfs',
    title: 'Breadth-First Search',
    description: 'Level-order traversal exploring neighbors first. Optimal for finding the shortest path in unweighted networks.',
    icon: <FaProjectDiagram />,
    route: '/dsa/graphs/bfs',
    difficulty: 'BEGINNER',
    timeComplexity: 'O(V + E)',
    features: ['#Unweighted', '#Queue', '#ShortestPath']
  },
  {
    id: 'dfs',
    title: 'Depth-First Search',
    description: 'Recursive exploration diving deep into branches. Primary tool for cycle detection and topological sorting.',
    icon: <FaNetworkWired />,
    route: '/dsa/graphs/dfs',
    difficulty: 'BEGINNER',
    timeComplexity: 'O(V + E)',
    features: ['#Recursive', '#Stack', '#Backtracking']
  },
  {
    id: 'dijkstra',
    title: "Dijkstra's Algorithm",
    description: 'Greedy weight-based optimization finding the most efficient path between network nodes in weighted graphs.',
    icon: <FaRoute />,
    route: '/dsa/graphs/dijkstra',
    difficulty: 'INTERMEDIATE',
    timeComplexity: 'O((V + E) LOG V)',
    features: ['#Weighted', '#Greedy', '#Optimization']
  },
  {
    id: 'prim',
    title: "Prim's Algorithm",
    description: 'Minimum Spanning Tree construction by growing a tree from a starting vertex based on edge weights.',
    icon: <FaTree />,
    route: '/dsa/graphs/prim',
    difficulty: 'INTERMEDIATE',
    timeComplexity: 'O(E LOG V)',
    features: ['#MST', '#Greedy', '#NetworkDesign']
  },
  {
    id: 'kruskal',
    title: "Kruskal's Algorithm",
    description: 'Edge-based MST generation utilizing Union-Find structures. Efficient for sparse graph implementations.',
    icon: <FaTerminal />,
    route: '/dsa/graphs/kruskal',
    difficulty: 'INTERMEDIATE',
    timeComplexity: 'O(E LOG E)',
    features: ['#UnionFind', '#Sorting', '#MST']
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] }
  }
};

const GraphCard = ({ card }) => {
  const isMobile = useIsMobile();
  return (
    <motion.div
      variants={cardVariants}
      className="graph-card"
      whileHover={!isMobile ? { y: -10, transition: { duration: 0.3 } } : {}}
    >
      <div className="graph-card-link">
        <div className="graph-card-header">
          <div className="graph-card-icon">{card.icon}</div>
          <div className="graph-card-badges">
            <span className="difficulty-badge">{card.difficulty}</span>
            <span className="complexity-badge">
              <FaClock size={10}/>
              {card.timeComplexity}</span>
          </div>
        </div>
        
        <div className="graph-card-body">
          <h3 className="graph-card-title">{card.title}</h3>
          <p className="graph-card-description">{card.description}</p>
          
          <div className="graph-card-features">
            {card.features.map((feature, index) => (
              <span key={index} className="feature-tag">{feature}</span>
            ))}
          </div>
        </div>

        <div className="graph-card-footer">
          <Link to={card.route} style={{ textDecoration: 'none' }}>
            <div className="learn-more-btn">
              <FaTerminal size={14} />
              <span>INITIALIZE_VISUALIZER</span>
              <FaArrowRight size={12} className="arrow-anim" />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const GraphAlgorithmsList = () => {
  const isMobile = useIsMobile();
  return (
    <div className="graph-home-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700&family=JetBrains+Mono:wght@400;700&display=swap');

        :root {
          --bg: linear-gradient(300deg, #000000 30%, #334155 40%, #000000d5 30%);
          --card-bg: #0a0a0a;
          --border: #1a1a1a;
          --text-dim: #888;
          --text-main: #eee;
          --font-sans: 'Inter', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        .graph-home-container {
          min-height: 100vh;
          background: var(--bg);
          color: white;
          font-family: var(--font-sans);
          padding: ${isMobile ? '1rem' : '2rem'};
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .navbar-wrapper {
          width: 100%;
          position: sticky;
          top: 0;
          z-index: 1000;
          margin-bottom: ${isMobile ? '2rem' : '5rem'};
        }

        .graph-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(${isMobile ? '100%' : '380px'}, 1fr));
          gap: ${isMobile ? '15px' : '30px'};
          width: 100%;
          max-width: 1300px;
          padding-bottom: 50px;
        }

        .graph-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 28px;
          height: ${isMobile ? 'auto' : '650px'}; 
          min-height: ${isMobile ? '450px' : 'auto'};
          padding: ${isMobile ? '24px' : '40px'};
          position: relative;
          transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .graph-card-link {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .graph-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${isMobile ? '1.5rem' : '3rem'};
        }

        .graph-card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .graph-card-icon {
          font-size: ${isMobile ? '1.8rem' : '2.5rem'};
          color: var(--text-main);
        }

        .graph-card-badges {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
          font-family: var(--font-mono);
        }

        .difficulty-badge, .complexity-badge {
          font-size: 8px;
          padding: 4px 12px;
          border-radius: 100px;
          border: 1px solid var(--border);
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .complexity-badge {
          color: black;
          background: #E2E8F0;
          border-color: #f1ede7;
        }

        .graph-card-title {
          font-size: ${isMobile ? '1.5rem' : '2.4rem'};
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-main);
          line-height: 1.1;
        }

        .graph-card-heading {
          font-family: var(--font-sans);
          font-size: ${isMobile ? '2rem' : '3.8rem'};
          font-weight: 300;
          margin-bottom: 0.5rem;
          color: var(--text-main);
          line-height: 1.1;
          letter-spacing: -0.04em;
          text-align: center;
        }

        .graph-card-description {
          color: var(--text-dim);
          font-size: ${isMobile ? '0.8rem' : '0.9rem'};
          line-height: 1.7;
        }

        .graph-card-features {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: ${isMobile ? '1.5rem' : 'auto'};
          margin-bottom: 30px;
          font-family: var(--font-mono);
        }

        .feature-tag {
          font-size: 8px;
          background: #111;
          padding: 5px 12px;
          border-radius: 8px;
          color: #555;
          border: 1px solid transparent;
        }

        .learn-more-btn {
          width: 100%;
          border: 1px solid var(--border);
          padding: ${isMobile ? '14px' : '18px'};
          border-radius: 16px;
          color: black;
          background: #94A3B8;
          font-size: 9px;
          font-family: var(--font-mono);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: 0.5s;
        }

        .graph-card:hover {
          box-shadow: 0px 5px 25px rgba(255, 255, 255, 0.05);
          border-color: rgba(255,255,255,0.2);
        }

        .learn-more-btn:hover {
          background: #CBD5E1;
          color: black;
        }

        .footer-panel {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: ${isMobile ? '24px' : '40px'};
          display: flex;
          flex-direction: ${isMobile ? 'column' : 'row'};
          align-items: center;
          gap: ${isMobile ? '15px' : '30px'};
          max-width: 1200px;
          margin: 2rem auto 0 auto;
          text-align: ${isMobile ? 'center' : 'left'};
        }

        .footer-panel h4 { 
          margin: 0 0 5px 0; 
          font-size: 1rem; 
          font-weight: 700; 
        }

        .footer-panel p { 
          margin: 0; 
          color: rgba(255, 255, 255, 0.4); 
          font-size: 0.8rem; 
        }
      `}</style>

      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '5rem' }}
      >
        <h1 className="graph-card-heading">Graph Algorithms</h1>
        <p style={{ fontWeight: 300, letterSpacing: '0.2em', fontSize: isMobile ? '0.6rem' : '0.9rem', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
          Network Topology & Pathfinding Analysis
        </p>
      </motion.div>

      <motion.div 
        className="graph-cards-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {graphCards.map((card) => (
          <GraphCard key={card.id} card={card} />
        ))}
      </motion.div>

      <motion.div 
        className="footer-panel"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <FaTerminal style={{ fontSize: '1.5rem', opacity: 0.2 }} />
        <div>
          <h4>Computational Complexity Module</h4>
          <p>Each module provides real-time visualization of recursion stacks and pointer manipulation.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default GraphAlgorithmsList;