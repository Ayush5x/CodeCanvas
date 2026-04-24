import { useState } from 'react';

const DiySection = ({ dataStructure = 'stack' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyCount, setCopyCount] = useState(0);
  const [copyText, setCopyText] = useState("Copy Code to Clipboard");
  
  const code = dataStructure === 'stack' 
    ? `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_SIZE 10

typedef struct {
    int elements[MAX_SIZE];
    int top;
    int maxSize;
} Stack;

// Initialize stack
void initStack(Stack* s, int size) {
    s->top = -1;
    s->maxSize = (size > MAX_SIZE) ? MAX_SIZE : size;
}

// Check if stack is empty
bool isEmpty(Stack* s) {
    return s->top == -1;
}

// Check if stack is full
bool isFull(Stack* s) {
    return s->top >= s->maxSize - 1;
}

// Push element to top of stack
void push(Stack* s, int value) {
    if (isFull(s)) {
        printf("Stack overflow\\n");
        return;
    }
    s->top++;
    s->elements[s->top] = value;
    printf("Pushed %d to stack\\n", value);
}

// Remove and return top element
int pop(Stack* s) {
    if (isEmpty(s)) {
        printf("Stack underflow\\n");
        return -1; // Error value
    }
    int topValue = s->elements[s->top];
    s->top--;
    printf("Popped %d from stack\\n", topValue);
    return topValue;
}

// View top element without removing
int peek(Stack* s) {
    if (isEmpty(s)) {
        printf("Stack is empty\\n");
        return -1; // Error value
    }
    printf("Top element: %d\\n", s->elements[s->top]);
    return s->elements[s->top];
}

// Get current stack size
int size(Stack* s) {
    return s->top + 1;
}

// Display stack contents
void display(Stack* s) {
    if (isEmpty(s)) {
        printf("Stack is empty\\n");
        return;
    }
    
    printf("Stack contents (top to bottom): ");
    for (int i = s->top; i >= 0; i--) {
        printf("%d", s->elements[i]);
        if (i > 0) printf(", ");
    }
    printf("\\n");
}

int main() {
    Stack stack;
    initStack(&stack, 5);  // Create a stack with max size 5
    
    push(&stack, 10);
    push(&stack, 20);
    push(&stack, 30);
    
    display(&stack);  // 30, 20, 10
    
    peek(&stack);     // 30
    pop(&stack);      // removes 30
    peek(&stack);     // 20
    
    push(&stack, 40);
    push(&stack, 50);
    
    display(&stack);  // 50, 40, 20, 10
    
    return 0;
    }
    
    return 0;
}`
    : `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_SIZE 10

typedef struct {
    int elements[MAX_SIZE];
    int front;
    int rear;
    int count;
    int maxSize;
} Queue;

// Initialize queue
void initQueue(Queue* q, int size) {
    q->front = 0;
    q->rear = -1;
    q->count = 0;
    q->maxSize = (size > MAX_SIZE) ? MAX_SIZE : size;
}

// Check if queue is empty
bool isEmpty(Queue* q) {
    return q->count == 0;
}

// Check if queue is full
bool isFull(Queue* q) {
    return q->count >= q->maxSize;
}

// Add element to rear of queue
void enqueue(Queue* q, int value) {
    if (isFull(q)) {
        printf("Queue overflow\\n");
        return;
    }
    q->rear = (q->rear + 1) % q->maxSize;
    q->elements[q->rear] = value;
    q->count++;
    printf("Enqueued %d to queue\\n", value);
}

// Remove and return front element
int dequeue(Queue* q) {
    if (isEmpty(q)) {
        printf("Queue underflow\\n");
        return -1; // Error value
    }
    int frontValue = q->elements[q->front];
    q->front = (q->front + 1) % q->maxSize;
    q->count--;
    printf("Dequeued %d from queue\\n", frontValue);
    return frontValue;
}

// View front element without removing
int peek(Queue* q) {
    if (isEmpty(q)) {
        printf("Queue is empty\\n");
        return -1; // Error value
    }
    printf("Front element: %d\\n", q->elements[q->front]);
    return q->elements[q->front];
}

// Get current queue size
int size(Queue* q) {
    return q->count;
}

// Display queue contents
void display(Queue* q) {
    if (isEmpty(q)) {
        printf("Queue is empty\\n");
        return;
    }
        
    printf("Queue contents (front to rear): ");
    int index = q->front;
    for (int i = 0; i < q->count; i++) {
        printf("%d", q->elements[index]);
        if (i < q->count - 1) printf(", ");
        index = (index + 1) % q->maxSize;
    }
    printf("\\n");
}

int main() {
    Queue queue;
    initQueue(&queue, 5);  // Create a queue with max size 5
    
    enqueue(&queue, 10);
    enqueue(&queue, 20);
    enqueue(&queue, 30);
    
    display(&queue);  // 10, 20, 30
    
    peek(&queue);     // 10
    dequeue(&queue);  // removes 10
    peek(&queue);     // 20
    
    enqueue(&queue, 40);
    enqueue(&queue, 50);
    
    display(&queue);  // 20, 30, 40, 50
    
    return 0;
}`;

  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopyCount(prev => prev + 1);
    
    // Fun copy messages
    const messages = [
      "Copied!",
      "Copied twice!",
      "Mega copy!",
      "Super copy!",
      "Ultra copy!",
      "MAXIMUM COPY!",
      "LEGENDARY COPY!!",
      "GODLIKE COPY!!!",
      "BEYOND COPY!!!!",
      "∞ COPY ∞"
    ];
    
    setCopyText(messages[Math.min(copyCount, messages.length - 1)]);
    
    // Reset text after 2 seconds
    setTimeout(() => {
      setCopyText("Copy Code to Clipboard");
    }, 2000);
  };
  
  return (
    <div className="diy-section">
      <h3 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? '▼' : '►'} How to Run This Code Yourself
      </h3>
      
      {isExpanded && (
        <div className="diy-content">
          <h4>Option 1: Online C Compiler</h4>
          <ol>
            <li>Copy the code below</li>
            <li>Visit an online C compiler like <a href="https://www.onlinegdb.com/online_c_compiler" target="_blank" rel="noopener noreferrer">OnlineGDB</a> or <a href="https://www.programiz.com/c-programming/online-compiler/" target="_blank" rel="noopener noreferrer">Programiz</a></li>
            <li>Paste the code and click "Run"</li>
            <li>Experiment by modifying the operations in the main() function</li>
          </ol>
          
          <h4>Option 2: Local Development</h4>
          <ol>
            <li>Save the code as <code>{dataStructure === 'stack' ? 'stack.c' : 'queue.c'}</code></li>
            <li>Compile with gcc: <code>gcc -o {dataStructure} {dataStructure}.c</code></li>
            <li>Run the program: <code>./{dataStructure}</code></li>
          </ol>
          
          <h4>Try These Exercises:</h4>
          <ul>
            <li>Add a method to display all elements in the {dataStructure}</li>
            <li>Implement a method to check if a specific value exists in the {dataStructure}</li>
            {dataStructure === 'stack' ? (
              <li>Implement a function to reverse a string using a stack</li>
            ) : (
              <li>Implement a circular queue that reuses empty spaces</li>
            )}
          </ul>
          
          <pre className="code-block">
            <code>{code}</code>
          </pre>
          
          <button 
            onClick={handleCopy}
            className={`copy-button ${copyText !== "Copy Code to Clipboard" ? 'copied' : ''}`}
          >
            {copyText}
          </button>
        </div>
      )}
    </div>
  );
};

export default DiySection;
