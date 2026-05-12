import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaPlay, FaStop, FaSyncAlt, FaTerminal, FaCode, FaMicrochip, FaCogs } from 'react-icons/fa';
import Editor from "@monaco-editor/react";
import { generateCircularLinkedListCode } from '../../../utils/circularLinkedListCodeGenerator';

const CircularLinkedListCodeViewer = ({ code, onChange, nodes, onStepChange, currentLine = 0, isAnimating = false }) => {
  const [showInteractiveCode, setShowInteractiveCode] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(500);

  // Enhanced C code for Circular Logic
  const getEnhancedCode = () => {
    return `#include <stdio.h>
#include <stdlib.h>

// Node structure for circular linked list
struct Node {
    int data;                      // Data stored in the node
    struct Node* next;             // Pointer to next node
};

// Create a new node
struct Node* createNode(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = NULL;
    return newNode;
}

// Circular Linked List structure
struct CircularLinkedList {
    struct Node* head;             // Pointer to first node
};

// Insert element at beginning
void insertAtBeginning(struct CircularLinkedList* list, int value) {
    struct Node* newNode = createNode(value);
    
    if (list->head == NULL) {
        list->head = newNode;
        newNode->next = newNode;       // Points to itself (Circle)
    } else {
        struct Node* current = list->head;
        while (current->next != list->head) { // Find Tail
            current = current->next;
        }
        newNode->next = list->head;    // New node points to head
        current->next = newNode;       // Tail points to new node
        list->head = newNode;          // Update head
    }
}

// Delete element from beginning
void deleteFromBeginning(struct CircularLinkedList* list) {
    if (list->head == NULL) return;
    
    if (list->head->next == list->head) {
        free(list->head);
        list->head = NULL;
    } else {
        struct Node* current = list->head;
        while (current->next != list->head) { // Find Tail
            current = current->next;
        }
        struct Node* temp = list->head;
        current->next = list->head->next; // Tail points to new head
        list->head = list->head->next;    // Move head
        free(temp);
    }
}`;
  };

  const handleEditorChange = useCallback((value) => {
    if (!onChange) return;
    const lines = value.split('\n');
    const nodesData = [];
    try {
      lines.forEach(line => {
        const insertBeginMatch = line.match(/insertAtBeginning\s*\(\s*list\s*,\s*(\d+)\s*\)/);
        if (insertBeginMatch) {
          nodesData.unshift({ data: parseInt(insertBeginMatch[1]) });
        }
      });
      onChange(nodesData);
    } catch (error) {
      console.warn('Error parsing code:', error);
    }
  }, [onChange]);

  return (
    <div className="code-viewer-container">
      <style>{`
        .code-viewer-container {
          background: rgba(15, 15, 15, 0.95);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 30px;
          color: white;
          font-family: 'Space Mono', monospace;
        }

        .viewer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .code-mode-toggle {
          display: flex;
          gap: 10px;
          background: rgba(255, 255, 255, 0.03);
          padding: 6px;
          border-radius: 14px;
        }

        .mode-button {
          background: transparent;
          border: none;
          color: #666;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          transition: 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mode-button.active {
          background: white;
          color: black;
        }

        .runtime-velocity {
          display: flex;
          align-items: center;
          gap: 20px;
          font-size: 11px;
          color: #888;
        }

        .runtime-velocity input[type="range"] {
          accent-color: #00ffcc;
          width: 140px;
          cursor: pointer;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          color: #00ffcc;
          font-weight: bold;
        }

        .runtime-spinner {
          width: 12px;
          height: 12px;
          border: 2px solid #00ffcc;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .os-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 25px;
        }

        .os-btn:hover:not(:disabled) {
          background: #00ffcc;
          color: black;
          border-color: #00ffcc;
        }

        .code-surface {
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: #0d0d0d;
          box-shadow: inset 0 0 30px rgba(0,0,0,0.5);
        }
      `}</style>

      <div className="viewer-header">
        <div className="code-mode-toggle">
          <button 
            className={`mode-button ${!showInteractiveCode ? 'active' : ''}`}
            onClick={() => setShowInteractiveCode(false)}
          >
            <FaCode /> SOURCE
          </button>
          <button 
            className={`mode-button ${showInteractiveCode ? 'active' : ''}`}
            onClick={() => setShowInteractiveCode(true)}
          >
            <FaTerminal /> RUNTIME
          </button>
        </div>

        <div className="runtime-velocity">
          <span>VELOCITY:</span>
          <input 
            type="range" 
            min="100" 
            max="2000" 
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
          />
          <span style={{color: '#00ffcc', width: '50px'}}>{animationSpeed}ms</span>
        </div>

        {isAnimating && (
          <div className="status-badge">
            <div className="runtime-spinner"></div>
            <span>PTR_LOOP_ACTIVE</span>
          </div>
        )}
      </div>

      <button 
        className="os-btn"
        disabled={isAnimating}
        onClick={() => onStepChange && onStepChange('reset')}
      >
        <FaSyncAlt /> RESET_INSTRUCTION_POINTER
      </button>

      <div className="code-surface">
        {showInteractiveCode ? (
          <SyntaxHighlighter
            language="c"
            style={vs2015}
            wrapLines={true}
            showLineNumbers={true}
            lineProps={lineNumber => ({
              style: { 
                backgroundColor: lineNumber === currentLine ? 'rgba(0, 255, 204, 0.12)' : 'transparent',
                display: 'block',
                borderLeft: lineNumber === currentLine ? '4px solid #00ffcc' : '4px solid transparent',
                paddingLeft: '15px',
                transition: '0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }
            })}
            customStyle={{
              margin: 0,
              padding: '25px',
              fontSize: '13px',
              lineHeight: '1.8',
              height: '65vh',
              background: 'transparent'
            }}
          >
            {getEnhancedCode()}
          </SyntaxHighlighter>
        ) : (
          <Editor
            height="65vh"
            defaultLanguage="c"
            defaultValue={code || generateCircularLinkedListCode(nodes)}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              padding: { top: 25 },
              fontFamily: 'Space Mono',
              scrollbar: { verticalScrollbarSize: 8 },
              automaticLayout: true
            }}
            onChange={handleEditorChange}
          />
        )}
      </div>
    </div>
  );
};

export default CircularLinkedListCodeViewer;