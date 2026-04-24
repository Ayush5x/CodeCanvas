import React from 'react';
import { FaInfoCircle, FaBolt, FaLayerGroup, FaHistory, FaMicrochip } from 'react-icons/fa';

const ExponentialSearchDoc = () => {
  return (
    <div className="doc-root">
      <style>{`
        .doc-root { 
          max-width: 1550px; 
          margin: 2rem auto; 
          font-family: 'Inter', sans-serif;
        }
        .cc-glass { 
          background: #09090b; 
          border: 1px solid #18181b; 
          border-radius: 12px; 
          overflow: hidden; 
        }
        .cc-label { 
          padding: 0.9rem 1.2rem; 
          border-bottom: 1px solid #18181b; 
          font-size: 0.65rem; 
          color: #52525b; 
          text-transform: uppercase; 
          font-weight: 600; 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          letter-spacing: 0.05em;
        }
        .doc-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
          gap: 1.5rem; 
          padding: 1.5rem; 
        }
        .doc-card { 
          background: rgba(255,255,255,0.01); 
          border: 1px solid #18181b; 
          padding: 1.5rem; 
          border-radius: 10px; 
        }
        .doc-card h4 { 
          color: #22d3ee; 
          font-size: 0.75rem; 
          margin-bottom: 1rem; 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          text-transform: uppercase; 
        }
        .doc-card p { 
          color: #a1a1aa; 
          font-size: 0.9rem; 
          line-height: 1.6; 
          margin: 0; 
        }
        .cc-math { 
          color: #fff; 
          font-family: 'JetBrains Mono', monospace; 
          background: rgba(255,255,255,0.05); 
          padding: 2px 6px; 
          border-radius: 4px; 
        }
        .matrix-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 1rem; 
          font-size: 0.85rem; 
        }
        .matrix-table th { 
          text-align: left; 
          color: #52525b; 
          padding: 8px; 
          border-bottom: 1px solid #18181b; 
        }
        .matrix-table td { 
          padding: 12px 8px; 
          color: #fff; 
          border-bottom: 1px solid #0f0f11; 
        }
        .highlight-cyan { color: #22d3ee; }
      `}</style>

      <div className="cc-glass">
        <div className="cc-label">
          <FaInfoCircle /> Engineering Documentation: Exponential_Search_V1
        </div>

        <div className="doc-grid">
          {/* Theory Section */}
          <div className="doc-card">
            <h4><FaBolt /> The "Galloping" Strategy</h4>
            <p>
              Exponential search (or Galloping Search) is designed to handle sorted datasets where the 
              bounds are unknown or infinite. By jumping in powers of two 
              <span className="cc-math">2^0, 2^1, 2^2...</span>, the engine quickly finds a range 
              where the target resides, then switches to a surgical 
              <span className="highlight-cyan"> Binary Search</span> within that specific sub-window.
            </p>
          </div>

          {/* Performance Matrix */}
          <div className="doc-card">
            <h4><FaMicrochip /> Performance Matrix</h4>
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Complexity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Best Case</td>
                  <td className="highlight-cyan">O(1)</td>
                </tr>
                <tr>
                  <td>Average/Worst Case</td>
                  <td className="highlight-cyan">O(log i)</td>
                </tr>
                <tr>
                  <td>Space Complexity</td>
                  <td>O(1) Iterative</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Use Case */}
          <div className="doc-card">
            <h4><FaLayerGroup /> Ideal Deployments</h4>
            <p>
              This algorithm is the industry standard for <strong>Unbounded Arrays</strong>. 
              If you are searching a sorted stream of data where you don't know the end point, 
              Exponential Search provides a logarithmic time guarantee relative to the 
              target's position <span className="cc-math">i</span>, rather than the total size 
              <span className="cc-math">n</span>.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ 
          padding: '1rem 1.5rem', 
          borderTop: '1px solid #18181b', 
          background: 'rgba(34, 211, 238, 0.02)',
          fontSize: '0.75rem',
          color: '#52525b'
        }}>
          <strong>Note:</strong> Dataset must be strictly sorted for the doubling phase to correctly identify boundaries. Failure to sort will result in undefined engine behavior.
        </div>
      </div>
    </div>
  );
};

export default ExponentialSearchDoc;