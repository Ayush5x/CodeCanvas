// BST Node Structure
export class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.id = Math.random().toString(36).substr(2, 9);
    // Position for visualization
    this.x = 0;
    this.y = 0;
  }
}

// Layout constants
const INITIAL_X = 1000;
const INITIAL_Y = 60;
const X_SPACING = 450;
const Y_SPACING = 100;



/**
 * Calculates hierarchical positions for nodes
 */
export const calculateLayout = (node, depth = 0, x = INITIAL_X, xOffset = X_SPACING, ySpacing = Y_SPACING) => {
  if (!node) return [];
  
  node.x = x;
  node.y = depth * ySpacing + INITIAL_Y;
  
  let nodes = [node];
  if (node.left) {
    nodes = [...nodes, ...calculateLayout(node.left, depth + 1, x - xOffset, xOffset / 2, ySpacing)];
  }
  if (node.right) {
    nodes = [...nodes, ...calculateLayout(node.right, depth + 1, x + xOffset, xOffset / 2, ySpacing)];
  }
  return nodes;
};

/**
 * Gets all edges for the tree
 */
export const getEdges = (node) => {
  if (!node) return [];
  let edges = [];
  if (node.left) {
    edges.push({ from: node, to: node.left, id: `${node.id}-${node.left.id}` });
    edges = [...edges, ...getEdges(node.left)];
  }
  if (node.right) {
    edges.push({ from: node, to: node.right, id: `${node.id}-${node.right.id}` });
    edges = [...edges, ...getEdges(node.right)];
  }
  return edges;
};

// --- Algorithmic Generators ---

export const SEARCH_CODE = [
  { line: 1, text: "async function search(root, val) {" },
  { line: 2, text: "  if (!root) return null;" },
  { line: 3, text: "  if (val === root.val) return root;" },
  { line: 4, text: "  if (val < root.val) {" },
  { line: 5, text: "    return await search(root.left, val);" },
  { line: 6, text: "  } else {" },
  { line: 7, text: "    return await search(root.right, val);" },
  { line: 8, text: "  }" },
  { line: 9, text: "}" }
];

export async function* searchGenerator(node, val) {
  yield { line: 1, nodeId: node ? node.id : null, msg: `Initializing search for ${val}` };
  
  yield { line: 2, nodeId: node ? node.id : null, msg: node ? `Checking node ${node.val}` : `Node is null, value not found` };
  if (!node) return null;
  
  yield { line: 3, nodeId: node.id, msg: `Comparing ${val} === ${node.val}` };
  if (val === node.val) return node;
  
  yield { line: 4, nodeId: node.id, msg: `Checking if ${val} < ${node.val}` };
  if (val < node.val) {
    yield { line: 5, nodeId: node.id, edgeTo: node.left ? node.left.id : null, msg: `${val} < ${node.val}, traversing LEFT` };
    return yield* searchGenerator(node.left, val);
  } else {
    yield { line: 6, nodeId: node.id };
    yield { line: 7, nodeId: node.id, edgeTo: node.right ? node.right.id : null, msg: `${val} > ${node.val}, traversing RIGHT` };
    return yield* searchGenerator(node.right, val);
  }
}


export const INSERT_CODE = [
  { line: 1, text: "async function insert(root, val) {" },
  { line: 2, text: "  if (!root) return new Node(val);" },
  { line: 3, text: "  if (val < root.val) {" },
  { line: 4, text: "    root.left = await insert(root.left, val);" },
  { line: 5, text: "  } else {" },
  { line: 6, text: "    root.right = await insert(root.right, val);" },
  { line: 7, text: "  }" },
  { line: 8, text: "  return root;" },
  { line: 9, text: "}" }
];

