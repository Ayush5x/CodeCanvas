/**
 * Graph Algorithm Utilities
 * Contains the actual algorithm implementations for visualization
 */

// Utility function to create delay for animations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Breadth-First Search Algorithm
 */
export const runBFS = async (graph, startNode, endNode, onUpdate, config, speed = 1) => {
  const visited = new Set();
  const queue = [startNode];
  const visitedNodes = new Set();
  const visitedEdges = new Set();
  let step = 0;
  
  // Initialize
  onUpdate(1, `Starting BFS from node ${startNode}`, true, {
    currentNode: startNode,
    startNode,
    queue: [...queue],
    distances: {},
    visitedNodes: Array.from(visitedNodes),
    visitedEdges: Array.from(visitedEdges)
  });
  
  await delay(1000 / speed);
  
  visited.add(startNode);
  visitedNodes.add(startNode);
  
  onUpdate(2, `Added start node ${startNode} to visited`, true, {
    currentNode: startNode,
    startNode,
    queue: [...queue],
    visitedNodes: Array.from(visitedNodes),
    visitedEdges: Array.from(visitedEdges)
  });
  
  while (queue.length > 0) {
    step++;
    const currentNode = queue.shift();
    
    onUpdate(step + 10, `Processing node ${currentNode}`, true, {
      currentNode,
      startNode,
      queue: [...queue],
      visitedNodes: Array.from(visitedNodes),
      visitedEdges: Array.from(visitedEdges)
    });
    
    await delay(800 / speed);
    
    // Explore neighbors
    for (let neighbor = 0; neighbor < graph[currentNode].length; neighbor++) {
      if (graph[currentNode][neighbor] > 0 && !visited.has(neighbor)) {
        visited.add(neighbor);
        visitedNodes.add(neighbor);
        visitedEdges.add(`${currentNode}-${neighbor}`);
        queue.push(neighbor);
        
        onUpdate(step + 15, `Found neighbor ${neighbor}, adding to queue`, true, {
          currentNode,
          startNode,
          currentEdge: `${currentNode}-${neighbor}`,
          queue: [...queue],
          visitedNodes: Array.from(visitedNodes),
          visitedEdges: Array.from(visitedEdges)
        });
        
        await delay(600 / speed);
      }
    }
  }
  
  onUpdate(0, `BFS completed! Visited ${visitedNodes.size} nodes`, false, {
    startNode,
    visitedNodes: Array.from(visitedNodes),
    visitedEdges: Array.from(visitedEdges)
  });
};

/**
 * Depth-First Search Algorithm
 */
export const runDFS = async (graph, startNode, endNode, onUpdate, config, speed = 1) => {
  const visited = new Set();
  const visitedNodes = new Set();
  const visitedEdges = new Set();
  const stack = [];
  let step = 0;
  
  const dfsRecursive = async (node, parent = null) => {
    step++;
    visited.add(node);
    visitedNodes.add(node);
    
    if (parent !== null) {
      visitedEdges.add(`${parent}-${node}`);
    }
    
    onUpdate(step + 10, `Visiting node ${node}`, true, {
      currentNode: node,
      startNode,
      visitedNodes: Array.from(visitedNodes),
      visitedEdges: Array.from(visitedEdges),
      stack: [...stack]
    });
    
    await delay(800 / speed);
    
    // Explore neighbors
    for (let neighbor = 0; neighbor < graph[node].length; neighbor++) {
      if (graph[node][neighbor] > 0 && !visited.has(neighbor)) {
        stack.push(neighbor);
        
        onUpdate(step + 15, `Exploring neighbor ${neighbor}`, true, {
          currentNode: node,
          startNode,
          currentEdge: `${node}-${neighbor}`,
          stack: [...stack],
          visitedNodes: Array.from(visitedNodes),
          visitedEdges: Array.from(visitedEdges)
        });
        
        await delay(600 / speed);
        await dfsRecursive(neighbor, node);
      }
    }
    
    stack.pop();
  };
  
  onUpdate(1, `Starting DFS from node ${startNode}`, true, {
    currentNode: startNode,
    startNode,
    visitedNodes: Array.from(visitedNodes),
    visitedEdges: Array.from(visitedEdges)
  });
  
  await delay(1000 / speed);
  await dfsRecursive(startNode);
  
  onUpdate(0, `DFS completed! Visited ${visitedNodes.size} nodes`, false, {
    startNode,
    visitedNodes: Array.from(visitedNodes),
    visitedEdges: Array.from(visitedEdges)
  });
};

