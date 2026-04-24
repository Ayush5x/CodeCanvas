import React from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaCode, FaMicrochip, FaNetworkWired, FaClock, FaHdd, FaTerminal, FaLayerGroup } from 'react-icons/fa';

const BFSDocPage = () => {
  return (
    <div className="doc-container">
      <style>{`
        .doc-container {
          background: #000;
          color: #fff;
          min-height: 100vh;
          /* Changed padding to prioritize left alignment */
          padding: 4rem 10% 4rem 5%; 
          font-family: 'Inter', sans-serif;
        }

        .doc-wrapper {
          /* Removed margin auto to move content from the middle */
          max-width: 1100px; 
          text-align: left;
        }

        .doc-header {
          border-left: 4px solid #fff;
          padding-left: 2rem;
          margin-bottom: 5rem;
        }

        .doc-header h1 {
          font-size: 3.5rem; /* Slightly larger for a more industrial look */
          font-weight: 900;
          letter-spacing: -3px;
          margin: 0.5rem 0;
          text-transform: uppercase;
        }

        .system-tag {
          font-family: 'JetBrains Mono', monospace;
          color: #444;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 5px;
        }

        .section {
          margin-bottom: 5rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 0.75rem;
          font-weight: 900;
          margin-bottom: 2rem;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 3px;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px; /* More angular, industrial feel */
          padding: 3rem;
          backdrop-filter: blur(20px);
        }

        .complexity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
        }

        .spec-box {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid #1a1a1a;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .spec-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.4rem;
          color: #fff;
        }

        .code-terminal {
          background: #050505;
          border: 1px solid #111;
          padding: 2.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          line-height: 1.8;
          color: #888;
        }

        .trace-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
        }

        .trace-table th {
          text-align: left;
          padding: 15px;
          color: #444;
          border-bottom: 2px solid #111;
        }

        .trace-table td {
          padding: 15px;
          border-bottom: 1px solid #0a0a0a;
        }

        .active-row td {
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }

        .list-item {
          margin-bottom: 1.5rem;
          padding-left: 2.5rem;
          position: relative;
          color: #777;
        }

        .list-item::before {
          content: '—';
          position: absolute;
          left: 0;
          color: #333;
        }
      `}</style>

      <motion.div 
        className="doc-wrapper"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <header className="doc-header">
          <span className="system-tag">PROTOCOL_DOC // BFS_v1.0</span>
          <h1>Engine Logic</h1>
          <p style={{color: '#666', fontSize: '1.1rem', maxWidth: '600px'}}>
            A high-fidelity traversal specification for identifying shortest paths within unweighted graph structures.
          </p>
        </header>

        {/* 01 Abstract Layer */}
        <section className="section">
          <div className="section-title"><FaMicrochip /> 01_Abstract_Layer</div>
          <div className="glass-card" style={{maxWidth: '800px'}}>
            <p style={{color: '#999', fontSize: '1.1rem', lineHeight: 1.8}}>
              The <b style={{color: '#fff'}}>Breadth-First Search</b> algorithm operates as an exhaustive exploration strategy. 
              By prioritizing horizontal expansion over vertical depth, it guarantees <b style={{color: '#fff'}}>optimal distance mapping</b> 
              across all reachable nodes from the primary coordinate.
            </p>
          </div>
        </section>

        {/* 02 Trace Analysis */}
        <section className="section">
          <div className="section-title"><FaLayerGroup /> 02_Trace_Analysis</div>
          <div className="glass-card">
            <table className="trace-table">
              <thead>
                <tr>
                  <th>Cycle</th>
                  <th>Node_ID</th>
                  <th>Queue_Stack</th>
                  <th>Registry_Status</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>00</td><td>-</td><td>[0]</td><td>ACTIVE [0]</td></tr>
                <tr className="active-row"><td>01</td><td>0</td><td>[1, 2]</td><td>ACTIVE [0, 1, 2]</td></tr>
                <tr className="active-row"><td>02</td><td>1</td><td>[2, 3]</td><td>ACTIVE [0, 1, 2, 3]</td></tr>
                <tr><td>03</td><td>2</td><td>[3]</td><td>COMPLETE</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 03 Specs */}
        <section className="section">
          <div className="section-title"><FaNetworkWired /> 03_Execution_Specs</div>
          <div className="complexity-grid">
            <div className="spec-box">
              <FaClock style={{opacity: 0.3}} />
              <div>
                <div className="spec-label" style={{color: '#444', fontSize: '0.6rem', fontWeight: 900}}>TIME_COMPLEXITY</div>
                <div className="spec-value">O(V + E)</div>
              </div>
            </div>
            <div className="spec-box">
              <FaHdd style={{opacity: 0.3}}/>
              <div>
                <div className="spec-label" style={{color: '#444', fontSize: '0.6rem', fontWeight: 900}}>SPACE_COMPLEXITY</div>
                <div className="spec-value">O(V)</div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 Logic Manifesto */}
        <section className="section">
          <div className="section-title"><FaCode /> 04_Logic_Manifesto</div>
          <div className="code-terminal">
            <div><span style={{color: '#fff'}}>function</span> runBFS(origin) &#123;</div>
            <div>&nbsp;&nbsp;let queue = [origin];</div>
            <div>&nbsp;&nbsp;let registry = new Set([origin]);</div>
            <div>&nbsp;&nbsp;while (queue.length &gt; 0) &#123;</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;let node = queue.shift();</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#333'}}>// Execute sequence</span></div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;for (let adj of node.links) &#123;</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (!registry.has(adj)) &#123;</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;registry.add(adj);</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;queue.push(adj);</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&#125;</div>
            <div>&nbsp;&nbsp;&#125;</div>
            <div>&#125;</div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default BFSDocPage;