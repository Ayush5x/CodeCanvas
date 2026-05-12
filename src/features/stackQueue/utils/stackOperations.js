/**
 * Stack Data Structure Implementation
 * Provides comprehensive stack operations with memory management and visualization support
 */

export class Stack {
  constructor() {
    this.items = [];
    this.maxSize = 10;
    this.operations = [];
  }

  /**
   * Check if the stack is empty
   * @returns {boolean} True if stack is empty, false otherwise
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Check if the stack is full
   * @returns {boolean} True if stack is full, false otherwise
   */
  isFull() {
    return this.items.length >= this.maxSize;
  }

  /**
   * Get the current size of the stack
   * @returns {number} Number of elements in the stack
   */
  size() {
    return this.items.length;
  }

  /**
   * Peek at the top element without removing it
   * @returns {*} The top element or null if empty
   */
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  /**
   * Push an element onto the stack
   * @param {*} element - Element to push
   * @returns {boolean} True if successful, false if stack is full
   */
  push(element) {
    if (this.isFull()) {
      throw new Error('Stack Overflow: Cannot push to a full stack');
    }

    this.items.push(element);
    this.operations.push({
      type: 'push',
      element: element,
      timestamp: Date.now(),
      stackSize: this.items.length
    });
    
    return true;
  }

  /**
   * Pop an element from the stack
   * @returns {*} The popped element or null if empty
   */
  pop() {
    if (this.isEmpty()) {
      throw new Error('Stack Underflow: Cannot pop from an empty stack');
    }

    const element = this.items.pop();
    this.operations.push({
      type: 'pop',
      element: element,
      timestamp: Date.now(),
      stackSize: this.items.length
    });

    return element;
  }

  /**
   * Clear all elements from the stack
   */
  clear() {
    const clearedCount = this.items.length;
    this.items = [];
    this.operations.push({
      type: 'clear',
      clearedCount: clearedCount,
      timestamp: Date.now(),
      stackSize: 0
    });
  }

  /**
   * Get all elements as an array (for visualization)
   * @returns {Array} Copy of stack elements
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
   * Get stack statistics
   * @returns {Object} Statistics about the stack
   */
  getStats() {
    const pushCount = this.operations.filter(op => op.type === 'push').length;
    const popCount = this.operations.filter(op => op.type === 'pop').length;
    
    return {
      currentSize: this.size(),
      maxSize: this.maxSize,
      totalPushes: pushCount,
      totalPops: popCount,
      totalOperations: this.operations.length,
      isEmpty: this.isEmpty(),
      isFull: this.isFull(),
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
   * Create a new stack from an array
   * @param {Array} elements - Elements to add to stack
   * @returns {Stack} New stack instance
   */
  static fromArray(elements) {
    const stack = new Stack();
    elements.forEach(element => {
      if (!stack.isFull()) {
        stack.push(element);
      }
    });
    return stack;
  }
}

/**
 * Stack utility functions for common operations
 */
export const StackUtils = {
  /**
   * Check if parentheses are balanced using a stack
   * @param {string} str - String to check
   * @returns {boolean} True if balanced, false otherwise
   */
  isBalancedParentheses(str) {
    const stack = new Stack();
    const pairs = { '(': ')', '[': ']', '{': '}' };
    
    for (let char of str) {
      if (char in pairs) {
        stack.push(char);
      } else if (Object.values(pairs).includes(char)) {
        if (stack.isEmpty() || pairs[stack.pop()] !== char) {
          return false;
        }
      }
    }
    
    return stack.isEmpty();
  },

  /**
   * Evaluate postfix expression using a stack
   * @param {string} expression - Postfix expression
   * @returns {number} Result of evaluation
   */
  evaluatePostfix(expression) {
    const stack = new Stack();
    const tokens = expression.split(' ');
    
    for (let token of tokens) {
      if (!isNaN(token)) {
        stack.push(parseFloat(token));
      } else {
        const b = stack.pop();
        const a = stack.pop();
        
        switch (token) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/': stack.push(a / b); break;
          default: throw new Error(`Unknown operator: ${token}`);
        }
      }
    }
    
    return stack.pop();
  },

  /**
   * Convert infix to postfix notation
   * @param {string} infix - Infix expression
   * @returns {string} Postfix expression
   */
  infixToPostfix(infix) {
    const stack = new Stack();
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
    const tokens = infix.split(' ');
    const result = [];
    
    for (let token of tokens) {
      if (!isNaN(token)) {
        result.push(token);
      } else if (token === '(') {
        stack.push(token);
      } else if (token === ')') {
        while (!stack.isEmpty() && stack.peek() !== '(') {
          result.push(stack.pop());
        }
        stack.pop(); // Remove '('
      } else {
        while (!stack.isEmpty() && 
               precedence[stack.peek()] >= precedence[token]) {
          result.push(stack.pop());
        }
        stack.push(token);
      }
    }
    
    while (!stack.isEmpty()) {
      result.push(stack.pop());
    }
    
    return result.join(' ');
  },

  /**
   * Reverse a string using a stack
   * @param {string} str - String to reverse
   * @returns {string} Reversed string
   */
  reverseString(str) {
    const stack = new Stack();
    
    for (let char of str) {
      stack.push(char);
    }
    
    let reversed = '';
    while (!stack.isEmpty()) {
      reversed += stack.pop();
    }
    
    return reversed;
  }
};

export default Stack;
