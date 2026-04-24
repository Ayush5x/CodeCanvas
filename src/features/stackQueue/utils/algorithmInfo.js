/**
 * Stack and Queue Algorithm Information
 * Educational content, complexity analysis, and metadata for visualization
 */

export const STACK_INFO = {
  name: 'Stack',
  description: 'A Last-In-First-Out (LIFO) data structure where elements are added and removed from the same end called the top.',
  
  characteristics: [
    'LIFO (Last In, First Out) principle',
    'Elements added and removed from the top',
    'No random access to middle elements',
    'Dynamic size (in most implementations)',
    'Memory efficient for sequential access'
  ],

  operations: {
    push: {
      name: 'Push',
      description: 'Add an element to the top of the stack',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      steps: [
        'Check if stack is full (if using fixed size)',
        'Add element to the top',
        'Increment stack pointer/size',
        'Update stack metadata'
      ]
    },
    pop: {
      name: 'Pop',
      description: 'Remove and return the top element from the stack',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      steps: [
        'Check if stack is empty',
        'Store the top element',
        'Remove the top element',
        'Decrement stack pointer/size',
        'Return the stored element'
      ]
    },
    peek: {
      name: 'Peek/Top',
      description: 'View the top element without removing it',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      steps: [
        'Check if stack is empty',
        'Return the top element without modification'
      ]
    },
    isEmpty: {
      name: 'Is Empty',
      description: 'Check if the stack contains any elements',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      steps: [
        'Check stack size or top pointer',
        'Return boolean result'
      ]
    }
  },

  applications: [
    'Function call management (call stack)',
    'Expression evaluation and syntax parsing',
    'Undo operations in applications',
    'Browser history management',
    'Backtracking algorithms',
    'Memory management',
    'Recursive algorithm implementation'
  ],

  advantages: [
    'Simple implementation',
    'Constant time operations',
    'Memory efficient',
    'Useful for recursive problems',
    'Natural for LIFO scenarios'
  ],

  disadvantages: [
    'No random access',
    'Limited access pattern',
    'Stack overflow risk',
    'Not suitable for searching'
  ],

  realWorldExamples: [
    'Browser back button functionality',
    'Undo/Redo in text editors',
    'Function call stack in programming',
    'Expression evaluation in calculators',
    'Plate stacker in cafeterias'
  ]
};

export const QUEUE_INFO = {
  name: 'Queue',
  description: 'A First-In-First-Out (FIFO) data structure where elements are added at the rear and removed from the front.',
  
  characteristics: [
    'FIFO (First In, First Out) principle',
    'Elements added at rear, removed from front',
    'No random access to middle elements',
    'Dynamic size (in most implementations)',
    'Fair processing order'
  ],

  operations: {
    enqueue: {
      name: 'Enqueue',
      description: 'Add an element to the rear of the queue',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      steps: [
        'Check if queue is full (if using fixed size)',
        'Add element to the rear',
        'Update rear pointer',
        'Increment queue size'
      ]
    },
    dequeue: {
      name: 'Dequeue',
      description: 'Remove and return the front element from the queue',
      timeComplexity: 'O(1) - O(n)',
      spaceComplexity: 'O(1)',
      note: 'O(n) for array implementation due to shifting, O(1) for linked list',
      steps: [
        'Check if queue is empty',
        'Store the front element',
        'Remove the front element',
        'Update front pointer',
        'Decrement queue size',
        'Return the stored element'
      ]
    },
    peek: {
      name: 'Peek/Front',
      description: 'View the front element without removing it',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      steps: [
        'Check if queue is empty',
        'Return the front element without modification'
      ]
    },
    isEmpty: {
      name: 'Is Empty',
      description: 'Check if the queue contains any elements',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      steps: [
        'Check queue size or front/rear pointers',
        'Return boolean result'
      ]
    }
  },

  applications: [
    'Process scheduling in operating systems',
    'Breadth-first search (BFS) algorithm',
    'Print job management',
    'Buffer for data streams',
    'Handling requests in web servers',
    'Level-order tree traversal',
    'Simulation of real-world queues'
  ],

  advantages: [
    'Fair processing order (FIFO)',
    'Efficient for streaming data',
    'Simple to understand and implement',
    'Good for buffering',
    'Useful in concurrent programming'
  ],

  disadvantages: [
    'No random access',
    'Array implementation has shifting overhead',
    'Memory overhead for linked implementation',
    'Not suitable for searching'
  ],

  realWorldExamples: [
    'People waiting in line at a store',
    'Print queue in computer systems',
    'Call center phone queues',
    'Buffer in streaming applications',
    'Task scheduling in operating systems'
  ]
};

