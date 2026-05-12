import { useState } from 'react';

const TreeExplanation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="explanation-section">
      
      <h3 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? '▼' : '►'} Understanding Binary Search Trees
      </h3>
      
      {isExpanded && (
        <div className="explanation-content">
          <h4>What is a Binary Search Tree?</h4>
          <p>
            A Binary Search Tree (BST) is a hierarchical data structure where each node has at most two children,
            referred to as the left child and right child. It maintains a specific ordering property that makes
            searching, insertion, and deletion operations efficient.
          </p>
          
          <h4>Key Properties:</h4>
          <ul>
            <li><strong>Left Subtree:</strong> All values in the left subtree are less than the node's value</li>
            <li><strong>Right Subtree:</strong> All values in the right subtree are greater than the node's value</li>
            <li><strong>Recursive Structure:</strong> Each subtree is also a valid BST</li>
            <li><strong>No Duplicates:</strong> Each value appears only once in the tree</li>
          </ul>
          
          <h4>Common Operations:</h4>
          <ul>
            <li><strong>Insert:</strong> Average O(log n), Worst O(n) - Add a new value while maintaining BST property</li>
            <li><strong>Search:</strong> Average O(log n), Worst O(n) - Find if a value exists in the tree</li>
            <li><strong>Delete:</strong> Average O(log n), Worst O(n) - Remove a value while maintaining BST structure</li>
            <li><strong>Traversals:</strong> O(n) - Visit all nodes in specific order (inorder, preorder, postorder)</li>
          </ul>
          
          <h4>Tree Traversals:</h4>
          <ul>
            <li><strong>Inorder (Left-Root-Right):</strong> Visits nodes in ascending sorted order</li>
            <li><strong>Preorder (Root-Left-Right):</strong> Useful for creating a copy of the tree</li>
            <li><strong>Postorder (Left-Right-Root):</strong> Useful for deleting or freeing nodes</li>
          </ul>
          
          <h4>Real-world Applications:</h4>
          <ul>
            <li>Database indexing for fast lookups</li>
            <li>Expression parsing in compilers</li>
            <li>File system directories</li>
            <li>Priority queues and scheduling algorithms</li>
            <li>Auto-complete and search suggestions</li>
            <li>Decision trees in machine learning</li>
          </ul>
          
          <h4>Performance Considerations:</h4>
          <p>
            <strong>Best Case:</strong> A balanced BST provides O(log n) performance for all operations.
            <br />
            <strong>Worst Case:</strong> An unbalanced BST (essentially a linked list) degrades to O(n) performance.
            <br />
            <strong>Solution:</strong> Self-balancing trees like AVL trees or Red-Black trees maintain balance automatically.
          </p>
        </div>
      )}
    </div>
  );
};

export default TreeExplanation;
