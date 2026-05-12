import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight, FaInfoCircle, FaCheckCircle, FaExclamationCircle, FaTerminal, FaCube, FaExchangeAlt, FaHistory } from 'react-icons/fa';

const DoublyLinkedListExplanation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="explanation-wrapper">
      <style>{`
        .explanation-wrapper {
          margin: 20px 0;
          font-family: 'Space Mono', monospace;
        }

        .explanation-header {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 18px 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: 0.3s;
        }

        .explanation-header:hover {
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 15px;
          font-weight: 700;
          color: white;
          font-size: 14px;
          letter-spacing: 1px;
        }

        .explanation-content {
          margin-top: 15px;
          background: rgba(10, 10, 10, 0.7);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 30px;
          color: #aaa;
          line-height: 1.6;
          animation: slideDown 0.4s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .explanation-content h4 {
          color: white;
          margin-bottom: 12px;
          margin-top: 25px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .explanation-content h4:first-child { margin-top: 0; }

        .analogy-box {
          background: rgba(255, 255, 255, 0.03);
          border-left: 3px solid #ff00ff;
          padding: 15px;
          margin: 15px 0;
          border-radius: 0 10px 10px 0;
          font-style: italic;
          font-size: 13px;
          color: #eee;
        }

        .explanation-content ul {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
        }

        .explanation-content li {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 15px;
          border-radius: 10px;
          font-size: 12px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          transition: 0.2s;
        }

        .explanation-content li:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .icon-cyan { color: #00ffcc; flex-shrink: 0; }
        .icon-magenta { color: #ff00ff; flex-shrink: 0; }
        
        .step-tag {
          background: #333;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: bold;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 10px;
        }

        .comp-card {
          background: rgba(255, 255, 255, 0.02);
          padding: 15px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      <div className="explanation-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="header-title">
          <FaInfoCircle className="icon-magenta" />
          CORE_SPECS: DOUBLY_LINKED_LIST
        </div>
        {isExpanded ? <FaChevronDown style={{color: '#444'}} /> : <FaChevronRight style={{color: '#444'}} />}
      </div>

      {isExpanded && (
        <div className="explanation-content">
          <h4><FaTerminal className="icon-magenta" /> THE_ANALOGY</h4>
          <div className="analogy-box">
            "Think of a Singly Linked List as a One-Way Alley. Once you pass a house, you can't go back. A Doubly Linked List is a <strong>Two-Way Street</strong>. Each house has two doors: one leading to the neighbor on the right, and one leading back to the neighbor on the left."
          </div>
          

          <h4><FaCube className="icon-cyan" /> MEMORY_UPGRADE</h4>
          <p style={{fontSize: '13px'}}>
            In this version, our <strong>Nodes</strong> (data boxes) get an extra compartment. They are heavier but smarter:
          </p>
          <ul>
            <li>
              <FaExchangeAlt className="icon-magenta" />
              <div><strong>Prev Pointer:</strong> Holds the address of the <em>previous</em> house.</div>
            </li>
            <li>
              <FaHistory className="icon-cyan" />
              <div><strong>Next Pointer:</strong> Holds the address of the <em>next</em> house.</div>
            </li>
            <li>
              <FaTerminal className="icon-cyan" />
              <div><strong>The Data:</strong> Your actual information (number, text, etc).</div>
            </li>
          </ul>

          <h4><FaCheckCircle className="icon-cyan" /> SYSTEM_ADVANTAGES</h4>
          <ul>
            <li><span className="step-tag">PRO_01</span> <strong>Freedom of Movement:</strong> Walk forward OR backward through your data.</li>
            <li><span className="step-tag">PRO_02</span> <strong>Easy Deletion:</strong> If you are standing at a node, you can delete it instantly because you already know who its neighbors are.</li>
            <li><span className="step-tag">PRO_03</span> <strong>Undo/Redo:</strong> Perfect for 'Previous' and 'Next' functionality.</li>
          </ul>

          <h4><FaExclamationCircle className="icon-magenta" /> THE_COST</h4>
          <ul>
            <li><span className="step-tag">CON_01</span> <strong>Storage:</strong> Every node now takes up more "RAM" because it has to store two addresses instead of one.</li>
            <li><span className="step-tag">CON_02</span> <strong>Logic complexity:</strong> When adding a node, you have to update 4 pointers instead of 2 to keep the chain connected.</li>
          </ul>

          <h4><FaTerminal className="icon-cyan" /> REAL_WORLD_USE</h4>
          <p style={{fontSize: '13px'}}>
            Your <strong>Web Browser History</strong> uses this! When you click 'Back', the browser uses the <code>Prev</code> pointer. When you click 'Forward', it uses the <code>Next</code> pointer.
          </p>

          <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', fontSize: '10px', color: '#444', textAlign: 'center' }}>
            DLL_SPEC_V2.0 | OPTIMIZED_FOR_LEARNING | STATUS: VERIFIED
          </div>
        </div>
      )}
    </div>
  );
};

export default DoublyLinkedListExplanation;