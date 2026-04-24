import React, { memo } from "react";
import ydgImage from "../../../assets/ydg.png";
import baviImage from "../../../assets/bavi.png";
import blockImage from "../../../assets/block.jpg"; // Add this import

/**
 * Pathfinding Grid Node Component
 * 
 * Represents a single cell in the pathfinding visualization grid.
 * Optimized with React.memo to prevent unnecessary re-renders
 * since grids can contain hundreds of nodes.
 * 
 * @param {Object} props - Node properties and event handlers
 * @returns {JSX.Element} Rendered node with appropriate styling and behavior
 */
const Node = memo(({ 
  isWall,
  isStart,
  isEnd,
  isVisited,
  isShortestPath,
  row,
  col,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onMouseLeave
}) => {
  // Determine the class name based on node properties
  const getNodeClassName = () => {
    if (isStart) return "node_start";
    if (isEnd) return "node_end";
    if (isWall) return "node_wall";
    if (isShortestPath) return "node_path";
    if (isVisited) return "node_visited";
    return "node_";
  };
  
  // Use preventDefaultEvent to prevent text selection during drag operations
  const preventDefaultEvent = (e) => {
    e.preventDefault();
    return false;
  };
  
  return (
    <td 
      id={`node-${row}-${col}`}
      className={getNodeClassName()}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(row, col);
      }}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      onMouseLeave={() => onMouseLeave(row, col)}
      onDragStart={preventDefaultEvent}
      draggable={false}
      style={{ 
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {isStart && (
        <img 
          src={ydgImage} 
          alt="Start" 
          className="node-image start-image"
        />
      )}
      {isEnd && (
        <img 
          src={baviImage} 
          alt="End" 
          className="node-image end-image"
        />
      )}
      {isWall && (
        <img 
          src={blockImage} 
          alt="Wall" 
          className="node-image wall-image"
        />
      )}
    </td>
  );
});

// Set display name for better debugging
Node.displayName = 'Node';

export default Node;