export async function* insertGenerator(node, val) {
  yield { line: 1, nodeId: node ? node.id : null, msg: `Preparing to insert ${val}` };
  
  yield { line: 2, nodeId: node ? node.id : null, msg: node ? `Checking insertion point at ${node.val}` : `Null found, creating new node ${val}` };
  if (!node) {
    return new TreeNode(val);
  }
  
  yield { line: 3, nodeId: node.id, msg: `Comparing ${val} with ${node.val}` };
  if (val < node.val) {
    yield { line: 4, nodeId: node.id, edgeTo: node.left ? node.left.id : 'new', msg: `${val} < ${node.val}, moving LEFT` };
    const newNode = yield* insertGenerator(node.left, val);
    node.left = newNode;
  } else {
    yield { line: 5, nodeId: node.id };
    yield { line: 6, nodeId: node.id, edgeTo: node.right ? node.right.id : 'new', msg: `${val} >= ${node.val}, moving RIGHT` };
    const newNode = yield* insertGenerator(node.right, val);
    node.right = newNode;
  }
  
  yield { line: 8, nodeId: node.id, msg: `Unwinding recursion for node ${node.val}` };
  return node;
}


export const DELETE_CODE = [
  { line: 1, text: "async function deleteNode(root, val) {" },
  { line: 2, text: "  if (!root) return null;" },
  { line: 3, text: "  if (val < root.val)" },
  { line: 4, text: "    root.left = await deleteNode(root.left, val);" },
  { line: 5, text: "  else if (val > root.val)" },
  { line: 6, text: "    root.right = await deleteNode(root.right, val);" },
  { line: 7, text: "  else {" },
  { line: 8, text: "    if (!root.left) return root.right;" },
  { line: 9, text: "    if (!root.right) return root.left;" },
  { line: 10, text: "    let min = findMin(root.right);" },
  { line: 11, text: "    root.val = min.val;" },
  { line: 12, text: "    root.right = await deleteNode(root.right, min.val);" },
  { line: 13, text: "  }" },
  { line: 14, text: "  return root;" },
  { line: 15, text: "}" }
];

export async function* deleteGenerator(node, val) {
  yield { line: 1, nodeId: node ? node.id : null, msg: `Finding node ${val} to delete` };
  
  yield { line: 2, nodeId: node ? node.id : null, msg: node ? `Checking node ${node.val}` : `Value not found in tree` };
  if (!node) return null;
  
  yield { line: 3, nodeId: node.id, msg: `Checking if ${val} < ${node.val}` };
  if (val < node.val) {
    yield { line: 4, nodeId: node.id, edgeTo: node.left ? node.left.id : null, msg: `${val} < ${node.val}, moving LEFT` };
    node.left = yield* deleteGenerator(node.left, val);
  } else {
    yield { line: 5, nodeId: node.id, msg: `Checking if ${val} > ${node.val}` };
    if (val > node.val) {
      yield { line: 6, nodeId: node.id, edgeTo: node.right ? node.right.id : null, msg: `${val} > ${node.val}, moving RIGHT` };
      node.right = yield* deleteGenerator(node.right, val);
    } else {
      yield { line: 7, nodeId: node.id, msg: `Target node ${val} FOUND!` };
      
      yield { line: 8, nodeId: node.id, msg: `Checking for LEFT child` };
      if (!node.left) {
        yield { line: 8, nodeId: node.id, msg: `No left child, returning RIGHT` };
        return node.right;
      }
      
      yield { line: 9, nodeId: node.id, msg: `Checking for RIGHT child` };
      if (!node.right) {
        yield { line: 9, nodeId: node.id, msg: `No right child, returning LEFT` };
        return node.left;
      }
      
      yield { line: 10, nodeId: node.id, msg: `Two children found. Finding successor...` };
      let min = node.right;
      while (min.left) {
        min = min.left;
      }
      
      yield { line: 11, nodeId: node.id, msg: `Replacing ${node.val} with successor ${min.val}` };
      node.val = min.val;
      
      yield { line: 12, nodeId: node.id, msg: `Deleting successor from right subtree` };
      node.right = yield* deleteGenerator(node.right, min.val);
    }
  }
  
  yield { line: 14, nodeId: node.id, msg: `Reconstructing subtree at ${node.val}` };
  return node;
}

