import { useState } from 'react';
import { Link } from 'react-router-dom';

const StackQueueExplanation = ({ dataStructure = 'stack' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="explanation-section">
      
      <h3 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? '▼' : '►'} Understanding {dataStructure === 'stack' ? 'Stacks' : 'Queues'}
      </h3>
      
      {isExpanded && (
        <div className="explanation-content">
          {dataStructure === 'stack' ? (
            <>
              <h4>What is a Stack?</h4>
              <p>
                A stack is a linear data structure that follows the Last In, First Out (LIFO) principle.
                Elements are added (pushed) and removed (popped) from the same end, called the "top" of the stack.
              </p>
              
              <h4>Key Characteristics:</h4>
              <ul>
                <li><strong>LIFO Order:</strong> The last element added is the first one removed</li>
                <li><strong>Limited Access:</strong> Only the top element is accessible at any time</li>
                <li><strong>Dynamic Size:</strong> Can grow or shrink as elements are pushed or popped</li>
              </ul>
              
              <h4>Common Operations:</h4>
              <ul>
                <li><strong>Push:</strong> O(1) - Add an element to the top</li>
                <li><strong>Pop:</strong> O(1) - Remove the top element</li>
                <li><strong>Peek:</strong> O(1) - View the top element without removing it</li>
                <li><strong>isEmpty:</strong> O(1) - Check if the stack is empty</li>
              </ul>
              
              <h4>Real-world Applications:</h4>
              <ul>
                <li>Undo mechanism in text editors</li>
                <li>Expression evaluation and syntax parsing</li>
                <li>Backtracking algorithms</li>
                <li>Browser's back button history</li>
                <li>Function call stack in programming languages</li>
              </ul>
            </>
          ) : (
            <>
              <h4>What is a Queue?</h4>
              <p>
                A queue is a linear data structure that follows the First In, First Out (FIFO) principle.
                Elements are added at the rear (enqueued) and removed from the front (dequeued).
              </p>
              
              <h4>Key Characteristics:</h4>
              <ul>
                <li><strong>FIFO Order:</strong> The first element added is the first one removed</li>
                <li><strong>Two Ends:</strong> Elements enter at the rear and exit from the front</li>
                <li><strong>Dynamic Size:</strong> Can grow or shrink as elements are added or removed</li>
              </ul>
              
              <h4>Common Operations:</h4>
              <ul>
                <li><strong>Enqueue:</strong> O(1) - Add an element to the rear</li>
                <li><strong>Dequeue:</strong> O(1) - Remove the front element</li>
                <li><strong>Peek:</strong> O(1) - View the front element without removing it</li>
                <li><strong>isEmpty:</strong> O(1) - Check if the queue is empty</li>
              </ul>
              
              <h4>Real-world Applications:</h4>
              <ul>
                <li>CPU scheduling in operating systems</li>
                <li>Handling of service requests on a single shared resource</li>
                <li>Breadth-first search algorithm</li>
                <li>Print job scheduling</li>
                <li>Data streaming</li>
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StackQueueExplanation;