/**
 * Dijkstra's Shortest Path Algorithm
 */
export const runDijkstra = async (graph, startNode, endNode, onUpdate, config, speed = 1) => {
  const distances = {};
  const visited = new Set();
  const previous = {};
  const visitedNodes = new Set();
  const visitedEdges = new Set();
  
  // Initialize distances
  for (let i = 0; i < graph.length; i++) {
    distances[i] = i === startNode ? 0 : Infinity;
    previous[i] = null;
  }
  
  onUpdate(1, `Starting Dijkstra from node ${startNode}`, true, {
    currentNode: startNode,
    startNode,
    endNode,
    distances: { ...distances },
    visited: Array.from(visited),
    visitedNodes: Array.from(visitedNodes),
    visitedEdges: Array.from(visitedEdges)
  });
  
  await delay(1000 / speed);
  
  let step = 0;
  
  while (visited.size < graph.length) {
    step++;
    
    // Find unvisited node with minimum distance
    let currentNode = null;
    let minDistance = Infinity;
    
    for (let node = 0; node < graph.length; node++) {
      if (!visited.has(node) && distances[node] < minDistance) {
        minDistance = distances[node];
        currentNode = node;
      }
    }
    
    if (currentNode === null || distances[currentNode] === Infinity) {
      break;
    }
    
    visited.add(currentNode);
    visitedNodes.add(currentNode);
    
    onUpdate(step + 10, `Processing node ${currentNode} with distance ${distances[currentNode]}`, true, {
      currentNode,
      startNode,
      endNode,
      distances: { ...distances },
      visitedNodes: Array.from(visitedNodes),
      visitedEdges: Array.from(visitedEdges)
    });
    
    await delay(800 / speed);
    
    // Update distances to neighbors
    for (let neighbor = 0; neighbor < graph[currentNode].length; neighbor++) {
      if (graph[currentNode][neighbor] > 0 && !visited.has(neighbor)) {
        const newDistance = distances[currentNode] + graph[currentNode][neighbor];
        
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = currentNode;
          visitedEdges.add(`${currentNode}-${neighbor}`);
          
          onUpdate(step + 15, `Updated distance to node ${neighbor}: ${newDistance}`, true, {
            currentNode,
            startNode,
            endNode,
            currentEdge: `${currentNode}-${neighbor}`,
            distances: { ...distances },
            visitedNodes: Array.from(visitedNodes),
            visitedEdges: Array.from(visitedEdges)
          });
          
          await delay(600 / speed);
        }
      }
    }
  }
  
  const finalMessage = endNode !== null 
    ? `Shortest path from ${startNode} to ${endNode}: ${distances[endNode]}`
    : `Dijkstra completed! All shortest distances calculated`;
    
  onUpdate(0, finalMessage, false, {
    startNode,
    endNode,
    distances: { ...distances },
    visitedNodes: Array.from(visitedNodes),
    visitedEdges: Array.from(visitedEdges)
  });
};

/**
 * Prim's Minimum Spanning Tree Algorithm
 */
export const runPrim = async (graph, startNode, endNode, onUpdate, config, speed = 1) => {
  const mstEdges = [];
  const visited = new Set();
  const visitedNodes = new Set();
  const visitedEdges = new Set();
  let totalWeight = 0;
  
  onUpdate(1, `Starting Prim's algorithm from node ${startNode}`, true, {
    currentNode: startNode,
    startNode,
    mstEdges: [...mstEdges],
    totalWeight,
    visitedNodes: Array.from(visitedNodes),
    visitedEdges: Array.from(visitedEdges)
  });
  
  await delay(1000 / speed);
  
  visited.add(startNode);
  visitedNodes.add(startNode);
  let step = 0;
  
  while (visited.size < graph.length) {
    step++;
    let minWeight = Infinity;
    let minEdge = null;
    
    // Find minimum weight edge crossing the cut
    for (const node of visited) {
      for (let neighbor = 0; neighbor < graph[node].length; neighbor++) {
        if (graph[node][neighbor] > 0 && !visited.has(neighbor) && graph[node][neighbor] < minWeight) {
          minWeight = graph[node][neighbor];
          minEdge = { from: node, to: neighbor, weight: graph[node][neighbor] };
        }
      }
    }
    
    if (!minEdge) {
      break;
    }
    
    // Add edge to MST
    mstEdges.push(minEdge);
    visited.add(minEdge.to);
    visitedNodes.add(minEdge.to);
    visitedEdges.add(`${minEdge.from}-${minEdge.to}`);
    totalWeight += minEdge.weight;
    
    onUpdate(step + 20, `Added edge ${minEdge.from}-${minEdge.to} with weight ${minEdge.weight}`, true, {
      currentNode: minEdge.to,
      startNode,
      currentEdge: `${minEdge.from}-${minEdge.to}`,
      mstEdges: [...mstEdges],
      visitedNodes: Array.from(visitedNodes),
      visitedEdges: Array.from(visitedEdges),
      totalWeight
    });
    
    await delay(1000 / speed);
  }
  
  onUpdate(0, `Prim's MST completed! Total weight: ${totalWeight}`, false, {
    startNode,
    mstEdges: [...mstEdges],
    visitedNodes: Array.from(visitedNodes),
    visitedEdges: Array.from(visitedEdges),
    totalWeight
  });
};

