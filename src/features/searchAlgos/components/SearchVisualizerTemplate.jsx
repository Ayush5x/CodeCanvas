import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaArrowLeft, FaTerminal, FaCode, FaCogs, FaChartBar } from 'react-icons/fa';
// import './SearchVisualizerStyles.css';

const SearchVisualizerTemplate = ({
  title,
  description,
  complexity,
  children,
  codeComponent,
  controls,
  visualization,
  consoleOutput
}) => {
  return (
    <div className="viz-master-wrapper">
      <div className="dark-grain-overlay"></div>
      
      <nav className="viz-glass-nav">
        <div className="viz-nav-left">
          <Link to="/" className="viz-nav-link">
            <FaHome size={14} /> <span>Home</span>
          </Link>
          <span className="viz-nav-sep">/</span>
          <Link to="/dsa/search" className="viz-nav-link">
            <FaArrowLeft size={14} /> <span>Algorithms</span>
          </Link>
        </div>
        <div className="viz-nav-right">
          <span className="viz-status-pill">● System Active</span>
        </div>
      </nav>

      <div className="viz-container">
        <header className="viz-hero">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="viz-title"
          >
            {title}
          </motion.h1>
          <p className="viz-subtitle">{description}</p>
          
          <div className="viz-complexity-grid">
            <div className="viz-comp-pill">
              <small>TIME</small> <span>{complexity.time}</span>
            </div>
            <div className="viz-comp-pill">
              <small>SPACE</small> <span>{complexity.space}</span>
            </div>
          </div>
        </header>

        <main className="viz-main-grid">
          <div className="viz-column viz-left">
            <section className="viz-glass-panel viz-controls">
              <h3 className="viz-panel-tag"><FaCogs /> Controls</h3>
              <div className="viz-panel-content">{controls}</div>
            </section>

            <section className="viz-glass-panel viz-display">
              <h3 className="viz-panel-tag"><FaChartBar /> Visualization</h3>
              <div className="viz-panel-content">{visualization}</div>
            </section>

            <section className="viz-glass-panel viz-terminal">
              <h3 className="viz-panel-tag"><FaTerminal /> Algorithm Steps</h3>
              <div className="viz-terminal-content">{consoleOutput}</div>
            </section>
          </div>

          <aside className="viz-column viz-right">
            <section className="viz-glass-panel viz-code-window">
              <div className="viz-code-header">
                <h3 className="viz-panel-tag"><FaCode /> Implementation</h3>
                <div className="viz-window-controls">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <div className="viz-code-content">{codeComponent}</div>
            </section>
          </aside>
        </main>
        {children}
      </div>
    </div>
  );
};

export default SearchVisualizerTemplate;