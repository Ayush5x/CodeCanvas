import React from 'react';
import { 
  FaInfoCircle, FaLayerGroup, FaHistory, FaMicrochip, 
  FaTerminal, FaQuoteLeft, FaExclamationTriangle, FaBoxOpen, FaSitemap 
} from 'react-icons/fa';

const RecursionDocs = () => {
  return (
    <div className="doc-root">
      <style>{`
        .doc-root { 
          max-width: 1600px; 
          margin: 4rem auto; 
          font-family: 'Inter', sans-serif;
        }
        .cc-glass { 
          background: rgba(255, 255, 255, 0.01); 
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.05); 
          border-radius: 20px; 
          overflow: hidden; 
        }
        .cc-label { 
          padding: 1.2rem 1.5rem; 
          border-bottom: 1px solid rgba(255, 255, 255, 0.06); 
          font-size: 0.75rem; 
          color: #71717a; 
          text-transform: uppercase; 
          font-weight: 800; 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          letter-spacing: 0.2em;
        }
        .doc-main-grid { 
          display: grid; 
          grid-template-columns: 1.4fr 1fr; 
          gap: 3rem; 
          padding: 2.5rem; 
        }
        .mental-model-box {
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 2rem;
          margin: 1.5rem 0;
        }
        .doc-card h4 { 
          color: #fff; 
          font-size: 1rem; 
          margin-bottom: 1.2rem; 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          letter-spacing: 0.02em;
        }
        .doc-card p { 
          color: #a1a1aa; 
          font-size: 1rem; 
          line-height: 1.8; 
        }
        .highlight {
          color: #fff;
          font-weight: 600;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .spec-table { 
          width: 100%; 
          margin-top: 1rem;
          border-collapse: collapse;
        }
        .spec-table td { 
          padding: 16px 0; 
          color: #a1a1aa; 
          border-bottom: 1px solid rgba(255, 255, 255, 0.05); 
          font-size: 0.9rem;
        }
        .spec-value {
          text-align: right;
          color: #fff;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
        }
        .warning-box {
          background: rgba(255, 255, 255, 0.03);
          border-left: 2px solid #fff;
          padding: 1.2rem;
          margin-top: 2rem;
          display: flex;
          gap: 15px;
        }
        .warning-text {
          font-size: 0.85rem;
          color: #d4d4d8;
          line-height: 1.6;
        }
      `}</style>

      <div className="cc-glass">
        <div className="cc-label">
          <FaTerminal /> ARCHIVE_REF: 0xRECURSION // CORE_SPECIFICATIONS
        </div>

        <div className="doc-main-grid">
          {/* Section 1: The Concept (The Matryoshka Doll) */}
          <div className="concept-card">
            <div className="doc-card">
              <h4><FaBoxOpen /> The Mental Model: Matryoshka Dolls</h4>
              <p>
                Recursion is the process of a function calling itself to solve a smaller version of the same problem. 
                Think of <span className="highlight">Russian Matryoshka Dolls</span>:
              </p>
              
              <div className="mental-model-box">
                <FaQuoteLeft style={{ opacity: 0.1, fontSize: '2rem', marginBottom: '1rem' }} />
                <p style={{ color: '#d4d4d8', fontStyle: 'italic' }}>
                  "To reach the prize in the center, you must open a doll, find a smaller one, 
                  and repeat (<span className="highlight">Recursive Step</span>). You cannot stop 
                  until you find the doll that doesn't open (<span className="highlight">Base Case</span>). 
                  Only then do you close each doll back up, returning values to the previous layer."
                </p>
              </div>

              <p>
                In our visualizer, each frame on the <span className="highlight">Call Stack</span> represents an open doll. 
                If you forget the base case, the engine keeps opening dolls until the "table" (system memory) collapses—this is a 
                <strong> Stack Overflow</strong>.
              </p>

              <div className="warning-box">
                <FaExclamationTriangle style={{ color: '#fff', fontSize: '1.2rem' }} />
                <div className="warning-text">
                  <strong>RISK ASSESSMENT:</strong> Recursion creates high memory overhead. 
                  Every "open doll" consumes stack space until the entire chain resolves.
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Complexity Analysis (The Op) */}
          <div className="doc-card">
            <h4><FaMicrochip /> Complexity Matrix</h4>
            <table className="spec-table">
              <tbody>
                <tr>
                  <td><FaHistory style={{ marginRight: '10px' }} /> Time Complexity (Ops)</td>
                  <td className="spec-value">O(2ⁿ)</td>
                </tr>
                <tr>
                  <td><FaLayerGroup style={{ marginRight: '10px' }} /> Space Complexity (Stack)</td>
                  <td className="spec-value">O(n)</td>
                </tr>
                <tr>
                  <td><FaSitemap style={{ marginRight: '10px' }} /> Pattern Type</td>
                  <td className="spec-value">DIVIDE & CONQUER</td>
                </tr>
              </tbody>
            </table>

            <h4 style={{ marginTop: '3rem' }}><FaTerminal /> Execution Logic</h4>
            <p style={{ fontSize: '0.9rem', color: '#888' }}>
              When <code>fib(4)</code> is executed, the "Op" count isn't linear. Because the function calls itself twice, 
              the execution tree doubles in size with every increment of <strong>N</strong>. 
              <br /><br />
              This exponential growth is why the visualizer's <strong>Logic Trace</strong> becomes significantly 
              longer as you increase the input value.
            </p>
          </div>
        </div>

        <div style={{ 
          padding: '1.5rem', 
          textAlign: 'center', 
          background: 'rgba(255,255,255,0.02)', 
          fontSize: '0.65rem', 
          color: '#52525b',
          letterSpacing: '0.3em',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          DOCUMENT_STATUS: FINALIZED // SYSTEM_STABLE
        </div>
      </div>
    </div>
  );
};

export default RecursionDocs;