import { useState } from 'react';
import { FaTrash, FaCode, FaFileCode } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeDisplay = ({ cCode, pseudocode, blocks = [], onRemoveBlock }) => {
  const [activeTab, setActiveTab] = useState('c');

  return (
    <div className="code-display">
      <div className="code-tabs">
        <button
          className={`tab ${activeTab === 'c' ? 'active' : ''}`}
          onClick={() => setActiveTab('c')}
        >
          <FaCode /> C Code
        </button>
        <button
          className={`tab ${activeTab === 'pseudo' ? 'active' : ''}`}
          onClick={() => setActiveTab('pseudo')}
        >
          <FaFileCode /> Pseudocode
        </button>
        <button
          className={`tab ${activeTab === 'blocks' ? 'active' : ''}`}
          onClick={() => setActiveTab('blocks')}
        >
          <FaFileCode /> Block Structure
        </button>
      </div>

      <div className="code-content">
        {activeTab === 'c' && (
          <div className="code-section">
            <h4>Generated C Code</h4>
            {cCode ? (
              <SyntaxHighlighter
                language="c"
                style={dracula}
                customStyle={{
                  margin: 0,
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                {cCode}
              </SyntaxHighlighter>
            ) : (
              <div className="empty-code">
                <p>No code generated yet</p>
                <small>Add blocks to generate C code</small>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pseudo' && (
          <div className="code-section">
            <h4>Generated Pseudocode</h4>
            {pseudocode ? (
              <pre className="pseudocode-display">
                {pseudocode}
              </pre>
            ) : (
              <div className="empty-code">
                <p>No pseudocode generated yet</p>
                <small>Add blocks to generate pseudocode</small>
              </div>
            )}
          </div>
        )}

        {activeTab === 'blocks' && (
          <div className="code-section">
            <h4>Block Structure</h4>
            {blocks.length > 0 ? (
              <div className="blocks-list">
                {blocks.map((block, index) => (
                  <div key={block.id} className={`block-item block-${block.type}`}>
                    <div className="block-info">
                      <span className="block-index">{index + 1}.</span>
                      <span className="block-type">{block.type.toUpperCase()}</span>
                      {block.value && (
                        <span className="block-value">: {block.value}</span>
                      )}
                    </div>
                    {onRemoveBlock && (
                      <button
                        className="remove-block-btn"
                        onClick={() => onRemoveBlock(block.id)}
                        title="Remove this block"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-code">
                <p>No blocks added yet</p>
                <small>Add blocks to see the structure</small>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeDisplay;
