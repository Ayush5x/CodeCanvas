import { useState } from 'react';

const HeapDiySection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyCount, setCopyCount] = useState(0);
  const [copyText, setCopyText] = useState("Copy Code to Clipboard");
  
  const heapCode = `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_SIZE 100

// Min Heap structure
typedef struct {
    int heap[MAX_SIZE];
    int size;
    int capacity;
} MinHeap;

// Max Heap structure  
typedef struct {
    int heap[MAX_SIZE];
    int size;
    int capacity;
} MaxHeap;

// Helper functions for array indexing
int parent(int i) { return (i - 1) / 2; }
int leftChild(int i) { return 2 * i + 1; }
int rightChild(int i) { return 2 * i + 2; }

// Initialize Min Heap
MinHeap* createMinHeap() {
    MinHeap* heap = (MinHeap*)malloc(sizeof(MinHeap));
    heap->size = 0;
    heap->capacity = MAX_SIZE;
    return heap;
}

// Initialize Max Heap
MaxHeap* createMaxHeap() {
    MaxHeap* heap = (MaxHeap*)malloc(sizeof(MaxHeap));
    heap->size = 0;
    heap->capacity = MAX_SIZE;
    return heap;
}

// Swap two elements
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
    printf("Swapped %d and %d\\n", *b, *a);
}

// Min Heap: Sift up (percolate up)
void siftUpMin(MinHeap* heap, int index) {
    if (index == 0) return; // Root reached
    
    int parentIdx = parent(index);
    printf("Comparing %d (index %d) with parent %d (index %d)\\n", 
           heap->heap[index], index, heap->heap[parentIdx], parentIdx);
    
    if (heap->heap[index] < heap->heap[parentIdx]) {
        printf("Min heap property violated, swapping up\\n");
        swap(&heap->heap[index], &heap->heap[parentIdx]);
        siftUpMin(heap, parentIdx);
    }
}

// Max Heap: Sift up (percolate up)
void siftUpMax(MaxHeap* heap, int index) {
    if (index == 0) return; // Root reached
    
    int parentIdx = parent(index);
    printf("Comparing %d (index %d) with parent %d (index %d)\\n", 
           heap->heap[index], index, heap->heap[parentIdx], parentIdx);
    
    if (heap->heap[index] > heap->heap[parentIdx]) {
        printf("Max heap property violated, swapping up\\n");
        swap(&heap->heap[index], &heap->heap[parentIdx]);
        siftUpMax(heap, parentIdx);
    }
}

// Min Heap: Sift down (heapify down)
void siftDownMin(MinHeap* heap, int index) {
    int left = leftChild(index);
    int right = rightChild(index);
    int smallest = index;
    
    if (left < heap->size && heap->heap[left] < heap->heap[smallest]) {
        smallest = left;
    }
    
    if (right < heap->size && heap->heap[right] < heap->heap[smallest]) {
        smallest = right;
    }
    
    if (smallest != index) {
        printf("Sifting down: swapping %d (index %d) with %d (index %d)\\n",
               heap->heap[index], index, heap->heap[smallest], smallest);
        swap(&heap->heap[index], &heap->heap[smallest]);
        siftDownMin(heap, smallest);
    }
}

// Max Heap: Sift down (heapify down)
void siftDownMax(MaxHeap* heap, int index) {
    int left = leftChild(index);
    int right = rightChild(index);
    int largest = index;
    
    if (left < heap->size && heap->heap[left] > heap->heap[largest]) {
        largest = left;
    }
    
    if (right < heap->size && heap->heap[right] > heap->heap[largest]) {
        largest = right;
    }
    
    if (largest != index) {
        printf("Sifting down: swapping %d (index %d) with %d (index %d)\\n",
               heap->heap[index], index, heap->heap[largest], largest);
        swap(&heap->heap[index], &heap->heap[largest]);
        siftDownMax(heap, largest);
    }
}

// Insert into Min Heap
void insertMin(MinHeap* heap, int value) {
    if (heap->size >= heap->capacity) {
        printf("Heap is full!\\n");
        return;
    }
    
    printf("\\nInserting %d into min heap\\n", value);
    heap->heap[heap->size] = value;
    printf("Placed %d at index %d\\n", value, heap->size);
    
    siftUpMin(heap, heap->size);
    heap->size++;
    
    printf("Min heap after insertion: ");
    printMinHeap(heap);
}

// Insert into Max Heap
void insertMax(MaxHeap* heap, int value) {
    if (heap->size >= heap->capacity) {
        printf("Heap is full!\\n");
        return;
    }
    
    printf("\\nInserting %d into max heap\\n", value);
    heap->heap[heap->size] = value;
    printf("Placed %d at index %d\\n", value, heap->size);
    
    siftUpMax(heap, heap->size);
    heap->size++;
    
    printf("Max heap after insertion: ");
    printMaxHeap(heap);
}

// Extract minimum from Min Heap
int extractMin(MinHeap* heap) {
    if (heap->size == 0) {
        printf("Heap is empty!\\n");
        return -1;
    }
    
    int min = heap->heap[0];
    printf("\\nExtracting minimum: %d\\n", min);
    
    // Move last element to root
    heap->heap[0] = heap->heap[heap->size - 1];
    heap->size--;
    
    printf("Moved %d to root, heap size now %d\\n", heap->heap[0], heap->size);
    
    // Restore heap property
    if (heap->size > 0) {
        siftDownMin(heap, 0);
    }
    
    printf("Min heap after extraction: ");
    printMinHeap(heap);
    
    return min;
}

// Extract maximum from Max Heap
int extractMax(MaxHeap* heap) {
    if (heap->size == 0) {
        printf("Heap is empty!\\n");
        return -1;
    }
    
    int max = heap->heap[0];
    printf("\\nExtracting maximum: %d\\n", max);
    
    // Move last element to root
    heap->heap[0] = heap->heap[heap->size - 1];
    heap->size--;
    
    printf("Moved %d to root, heap size now %d\\n", heap->heap[0], heap->size);
    
    // Restore heap property
    if (heap->size > 0) {
        siftDownMax(heap, 0);
    }
    
    printf("Max heap after extraction: ");
    printMaxHeap(heap);
    
    return max;
}

// Print Min Heap
void printMinHeap(MinHeap* heap) {
    printf("MinHeap: [");
    for (int i = 0; i < heap->size; i++) {
        printf("%d", heap->heap[i]);
        if (i < heap->size - 1) printf(", ");
    }
    printf("] (size: %d)\\n", heap->size);
}

// Print Max Heap
void printMaxHeap(MaxHeap* heap) {
    printf("MaxHeap: [");
    for (int i = 0; i < heap->size; i++) {
        printf("%d", heap->heap[i]);
        if (i < heap->size - 1) printf(", ");
    }
    printf("] (size: %d)\\n", heap->size);
}

// Build heap from array (O(n) construction)
void buildMinHeap(MinHeap* heap, int arr[], int n) {
    printf("\\nBuilding min heap from array\\n");
    heap->size = n;
    
    // Copy array to heap
    for (int i = 0; i < n; i++) {
        heap->heap[i] = arr[i];
    }
    
    printf("Initial array: ");
    printMinHeap(heap);
    
    // Start from last non-leaf node and sift down
    for (int i = (n / 2) - 1; i >= 0; i--) {
        printf("Heapifying from index %d (value %d)\\n", i, heap->heap[i]);
        siftDownMin(heap, i);
    }
    
    printf("Final min heap: ");
    printMinHeap(heap);
}

// Example usage
int main() {
    printf("=== Heap Data Structure Demo ===\\n");
    
    // Min Heap Example
    printf("\\n--- MIN HEAP OPERATIONS ---\\n");
    MinHeap* minHeap = createMinHeap();
    
    printf("Inserting values: 4, 1, 3, 2, 16, 9, 10, 14, 8, 7\\n");
    insertMin(minHeap, 4);
    insertMin(minHeap, 1);
    insertMin(minHeap, 3);
    insertMin(minHeap, 2);
    insertMin(minHeap, 16);
    insertMin(minHeap, 9);
    insertMin(minHeap, 10);
    insertMin(minHeap, 14);
    insertMin(minHeap, 8);
    insertMin(minHeap, 7);
    
    printf("\\nExtracting minimums:\\n");
    while (minHeap->size > 0) {
        int min = extractMin(minHeap);
        printf("Extracted: %d\\n", min);
    }
    
    // Max Heap Example
    printf("\\n--- MAX HEAP OPERATIONS ---\\n");
    MaxHeap* maxHeap = createMaxHeap();
    
    printf("Inserting values: 4, 1, 3, 2, 16, 9, 10, 14, 8, 7\\n");
    insertMax(maxHeap, 4);
    insertMax(maxHeap, 1);
    insertMax(maxHeap, 3);
    insertMax(maxHeap, 2);
    insertMax(maxHeap, 16);
    insertMax(maxHeap, 9);
    insertMax(maxHeap, 10);
    insertMax(maxHeap, 14);
    insertMax(maxHeap, 8);
    insertMax(maxHeap, 7);
    
    // Build Heap Example
    printf("\\n--- BUILD HEAP FROM ARRAY ---\\n");
    int arr[] = {4, 1, 3, 2, 16, 9, 10, 14, 8, 7};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    MinHeap* builtHeap = createMinHeap();
    buildMinHeap(builtHeap, arr, n);
    
    // Clean up
    free(minHeap);
    free(maxHeap);
    free(builtHeap);
    
    return 0;
}

/*
Key Concepts Demonstrated:
1. Array-based complete binary tree representation
2. Parent-child relationships: parent(i) = (i-1)/2, children = 2i+1, 2i+2
3. Heap property: min-heap (parent ≤ children), max-heap (parent ≥ children)
4. Sift up: restore heap property after insertion
5. Sift down: restore heap property after extraction
6. O(n) build-heap algorithm
7. O(log n) insertion and extraction
*/`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(heapCode);
      const newCount = copyCount + 1;
      setCopyCount(newCount);
      setCopyText(`Copied! (${newCount})`);
      
      setTimeout(() => {
        setCopyText("Copy Code to Clipboard");
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
      setCopyText("Copy failed - try selecting manually");
      setTimeout(() => {
        setCopyText("Copy Code to Clipboard");
      }, 2000);
    }
  };

  return (
    <div className="diy-section">
      <h3 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? '▼' : '►'} How to Run This Heap Code Yourself
      </h3>
      
      {isExpanded && (
        <div className="diy-content">
          <p>
            Want to implement and experiment with Heaps yourself? 
            Here's a complete, runnable C implementation with both min and max heaps!
          </p>
          
          <h4>🚀 Quick Start:</h4>
          <ol>
            <li>Copy the code below</li>
            <li>Save it as <code>heap.c</code></li>
            <li>Compile: <code>gcc -o heap heap.c</code></li>
            <li>Run: <code>./heap</code></li>
          </ol>
          
          <h4>💡 Try These Heap Experiments:</h4>
          <ul>
            <li>Build heaps from different array configurations (sorted, reverse, random)</li>
            <li>Compare build-heap O(n) vs repeated insertion O(n log n)</li>
            <li>Implement heap sort using extract operations</li>
            <li>Test priority queue operations (insert with priority, extract max/min)</li>
            <li>Verify heap property is maintained after every operation</li>
            <li>Measure performance with large datasets</li>
          </ul>
          
          <h4>🔧 Heap-Specific Features:</h4>
          <ul>
            <li>Both min-heap and max-heap implementations</li>
            <li>Array-based complete binary tree representation</li>
            <li>Sift up (percolate up) for insertion</li>
            <li>Sift down (heapify down) for extraction</li>
            <li>O(n) build-heap algorithm from arbitrary array</li>
            <li>Detailed step-by-step operation explanations</li>
          </ul>
          
          <div className="code-container">
            <div className="code-header">
              <span className="language-label">C</span>
              <button 
                onClick={handleCopyCode}
                className="copy-button"
                title="Copy heap code to clipboard"
              >
                {copyText}
              </button>
            </div>
            <div className="code-content">
              <pre><code>{heapCode}</code></pre>
            </div>
          </div>
          
          <h4>🎯 Heap Learning Extensions:</h4>
          <ul>
            <li><strong>Heap Sort:</strong> Implement in-place sorting using heap operations</li>
            <li><strong>Priority Queue:</strong> Add priority-based insertion and extraction</li>
            <li><strong>K-way Merge:</strong> Use min-heap to merge k sorted arrays</li>
            <li><strong>Top-K Problems:</strong> Find k largest/smallest elements efficiently</li>
            <li><strong>Median Tracking:</strong> Use two heaps to maintain running median</li>
            <li><strong>Dynamic Resizing:</strong> Implement heap with automatic capacity management</li>
          </ul>
          
          <div className="tip-box">
            <h4>💡 Heap Pro Tip:</h4>
            <p>
              Heaps are perfect for priority queues! The array representation makes them cache-friendly, 
              and the complete tree property ensures O(log n) height. Use min-heap for smallest-first 
              scenarios (Dijkstra's algorithm) and max-heap for largest-first (scheduling systems).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeapDiySection;
