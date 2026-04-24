import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaHome, FaPlus, FaTrash, FaEye, FaLayerGroup, FaCode, FaInfoCircle, FaBookOpen } from 'react-icons/fa';
import CurrentOperationDisplay from './CurrentOperationDisplay';
import StackQueueExplanation from './StackQueueExplanation';
import DiySection from './DiySection';
import { ANIMATION_SPEEDS } from '../../../constants';
import { isValidInput } from '../../../utils/helpers';
import Header from '../../../components/Header';
const StackQueueVisualizer = () => {
  const [dataStructure, setDataStructure] = useState('stack');
  const [elements, setElements] = useState([]);
  const [value, setValue] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(ANIMATION_SPEEDS.MEDIUM);
  const [loading, setLoading] = useState(false);
  const maxSize = 10;
  
  const codeViewerRef = useRef(null);

  const showErrorMessage = useCallback((message) => {
    setShowError(true);
    setErrorMessage(message);
    const timeoutId = setTimeout(() => {
      setShowError(false);
      setErrorMessage('');
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  const isValidElementValue = useMemo(() => {
    return isValidInput(value) && value.trim().length > 0 && value.trim().length <= 3;
  }, [value]);

  useEffect(() => {
    setElements([]);
    setValue('');
    setCurrentStep('');
    setCurrentLine(0);
    setShowError(false);
    setErrorMessage('');
  }, [dataStructure]);

  const getAnimationDelay = () => animationSpeed;

  useEffect(() => {
    if (codeViewerRef.current && currentLine > 0 && isAnimating) {
      const preElement = codeViewerRef.current.querySelector('pre');
      const codeElement = codeViewerRef.current.querySelector('code');
      
      if (preElement && codeElement) {
        const lines = codeElement.querySelectorAll('span[style*="display: block"]');
        const targetLine = lines[currentLine - 1];

        if (targetLine) {
          const containerHalfHeight = preElement.clientHeight / 2;
          const lineHalfHeight = targetLine.clientHeight / 2;
          const targetScrollTop = targetLine.offsetTop - containerHalfHeight + lineHalfHeight;

          preElement.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [currentLine, isAnimating]);

  const stackItemVariants = {
    initial: { opacity: 0, y: -50, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -50, scale: 0.8 }
  };

  const queueItemVariants = {
    initial: { opacity: 0, x: 50, scale: 0.8 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -50, scale: 0.8 }
  };

  const pushToStack = useCallback(async () => { 
    if (!isValidElementValue) { showErrorMessage('Please enter a valid value (1-3 characters)'); return; }
    if (elements.length >= maxSize) { showErrorMessage(`Maximum size reached (${maxSize})`); return; }
    
    setIsAnimating(true); setLoading(true);
    const delay = getAnimationDelay();

    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message); setCurrentLine(line);
        if (action) action();
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting push operation..."); setCurrentLine(0); 
    await new Promise(r => setTimeout(r, delay));

    await performAnimatedStep("Initializing stack object", 13);
    await performAnimatedStep(`Calling push(${value})`, 42);
    await performAnimatedStep("Checking if stack is full", 43);
    await performAnimatedStep("Checking current state with peek()", 49);
    await performAnimatedStep("Inside peek() method", 33);
    await performAnimatedStep("Checking if stack is empty", 34);

    if (elements.length === 0) { await performAnimatedStep("Stack is empty (result of peek)", 35); } 
    else { await performAnimatedStep(`Stack not empty, top is ${elements[elements.length - 1]}`, 50); }

    await performAnimatedStep(`Incrementing top index`, 53, () => { setElements(prev => [...prev, value]); });
    await performAnimatedStep(`Adding element to stack`, 54);
    await performAnimatedStep(`Successfully pushed ${value}`, 55);

    setIsAnimating(false); setLoading(false); setValue('');
    setTimeout(() => { setCurrentStep(''); setCurrentLine(0); }, 2000);

  }, [value, elements, isValidElementValue, getAnimationDelay, showErrorMessage, maxSize]);

  const popFromStack = useCallback(async () => {
    if (elements.length === 0) { showErrorMessage('Stack is empty! Cannot pop.'); return; }

    setIsAnimating(true); setLoading(true);
    const delay = getAnimationDelay();

    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message); setCurrentLine(line);
        if (action) action();
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting pop operation..."); setCurrentLine(0);
    await new Promise(r => setTimeout(r, delay));

    await performAnimatedStep("Initializing stack object", 13);
    await performAnimatedStep("Calling pop()", 58);
    await performAnimatedStep("Checking if stack is empty", 59);
    await performAnimatedStep("Inside isEmpty() method", 18);
    await performAnimatedStep("Checking if top == -1", 19);
    await performAnimatedStep("Stack has elements, proceeding with pop", 62);
    
    const poppedValue = elements[elements.length - 1];
    await performAnimatedStep(`Getting top element: ${poppedValue}`, 64);
    await performAnimatedStep("Decrementing top index", 65, () => { setElements(prev => prev.slice(0, -1)); });
    await performAnimatedStep("Pop operation complete", 66);
    await performAnimatedStep("Returning popped element", 67);

    setIsAnimating(false); setLoading(false);
    setTimeout(() => { setCurrentStep(''); setCurrentLine(0); }, 2000);
  }, [elements, getAnimationDelay, showErrorMessage]);

  const enqueue = useCallback(async () => {
    if (!isValidElementValue) { showErrorMessage('Please enter a valid value (1-3 characters)'); return; }
    if (elements.length >= maxSize) { showErrorMessage('Queue is full! Cannot enqueue more elements.'); return; }

    setIsAnimating(true); setLoading(true);
    const delay = getAnimationDelay();

    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message); setCurrentLine(line);
        if (action) action();
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting enqueue operation..."); setCurrentLine(0);
    await new Promise(r => setTimeout(r, delay));

    await performAnimatedStep("Initializing queue object", 12);
    await performAnimatedStep(`Calling enqueue(${value})`, 40);
    await performAnimatedStep("Checking current state with peek()", 44);
    await performAnimatedStep("Inside peek() method", 29);
    await performAnimatedStep("Checking if queue is empty", 30);

    if (elements.length === 0) { await performAnimatedStep("Queue is empty (result of peek)", 31); } 
    else { await performAnimatedStep(`Current front element: ${elements[0]}`, 34); }
    
    await performAnimatedStep(`Adding ${value} to queue`, 37, () => { setElements(prev => [...prev, value]); });
    await performAnimatedStep(`Successfully enqueued ${value}`, 39);

    setIsAnimating(false); setLoading(false); setValue('');
    setTimeout(() => { setCurrentStep(''); setCurrentLine(0); }, 2000);
  }, [value, elements, isValidElementValue, getAnimationDelay, showErrorMessage, maxSize]);

  const dequeue = useCallback(async () => {
    if (elements.length === 0) { showErrorMessage('Queue is empty! Cannot dequeue.'); return; }

    setIsAnimating(true); setLoading(true);
    const delay = getAnimationDelay();

    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message); setCurrentLine(line);
        if (action) action();
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting dequeue operation..."); setCurrentLine(0);
    await new Promise(r => setTimeout(r, delay));

    await performAnimatedStep("Initializing queue object", 12);
    await performAnimatedStep("Calling dequeue()", 42);
    await performAnimatedStep("Checking if queue is empty", 43);
    await performAnimatedStep("Inside isEmpty() method", 18);
    await performAnimatedStep("Checking if queue count is zero", 19);

    await performAnimatedStep("Queue has elements, proceeding with dequeue", 46);
    
    const dequeuedValue = elements[0];
    await performAnimatedStep(`Getting front element: ${dequeuedValue}`, 46);
    await performAnimatedStep("Removing front element", 47, () => { setElements(prev => prev.slice(1)); });
    await performAnimatedStep("Dequeue operation complete", 49);

    setIsAnimating(false); setLoading(false);
    setTimeout(() => { setCurrentStep(''); setCurrentLine(0); }, 2000);
  }, [elements, getAnimationDelay, showErrorMessage]);

  const peekStack = useCallback(async () => {
    setIsAnimating(true); setLoading(true);
    const delay = getAnimationDelay();
    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => { setCurrentStep(message); setCurrentLine(line); if (action) action(); setTimeout(resolve, delay); });
    };

    setCurrentStep("Starting peek operation..."); setCurrentLine(0);
    await new Promise(r => setTimeout(r, delay));

    await performAnimatedStep("Initializing stack object", 13);
    await performAnimatedStep("Inside peek() method", 33);
    await performAnimatedStep("Checking if stack is empty", 34);
    await performAnimatedStep("Inside isEmpty() method", 18);
    await performAnimatedStep("Checking if top == -1", 19);

    if (elements.length === 0) { await performAnimatedStep("Stack is empty - nothing to peek", 35); } 
    else { await performAnimatedStep(`Current top element: ${elements[elements.length - 1]}`, 38); }

    setIsAnimating(false); setLoading(false);
    setTimeout(() => { setCurrentStep(''); setCurrentLine(0); }, 2000);
  }, [elements, getAnimationDelay]);

  const peekQueue = useCallback(async () => {
    setIsAnimating(true); setLoading(true);
    const delay = getAnimationDelay();
    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => { setCurrentStep(message); setCurrentLine(line); if (action) action(); setTimeout(resolve, delay); });
    };

    setCurrentStep("Starting peek operation..."); setCurrentLine(0);
    await new Promise(r => setTimeout(r, delay));
    
    await performAnimatedStep("Initializing queue object", 12);
    await performAnimatedStep("Inside peek() method", 29);
    await performAnimatedStep("Checking if queue is empty", 30);
    await performAnimatedStep("Inside isEmpty() method", 18);
    await performAnimatedStep("Checking if queue count is zero", 19);

    if (elements.length === 0) { await performAnimatedStep("Queue is empty - nothing to peek", 31); } 
    else { await performAnimatedStep(`Current front element: ${elements[0]}`, 34); }

    setIsAnimating(false); setLoading(false);
    setTimeout(() => { setCurrentStep(''); setCurrentLine(0); }, 2000);
  }, [elements, getAnimationDelay]);

  const getCode = () => {
    if (dataStructure === 'stack') {
      return `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n\n#define MAX_SIZE 100\n\ntypedef struct {\n    int items[MAX_SIZE];  // Array to store stack elements\n    int top;              // Index of top element\n} Stack;\n\n// Initialize empty stack\nvoid initStack(Stack* s) {\n    s->top = -1;\n}\n\n// Check if stack is empty\nbool isEmpty(Stack* s) {\n    return s->top == -1;\n}\n\n// Check if stack is full\nbool isFull(Stack* s) {\n    return s->top == MAX_SIZE - 1;\n}\n\n// Get size of stack\nint size(Stack* s) {\n    return s->top + 1;\n}\n\n// View top element without removing it\nint peek(Stack* s) {\n    if (isEmpty(s)) {\n        printf("Stack is empty\\n");\n        return -1;  // Error value\n    }\n    return s->items[s->top];  // Get top element\n}\n\n// Add element to top of stack\nvoid push(Stack* s, int element) {\n    if (isFull(s)) {\n        printf("Stack Overflow: Cannot push to full stack\\n");\n        return;\n    }\n    \n    // Check current state for visualization\n    if (!isEmpty(s)) {\n        printf("Current top: %d\\n", peek(s));\n    }\n    \n    s->top++;                    // Increment top index\n    s->items[s->top] = element; // Add element\n    printf("Pushed %d to stack\\n", element);\n}\n\n// Remove and return top element\nint pop(Stack* s) {\n    if (isEmpty(s)) {\n        printf("Stack Underflow: Cannot pop from empty stack\\n");\n        return -1;  // Error value\n    }\n    \n    int topElement = s->items[s->top];  // Get top element\n    s->top--;                           // Decrement top index\n    printf("Popped %d from stack\\n", topElement);\n    return topElement;\n}\n\n// Display all stack elements (top to bottom)\nvoid display(Stack* s) {\n    if (isEmpty(s)) {\n        printf("Stack is empty\\n");\n        return;\n    }\n    \n    printf("Stack (top to bottom): ");\n    for (int i = s->top; i >= 0; i--) {\n        printf("%d ", s->items[i]);\n    }\n    printf("\\n");\n}\n\n// Example usage\nint main() {\n    Stack myStack;\n    initStack(&myStack);\n    push(&myStack, 10);\n    push(&myStack, 20);\n    display(&myStack);\n    return 0;\n}`;
    } else {
      return `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n\n#define MAX_SIZE 100\n\ntypedef struct {\n    int items[MAX_SIZE];  // Array to store queue elements\n    int front;            // Index of front element\n    int rear;             // Index of rear element\n    int count;            // Number of elements in queue\n} Queue;\n\n// Initialize empty queue\nvoid initQueue(Queue* q) {\n    q->front = 0;\n    q->rear = -1;\n    q->count = 0;\n}\n\n// Check if queue is empty\nbool isEmpty(Queue* q) {\n    return q->count == 0;\n}\n\n// Check if queue is full\nbool isFull(Queue* q) {\n    return q->count == MAX_SIZE;\n}\n\n// Get size of queue\nint size(Queue* q) {\n    return q->count;\n}\n\n// View front element without removing it\nint peek(Queue* q) {\n    if (isEmpty(q)) {\n        printf("Queue is empty\\n");\n        return -1;  // Error value\n    }\n    return q->items[q->front];  // Get front element\n}\n\n// Add element to rear of queue\nvoid enqueue(Queue* q, int element) {\n    if (isFull(q)) {\n        printf("Queue Overflow: Cannot enqueue to full queue\\n");\n        return;\n    }\n    \n    // Check current state for visualization\n    if (!isEmpty(q)) {\n        printf("Current front: %d\\n", peek(q));\n    }\n    \n    q->rear = (q->rear + 1) % MAX_SIZE;  // Circular increment\n    q->items[q->rear] = element;         // Add element\n    q->count++;                          // Increment count\n    printf("Enqueued %d to queue\\n", element);\n}\n\n// Remove and return front element\nint dequeue(Queue* q) {\n    if (isEmpty(q)) {\n        printf("Queue is empty: Cannot dequeue from empty queue\\n");\n        return -1;  // Error value\n    }\n    \n    int frontElement = q->items[q->front];  // Get front element\n    q->front = (q->front + 1) % MAX_SIZE;   // Circular increment\n    q->count--;                             // Decrement count\n    printf("Dequeued %d from queue\\n", frontElement);\n    return frontElement;\n}\n\n// Display all queue elements (front to rear)\nvoid display(Queue* q) {\n    if (isEmpty(q)) {\n        printf("Queue is empty\\n");\n        return;\n    }\n    \n    printf("Queue (front to rear): ");\n    int index = q->front;\n    for (int i = 0; i < q->count; i++) {\n        printf("%d ", q->items[index]);\n        index = (index + 1) % MAX_SIZE;  // Circular increment\n    }\n    printf("\\n");\n}\n\n// Example usage\nint main() {\n    Queue myQueue;\n    initQueue(&myQueue);\n    enqueue(&myQueue, 10);\n    enqueue(&myQueue, 20);\n    display(&myQueue);\n    return 0;\n}`;
    }
  };

  return (
    <div className="os-layout-wrapper">
      <Header></Header>
            <div className="relative py-0 flex flex-col items-center justify-center text-center overflow-hidden w-full">
  {/* Decorative Background Element */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#00ffcc]/5 blur-[120px] rounded-full pointer-events-none" />

  <div className="relative z-10">
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="h-[1px] w-8 bg-zinc-800" />
      <span className="text-[10px] font-mono tracking-[0.6em] text-zinc-500 uppercase">Architecture // V2</span>
      <div className="h-[1px] w-8 bg-zinc-800" />
    </div>
    
    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic">
      Stack<span className="text-[#00ffcc] not-italic">.</span>Queue
    </h1>
    
    <p className="mt-6 max-w-lg mx-auto text-zinc-400 text-sm leading-relaxed font-light tracking-wide">
      A high-fidelity environment for <span className="text-white">algorithmic exploration</span>. 
      Optimized for structural transparency and real-time computation.
    </p>
  </div>
</div>
      <style>{`
        /* Pure Black Base */
        .os-layout-wrapper {
          min-height: 100vh;
          background-color: #000000;
          color: #fff;
          font-family: 'Space Mono', monospace;
          padding: 40px 0 ;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Added Spacing below Navbar */
        .os-grid {
          display: grid; 
          grid-template-columns: 1fr; 
          gap: 20px; 
          width: 100%; 
          max-width: 1500px;
          margin-top: 40px; /* Space between Navbar and panels */
        }
        @media (min-width: 1024px) {
          .os-grid { grid-template-columns: 1fr 1fr; }
        }

        /* High-End B&W Glass Panels */
        .os-panel {
          background: rgba(15, 15, 15, 0.6);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 24px;
          display: flex; flex-direction: column; gap: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.9);
        }

        .os-grid .os-panel {
          max-height: calc(100vh - 40px);
        }

        /* Controls */
        .os-control-group {
          display: flex; flex-wrap: wrap; gap: 10px; background: rgba(0,0,0,0.5);
          padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);
          align-items: center;
        }

        .os-input, .os-select {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
          color: white; padding: 10px 15px; border-radius: 8px; font-family: 'Space Mono', monospace;
          outline: none; transition: all 0.3s ease;
        }
        .os-input:focus, .os-select:focus { border-color: #fff; background: rgba(255,255,255,0.08); box-shadow: 0 0 10px rgba(255,255,255,0.1); }
        .os-input:disabled, .os-select:disabled { opacity: 0.5; cursor: not-allowed; }

        .os-btn {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15);
          color: #fff; padding: 10px 18px; border-radius: 8px; font-size: 12px; font-weight: 600;
          text-transform: uppercase; cursor: pointer; display: flex; align-items: center; gap: 8px;
          transition: all 0.2s ease;
        }
        .os-btn:hover:not(:disabled) { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.4); box-shadow: 0 4px 12px rgba(255,255,255,0.1); }
        .os-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Custom Pure CSS Range Slider */
        input[type="range"].custom-slider {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }
        input[type="range"].custom-slider:focus {
          outline: none;
        }
        input[type="range"].custom-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
        }
        input[type="range"].custom-slider::-webkit-slider-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -6px;
          box-shadow: 0 0 10px rgba(255,255,255,0.3);
          transition: transform 0.1s;
        }
        input[type="range"].custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        input[type="range"].custom-slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 12px rgba(255,255,255,0.6);
        }

        /* The Premium Visualizer Canvas */
        .os-visualizer-box {
          flex: 1; 
          background: #020202;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          position: relative;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          min-height: 350px;
          box-shadow: inset 0 0 50px rgba(0,0,0,0.9);
        }

        .structure-info-badge {
          position: absolute; top: 15px; left: 15px;
          background: rgba(255, 255, 255, 0.05); color: #ccc;
          padding: 6px 12px; border-radius: 6px; font-size: 11px;
          font-weight: bold; letter-spacing: 1px; border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .physical-container { position: relative; display: flex; gap: 10px; }

        .physical-container.stack {
          flex-direction: column-reverse; width: 160px; min-height: 280px;
          border-left: 2px solid rgba(255,255,255,0.2);
          border-right: 2px solid rgba(255,255,255,0.2);
          border-bottom: 2px solid rgba(255,255,255,0.2);
          border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;
          padding: 10px;
        }

        .physical-container.queue {
          flex-direction: row; width: 100%; max-width: 500px; min-height: 120px;
          border-top: 2px solid rgba(255,255,255,0.2);
          border-bottom: 2px solid rgba(255,255,255,0.2);
          padding: 10px; overflow-x: auto;
        }

        /* Monochrome Data Nodes */
        .os-data-node {
          background: rgba(20,20,20,0.9);
          color: #fff; font-weight: 800; font-size: 18px;
          border-radius: 6px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
          position: relative;
          overflow: hidden;
        }

        .stack .os-data-node { width: 100%; height: 50px; flex-shrink: 0; }
        .queue .os-data-node { width: 70px; height: 70px; flex-shrink: 0; }

        /* Code Viewer Box */
        .code-container-scroll {
          flex: 1; 
          background: #050505;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
          overflow: hidden; 
          position: relative;
          display: flex;
          flex-direction: column;
        }
                  /* Updated Controls with visible dropdown options */
        .os-input, .os-select {
          background: rgba(255, 255, 255, 0.05); 
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white; 
          padding: 10px 15px; 
          border-radius: 8px; 
          font-family: 'Space Mono', monospace;
          outline: none; 
          transition: all 0.3s ease;
          cursor: pointer;
        }

        /* This targets the dropdown menu items specifically */
        .os-select option {
          background-color: #181817; /* High-contrast dark background for the menu */
          color: #f1ede7;            /* Off-white text for readability */
          padding: 10px;
        }

        .os-input:focus, .os-select:focus { 
          border-color: #fff; 
          background: rgba(255, 255, 255, 0.12); 
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.1); 
        }

        .os-input:disabled, .os-select:disabled { 
          opacity: 0.5; 
          cursor: not-allowed; 
        }
        .code-container-scroll pre {
          flex: 1;
          margin: 0 !important;
          padding: 20px !important;
          background: transparent !important;
          overflow-y: auto !important; 
        }

        .active-code-line {
          background-color: rgba(255, 255, 255, 0.1) !important;
          border-left: 3px solid #fff !important;
          padding-left: 10px !important;
          box-shadow: inset 20px 0 30px -10px rgba(255,255,255,0.05);
          display: block;
        }

        .os-error {
          color: #fff; background: rgba(255,51,102,0.4); border: 1px solid rgba(255,51,102,0.8);
          padding: 10px; border-radius: 8px; text-align: center; font-size: 13px; font-weight: bold;
        }

        .current-operation-display { 
          background: rgba(255,255,255,0.05); 
          border: 1px solid rgba(255,255,255,0.2); 
          border-radius: 8px; 
          padding: 15px; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.3); 
        }
        .current-operation-display h4 { 
          margin: 0 0 10px 0; font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; 
        }
        .operation-description { 
          font-size: 14px; font-weight: bold; color: #fff; min-height: 24px; position: relative; 
        }
        
        .docs-panel h3 { font-size: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-top: 0; margin-bottom: 15px; color: #fff; }
        .docs-panel .explanation-content, .docs-panel .diy-content { font-size: 14px; color: #bbb; line-height: 1.6; }
        .docs-panel h4 { color: #fff; margin-top: 20px; margin-bottom: 8px; }
      `}</style>

      <div className="os-grid">
        
        {/* Left Panel: C Code */}
        <motion.div className="os-panel" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '14px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
              <FaCode style={{marginRight: '8px'}} />RUNTIME_SOURCE.C
            </h2>
          </div>
          
          <div className="code-container-scroll" ref={codeViewerRef}>
            <SyntaxHighlighter
              language="c"
              style={atomOneDark}
              wrapLines={true}
              showLineNumbers={true}
              lineNumberStyle={{ color: '#444', minWidth: '40px', paddingRight: '10px', textAlign: 'right' }}
              lineProps={lineNumber => {
                const isActive = lineNumber === currentLine;
                return {
                  className: isActive ? 'active-code-line' : '',
                  style: { display: 'block', color: isActive ? '#fff' : undefined }
                };
              }}
            >
              {getCode()}
            </SyntaxHighlighter>
          </div>
        </motion.div>

        {/* Right Panel: Controls & Vis */}
        <motion.div className="os-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
          
          <div className="os-control-group">
            <select value={dataStructure} onChange={(e) => setDataStructure(e.target.value)} disabled={isAnimating} className="os-select">
              <option value="stack">STACK</option>
              <option value="queue">QUEUE</option>
            </select>
            
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value.slice(0, 3))}
              placeholder="Data"
              disabled={isAnimating || loading}
              className="os-input"
              style={{ width: '80px' }}
            />

            <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)', margin: '0 5px' }}></div>

            {dataStructure === 'stack' ? (
              <>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={pushToStack} disabled={isAnimating || loading || !isValidElementValue} className="os-btn"><FaPlus /> Push</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={popFromStack} disabled={isAnimating || loading || elements.length === 0} className="os-btn"><FaTrash /> Pop</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={peekStack} disabled={isAnimating || loading} className="os-btn"><FaEye /> Peek</motion.button>
              </>
            ) : (
              <>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={enqueue} disabled={isAnimating || loading || !isValidElementValue} className="os-btn"><FaPlus /> Enq</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={dequeue} disabled={isAnimating || loading || elements.length === 0} className="os-btn"><FaTrash /> Deq</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={peekQueue} disabled={isAnimating || loading} className="os-btn"><FaEye /> Peek</motion.button>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '12px', color: '#888' }}>
            <span>SPEED:</span>
            <input 
              type="range" 
              className="custom-slider"
              min="10" 
              max="2000" 
              step="10" 
              value={animationSpeed} 
              onChange={(e) => setAnimationSpeed(parseInt(e.target.value))} 
              disabled={isAnimating} 
              style={{ flex: 1 }} 
            />
            <span style={{ width: '50px' }}>{animationSpeed}ms</span>
          </div>

          {showError && <div className="os-error">{errorMessage}</div>}

          {(isAnimating || currentStep) && (
            <CurrentOperationDisplay currentStep={currentStep || (isAnimating ? 'Processing step...' : '')} isAnimating={isAnimating} loading={loading} />
          )}
          
          <div className="os-visualizer-box">
            <div className="structure-info-badge">
              SIZE: {elements.length}/{maxSize} | 
              {dataStructure === 'stack' 
                ? ` TOP: ${elements[elements.length - 1] || 'NULL'}`
                : ` FRONT: ${elements[0] || 'NULL'} | REAR: ${elements[elements.length - 1] || 'NULL'}`
              }
            </div>
            
            <div className={`physical-container ${dataStructure}`}>
              <AnimatePresence mode="popLayout">
                {elements.map((element, index) => (
                  <motion.div
                    key={`${element}-${index}-${dataStructure}`}
                    className="os-data-node"
                    layout
                    variants={dataStructure === 'stack' ? stackItemVariants : queueItemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    {element}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {elements.length === 0 && (
                <div style={{ color: '#555', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', textAlign: 'center' }}>
                  {dataStructure} IS EMPTY
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="os-panel docs-panel" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{ width: '100%', maxWidth: '1400px', marginTop: '20px' }}
      >
        <StackQueueExplanation dataStructure={dataStructure} />
        <DiySection dataStructure={dataStructure} />
      </motion.div>

    </div>
  );
};

export default StackQueueVisualizer;