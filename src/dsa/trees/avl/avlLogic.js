// AVL Tree Logic for Synchronized Visualizer

export class AvlNode {
  constructor(val) {
    this.val = val;
    this.id = Math.random().toString(36).substr(2, 9);
    this.left = null;
    this.right = null;
    this.height = 1;
    this.x = 0;
    this.y = 0;
  }
}

// Layout constants
const INITIAL_X = 1000;
const INITIAL_Y = 80;
const X_SPACING = 450;
const Y_SPACING = 120;

export const calculateLayout = (root, xSpacing = X_SPACING, ySpacing = Y_SPACING) => {
  if (!root) return [];
  const nodes = [];
  
  const traverse = (node, x, y, spacing) => {
    if (!node) return;
    node.x = x;
    node.y = y;
    nodes.push({ id: node.id, val: node.val, x, y, height: node.height });
    
    traverse(node.left, x - spacing, y + ySpacing, spacing / 2);
    traverse(node.right, x + spacing, y + ySpacing, spacing / 2);
  };
  
  traverse(root, INITIAL_X, INITIAL_Y, xSpacing);
  return nodes;
};

export const getEdges = (root) => {
  if (!root) return [];
  const edges = [];
  
  const traverse = (node) => {
    if (!node) return;
    if (node.left) {
      edges.push({ id: `${node.id}-${node.left.id}`, from: { x: node.x, y: node.y }, to: { x: node.left.x, y: node.left.y } });
      traverse(node.left);
    }
    if (node.right) {
      edges.push({ id: `${node.id}-${node.right.id}`, from: { x: node.x, y: node.y }, to: { x: node.right.x, y: node.right.y } });
      traverse(node.right);
    }
  };
  
  traverse(root);
  return edges;
};

const getHeight = (node) => (node ? node.height : 0);
const getBalance = (node) => (node ? getHeight(node.left) - getHeight(node.right) : 0);

// --- Rotations ---

async function* rightRotate(y) {
  let x = y.left;
  let T2 = x.right;
  
  yield { line: 10, nodeId: y.id, msg: `RR_ROTATION on node ${y.val}` };
  x.right = y;
  y.left = T2;
  
  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
  
  return x;
}

async function* leftRotate(x) {
  let y = x.right;
  let T2 = y.left;
  
  yield { line: 20, nodeId: x.id, msg: `LL_ROTATION on node ${x.val}` };
  y.left = x;
  x.right = T2;
  
  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  
  return y;
}

// --- Generators ---

export const INSERT_CODE = [
  { line: 1, text: "async function insert(node, val) {" },
  { line: 2, text: "  if (!node) return new Node(val);" },
  { line: 3, text: "  if (val < node.val) node.left = await insert(node.left, val);" },
  { line: 4, text: "  else node.right = await insert(node.right, val);" },
  { line: 5, text: "  node.height = updateHeight(node);" },
  { line: 6, text: "  let balance = getBalance(node);" },
  { line: 7, text: "  if (balance > 1 && val < node.left.val) return rightRotate(node);" },
  { line: 8, text: "  if (balance < -1 && val > node.right.val) return leftRotate(node);" },
  { line: 9, text: "  if (balance > 1 && val > node.left.val) { ... LR Rotate ... }" },
  { line: 10, text: "  if (balance < -1 && val < node.right.val) { ... RL Rotate ... }" },
  { line: 11, text: "  return node;" },
  { line: 12, text: "}" }
];

export async function* insertGenerator(node, val) {
  yield { line: 1, nodeId: node ? node.id : null, msg: `Inserting ${val}` };
  
  if (!node) {
    yield { line: 2, msg: `Null found. Creating new node ${val}` };
    return new AvlNode(val);
  }
  
  if (val < node.val) {
    yield { line: 3, nodeId: node.id, msg: `${val} < ${node.val}, moving LEFT` };
    node.left = yield* insertGenerator(node.left, val);
  } else if (val > node.val) {
    yield { line: 4, nodeId: node.id, msg: `${val} > ${node.val}, moving RIGHT` };
    node.right = yield* insertGenerator(node.right, val);
  } else {
    yield { line: 4, nodeId: node.id, msg: `Duplicate ${val} found. Ignoring.` };
    return node;
  }
  
  yield { line: 5, nodeId: node.id, msg: `Updating height for node ${node.val}` };
  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
  
  const balance = getBalance(node);
  yield { line: 6, nodeId: node.id, msg: `Balance Factor for ${node.val}: ${balance}` };
  
  // Case 1: Left Left
  if (balance > 1 && val < node.left.val) {
    yield { line: 7, nodeId: node.id, msg: `Balance ${balance} > 1 & ${val} < ${node.left.val}. LL Case.` };
    return yield* rightRotate(node);
  }
  
  // Case 2: Right Right
  if (balance < -1 && val > node.right.val) {
    yield { line: 8, nodeId: node.id, msg: `Balance ${balance} < -1 & ${val} > ${node.right.val}. RR Case.` };
    return yield* leftRotate(node);
  }
  
  // Case 3: Left Right
  if (balance > 1 && val > node.left.val) {
    yield { line: 9, nodeId: node.id, msg: `Balance ${balance} > 1 & ${val} > ${node.left.val}. LR Case.` };
    node.left = yield* leftRotate(node.left);
    return yield* rightRotate(node);
  }
  
  // Case 4: Right Left
  if (balance < -1 && val < node.right.val) {
    yield { line: 10, nodeId: node.id, msg: `Balance ${balance} < -1 & ${val} < ${node.right.val}. RL Case.` };
    node.right = yield* rightRotate(node.right);
    return yield* leftRotate(node);
  }
  
  yield { line: 11, nodeId: node.id, msg: `Node ${node.val} is balanced.` };
  return node;
}