/**
 * Kruskal's Minimum Spanning Tree Algorithm
 */
export const runKruskal = async (graph, startNode, endNode, onUpdate, config, speed = 1) => {
  const edges = [];
  const mstEdges = [];
  const visitedEdges = new Set();
  const visitedNodes = new Set();
  const parent = {};
  const rank = {};
  let totalWeight = 0;
  
  // Extract all edges
  for (let i = 0; i < graph.length; i++) {
    for (let j = i + 1; j < graph[i].length; j++) {
      if (graph[i][j] > 0) {
        edges.push({ from: i, to: j, weight: graph[i][j] });
      }
    }
  }
  
  // Sort edges by weight
  edges.sort((a, b) => a.weight - b.weight);
  
  // Initialize Union-Find
  for (let i = 0; i < graph.length; i++) {
    parent[i] = i;
    rank[i] = 0;
  }
  
  const find = (x) => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  };
  
  const union = (x, y) => {
    const rootX = find(x);
    const rootY = find(y);
    
    if (rootX !== rootY) {
      if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
      } else if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX;
      } else {
        parent[rootY] = rootX;
        rank[rootX]++;
      }
      return true;
    }
    return false;
  };
  
  onUpdate(1, `Starting Kruskal's algorithm with ${edges.length} edges`, true, {
    edges: edges.map(e => `${e.from}-${e.to}(${e.weight})`),
    mstEdges: [...mstEdges],
    totalWeight,
    visitedNodes: Array.from(visitedNodes),
    visitedEdges: Array.from(visitedEdges)
  });
  
  await delay(1000 / speed);
  
  let step = 0;
  
  for (const edge of edges) {
    step++;
    
    onUpdate(step + 10, `Considering edge ${edge.from}-${edge.to} with weight ${edge.weight}`, true, {
      currentEdge: `${edge.from}-${edge.to}`,
      edges: edges.map(e => `${e.from}-${e.to}(${e.weight})`),
      mstEdges: [...mstEdges],
      visitedNodes: Array.from(visitedNodes),
      visitedEdges: Array.from(visitedEdges)
    });
    
    await delay(800 / speed);
    
    if (union(edge.from, edge.to)) {
      mstEdges.push(edge);
      visitedEdges.add(`${edge.from}-${edge.to}`);
      visitedNodes.add(edge.from);
      visitedNodes.add(edge.to);
      totalWeight += edge.weight;
      
      onUpdate(step + 15, `Added edge ${edge.from}-${edge.to} to MST`, true, {
        currentEdge: `${edge.from}-${edge.to}`,
        mstEdges: [...mstEdges],
        visitedNodes: Array.from(visitedNodes),
        visitedEdges: Array.from(visitedEdges),
        totalWeight
      });
      
      if (mstEdges.length === graph.length - 1) {
        break;
      }
    } else {
      onUpdate(step + 15, `Edge ${edge.from}-${edge.to} would create cycle, skipping`, true, {
        currentEdge: `${edge.from}-${edge.to}`,
        mstEdges: [...mstEdges],
        visitedNodes: Array.from(visitedNodes),
        visitedEdges: Array.from(visitedEdges)
      });
    }
    
    await delay(600 / speed);
  }
  
  onUpdate(0, `Kruskal's MST completed! Total weight: ${totalWeight}`, false, {
    mstEdges: [...mstEdges],
    visitedNodes: Array.from(visitedNodes),
    visitedEdges: Array.from(visitedEdges),
    totalWeight
  });
};
