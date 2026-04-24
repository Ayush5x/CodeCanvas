import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaPlay, FaStop, FaSyncAlt, FaTerminal, FaCode, FaMicrochip, FaCogs } from 'react-icons/fa';
import Editor from "@monaco-editor/react";
import { generateDoublyLinkedListCode } from '../../../utils/doublyLinkedListCodeGenerator';

const DoublyLinkedListCodeViewer = ({ code, onChange, nodes, onStepChange, currentLine = 0, isAnimating = false }) => {
  const [showInteractiveCode, setShowInteractiveCode] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(500);

  const getEnhancedCode = () => {
    return `#include <stdio.h>
#include <stdlib.h>

// Node structure for doubly linked list
struct Node {
    int data;                      // Data stored in the node
    struct Node* prev;             // Pointer to previous node
    struct Node* next;             // Pointer to next node
};

// Create a new node
struct Node* createNode(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->prev = NULL;
    newNode->next = NULL;
    return newNode;
}

// Doubly Linked List structure
struct DoublyLinkedList {
    struct Node* head;             // Pointer to first node
    struct Node* tail;             // Pointer to last node
};

// Initialize empty list
struct DoublyLinkedList* createList() {
    struct DoublyLinkedList* list = (struct DoublyLinkedList*)malloc(sizeof(struct DoublyLinkedList));
    list->head = NULL;
    list->tail = NULL;
    return list;
}

// Insert element at beginning of list
void insertAtBeginning(struct DoublyLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    newNode->prev = NULL;                      // Set prev to null

    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
        list->tail = newNode;                  // Node also becomes tail
    } else {                                   // List has nodes
        newNode->next = list->head;            // Point to current head
        list->head->prev = newNode;            // Current head's prev points to new node
        list->head = newNode;                  // Update head pointer
    }
}

// Delete element from beginning
void deleteFromBeginning(struct DoublyLinkedList* list) {
    if (list->head == NULL) return;            // Check if empty
    
    struct Node* nodeToDelete = list->head;    // Store reference
    
    if (list->head == list->tail) {            // Only one node
        list->head = NULL;                     // List becomes empty
        list->tail = NULL;
    } else {
        list->head = list->head->next;         // Move head pointer
        list->head->prev = NULL;               // New head's prev is NULL
    }
    
    free(nodeToDelete);                        // Free memory
}`;
  };

  const handleEditorChange = useCallback((value) => {
    if (!onChange) return;
    const lines = value.split('\n');
    const nodesData = [];
    try {
      lines.forEach(line => {
        const insertBeginMatch = line.match(/insertAtBeginning\s*\(\s*list\s*,\s*(\d+)\s*\)/);
        const insertEndMatch = line.match(/insertAtEnd\s*\(\s*list\s*,\s*(\d+)\s*\)/);
        if (insertBeginMatch) {
          nodesData.unshift({ data: parseInt(insertBeginMatch[1]) });
        } else if (insertEndMatch) {
          nodesData.push({ data: parseInt(insertEndMatch[1]) });
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
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
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
          box-shadow: 0 4px 15px rgba(255,255,255,0.1);
        }

        .runtime-velocity {
          display: flex;
          align-items: center;
          gap: 20px;
          font-size: 11px;
          color: #888;
        }

        .runtime-velocity input[type="range"] {
          accent-color: white;
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
          text-shadow: 0 0 10px rgba(0,255,204,0.3);
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
          background: white;
          color: black;
          transform: translateY(-2px);
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
          <span style={{color: 'white', width: '50px'}}>{animationSpeed}ms</span>
        </div>

        {isAnimating && (
          <div className="status-badge">
            <div className="runtime-spinner"></div>
            <span>PTR_TRACE_ACTIVE</span>
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
                backgroundColor: lineNumber === currentLine ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                display: 'block',
                borderLeft: lineNumber === currentLine ? '4px solid white' : '4px solid transparent',
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
            defaultValue={code || generateDoublyLinkedListCode(nodes)}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              padding: { top: 25 },
              fontFamily: 'Space Mono',
              scrollbar: { verticalScrollbarSize: 8 },
              automaticLayout: true,
              cursorSmoothCaretAnimation: true
            }}
            onChange={handleEditorChange}
          />
        )}
      </div>
    </div>
  );
};

export default DoublyLinkedListCodeViewer;