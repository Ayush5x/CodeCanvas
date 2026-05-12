// Heap Logic for Synchronized Visualizer

/**
 * Heaps are represented as arrays [null, val1, val2, ...]
 * Index 1 is the root.
 * Parent of i is floor(i/2)
 * Left child of i is 2i
 * Right child of i is 2i + 1
 */

export const getParent = (i) => Math.floor(i / 2);
export const getLeft = (i) => i * 2;
export const getRight = (i) => i * 2 + 1;

// Layout constants for complete binary tree
const INITIAL_X = 1000;
const INITIAL_Y = 80;
const X_SPACING = 450;
const Y_SPACING = 120;


export const calculateHeapLayout = (heap, xSpacing = X_SPACING, ySpacing = Y_SPACING) => {
  if (heap.length <= 1) return [];
  
  const nodes = [];
  const levels = Math.floor(Math.log2(heap.length - 1)) + 1;
  
  const traverse = (idx, level, x, xOffset) => {
    if (idx >= heap.length) return;
    
    nodes.push({
      id: idx.toString(),
      val: heap[idx],
      x: x,
      y: level * ySpacing + INITIAL_Y,
      index: idx
    });
    
    traverse(getLeft(idx), level + 1, x - xOffset, xOffset / 2);
    traverse(getRight(idx), level + 1, x + xOffset, xOffset / 2);
  };
  
  traverse(1, 0, INITIAL_X, xSpacing);
  return nodes;
};

export const getHeapEdges = (heap, xSpacing = X_SPACING, ySpacing = Y_SPACING) => {
  if (heap.length <= 1) return [];
  const edges = [];
  const nodes = calculateHeapLayout(heap, xSpacing, ySpacing);
  
  for (let i = 1; i < heap.length; i++) {
    const left = getLeft(i);
    const right = getRight(i);
    const fromNode = nodes.find(n => n.id === i.toString());
    
    if (left < heap.length) {
      const toNode = nodes.find(n => n.id === left.toString());
      if (fromNode && toNode) {
        edges.push({ id: `${i}-${left}`, from: fromNode, to: toNode });
      }
    }
    if (right < heap.length) {
      const toNode = nodes.find(n => n.id === right.toString());
      if (fromNode && toNode) {
        edges.push({ id: `${i}-${right}`, from: fromNode, to: toNode });
      }
    }
  }
  return edges;
};

// --- Generators ---

export const INSERT_CODE = [
  { line: 1, text: "function insert(val) {" },
  { line: 2, text: "  heap.push(val);" },
  { line: 3, text: "  let i = heap.length - 1;" },
  { line: 4, text: "  while (i > 1 && compare(heap[i], heap[parent(i)])) {" },
  { line: 5, text: "    swap(heap[i], heap[parent(i)]);" },
  { line: 6, text: "    i = parent(i);" },
  { line: 7, text: "  }" },
  { line: 8, text: "}" }
];

export async function* insertGenerator(heap, val, isMaxHeap) {
  const compare = (a, b) => isMaxHeap ? a > b : a < b;
  const type = isMaxHeap ? "MAX" : "MIN";

  yield { line: 1, msg: `Initializing ${type}_HEAP insertion for ${val}` };
  
  const newHeap = [...heap];
  newHeap.push(val);
  let i = newHeap.length - 1;
  yield { line: 2, heap: [...newHeap], nodeId: i.toString(), msg: `Appended ${val} to end of array` };
  
  yield { line: 3, nodeId: i.toString(), msg: `Current index: ${i}` };

  while (i > 1) {
    let p = getParent(i);
    yield { line: 4, nodeId: i.toString(), parentId: p.toString(), msg: `Comparing child ${newHeap[i]} with parent ${newHeap[p]}` };
    
    if (compare(newHeap[i], newHeap[p])) {
      yield { line: 5, nodeId: i.toString(), parentId: p.toString(), msg: `${newHeap[i]} violates ${type}_HEAP property relative to ${newHeap[p]}. SWAPPING.` };
      [newHeap[i], newHeap[p]] = [newHeap[p], newHeap[i]];
      i = p;
      yield { line: 6, heap: [...newHeap], nodeId: i.toString(), msg: `Moved up to index ${i}` };
    } else {
      yield { line: 4, msg: `Heap property satisfied.` };
      break;
    }
  }
  
  yield { line: 8, msg: `Insertion complete.` };
  return newHeap;
}

export const EXTRACT_CODE = [
  { line: 1, text: "function extract() {" },
  { line: 2, text: "  const root = heap[1];" },
  { line: 3, text: "  heap[1] = heap.pop();" },
  { line: 4, text: "  heapify(1);" },
  { line: 5, text: "  return root;" },
  { line: 6, text: "}" },
  { line: 7, text: "function heapify(i) {" },
  { line: 8, text: "  let target = i;" },
  { line: 9, text: "  if (left < size && compare(heap[left], heap[target])) target = left;" },
  { line: 10, text: "  if (right < size && compare(heap[right], heap[target])) target = right;" },
  { line: 11, text: "  if (target !== i) { swap(i, target); heapify(target); }" },
  { line: 12, text: "}" }
];

export async function* extractGenerator(heap, isMaxHeap) {
  if (heap.length <= 1) return heap;
  const compare = (a, b) => isMaxHeap ? a > b : a < b;
  const type = isMaxHeap ? "MAX" : "MIN";

  yield { line: 1, msg: `Extracting ${isMaxHeap ? 'ROOT_MAX' : 'ROOT_MIN'} from heap` };
  
  const rootVal = heap[1];
  yield { line: 2, nodeId: "1", msg: `Root value is ${rootVal}` };

  const newHeap = [...heap];
  if (newHeap.length === 2) {
    newHeap.pop();
    yield { line: 3, heap: [...newHeap], msg: "Heap emptied." };
    return newHeap;
  }

  const lastVal = newHeap.pop();
  newHeap[1] = lastVal;
  yield { line: 3, heap: [...newHeap], nodeId: "1", msg: `Replaced root with last element ${lastVal}` };

  // Heapify
  yield { line: 4, msg: `Starting heapify from root` };
  
  let i = 1;
  while (true) {
    yield { line: 8, nodeId: i.toString(), msg: `Checking children of ${newHeap[i]}` };
    let target = i;
    let l = getLeft(i);
    let r = getRight(i);

    if (l < newHeap.length) {
      yield { line: 9, nodeId: i.toString(), leftId: l.toString(), msg: `Comparing ${newHeap[l]} with ${newHeap[target]}` };
      if (compare(newHeap[l], newHeap[target])) target = l;
    }

    if (r < newHeap.length) {
      yield { line: 10, nodeId: i.toString(), rightId: r.toString(), msg: `Comparing ${newHeap[r]} with ${newHeap[target]}` };
      if (compare(newHeap[r], newHeap[target])) target = r;
    }

    if (target !== i) {
      yield { line: 11, nodeId: i.toString(), swapId: target.toString(), msg: `Violated ${type}_HEAP. Swapping ${newHeap[i]} with ${newHeap[target]}` };
      [newHeap[i], newHeap[target]] = [newHeap[target], newHeap[i]];
      i = target;
      yield { line: 11, heap: [...newHeap], nodeId: i.toString(), msg: `Recursing down to index ${i}` };
    } else {
      yield { line: 11, msg: `Heap property restored.` };
      break;
    }
  }

  yield { line: 5, msg: `Extraction complete. Returned ${rootVal}` };
  return newHeap;
}