export const SEARCH_CODE = [
  { line: 1, text: "function search(node, val) {" },
  { line: 2, text: "  if (!node || node.val === val) return node;" },
  { line: 3, text: "  if (val < node.val) return search(node.left, val);" },
  { line: 4, text: "  return search(node.right, val);" },
  { line: 5, text: "}" }
];


// Search and Delete can be similar to BST but with rebalancing for Delete
export const DELETE_CODE = [
  { line: 1, text: "async function delete(node, val) {" },
  { line: 2, text: "  if (!node) return null;" },
  { line: 3, text: "  if (val < node.val) node.left = await delete(node.left, val);" },
  { line: 4, text: "  else if (val > node.val) node.right = await delete(node.right, val);" },
  { line: 5, text: "  else { ... handle leaf/single/double child ... }" },
  { line: 6, text: "  if (!node) return null;" },
  { line: 7, text: "  node.height = updateHeight(node);" },
  { line: 8, text: "  let balance = getBalance(node);" },
  { line: 9, text: "  if (balance > 1 && getBalance(node.left) >= 0) return rightRotate(node);" },
  { line: 10, text: "  if (balance < -1 && getBalance(node.right) <= 0) return leftRotate(node);" },
  { line: 11, text: "  return node;" },
  { line: 12, text: "}" }
];

export async function* deleteGenerator(node, val) {
  yield { line: 1, nodeId: node ? node.id : null, msg: `Deleting ${val}` };
  
  if (!node) {
    yield { line: 2, msg: `Value ${val} not found.` };
    return null;
  }
  
  if (val < node.val) {
    yield { line: 3, nodeId: node.id, msg: `${val} < ${node.val}, moving LEFT` };
    node.left = yield* deleteGenerator(node.left, val);
  } else if (val > node.val) {
    yield { line: 4, nodeId: node.id, msg: `${val} > ${node.val}, moving RIGHT` };
    node.right = yield* deleteGenerator(node.right, val);
  } else {
    yield { line: 5, nodeId: node.id, msg: `Node ${val} found. Deleting...` };
    
    if (!node.left || !node.right) {
      let temp = node.left ? node.left : node.right;
      if (!temp) {
        yield { line: 5, nodeId: node.id, msg: `Leaf node. Removing.` };
        node = null;
      } else {
        yield { line: 5, nodeId: node.id, msg: `Single child. Replacing with ${temp.val}` };
        node = temp;
      }
    } else {
      yield { line: 5, nodeId: node.id, msg: `Two children. Finding successor...` };
      let temp = node.right;
      while (temp.left) temp = temp.left;
      
      yield { line: 5, nodeId: node.id, msg: `Replacing ${node.val} with successor ${temp.val}` };
      node.val = temp.val;
      node.right = yield* deleteGenerator(node.right, temp.val);
    }
  }
  
  if (!node) return null;
  
  yield { line: 7, nodeId: node.id, msg: `Updating height for node ${node.val}` };
  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
  
  const balance = getBalance(node);
  yield { line: 8, nodeId: node.id, msg: `Balance Factor for ${node.val}: ${balance}` };
  
  // Case 1: Left Left
  if (balance > 1 && getBalance(node.left) >= 0) {
    yield { line: 9, nodeId: node.id, msg: `BF ${balance} > 1 & BF(left) >= 0. LL Case.` };
    return yield* rightRotate(node);
  }
  
  // Case 2: Left Right
  if (balance > 1 && getBalance(node.left) < 0) {
    yield { line: 9, nodeId: node.id, msg: `BF ${balance} > 1 & BF(left) < 0. LR Case.` };
    node.left = yield* leftRotate(node.left);
    return yield* rightRotate(node);
  }
  
  // Case 3: Right Right
  if (balance < -1 && getBalance(node.right) <= 0) {
    yield { line: 10, nodeId: node.id, msg: `BF ${balance} < -1 & BF(right) <= 0. RR Case.` };
    return yield* leftRotate(node);
  }
  
  // Case 4: Right Left
  if (balance < -1 && getBalance(node.right) > 0) {
    yield { line: 10, nodeId: node.id, msg: `BF ${balance} < -1 & BF(right) > 0. RL Case.` };
    node.right = yield* rightRotate(node.right);
    return yield* leftRotate(node);
  }
  
  yield { line: 11, nodeId: node.id, msg: `Node ${node.val} is balanced.` };
  return node;
}

export async function* searchGenerator(node, val) {
  yield { line: 1, nodeId: node ? node.id : null, msg: `Searching for ${val}` };
  if (!node) {
    yield { line: 2, msg: `Value ${val} not found.` };
    return null;
  }
  if (val === node.val) {
    yield { line: 2, nodeId: node.id, msg: `Value ${val} FOUND!` };
    return node;
  }
  if (val < node.val) {
    yield { line: 3, nodeId: node.id, msg: `${val} < ${node.val}, moving LEFT` };
    return yield* searchGenerator(node.left, val);
  } else {
    yield { line: 4, nodeId: node.id, msg: `${val} > ${node.val}, moving RIGHT` };
    return yield* searchGenerator(node.right, val);
  }
}


