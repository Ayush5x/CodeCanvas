import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../../components/Navbar';
import { useIsMobile } from '../../../hooks/use-mobile';

import { 
  FaArrowRight,
  FaTerminal,
  FaClock,
  FaBalanceScale,
  FaTree,
  FaLayerGroup
} from 'react-icons/fa';

const treeCards = [
  {
    id: 'bst',
    title: 'Binary Search Tree',
    description: 'Discrete hierarchical ordering where left < root < right. This recursive property ensures every node maintains a sorted path, enabling efficient searching and seamless dynamic updates.',
    icon: <FaTree />,
    route: '/dsa/tree/bst',
    difficulty: 'Beginner',
    timeComplexity: 'O(log n)',
    features: ['Ordered','Hierarchical', 'Recursive', 'Dynamic']
  },
  {
    id: 'heap',
    title: 'Min/Max Heap',
    description: 'Priority-based complete binary structure. Essential for scheduling and efficient sorting protocols.',
    icon: <FaLayerGroup />,
    route: '/dsa/tree/heap',
    difficulty: 'Intermediate',
    timeComplexity: 'O(1) Peek',
    features: ['Priority', 'Complete', 'Array-based','Sorting']
  },
  {
    id: 'avl',
    title: 'AVL Tree',
    description: 'Automated rotational corrections—Single (LL, RR) or Double (LR, RL)—instantly fix balance violations. These O(1) pointer shifts guarantee a stable O(log n) height, ensuring peak lookup performance.',
    icon: <FaBalanceScale />,
    route: '/dsa/tree/avl',
    difficulty: 'Advanced',
    timeComplexity: 'O(log n)',
    features: ['Balanced', 'Rotations', 'Rotational','Optimal']
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

const TreeCard = ({ card }) => {
  const isMobile = useIsMobile();
  return (
    <motion.div
      variants={cardVariants}
      className="tree-card"
      whileHover={!isMobile ? { y: -10, transition: { duration: 0.3 } } : {}}
    >
      <div className="tree-card-link">
        <div className="tree-card-header">
          <div className="tree-card-icon">{card.icon}</div>
          <div className="tree-card-badges">
            <span className="difficulty-badge">{card.difficulty}</span>
            <span className="complexity-badge">
              <FaClock size={10}/>
              {card.timeComplexity}</span>
          </div>
        </div>
        
        <div className="tree-card-body">
          <h3 className="tree-card-title">{card.title}</h3>
          <p className="tree-card-description">{card.description}</p>
          
          <div className="tree-card-features">
            {card.features.map((feature, index) => (
              <span key={index} className="feature-tag">{feature}</span>
            ))}
          </div>
        </div>

        <div className="tree-card-footer">
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

const TreeHome = () => {
  const isMobile = useIsMobile();
  return (
    <div className="tree-home-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --bg: linear-gradient(300deg, #000000 30%, #444 40%, #000000d5 30%);
          --card-bg: #0a0a0a;
          --border: #1a1a1a;
          --text-dim: #888;
          --text-main: #eee;
          --font-sans: 'Inter', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        .tree-home-container {
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

        .tree-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(${isMobile ? '100%' : '380px'}, 1fr));
          gap: ${isMobile ? '15px' : '30px'};
          width: 100%;
          max-width: 1300px;
          padding-bottom: 50px;
        }

        .tree-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 28px;
          height: ${isMobile ? 'auto' : '650px'}; 
          min-height: ${isMobile ? '420px' : 'auto'};
          padding: ${isMobile ? '24px' : '40px'};
          position: relative;
          transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .tree-card-link {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .tree-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${isMobile ? '1.5rem' : '3rem'};
        }

        .tree-card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .tree-card-icon {
          font-size: ${isMobile ? '1.8rem' : '2.5rem'};
          color: var(--text-main);
        }

        .tree-card-badges {
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
          background: #f1ede7d2;
          border-color: #f1ede7;
        }

        .tree-card-title {
          font-size: ${isMobile ? '1.5rem' : '2.2rem'};
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-main);
          line-height: 1.1;
        }

        .tree-card-heading {
          font-family: var(--font-sans);
          font-size: ${isMobile ? '2rem' : '3.8rem'};
          font-weight: 300;
          margin-bottom: 0.5rem;
          color: var(--text-main);
          line-height: 1.1;
          letter-spacing: -0.04em;
          text-align: center;
        }

        .tree-card-description {
          color: var(--text-dim);
          font-size: ${isMobile ? '0.8rem' : '0.9rem'};
          line-height: 1.7;
        }

        .tree-card-features {
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
          background: #f0e7e7;
          font-size: 9px;
          font-family: var(--font-mono);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: 0.5s;
        }

        .tree-card:hover {
          box-shadow: 0px 5px 25px rgba(255, 255, 255, 0.05);
          border-color: rgba(255,255,255,0.2);
        }

        .learn-more-btn:hover {
          background: #fff;
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
          font-weight: 600;
          margin: 0 0 5px 0; 
          font-size: 1rem; 
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
        <h1 className="tree-card-heading">Tree Structures</h1>
        <p style={{ fontWeight: 300, letterSpacing: '0.2em', fontSize: isMobile ? '0.6rem' : '0.9rem', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
          Hierarchical Memory & Recursive Optimization
        </p>
      </motion.div>

      <motion.div 
        className="tree-cards-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {treeCards.map((card) => (
          <TreeCard key={card.id} card={card} />
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

export default TreeHome;