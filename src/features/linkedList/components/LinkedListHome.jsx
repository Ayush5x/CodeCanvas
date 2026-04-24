import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../../components/Navbar';
import { useIsMobile } from '../../../hooks/use-mobile';
import { 
  FaListUl, 
  FaSyncAlt,
  FaArrowRight,
  FaTerminal,
  FaMicrochip,
  FaClock,
  FaExchangeAlt
} from 'react-icons/fa';

const linkedListCards = [
  {
    id: 'singly',
    title: 'Singly Linked List',
    description: 'Fundamental linear structure where nodes point forward. Optimized for dynamic memory and rapid head operations.',
    icon: <FaListUl />,
    route:'/dsa/linked-list/single',
    difficulty: 'LEVEL 01',
    timeComplexity: 'O(N)',
    features: ['Linear traversal', 'Dynamic size', 'Memory efficient'],
  },
  {
    id: 'circular',
    title: 'Circular Linked List',
    description: 'An infinite loop structure where the tail connects back to the head. Backbone of round-robin algorithms.',
    icon: <FaSyncAlt />,
    route: '/dsa/linked-list/circular',
    difficulty: 'LEVEL 02',
    timeComplexity: 'O(N)',
    features: ['Endless loop', 'Zero Null Pointers', 'CPU Scheduling'],
  },
  {
    id: 'doubly',
    title: 'Doubly Linked List',
    description: 'Bi-directional node linkage allowing seamless forward and backward navigation. Critical for undo-redo systems.',
    icon: <FaExchangeAlt />,
    route: '/dsa/linked-list/double',
    difficulty: 'LEVEL 03',
    timeComplexity: 'O(N)',
    features: ['Bi-Directional', 'Instant Deletion', 'Ease of Navigation'],
  }
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

const LinkedListCard = ({ card }) => {
  const isMobile = useIsMobile();
  return (
    <motion.div
      variants={cardVariants}
      className="linkedlist-card"
      whileHover={!isMobile ? { y: -10, transition: { duration: 0.3 } } : {}}
    >
      <div className="linkedlist-card-link">
        <div className="linkedlist-card-header">
          <div className="linkedlist-card-icon">{card.icon}</div>
          <div className="linkedlist-card-badges">
            <span className="difficulty-badge">{card.difficulty}</span>
            <span className="complexity-badge">
              <FaClock size={10}/>
              {card.timeComplexity}</span>
          </div>
        </div>
        
        <div className="linkedlist-card-body">
          <h3 className="linkedlist-card-title">{card.title}</h3>
          <p className="linkedlist-card-description">{card.description}</p>
          
          <div className="linkedlist-card-features">
            {card.features.map((feature, index) => (
              <span key={index} className="feature-tag">{feature}</span>
            ))}
          </div>
        </div>

        <div className="linkedlist-card-footer">
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

const LinkedListHome = () => {
  const isMobile = useIsMobile();
  return (
    <div className="linkedlist-home-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap');

        :root {
          --bg: linear-gradient(300deg, #000000 30%, #36c0c39c 40%, #000000d5 30%);
          --card-bg: #0a0a0a;
          --border: #1a1a1a;
          --text-dim: #666;
          --text-main: #eee;
          --font-sans: 'Inter', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        .linkedlist-home-container {
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

        .linkedlist-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(${isMobile ? '100%' : '380px'}, 1fr));
          gap: ${isMobile ? '15px' : '30px'};
          width: 100%;
          max-width: 1300px;
          padding-bottom: 50px;
        }

        .linkedlist-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 28px;
          height: ${isMobile ? 'auto' : '650px'}; 
          min-height: ${isMobile ? '400px' : 'auto'};
          padding: ${isMobile ? '24px' : '40px'};
          position: relative;
          transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .linkedlist-card-link {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .linkedlist-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${isMobile ? '1.5rem' : '3rem'};
        }

        .linkedlist-card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .linkedlist-card-icon {
          font-size: ${isMobile ? '1.8rem' : '2.5rem'};
          color: var(--text-main);
        }

        .linkedlist-card-badges {
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

        .linkedlist-card-title {
          font-size: ${isMobile ? '1.5rem' : '2.2rem'};
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-main);
          line-height: 1.1;
        }

        .linkedlist-card-heading {
          font-family: var(--font-sans);
          font-size: ${isMobile ? '2rem' : '3.8rem'};
          font-weight: 300;
          margin-bottom: 0.5rem;
          color: var(--text-main);
          line-height: 1.1;
          letter-spacing: -0.04em;
          text-align: center;
        }

        .linkedlist-card-description {
          color: var(--text-dim);
          font-size: ${isMobile ? '0.8rem' : '0.9rem'};
          line-height: 1.7;
        }

        .linkedlist-card-features {
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
          background: #57dee0a7;
          font-size: 9px;
          font-family: var(--font-mono);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: 0.5s;
        }

        .linkedlist-card:hover {
          box-shadow: 0px 5px 25px rgba(255, 255, 255, 0.05);
          border-color: rgba(255,255,255,0.2);
        }

        .learn-more-btn:hover {
          background: #57dee0;
          color: black;
        }

        .linkedlist-home-footer {
          margin-top: 3rem;
          color: white;
          font-size: 9px;
          letter-spacing: 2px;
          font-family: var(--font-mono);
          text-align: center;
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
        <h1 className="linkedlist-card-heading">Linked Lists</h1>
        <p style={{ fontWeight: 300, letterSpacing: '0.2em', fontSize: isMobile ? '0.6rem' : '0.9rem', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
          Memory Visualization & Sequence Execution
        </p>
      </motion.div>

      <motion.div 
        className="linkedlist-cards-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {linkedListCards.map((card) => (
          <LinkedListCard key={card.id} card={card} />
        ))}
      </motion.div>

      <footer className="linkedlist-home-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
          <FaMicrochip />
          <span>INITIALIZE_SEQUENCE</span>
          <FaMicrochip />
        </div>
      </footer>
    </div>
  );
};

export default LinkedListHome;