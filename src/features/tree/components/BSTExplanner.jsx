import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaBookOpen, FaMicrochip, FaTerminal, FaCode, 
  FaPlus, FaSearch, FaInfoCircle, FaExclamationTriangle 
} from 'react-icons/fa';

/**
 * BSTDocumentation - Premium Beginner-Friendly Guide
 * Theme: Black & White Glassmorphism
 */
const BSTDocumentation = () => {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=JetBrains+Mono:wght@400;700&display=swap');

    .doc-page-root {
      width: 100%;
      background: #000;
      color: #fff;
      padding: 80px 0;
      font-family: 'Space Grotesk', sans-serif;
    }

    .glass-panel-full {
      width: 100%;
      background: rgba(255, 255, 255, 0.015);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 80px 10%;
      box-sizing: border-box;
    }

    .doc-header-main {
      margin-bottom: 60px;
      border-left: 6px solid #fff;
      padding-left: 25px;
    }

    .doc-header-main h1 {
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin: 0;
    }

    /* --- VISUAL DIAGRAM AREA --- */
    .visual-treelab-diagram {
      position: relative;
      width: 100%;
      height: 350px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      margin-bottom: 60px;
      display: flex;
      justify-content: center;
    }

    .tree-node-viz {
      position: absolute;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #000;
      border: 2px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      z-index: 5;
    }

    .node-root { top: 40px; }
    .node-l1 { top: 140px; left: calc(50% - 120px); }
    .node-r1 { top: 140px; left: calc(50% + 120px); opacity: 0.2; }
    .node-target { top: 240px; left: calc(50% - 180px); border-style: dashed; background: rgba(255,255,255,0.1); }

    .path-line-viz {
      position: absolute;
      background: #fff;
      height: 2px;
      box-shadow: 0 0 15px #fff;
      z-index: 1;
    }

    /* --- STEP LIST --- */
    .step-list { display: flex; flex-direction: column; gap: 40px; }
    .step-item { display: flex; gap: 30px; }
    .step-num {
      width: 40px; height: 40px; border-radius: 50%; background: #fff; color: #000;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: 700;
    }

    .step-content b { font-size: 1.3rem; display: block; margin-bottom: 10px; }
    .step-content p { color: rgba(255,255,255,0.5); line-height: 1.8; margin: 0; }

    .logic-gate-box {
      background: #fff; color: #000; padding: 25px; border-radius: 15px;
      margin-top: 20px; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem;
    }

    .complexity-table {
      width: 100%; border-collapse: collapse; margin-top: 50px;
    }
    .complexity-table td, .complexity-table th {
      padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: left;
    }
    .highlight-gold { color: #ffd700; font-family: 'JetBrains Mono', monospace; }
  `;

  return (
    <div className="doc-page-root">
      <style>{styles}</style>
      
      <div className="glass-panel-full">
        <header className="doc-header-main">
          <h1>BST Architecture Guide</h1>
          <p style={{color: 'rgba(255,255,255,0.4)', marginTop: '10px'}}>How Binary Search Trees manage hierarchical data efficiency.</p>
        </header>

        {/* Visual Example Section */}
        <section className="example-section">
          <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px'}}>
            <FaBookOpen size={24} />
            <h2 style={{margin: 0, textTransform: 'uppercase', letterSpacing: '2px'}}>The Comparison Process: Inserting "25"</h2>
          </div>

          <div className="visual-treelab-diagram">
            {/* Diagram Content */}
            <div className="tree-node-viz node-root">50</div>
            <div className="path-line-viz" style={{ width: '130px', transform: 'rotate(140deg)', top: '85px', left: 'calc(50% - 70px)' }}></div>
            <div className="tree-node-viz node-l1">30</div>
            <div className="tree-node-viz node-r1">70</div>
            <div className="path-line-viz" style={{ width: '100px', transform: 'rotate(120deg)', top: '185px', left: 'calc(50% - 150px)' }}></div>
            <div className="tree-node-viz node-target"><FaPlus size={12} style={{marginRight: '5px'}}/> 25</div>
          </div>

          <div className="step-list">
            <div className="step-item">
              <div className="step-num">1</div>
              <div className="step-content">
                <b>The Entry Point (Root)</b>
                <p>The system lands on the first available node, the <b>Root</b> (e.g., 50). This is the starting coordinate for all logic.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-num">2</div>
              <div className="step-content">
                <b>Comparison Logic: The Decision Gate</b>
                <p>The algorithm performs a mathematical comparison: <code>Is 25 &lt; 50?</code></p>
                
                <div className="logic-gate-box">
                  <b>IF TRUE (25 &lt; 50):</b> The system immediately <b>discards</b> the entire Right side of the tree. <br/><br/>
                  <b>THE ACTION:</b> The computer's focus "jumps" to the Left child address. We have just ignored 50% of the potential search area.
                </div>
              </div>
            </div>

            <div className="step-item">
              <div className="step-num">3</div>
              <div className="step-content">
                <b>Placement & Recursion</b>
                <p>The process repeats at the next node (30). <code>Is 25 &lt; 30?</code> <b>Yes.</b> Since there is no node to the left of 30, the system allocates memory for 25 right there.</p>
              </div>
            </div>
          </div>
        </section>

        <hr style={{margin: '80px 0', borderColor: 'rgba(255,255,255,0.05)'}} />

        {/* Technical Specs */}
        <section className="tech-specs">
          <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px'}}>
            <FaMicrochip size={24} />
            <h2 style={{margin: 0, textTransform: 'uppercase', letterSpacing: '2px'}}>Kernel Specifications</h2>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px'}}>
            <div>
              <h3><FaTerminal size={18} style={{marginRight: '10px'}}/> Traversal Logic</h3>
              <p style={{color: 'rgba(255,255,255,0.5)', lineHeight: '1.8'}}>
                BSTs use <b>Recursive Descent</b>. Each choice effectively splits the remaining dataset in half, resulting in high-speed $O(\log n)$ performance.
              </p>
            </div>
            <div>
              <h3><FaExclamationTriangle size={18} style={{marginRight: '10px', color: '#ffd700'}}/> Balancing Warning</h3>
              <p style={{color: 'rgba(255,255,255,0.5)', lineHeight: '1.8'}}>
                If data is inserted in sorted order (1, 2, 3...), the tree becomes "Skewed" (a straight line). This turns our fast tree into a slow $O(n)$ linked list.
              </p>
            </div>
          </div>

          <table className="complexity-table">
            <thead>
              <tr style={{color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontSize: '0.8rem'}}>
                <th>Operation</th>
                <th>Average (Balanced)</th>
                <th>Worst (Skewed)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Search</td>
                <td className="highlight-gold">O(log n)</td>
                <td>O(n)</td>
              </tr>
              <tr>
                <td>Insert</td>
                <td className="highlight-gold">O(log n)</td>
                <td>O(n)</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default BSTDocumentation;