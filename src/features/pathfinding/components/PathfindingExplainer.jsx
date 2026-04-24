import React from 'react';
import { FaMicrochip, FaTerminal, FaCode, FaChartLine, FaProjectDiagram } from 'react-icons/fa';

/**
 * PathfindingDoc - Full Edge-to-Edge Premium Version
 * Features: Fluid width, frosted glass refraction, and technical hierarchy.
 */
const PathfindingDoc = () => {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=JetBrains+Mono:wght@400;700&display=swap');

    .doc-full-bleed {
      width: 100%;
      background: #000;
      color: #fff;
      padding: 0;
      margin: 0;
      font-family: 'Space Grotesk', sans-serif;
    }

    /* The Main Glass Panel spanning the entire width */
    .glass-panel-full {
      width: 100%;
      background: rgba(255, 255, 255, 0.015);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 80px 8%;
      box-sizing: border-box;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    }

    .doc-header-main {
      margin-bottom: 60px;
      border-left: 6px solid #fff;
      padding-left: 25px;
    }

    .doc-header-main h1 {
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: 5px;
      text-transform: uppercase;
      margin: 0;
    }

    .doc-content-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 60px;
      width: 100%;
    }

    .doc-section-title {
      font-size: 1.4rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 25px;
      color: #fff;
    }

    .doc-text {
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.8;
      font-size: 1.05rem;
      margin-bottom: 30px;
    }

    .algo-comparison-full {
      grid-column: span 2;
      display: flex;
      gap: 30px;
      margin-top: 40px;
    }

    .algo-card-full {
      flex: 1;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 24px;
      padding: 40px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .algo-card-full:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-8px);
    }

    .algo-card-full h4 {
      margin: 0 0 15px 0;
      font-size: 1.3rem;
      color: #fff;
      letter-spacing: 1px;
    }

    .complexity-meta {
      font-family: 'JetBrains Mono', monospace;
      color: #00ff88;
      font-size: 0.9rem;
      margin-top: 20px;
      display: block;
      padding-top: 15px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .protocol-strip {
      background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, transparent 100%);
      border-left: 4px solid #fff;
      padding: 25px;
      border-radius: 0 16px 16px 0;
      margin-bottom: 20px;
      transition: background 0.3s;
    }

    .protocol-strip:hover {
      background: linear-gradient(90deg, rgba(255,255,255,0.06) 0%, transparent 100%);
    }

    .protocol-strip b {
      display: block;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 8px;
      color: #fff;
    }

    code {
      font-family: 'JetBrains Mono', monospace;
      color: #00ff88;
      background: rgba(0, 255, 136, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
    }

    @media (max-width: 1100px) {
      .doc-content-grid, .algo-comparison-full {
        grid-template-columns: 1fr;
        flex-direction: column;
      }
      .glass-panel-full {
        padding: 60px 5%;
      }
    }
  `;

  return (
    <div className="doc-full-bleed">
      <style>{styles}</style>
      
      <div className="glass-panel-full">
        <header className="doc-header-main">
          <h1>Path Finder Documentation</h1>
        </header>

        <div className="doc-content-grid">
          {/* Architecture Section */}
          <div className="doc-section">
            <h3 className="doc-section-title"><FaMicrochip /> 01. Architecture & Logic</h3>
            <p className="doc-text">
              PathLab is a high-performance simulation environment modeled on a 2D discrete grid 
              representing an <b>Adjacency List</b> graph. Each node $(n)$ is processed relative to 
              its 4-way neighbors (Up, Down, Left, Right). The system calculates traversal costs 
              using a uniform edge weight of $1$.
            </p>
          </div>

          {/* Protocols Section */}
          <div className="doc-section">
            <h3 className="doc-section-title"><FaTerminal /> 02. Interface Protocols</h3>
            <div className="protocol-strip">
              <b>Obstacle Vectoring</b>
              <p style={{margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem'}}>
                Mouse interaction toggles the <code>isWall</code> bit, re-calculating the graph's traversable node set.
              </p>
            </div>
            <div className="protocol-strip" style={{borderLeftColor: '#bc13fe'}}>
              <b>Dynamic Re-routing</b>
              <p style={{margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem'}}>
                Repositioning 'S' or 'E' markers triggers a <code>softReset()</code>, clearing computational paths while preserving environmental obstacles.
              </p>
            </div>
          </div>

          {/* Algorithm Comparison */}
          <div className="algo-comparison-full">
            <div className="algo-card-full">
              <h4>Dijkstra's Algorithm</h4>
              <p className="doc-text" style={{fontSize: '0.95rem', margin: 0}}>
                An unweighted traversal evaluating nodes via $f(n) = g(n)$. It ensures mathematical 
                optimality by exhausting every available node in the search frontier until the target 
                is finalized.
              </p>
              <span className="complexity-meta">BIG O: $O((V+E) \log V)$</span>
            </div>

            <div className="algo-card-full">
              <h4>A* (A-Star) Search</h4>
              <p className="doc-text" style={{fontSize: '0.95rem', margin: 0}}>
                An informed search using $f(n) = g(n) + h(n)$. The heuristic $h(n)$ uses 
                <b> Manhattan Distance</b>: $|x_1-x_2| + |y_1-y_2|$ to focus the search area 
                towards the target, significantly reducing computational overhead.
              </p>
              <span className="complexity-meta">BIG O: $O(E)$ (Average Case)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathfindingDoc;