import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight, FaInfoCircle, FaCheckCircle, FaExclamationCircle, FaTerminal, FaCube, FaSyncAlt, FaUndo } from 'react-icons/fa';

const CircularLinkedListExplanation = () => {
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
          border: 1px solid rgba(0, 255, 204, 0.2);
          border-radius: 15px;
          padding: 18px 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: 0.3s;
        }

        .explanation-header:hover {
          background: rgba(0, 255, 204, 0.05);
          box-shadow: 0 0 20px rgba(0, 255, 204, 0.1);
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
          color: #00ffcc;
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
          background: rgba(0, 255, 204, 0.03);
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
          padding: 15px;
          border-radius: 10px;
          font-size: 12px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          transition: 0.2s;
        }

        .explanation-content li:hover {
          background: rgba(0, 255, 204, 0.05);
          border-color: rgba(0, 255, 204, 0.2);
        }

        .icon-cyan { color: #00ffcc; flex-shrink: 0; }
        
        .step-tag {
          background: #222;
          color: #00ffcc;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: bold;
          border: 1px solid rgba(0, 255, 204, 0.2);
        }
      `}</style>

      <div className="explanation-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="header-title">
          <FaSyncAlt className="icon-cyan" />
          SYSTEM_OS: CIRCULAR_LINKED_LIST_SPEC
        </div>
        {isExpanded ? <FaChevronDown style={{color: '#444'}} /> : <FaChevronRight style={{color: '#444'}} />}
      </div>

      {isExpanded && (
        <div className="explanation-content">
          <h4><FaTerminal className="icon-cyan" /> THE_ANALOGY</h4>
          <div className="analogy-box">
            "Think of a Circular Linked List as a <strong>Merry-Go-Round</strong>. In a normal line, there is a clear start and a clear end. But here, the person at the very back is holding the hand of the person at the very front. You can keep walking forward forever and you will never fall off the edge."
          </div>
          

          <h4><FaCube className="icon-cyan" /> INFINITE_POINTER_LOGIC</h4>
          <p style={{fontSize: '13px'}}>
            A <strong>Circular Node</strong> looks exactly like a Singly node, but its behavior is different:
          </p>
          <ul>
            <li>
              <FaSyncAlt className="icon-cyan" />
              <div><strong>The Loop:</strong> The <em>last</em> node stores the address of the <em>first</em> node instead of <code>NULL</code>.</div>
            </li>
            <li>
              <FaUndo className="icon-cyan" />
              <div><strong>No Dead Ends:</strong> There is no 'null' pointer in the entire sequence. The system is always pointing to valid data.</div>
            </li>
          </ul>

          <h4><FaCheckCircle className="icon-cyan" /> SYSTEM_ADVANTAGES</h4>
          <ul>
            <li><span className="step-tag">ADV_01</span> <strong>Continuous Play:</strong> Perfect for things that need to repeat, like a music playlist.</li>
            <li><span className="step-tag">ADV_02</span> <strong>Access Freedom:</strong> You can start at ANY node and still visit every other node in the list.</li>
            <li><span className="step-tag">ADV_03</span> <strong>Queue Management:</strong> Ideal for 'Round Robin' scheduling where everyone gets a turn in a circle.</li>
          </ul>

          <h4><FaExclamationCircle style={{color: '#ff4444'}} /> CRITICAL_WARNINGS</h4>
          <ul>
            <li><span className="step-tag" style={{color:'#ff4444', borderColor:'#ff4444'}}>ERR_01</span> <strong>Infinite Loops:</strong> If your code isn't careful, it will keep running in circles forever. You must know when to stop!</li>
            <li><span className="step-tag" style={{color:'#ff4444', borderColor:'#ff4444'}}>ERR_02</span> <strong>Complexity:</strong> It is harder to find the 'End' because the end technically doesn't exist.</li>
          </ul>

          <h4><FaTerminal className="icon-cyan" /> REAL_WORLD_APPLICATION</h4>
          <p style={{fontSize: '13px'}}>
            <strong>Round Robin Scheduling:</strong> Operating systems use this to give every app a tiny bit of CPU time. Once it finishes with the last app, it circles right back to the first one!
          </p>

          <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', fontSize: '10px', color: '#444', textAlign: 'center' }}>
            CLL_SPEC_FINAL | READY_FOR_TRAVERSAL | STATUS: SYSTEM_OPTIMIZED
          </div>
        </div>
      )}
    </div>
  );
};

export default CircularLinkedListExplanation;