/**
 * Queue Data Structure Implementation
 * Provides comprehensive queue operations with memory management and visualization support
 */

export class Queue {
  constructor() {
    this.items = [];
    this.maxSize = 10;
    this.operations = [];
  }

  /**
   * Check if the queue is empty
   * @returns {boolean} True if queue is empty, false otherwise
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Check if the queue is full
   * @returns {boolean} True if queue is full, false otherwise
   */
  isFull() {
    return this.items.length >= this.maxSize;
  }

  /**
   * Get the current size of the queue
   * @returns {number} Number of elements in the queue
   */
  size() {
    return this.items.length;
  }

  /**
   * Peek at the front element without removing it
   * @returns {*} The front element or null if empty
   */
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  /**
   * Get the rear element without removing it
   * @returns {*} The rear element or null if empty
   */
  rear() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  /**
   * Add an element to the rear of the queue
   * @param {*} element - Element to enqueue
   * @returns {boolean} True if successful, false if queue is full
   */
  enqueue(element) {
    if (this.isFull()) {
      throw new Error('Queue Overflow: Cannot enqueue to a full queue');
    }

    this.items.push(element);
    this.operations.push({
      type: 'enqueue',
      element: element,
      timestamp: Date.now(),
      queueSize: this.items.length
    });
    
    return true;
  }

  /**
   * Remove and return the front element
   * @returns {*} The dequeued element or null if empty
   */
  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Queue Underflow: Cannot dequeue from an empty queue');
    }

    const element = this.items.shift();
    this.operations.push({
      type: 'dequeue',
      element: element,
      timestamp: Date.now(),
      queueSize: this.items.length
    });

    return element;
  }

  /**
   * Clear all elements from the queue
   */
  clear() {
    const clearedCount = this.items.length;
    this.items = [];
    this.operations.push({
      type: 'clear',
      clearedCount: clearedCount,
      timestamp: Date.now(),
      queueSize: 0
    });
  }

  /**
   * Get all elements as an array (for visualization)
   * @returns {Array} Copy of queue elements
   */
  toArray() {
    return [...this.items];
  }

  /**
   * Get operation history
   * @returns {Array} Array of operations performed
   */
  getHistory() {
    return [...this.operations];
  }

  /**
   * Get queue statistics
   * @returns {Object} Statistics about the queue
   */
  getStats() {
    const enqueueCount = this.operations.filter(op => op.type === 'enqueue').length;
    const dequeueCount = this.operations.filter(op => op.type === 'dequeue').length;
    
    return {
      currentSize: this.size(),
      maxSize: this.maxSize,
      totalEnqueues: enqueueCount,
      totalDequeues: dequeueCount,
      totalOperations: this.operations.length,
      isEmpty: this.isEmpty(),
      isFull: this.isFull(),
      front: this.peek(),
      rear: this.rear(),
      utilization: (this.size() / this.maxSize * 100).toFixed(1)
    };
  }

  /**
   * Validate element before operations
   * @param {*} element - Element to validate
   * @returns {boolean} True if valid, false otherwise
   */
  static isValidElement(element) {
    if (element === null || element === undefined) {
      return false;
    }
    
    const str = String(element).trim();
    return str.length > 0 && str.length <= 3;
  }

  /**
   * Create a new queue from an array
   * @param {Array} elements - Elements to add to queue
   * @returns {Queue} New queue instance
   */
  static fromArray(elements) {
    const queue = new Queue();
    elements.forEach(element => {
      if (!queue.isFull()) {
        queue.enqueue(element);
      }
    });
    return queue;
  }
}

/**
 * Priority Queue Implementation (Min-Heap based)
 */
export class PriorityQueue {
  constructor() {
    this.items = [];
    this.operations = [];
  }

  /**
   * Add element with priority
   * @param {*} element - Element to add
   * @param {number} priority - Priority (lower number = higher priority)
   */
  enqueue(element, priority) {
    const newItem = { element, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (newItem.priority < this.items[i].priority) {
        this.items.splice(i, 0, newItem);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(newItem);
    }

    this.operations.push({
      type: 'enqueue',
      element,
      priority,
      timestamp: Date.now()
    });
  }

  /**
   * Remove and return highest priority element
   * @returns {*} The element with highest priority
   */
  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Priority Queue is empty');
    }

    const item = this.items.shift();
    this.operations.push({
      type: 'dequeue',
      element: item.element,
      priority: item.priority,
      timestamp: Date.now()
    });

    return item.element;
  }

  /**
   * Peek at highest priority element
   * @returns {*} The highest priority element
   */
  peek() {
    return this.isEmpty() ? null : this.items[0].element;
  }

  /**
   * Check if queue is empty
   * @returns {boolean} True if empty
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Get queue size
   * @returns {number} Number of elements
   */
  size() {
    return this.items.length;
  }

  /**
   * Get all items for visualization
   * @returns {Array} Array of {element, priority} objects
   */
  toArray() {
    return [...this.items];
  }
}

