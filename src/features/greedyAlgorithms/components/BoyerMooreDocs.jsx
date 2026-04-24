import React from "react";

const BoyerMooreDocs = () => {
  return (
    <div className="bm-doc-root">
      <style>{`
        .bm-doc-root {
          background: #000;
          color: #fff;
          padding: 60px 40px 0 40px;
          font-family: 'Inter', -apple-system, sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .bm-doc-container {
          max-width: 1800px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: auto;
          gap: 20px;
          flex: 1;
        }

        .glass {
          background: #000;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 40px;
          display: flex;
          flex-direction: column;
        }

        .col-span-3 { grid-column: span 3; }
        .col-span-2 { grid-column: span 2; }
        .col-span-1 { grid-column: span 1; }

        .title {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          text-transform: uppercase;
        }

        .subtitle {
          font-size: 1rem;
          color: #666;
          margin-top: 8px;
          border-left: 1px solid #333;
          padding-left: 15px;
        }

        .section-title {
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 24px;
          color: #666;
        }

        .text {
          font-size: 1rem;
          color: #ccc;
          line-height: 1.8;
        }

        .code {
          background: #111;
          padding: 24px;
          border-radius: 8px;
          font-family: 'SFMono-Regular', Consolas, monospace;
          font-size: 0.9rem;
          border: 1px solid #222;
          color: #eee;
          line-height: 1.5;
        }

        .stat-container {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #333;
          padding-top: 20px;
          margin-top: auto;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.7rem;
          color: #555;
          text-transform: uppercase;
        }

        .stat-value {
          font-size: 1.2rem;
          font-weight: 600;
          color: #fff;
        }

        /* FOOTER STYLES */
        .bm-footer {
          max-width: 1800px;
          width: 100%;
          margin: 60px auto 0;
          padding-top: 40px;
          border-top: 1px solid #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #444;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        @media (max-width: 1200px) {
          .col-span-3, .col-span-2, .col-span-1 {
            grid-column: span 4;
          }
          .bm-footer {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }
      `}</style>

      <div className="bm-doc-container">
        
        {/* ROW 1 */}
        <div className="glass col-span-3">
          <div className="title">Boyer–Moore</div>
          <div className="subtitle">Majority Vote Algorithm — Linear Time Search</div>
        </div>

        <div className="glass col-span-1">
          <div className="section-title">Performance</div>
          <div className="stat-container">
            <div className="stat-item">
              <span className="stat-label">Time</span>
              <span className="stat-value">O(n)</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Space</span>
              <span className="stat-value">O(1)</span>
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="glass col-span-2">
          <div className="section-title">01. Overview</div>
          <div className="text">
            Designed to find the element that appears more than <strong>⌊n/2⌋</strong> times. 
            The algorithm processes the array in a single pass using a streaming 
            approach.
          </div>
        </div>

        <div className="glass col-span-2">
          <div className="section-title">02. Voting Logic</div>
          <div className="code">
{`if (count === 0) {
  candidate = current;
  count = 1;
} else if (current === candidate) {
  count++;
} else {
  count--;
}`}
          </div>
        </div>

        {/* ROW 3 */}
        <div className="glass col-span-3">
          <div className="section-title">03. Full Implementation</div>
          <div className="code">
{`function majorityElement(nums) {
  let candidate = null;
  let count = 0;

  for (let num of nums) {
    if (count === 0) candidate = num;
    count += (num === candidate) ? 1 : -1;
  }

  let actualCount = 0;
  for (let num of nums) {
    if (num === candidate) actualCount++;
  }

  return actualCount > Math.floor(nums.length / 2) ? candidate : null;
}`}
          </div>
        </div>

        <div className="col-span-1" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div className="glass" style={{flex: 1}}>
            <div className="section-title">Trace Example</div>
            <div className="text" style={{fontSize: '0.85rem', fontFamily: 'monospace'}}>
              [3, 1, 2, 3, 3]<br/>
              ↑<br/>
              Cand: 3, Count: 1
            </div>
          </div>
          <div className="glass" style={{flex: 1, border: '1px solid #fff'}}>
            <div className="section-title" style={{color: '#fff'}}>Requirement</div>
            <div className="text" style={{color: '#fff'}}>
              Validation is mandatory if the presence of a majority is not guaranteed.
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bm-footer">
        <div>Algorithm Documentation</div>
        <div>Standard Complexity Library — 2026</div>
        <div>Reference: Robert S. Boyer & J Strother Moore</div>
      </footer>
    </div>
  );
};

export default BoyerMooreDocs;