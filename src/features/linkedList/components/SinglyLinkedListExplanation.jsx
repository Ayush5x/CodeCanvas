import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight, FaInfoCircle, FaCheckCircle, FaExclamationCircle, FaTerminal, FaCube, FaLink } from 'react-icons/fa';

const SinglyLinkedListExplanation = () => {
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
          border-left: 3px solid #00ffcc;
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
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 10px;
        }

        .explanation-content li {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 12px;
          border-radius: 8px;
          font-size: 12px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .icon-cyan { color: #00ffcc; flex-shrink: 0; margin-top: 3px; }
        .icon-magenta { color: #ff00ff; flex-shrink: 0; margin-top: 3px; }
        
        .step-tag {
          background: #333;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 9px;
          margin-right: 8px;
        }

      `}</style>

      <div className="explanation-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="header-title">
          <FaInfoCircle className="icon-cyan" />
          START_HERE: WHAT IS A LINKED LIST?
        </div>
        {isExpanded ? <FaChevronDown style={{color: '#444'}} /> : <FaChevronRight style={{color: '#444'}} />}
      </div>

      {isExpanded && (
        <div className="explanation-content">
          <h4><FaTerminal className="icon-cyan" /> THE_ANALOGY</h4>
          <div className="analogy-box">
            "Imagine a Treasure Hunt. You have a clue in your hand. That clue tells you where the treasure is, but it ALSO tells you where to find the NEXT clue. You can't skip clues; you must follow the chain one by one until you reach the end."
          </div>

          <h4><FaCube className="icon-magenta" /> HOW_IT_WORKS</h4>
          <p style={{fontSize: '13px'}}>
            A Singly Linked List is just a chain of <strong>Nodes</strong> (data boxes). Each box has two compartments:
          </p>
          <ul>
            <li>
              <FaLink className="icon-cyan" />
              <div><strong>The Data:</strong> The actual info you want to store (like a number or name).</div>
            </li>
            <li>
              <FaLink className="icon-magenta" />
              <div><strong>The Pointer:</strong> A "Next" signpost that tells the computer exactly where the next box is located in memory.</div>
            </li>
          </ul>

          <h4><FaCheckCircle className="icon-cyan" /> WHY_USE_IT? (PROS)</h4>
          <ul>
            <li><span className="step-tag">01</span> Easy to add things to the very front of the list instantly.</li>
            <li><span className="step-tag">02</span> No wasted space! You only create a box when you actually need it.</li>
            <li><span className="step-tag">03</span> It can grow forever (or until your RAM is full).</li>
          </ul>

          <h4><FaExclamationCircle className="icon-magenta" /> THE_CATCH (CONS)</h4>
          <ul>
            <li><span className="step-tag">01</span> One-Way Only: You can't go back to the previous box.</li>
            <li><span className="step-tag">02</span> No Teleporting: To find the 10th item, you MUST start at the 1st and walk through all of them.</li>
          </ul>

          <h4><FaTerminal className="icon-cyan" /> REAL_WORLD_EXAMPLE</h4>
          <p style={{fontSize: '13px'}}>
            Think of the <strong>'Undo'</strong> button in your text editor. Every time you type, the app adds a new "state" to a linked list. When you press Undo, it just moves back through the chain!
          </p>

          <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', fontSize: '10px', color: '#444', textAlign: 'center' }}>
            DOC_READY_FOR_BEGINNERS | ENJOY_LEARNING
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglyLinkedListExplanation;