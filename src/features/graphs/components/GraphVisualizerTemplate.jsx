import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import CodeViewer from '../../common/components/CodeViewer';
import GraphControls from './GraphControls';
import GraphVisualization from './GraphVisualization';
import '../styles/GraphVisualizerTemplate.css';

const GraphVisualizerTemplate = ({ 
  algorithmName,
  algorithmCode,
  initialGraph,
  onAlgorithmStep,
  controlsConfig,
  algorithmDescription,
  timeComplexity,
  spaceComplexity
}) => {
  const [graph, setGraph] = useState(initialGraph || []);
  const [currentLine, setCurrentLine] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [algorithmState, setAlgorithmState] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [visitedEdges, setVisitedEdges] = useState(new Set());
  const [consoleLog, setConsoleLog] = useState([]);

  const handleAnimationUpdate = useCallback((lineNumber, step, animating, state = {}) => {
    setCurrentLine(lineNumber);
    setCurrentStep(step);
    setIsAnimating(animating);
    setAlgorithmState(prev => ({ ...prev, ...state }));
    if (step) {
      setConsoleLog(prev => [...prev, {
        timestamp: Date.now(),
        step: prev.length + 1,
        message: step,
        state: { ...state }
      }]);
    }
    if (state.visitedNodes) setVisitedNodes(new Set(state.visitedNodes));
    if (state.visitedEdges) setVisitedEdges(new Set(state.visitedEdges));
  }, []);

  const handleAlgorithmExecution = useCallback(async (startNode, endNode, config = {}) => {
    if (onAlgorithmStep) {
      setIsPlaying(true);
      setVisitedNodes(new Set());
      setVisitedEdges(new Set());
      setConsoleLog([]);
      await onAlgorithmStep(graph, startNode, endNode, handleAnimationUpdate, config, speed);
      setIsPlaying(false);
    }
  }, [graph, onAlgorithmStep, handleAnimationUpdate, speed]);

  const handleGraphUpdate = useCallback((newGraph) => {
    setGraph(newGraph);
    setVisitedNodes(new Set());
    setVisitedEdges(new Set());
    setCurrentLine(0);
    setCurrentStep('');
    setAlgorithmState({});
    setConsoleLog([]);
  }, []);

  const handleReset = useCallback(() => {
    setVisitedNodes(new Set());
    setVisitedEdges(new Set());
    setCurrentLine(0);
    setCurrentStep('');
    setAlgorithmState({});
    setIsPlaying(false);
    setIsAnimating(false);
    setConsoleLog([]);
  }, []);

  return (
    <div className="graph-visualizer-container">
      <div className="graph-visualizer-bg-overlay"></div>
      
      <motion.header 
        className="graph-visualizer-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="header-navigation">
          <Link to="/dsa" className="graph-nav-button">
            <FaHome size={16} />
            <span>Home</span>
          </Link>
          <Link to="/dsa/graphs" className="graph-nav-button">
            <FaArrowLeft size={16} />
            <span>Back to Graphs</span>
          </Link>
        </div>
        
        <div className="header-content">
          <h1>{algorithmName}</h1>
          <p>{algorithmDescription}</p>
          <div className="complexity-info">
            <div className="complexity-item">
              <strong>Time Complexity:</strong> {timeComplexity}
            </div>
            <div className="complexity-item">
              <strong>Space Complexity:</strong> {spaceComplexity}
            </div>
          </div>
        </div>
      </motion.header>

      <motion.div 
        className="graph-visualizer-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div className="graph-left-panel">
          <div className="graph-controls-section">
            <GraphControls
              graph={graph}
              onGraphUpdate={handleGraphUpdate}
              onAlgorithmExecute={handleAlgorithmExecution}
              onReset={handleReset}
              isPlaying={isPlaying}
              speed={speed}
              onSpeedChange={setSpeed}
              config={controlsConfig}
              algorithmState={algorithmState}
            />
          </div>

          <div className="graph-visualization-section">
            <GraphVisualization
              graph={graph}
              visitedNodes={visitedNodes}
              visitedEdges={visitedEdges}
              currentStep={currentStep}
              algorithmState={algorithmState}
              isAnimating={isAnimating}
            />
          </div>
        </motion.div>

        <motion.div className="graph-right-panel">
          <div className="graph-code-viewer">
            <CodeViewer 
              code={algorithmCode}
              language="c"
              currentLine={currentLine}
              isAnimating={isAnimating}
              theme="dark"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GraphVisualizerTemplate;