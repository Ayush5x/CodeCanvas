import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGithub, FaBook, FaRocket, FaRegLightbulb, FaListUl, FaLayerGroup, 
  FaTree, FaProjectDiagram, FaSitemap, FaSortNumericDown, FaChartLine, 
  FaCode, FaRandom, FaSlidersH, FaSearch, FaCog, FaGamepad, FaBolt,
  FaFilter, FaCubes, FaExchangeAlt, FaDigitalTachograph, FaNetworkWired
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/landingpage.css';
import Robocats from '../../../assets/Robocats.svg';
import logo from '../../../assets/openverse2.svg';

const Card = ({ title, link, icon, type, enabled = true, gradientClass }) => {
  // Apply card class with gradient class
  const cardClasses = `homepage-card ${enabled ? '' : 'homepage-card-disabled'} ${gradientClass || ''}`;
  
  const content = (
    <>
      <div className="homepage-card-title-box">
        {title}
      </div>
      <div className="homepage-card-illustration">
        {icon}
      </div>
      <div className="homepage-learn-more-btn">
        Learn more
        <span className="homepage-learn-more-arrow">→</span>
      </div>
    </>
  );
  
  if (enabled && link) {
    return (
      <Link to={link} className={cardClasses}>
        {content}
      </Link>
    );
  }
  
  return (
    <div className={cardClasses}>
      {content}
    </div>
  );
};

const HomePage = () => {
  // Card data structure with gradient classes cycling through the 3 gradient types
  const dataStructureCards = [
    {
      title: 'Linked Lists',
      link: '/archive/pyq/linked-list', 
      icon: <FaListUl size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Stacks & Queues',
      link: '/archive/pyq/stacks-queues',
      icon: <FaLayerGroup size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Trees',
      link: '/archive/pyq/trees',
      icon: <FaTree size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Pathfinding',
      link: '/archive/pyq/pathfinding',
      icon: <FaProjectDiagram size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Hash Tables',
      link: '/archive/pyq/hash-tables',
      icon: <FaSitemap size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Graphs',
      link: '/archive/pyq/graphs',
      icon: <FaLayerGroup size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Sorting Algorithms',
      link: '/archive/pyq/sorting',
      icon: <FaSortNumericDown size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Dynamic Programming',
      link: '/archive/pyq/dynamic-programming',
      icon: <FaChartLine size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Backtracking',
      link: '/archive/pyq/backtracking',
      icon: <FaRandom size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Greedy Algorithms',
      link: '/archive/pyq/greedy-algorithms',
      icon: <FaCode size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Binary Search',
      link: '/archive/pyq/binary-search',
      icon: <FaSearch size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Bit Manipulation',
      link: '/archive/pyq/bit-manipulation',
      icon: <FaDigitalTachograph size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Trie',
      link: '/archive/pyq/trie',
      icon: <FaNetworkWired size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Sliding Window',
      link: '/archive/pyq/sliding-window',
      icon: <FaExchangeAlt size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Two Pointers',
      link: '/archive/pyq/two-pointers',
      icon: <FaExchangeAlt size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    }
  ];
  
  const algorithmCards = [
    {
      title: 'Linked Lists',
      link: '/archive/linked-list',
      icon: <FaListUl size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Stacks & Queues',
      link: '/archive/stacks-queues',
      icon: <FaLayerGroup size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Trees',
      link: '/archive/trees',
      icon: <FaTree size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Pathfinding',
      link: '/archive/pathfinding',
      icon: <FaProjectDiagram size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Hash Tables',
      link: '/archive/hash-tables',
      icon: <FaSitemap size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Heaps',
      link: '/archive/heaps',
      icon: <FaLayerGroup size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Sorting Algorithms',
      link: '/archive/sorting',
      icon: <FaSortNumericDown size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Dynamic Programming',
      link: '/archive/dynamic-programming',
      icon: <FaChartLine size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Backtracking',
      link: '/archive/backtracking',
      icon: <FaRandom size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Greedy Algorithms',
      link: '/archive/greedy-algorithms',
      icon: <FaCode size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Binary Search',
      link: '/archive/binary-search',
      icon: <FaSearch size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Bit Manipulation',
      link: '/archive/bit-manipulation',
      icon: <FaDigitalTachograph size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Trie',
      link: '/archive/trie',
      icon: <FaNetworkWired size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Sliding Window',
      link: '/archive/sliding-window',
      icon: <FaExchangeAlt size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Two Pointers',
      link: '/archive/two-pointers',
      icon: <FaExchangeAlt size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    }
  ];

  return (
    <div className="homepage">
      {/* Enhanced starry background overlay */}
      <div className="homepage-bg-overlay"></div>
      
      <header className="homepage-header">
        <div className="homepage-logo">
          <a href="/">
            <img src={logo} alt="Openverse logo" />
            <span>Openverse</span>
          </a>
        </div>
         <div className="homepage-nav">
          {/* --- Cool "Take a Quiz" Button --- */}
          <motion.div
           
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5, type: "spring", stiffness: 200 } }}
            className="take-quiz-btn-wrapper"
          >

            <Link to="/quiz" className="take-quiz-btn">
           
              <span className="quiz-btn-icon">
                <FaRocket size={20} />
              </span>
              <span className="quiz-btn-text">Take a Quiz</span>
              <span className="quiz-btn-emoji" role="img" aria-label="sparkles">✨</span>
            </Link>
            <span className="quiz-btn-glow"></span>
          </motion.div>
          
          {/* --- End Cool Button --- */}
          <Link to="/about" className="homepage-nav-link">About us</Link>
          <a
            href="https://github.com/Openverse-iiitk/DSA-Website"
            target="_blank"
            rel="noopener noreferrer"
            className="homepage-nav-link"
          >
            <FaGithub size={24} />
          </a>
        </div>
      </header>

      <main className="homepage-main">
        <motion.h1
          className="homepage-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          TestLab
        </motion.h1>
         <span>🧐</span>
        <div className="homepage-columns">
          <div className="homepage-column">
            <h2 className="homepage-column-title">IIITK PYQ's</h2>
            <div className="homepage-card-grid">
              {dataStructureCards.map((card, index) => (
                <Card
                  key={`ds-${index}`}
                  title={card.title}
                  link={card.link}
                  icon={card.icon}
                  gradientClass={card.gradientClass}
                  type="ds"
                  enabled={card.enabled}
                />
              ))}
            </div>
          </div>
          
          <div className="homepage-divider"></div>
          
          <div className="homepage-column">
            <h2 className="homepage-column-title">LeetCode <sub> sorted by topic </sub> </h2> 
            <div className="homepage-card-grid">
              {algorithmCards.map((card, index) => (
                <Card
                  key={`algo-${index}`}
                  title={card.title}
                  link={card.link}
                  icon={card.icon}
                  gradientClass={card.gradientClass}
                  type="algo"
                  enabled={card.enabled}
                />
              ))}
            </div>
          </div>
        </div>  
          
         
      </main>

      <footer className="homepage-footer-container">
       
      </footer>
    </div>
  );
};

export default HomePage;
