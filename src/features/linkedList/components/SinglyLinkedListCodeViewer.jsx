import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaTerminal, FaCode, FaMicrochip, FaSyncAlt } from 'react-icons/fa';
import Editor from "@monaco-editor/react";
import { generateSinglyLinkedListCode } from '../../../utils/singlyLinkedListCodeGenerator';

const SinglyLinkedListCodeViewer = ({ code, onChange, nodes, onStepChange, currentLine = 0, isAnimating = false }) => {
  const [showInteractiveCode, setShowInteractiveCode] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(500);

  const getEnhancedCode = () => {
    return `#include <stdio.h>
#include <stdlib.h>

// Node structure for singly linked list
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

// Singly Linked List structure
struct SinglyLinkedList {
    struct Node* head;             // Pointer to first node
};

// Initialize empty list
struct SinglyLinkedList* createList() {
    struct SinglyLinkedList* list = (struct SinglyLinkedList*)malloc(sizeof(struct SinglyLinkedList));
    list->head = NULL;
    return list;
}

// Insert element at beginning of list
void insertAtBeginning(struct SinglyLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    newNode->next = list->head;                // Point to current head
    list->head = newNode;                      // Update head pointer
    printf("Inserted %d\\n", value);
}

// Insert element at end of list
void insertAtEnd(struct SinglyLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    newNode->next = NULL;                      // Set next to null
    
    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
    } else {                                   // List has nodes
        struct Node* current = list->head;     // Start from head
        while (current->next != NULL) {        // Traverse to end
            current = current->next;
        }
        current->next = newNode;               // Link to new node
    }
    printf("Inserted %d\\n", value);
}

// Insert element at specific position
void insertAtPosition(struct SinglyLinkedList* list, int value, int position) {
    if (position < 0) {                        // Validate position
        printf("Position cannot be negative\\n");
        return;
    }
    
    if (position == 0) {                       // Insert at beginning
        insertAtBeginning(list, value);
        return;
    }
    
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    
    struct Node* current = list->head;         // Start from head
    for (int i = 0; i < position - 1 && current != NULL; i++) {
        current = current->next;               // Traverse to position
    }
    
    if (current == NULL) {                     // Position beyond list
        printf("Position out of range\\n");
        free(newNode);
        return;
    }
    
    newNode->next = current->next;             // Link new node
    current->next = newNode;                   // Update previous link
    printf("Inserted %d at position %d\\n", value, position);
}

// Delete element from beginning
void deleteFromBeginning(struct SinglyLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    struct Node* nodeToDelete = list->head;    // Store reference
    list->head = list->head->next;             // Move head pointer
    free(nodeToDelete);                        // Free memory
    printf("Deleted from beginning\\n");
}

// Delete element from end
void deleteFromEnd(struct SinglyLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    if (list->head->next == NULL) {            // Only one node
        free(list->head);                      // Free memory
        list->head = NULL;                     // List becomes empty
        printf("Deleted from end\\n");
        return;
    }
    
    struct Node* current = list->head;         // Start from head
    while (current->next->next != NULL) {     // Find second last
        current = current->next;
    }
    
    free(current->next);                       // Free last node
    current->next = NULL;                      // Update link
    printf("Deleted from end\\n");
}

// Delete element from specific position
void deleteFromPosition(struct SinglyLinkedList* list, int position) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    if (position < 0) {                        // Validate position
        printf("Position cannot be negative\\n");
        return;
    }
    
    if (position == 0) {                       // Delete from beginning
        deleteFromBeginning(list);
        return;
    }
    
    struct Node* current = list->head;         // Start from head
    for (int i = 0; i < position - 1 && current != NULL; i++) {
        current = current->next;               // Traverse to position
    }
    
    if (current == NULL || current->next == NULL) { // Position beyond list
        printf("Position out of range\\n");
        return;
    }
    
    struct Node* nodeToDelete = current->next; // Store reference
    current->next = nodeToDelete->next;        // Update link
    free(nodeToDelete);                        // Free memory
    printf("Deleted from position %d\\n", position);
}

// Display the list
void display(struct SinglyLinkedList* list) {
    struct Node* current = list->head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\\n");
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
          background: rgba(15, 15, 15, 0.9);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 25px;
          color: white;
          font-family: 'Space Mono', monospace;
        }

        .viewer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .code-mode-toggle {
          display: flex;
          gap: 10px;
          background: rgba(255, 255, 255, 0.03);
          padding: 5px;
          border-radius: 12px;
        }

        .mode-button {
          background: transparent;
          border: none;
          color: #555;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          transition: 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mode-button.active {
          background: white;
          color: black;
        }

        .velocity-control {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 10px;
          color: #888;
        }

        .velocity-control input[type="range"] {
          accent-color: white;
          width: 120px;
          cursor: pointer;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          color: #00ffcc;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .runtime-spinner {
          width: 10px;
          height: 10px;
          border: 2px solid #00ffcc;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .action-bar {
          margin-bottom: 20px;
        }

        .os-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .os-btn:hover:not(:disabled) {
          background: white;
          color: black;
        }

        .code-surface {
          border-radius: 15px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: #121212;
        }
      `}</style>

      <div className="viewer-header">
        <div className="code-mode-toggle">
          <button 
            className={`mode-button ${!showInteractiveCode ? 'active' : ''}`}
            onClick={() => setShowInteractiveCode(false)}
          >
            <FaCode /> Editable
          </button>
          <button 
            className={`mode-button ${showInteractiveCode ? 'active' : ''}`}
            onClick={() => setShowInteractiveCode(true)}
          >
            <FaTerminal /> Runtime
          </button>
        </div>

        <div className="velocity-control">
          <span>VELOCITY:</span>
          <input 
            type="range" 
            min="100" 
            max="2000" 
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
          />
          <span style={{color: 'white', width: '45px'}}>{animationSpeed}ms</span>
        </div>

        {isAnimating && (
          <div className="status-badge">
            <div className="runtime-spinner"></div>
            <span>PTR_ACTIVE</span>
          </div>
        )}
      </div>

      <div className="action-bar">
        <button 
          className="os-btn"
          disabled={isAnimating}
          onClick={() => onStepChange && onStepChange('reset')}
        >
          <FaSyncAlt /> RESET_HIGHLIGHT
        </button>
      </div>

      <div className="code-surface">
        {showInteractiveCode ? (
          <SyntaxHighlighter
            language="c"
            style={vs2015}
            wrapLines={true}
            showLineNumbers={true}
            lineProps={lineNumber => ({
              style: { 
                backgroundColor: lineNumber === currentLine ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                display: 'block',
                borderLeft: lineNumber === currentLine ? '4px solid white' : '4px solid transparent',
                paddingLeft: '10px',
                transition: '0.2s'
              }
            })}
            customStyle={{
              margin: 0,
              padding: '20px',
              fontSize: '13px',
              lineHeight: '1.6',
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
            defaultValue={code || generateSinglyLinkedListCode(nodes)}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              padding: { top: 20 },
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

export default SinglyLinkedListCodeViewer;