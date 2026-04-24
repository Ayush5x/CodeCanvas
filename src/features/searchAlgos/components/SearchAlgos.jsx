import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaRocket, FaChartLine, FaTh } from 'react-icons/fa';

import BinarySearchVisualizer from './BinarySearchVisualizer';
import LinearSearchVisualizer from './LinearSearchVisualizer';
import JumpSearchVisualizer from './JumpSearchVisualizer';
import ExponentialSearchVisualizer from './ExponentialSearchVisualizer';
import SearchHomepage from './SearchHomepage';

const SearchAlgos = () => {
  const { algo } = useParams();
  const navigate = useNavigate();
  const activeAlgo = algo || 'overview';

  const navItems = [
    { id: 'linear', icon: <FaSearch />, label: 'Linear' },
    { id: 'binary', icon: <FaRocket />, label: 'Binary' },
    { id: 'jump', icon: <FaChartLine />, label: 'Jump' },
    {id:'expo',icon:<FaChartLine/>,label:'expo'}
  ];

  const renderContent = () => {
    switch (activeAlgo) {
      case 'linear': return <LinearSearchVisualizer />;
      case 'binary': return <BinarySearchVisualizer />;
      case 'jump': return <JumpSearchVisualizer />;
      case 'expo':return <ExponentialSearchVisualizer/>
      default: return <SearchHomepage onAlgorithmSelect={(id) => navigate(`/dsa/search/${id}`)} />;
    }
  };

  return (
    <div className="algo-orchestrator">
      

      <AnimatePresence mode="wait">
        <motion.div
          key={activeAlgo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SearchAlgos;