/**
 * Circular Queue Implementation
 */
export class CircularQueue {
  constructor(maxSize = 10) {
    this.items = new Array(maxSize);
    this.maxSize = maxSize;
    this.front = -1;
    this.rear = -1;
    this.currentSize = 0;
    this.operations = [];
  }

  /**
   * Check if queue is empty
   * @returns {boolean} True if empty
   */
  isEmpty() {
    return this.currentSize === 0;
  }

  /**
   * Check if queue is full
   * @returns {boolean} True if full
   */
  isFull() {
    return this.currentSize === this.maxSize;
  }

  /**
   * Add element to rear
   * @param {*} element - Element to enqueue
   */
  enqueue(element) {
    if (this.isFull()) {
      throw new Error('Circular Queue is full');
    }

    if (this.isEmpty()) {
      this.front = 0;
      this.rear = 0;
    } else {
      this.rear = (this.rear + 1) % this.maxSize;
    }

    this.items[this.rear] = element;
    this.currentSize++;

    this.operations.push({
      type: 'enqueue',
      element,
      front: this.front,
      rear: this.rear,
      timestamp: Date.now()
    });
  }

  /**
   * Remove element from front
   * @returns {*} Dequeued element
   */
  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Circular Queue is empty');
    }

    const element = this.items[this.front];
    this.items[this.front] = undefined;

    if (this.currentSize === 1) {
      this.front = -1;
      this.rear = -1;
    } else {
      this.front = (this.front + 1) % this.maxSize;
    }

    this.currentSize--;

    this.operations.push({
      type: 'dequeue',
      element,
      front: this.front,
      rear: this.rear,
      timestamp: Date.now()
    });

    return element;
  }

  /**
   * Peek at front element
   * @returns {*} Front element
   */
  peek() {
    return this.isEmpty() ? null : this.items[this.front];
  }

  /**
   * Get queue size
   * @returns {number} Current size
   */
  size() {
    return this.currentSize;
  }

  /**
   * Get all elements for visualization
   * @returns {Array} Array of elements
   */
  toArray() {
    if (this.isEmpty()) return [];

    const result = [];
    let index = this.front;
    
    for (let i = 0; i < this.currentSize; i++) {
      result.push(this.items[index]);
      index = (index + 1) % this.maxSize;
    }

    return result;
  }
}

/**
 * Queue utility functions for common algorithms
 */
export const QueueUtils = {
  /**
   * Breadth-First Search simulation using queue
   * @param {Object} graph - Graph representation
   * @param {*} startNode - Starting node
   * @returns {Array} BFS traversal order
   */
  bfsTraversal(graph, startNode) {
    const queue = new Queue();
    const visited = new Set();
    const result = [];

    queue.enqueue(startNode);
    visited.add(startNode);

    while (!queue.isEmpty()) {
      const current = queue.dequeue();
      result.push(current);

      if (graph[current]) {
        for (let neighbor of graph[current]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.enqueue(neighbor);
          }
        }
      }
    }

    return result;
  },

  /**
   * Generate numbers in sequence using queue
   * @param {number} n - Number to generate up to
   * @returns {Array} Generated sequence
   */
  generateBinaryNumbers(n) {
    const queue = new Queue();
    const result = [];

    queue.enqueue('1');

    for (let i = 0; i < n; i++) {
      const current = queue.dequeue();
      result.push(current);

      queue.enqueue(current + '0');
      queue.enqueue(current + '1');
    }

    return result;
  },

  /**
   * Reverse first k elements of queue
   * @param {Queue} queue - Queue to modify
   * @param {number} k - Number of elements to reverse
   */
  reverseFirstK(queue, k) {
    if (k <= 0 || k > queue.size()) {
      throw new Error('Invalid k value');
    }

    const stack = [];
    
    // Dequeue first k elements and push to stack
    for (let i = 0; i < k; i++) {
      stack.push(queue.dequeue());
    }

    // Pop from stack and enqueue back
    while (stack.length > 0) {
      queue.enqueue(stack.pop());
    }

    // Move remaining elements to back
    const remaining = queue.size() - k;
    for (let i = 0; i < remaining; i++) {
      queue.enqueue(queue.dequeue());
    }
  },

  /**
   * Check if queue can be sorted using another queue
   * @param {Array} arr - Array representing queue
   * @returns {boolean} True if sortable
   */
  isSortableUsingQueue(arr) {
    const queue = Queue.fromArray(arr);
    const auxQueue = new Queue();
    let expected = 1;

    while (!queue.isEmpty() || !auxQueue.isEmpty()) {
      if (!queue.isEmpty() && queue.peek() === expected) {
        queue.dequeue();
        expected++;
      } else if (!auxQueue.isEmpty() && auxQueue.peek() === expected) {
        auxQueue.dequeue();
        expected++;
      } else if (!queue.isEmpty()) {
        auxQueue.enqueue(queue.dequeue());
      } else {
        return false;
      }
    }

    return true;
  }
};

export default Queue;