export const QUEUE_VARIANTS = {
  circular: {
    name: 'Circular Queue',
    description: 'A queue where the last position connects to the first, making efficient use of space',
    advantages: ['Efficient space utilization', 'No wasted memory', 'Constant time operations'],
    timeComplexity: 'O(1) for all operations',
    spaceComplexity: 'O(n) where n is the maximum size'
  },
  priority: {
    name: 'Priority Queue',
    description: 'A queue where elements are served based on priority rather than insertion order',
    advantages: ['Elements processed by priority', 'Flexible ordering', 'Useful for scheduling'],
    timeComplexity: 'O(log n) for insertion/deletion, O(1) for peek',
    spaceComplexity: 'O(n)'
  },
  deque: {
    name: 'Double-ended Queue (Deque)',
    description: 'A queue that allows insertion and deletion at both ends',
    advantages: ['Flexible insertion/deletion', 'Can act as stack or queue', 'Efficient operations'],
    timeComplexity: 'O(1) for operations at both ends',
    spaceComplexity: 'O(n)'
  }
};

export const COMPLEXITY_COMPARISON = {
  operations: {
    insertion: {
      stack: 'O(1)',
      queue: 'O(1)',
      circularQueue: 'O(1)',
      priorityQueue: 'O(log n)'
    },
    deletion: {
      stack: 'O(1)',
      queue: 'O(1) - O(n)*',
      circularQueue: 'O(1)',
      priorityQueue: 'O(log n)'
    },
    peek: {
      stack: 'O(1)',
      queue: 'O(1)',
      circularQueue: 'O(1)',
      priorityQueue: 'O(1)'
    },
    search: {
      stack: 'O(n)',
      queue: 'O(n)',
      circularQueue: 'O(n)',
      priorityQueue: 'O(n)'
    }
  },
  notes: {
    queue: '*O(n) for array implementation due to shifting, O(1) for linked list implementation'
  }
};

export const COMMON_ALGORITHMS = {
  stack: [
    {
      name: 'Balanced Parentheses',
      description: 'Check if parentheses in an expression are balanced',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      useCase: 'Syntax validation in compilers'
    },
    {
      name: 'Postfix Evaluation',
      description: 'Evaluate postfix expressions using stack',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      useCase: 'Calculator implementations'
    },
    {
      name: 'Infix to Postfix',
      description: 'Convert infix expressions to postfix notation',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      useCase: 'Compiler design'
    },
    {
      name: 'Tower of Hanoi',
      description: 'Solve the classic Tower of Hanoi puzzle',
      timeComplexity: 'O(2^n)',
      spaceComplexity: 'O(n)',
      useCase: 'Recursive problem solving'
    }
  ],
  queue: [
    {
      name: 'Breadth-First Search',
      description: 'Graph traversal algorithm using queue',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      useCase: 'Shortest path in unweighted graphs'
    },
    {
      name: 'Level Order Traversal',
      description: 'Traverse tree level by level',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(w)', // w is maximum width
      useCase: 'Tree processing'
    },
    {
      name: 'Generate Binary Numbers',
      description: 'Generate binary numbers from 1 to n',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      useCase: 'Number sequence generation'
    },
    {
      name: 'Sliding Window Maximum',
      description: 'Find maximum in each sliding window using deque',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(k)',
      useCase: 'Array processing problems'
    }
  ]
};

export const IMPLEMENTATION_COMPARISON = {
  array: {
    advantages: [
      'Simple implementation',
      'Cache-friendly',
      'No extra memory for pointers'
    ],
    disadvantages: [
      'Fixed size (static arrays)',
      'Shifting required for queue operations',
      'Memory waste in circular queues'
    ]
  },
  linkedList: {
    advantages: [
      'Dynamic size',
      'No shifting required',
      'Memory efficient'
    ],
    disadvantages: [
      'Extra memory for pointers',
      'Not cache-friendly',
      'More complex implementation'
    ]
  }
};

export const VISUALIZATION_CONCEPTS = {
  stack: {
    direction: 'vertical',
    growthDirection: 'upward',
    visualMetaphors: ['Stack of plates', 'Stack of books', 'Stack of papers'],
    keyVisualElements: [
      'Top pointer/indicator',
      'LIFO arrow indication',
      'Stack height visualization',
      'Overflow/underflow states'
    ]
  },
  queue: {
    direction: 'horizontal',
    growthDirection: 'left-to-right',
    visualMetaphors: ['People in line', 'Cars at traffic light', 'Print queue'],
    keyVisualElements: [
      'Front and rear pointers',
      'FIFO flow indication',
      'Queue length visualization',
      'Empty/full states'
    ]
  }
};

export default {
  STACK_INFO,
  QUEUE_INFO,
  QUEUE_VARIANTS,
  COMPLEXITY_COMPARISON,
  COMMON_ALGORITHMS,
  IMPLEMENTATION_COMPARISON,
  VISUALIZATION_CONCEPTS
};
