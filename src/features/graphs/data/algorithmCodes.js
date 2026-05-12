/**
 * C Implementation codes for Graph Algorithms
 * These are used in the code viewer during visualizations
 */

export const BFS_CODE = `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_VERTICES 100

// Queue structure for BFS
typedef struct {
    int items[MAX_VERTICES];
    int front;
    int rear;
} Queue;

// Initialize queue
void initQueue(Queue* q) {
    q->front = -1;
    q->rear = -1;
}

// Check if queue is empty
bool isEmpty(Queue* q) {
    return q->front == -1;
}

// Add element to queue
void enqueue(Queue* q, int value) {
    if (q->rear == MAX_VERTICES - 1) return;
    
    if (q->front == -1) q->front = 0;
    q->rear++;
    q->items[q->rear] = value;
}

// Remove element from queue
int dequeue(Queue* q) {
    if (isEmpty(q)) return -1;
    
    int item = q->items[q->front];
    q->front++;
    
    if (q->front > q->rear) {
        q->front = q->rear = -1;
    }
    
    return item;
}

// BFS traversal function
void BFS(int graph[][MAX_VERTICES], int vertices, int startVertex) {
    bool visited[MAX_VERTICES] = {false};
    Queue q;
    initQueue(&q);
    
    // Mark the starting vertex as visited and enqueue it
    visited[startVertex] = true;
    enqueue(&q, startVertex);
    printf("BFS traversal starting from vertex %d: ", startVertex);
    
    while (!isEmpty(&q)) {
        // Dequeue a vertex from queue and print it
        int currentVertex = dequeue(&q);
        printf("%d ", currentVertex);
        
        // Get all adjacent vertices of the dequeued vertex
        // If an adjacent vertex has not been visited, mark it visited and enqueue it
        for (int i = 0; i < vertices; i++) {
            if (graph[currentVertex][i] == 1 && !visited[i]) {
                visited[i] = true;
                enqueue(&q, i);
            }
        }
    }
    printf("\\n");
}

int main() {
    int vertices = 6;
    int graph[MAX_VERTICES][MAX_VERTICES] = {
        {0, 1, 1, 0, 0, 0},
        {1, 0, 0, 1, 1, 0},
        {1, 0, 0, 0, 0, 1},
        {0, 1, 0, 0, 0, 1},
        {0, 1, 0, 0, 0, 1},
        {0, 0, 1, 1, 1, 0}
    };
    
    BFS(graph, vertices, 0);
    return 0;
}`;

export const DFS_CODE = `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_VERTICES 100

// DFS traversal function using recursion
void DFS(int graph[][MAX_VERTICES], int vertices, int vertex, bool visited[]) {
    // Mark current vertex as visited and print it
    visited[vertex] = true;
    printf("%d ", vertex);
    
    // Recur for all adjacent vertices
    for (int i = 0; i < vertices; i++) {
        if (graph[vertex][i] == 1 && !visited[i]) {
            DFS(graph, vertices, i, visited);
        }
    }
}

// DFS traversal using stack (iterative approach)
void DFS_iterative(int graph[][MAX_VERTICES], int vertices, int startVertex) {
    bool visited[MAX_VERTICES] = {false};
    int stack[MAX_VERTICES];
    int top = -1;
    
    // Push the starting vertex to stack
    stack[++top] = startVertex;
    
    printf("DFS traversal starting from vertex %d: ", startVertex);
    
    while (top != -1) {
        // Pop a vertex from stack and print it if not visited
        int vertex = stack[top--];
        
        if (!visited[vertex]) {
            visited[vertex] = true;
            printf("%d ", vertex);
            
            // Push all adjacent unvisited vertices to stack
            for (int i = vertices - 1; i >= 0; i--) {
                if (graph[vertex][i] == 1 && !visited[i]) {
                    stack[++top] = i;
                }
            }
        }
    }
    printf("\\n");
}

// Wrapper function for recursive DFS
void DFS_recursive(int graph[][MAX_VERTICES], int vertices, int startVertex) {
    bool visited[MAX_VERTICES] = {false};
    printf("DFS traversal starting from vertex %d: ", startVertex);
    DFS(graph, vertices, startVertex, visited);
    printf("\\n");
}

int main() {
    int vertices = 6;
    int graph[MAX_VERTICES][MAX_VERTICES] = {
        {0, 1, 1, 0, 0, 0},
        {1, 0, 0, 1, 1, 0},
        {1, 0, 0, 0, 0, 1},
        {0, 1, 0, 0, 0, 1},
        {0, 1, 0, 0, 0, 1},
        {0, 0, 1, 1, 1, 0}
    };
    
    DFS_recursive(graph, vertices, 0);
    DFS_iterative(graph, vertices, 0);
    
    return 0;
}`;

export const DIJKSTRA_CODE = `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>

#define MAX_VERTICES 100
#define INF INT_MAX

// Function to find vertex with minimum distance
int findMinDistance(int dist[], bool visited[], int vertices) {
    int min = INF, minIndex = -1;
    
    for (int v = 0; v < vertices; v++) {
        if (!visited[v] && dist[v] <= min) {
            min = dist[v];
            minIndex = v;
        }
    }
    
    return minIndex;
}

// Function to print the shortest path from source to target
void printPath(int parent[], int target) {
    if (parent[target] == -1) {
        printf("%d ", target);
        return;
    }
    
    printPath(parent, parent[target]);
    printf("%d ", target);
}

// Dijkstra's algorithm implementation
void dijkstra(int graph[][MAX_VERTICES], int vertices, int source) {
    int dist[MAX_VERTICES];     // Distance array
    bool visited[MAX_VERTICES]; // Visited array
    int parent[MAX_VERTICES];   // Parent array for path reconstruction
    
    // Initialize all distances as infinite and visited as false
    for (int i = 0; i < vertices; i++) {
        dist[i] = INF;
        visited[i] = false;
        parent[i] = -1;
    }
    
    // Distance from source to itself is always 0
    dist[source] = 0;
    
    // Find shortest path for all vertices
    for (int count = 0; count < vertices - 1; count++) {
        // Pick minimum distance vertex from unvisited vertices
        int u = findMinDistance(dist, visited, vertices);
        
        if (u == -1) break; // No more reachable vertices
        
        // Mark the picked vertex as visited
        visited[u] = true;
        
        // Update distance value of adjacent vertices
        for (int v = 0; v < vertices; v++) {
            // Update dist[v] if:
            // 1. Not visited yet
            // 2. There is an edge from u to v
            // 3. Total weight of path from source to v through u is smaller
            if (!visited[v] && graph[u][v] != 0 && 
                dist[u] != INF && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
                parent[v] = u;
            }
        }
    }
    
    // Print the shortest distances and paths
    printf("Shortest distances from vertex %d:\\n", source);
    printf("Vertex\\tDistance\\tPath\\n");
    
    for (int i = 0; i < vertices; i++) {
        printf("%d\\t", i);
        if (dist[i] == INF) {
            printf("INF\\t\\tNo path\\n");
        } else {
            printf("%d\\t\\t", dist[i]);
            printPath(parent, i);
            printf("\\n");
        }
    }
}

int main() {
    int vertices = 6;
    int graph[MAX_VERTICES][MAX_VERTICES] = {
        {0, 4, 2, 0, 0, 0},
        {4, 0, 1, 5, 0, 0},
        {2, 1, 0, 8, 10, 0},
        {0, 5, 8, 0, 2, 6},
        {0, 0, 10, 2, 0, 3},
        {0, 0, 0, 6, 3, 0}
    };
    
    dijkstra(graph, vertices, 0);
    return 0;
}`;

export const PRIM_CODE = `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>

#define MAX_VERTICES 100
#define INF INT_MAX

// Structure to represent an edge
typedef struct {
    int src, dest, weight;
} Edge;

// Function to find vertex with minimum key value
int findMinKey(int key[], bool mstSet[], int vertices) {
    int min = INF, minIndex = -1;
    
    for (int v = 0; v < vertices; v++) {
        if (!mstSet[v] && key[v] < min) {
            min = key[v];
            minIndex = v;
        }
    }
    
    return minIndex;
}

// Function to print the MST
void printMST(int parent[], int graph[][MAX_VERTICES], int vertices) {
    int totalWeight = 0;
    printf("Edge\\tWeight\\n");
    
    for (int i = 1; i < vertices; i++) {
        printf("%d - %d\\t%d\\n", parent[i], i, graph[i][parent[i]]);
        totalWeight += graph[i][parent[i]];
    }
    
    printf("Total weight of MST: %d\\n", totalWeight);
}

// Prim's algorithm to find MST
void primMST(int graph[][MAX_VERTICES], int vertices) {
    int parent[MAX_VERTICES]; // Array to store constructed MST
    int key[MAX_VERTICES];    // Key values used to pick minimum weight edge
    bool mstSet[MAX_VERTICES]; // To represent set of vertices included in MST
    
    // Initialize all keys as infinite and mstSet as false
    for (int i = 0; i < vertices; i++) {
        key[i] = INF;
        mstSet[i] = false;
    }
    
    // Always include first vertex in MST
    key[0] = 0;     // Make key 0 so that this vertex is picked first
    parent[0] = -1; // First node is always root of MST
    
    // The MST will have exactly (vertices-1) edges
    for (int count = 0; count < vertices - 1; count++) {
        // Pick minimum key vertex from set of vertices not yet included in MST
        int u = findMinKey(key, mstSet, vertices);
        
        if (u == -1) break; // No more vertices to process
        
        // Add the picked vertex to the MST set
        mstSet[u] = true;
        
        // Update key value and parent index of adjacent vertices
        for (int v = 0; v < vertices; v++) {
            // Update key[v] if:
            // 1. graph[u][v] is non-zero (there is an edge)
            // 2. v is not in mstSet (not yet included in MST)
            // 3. weight of edge u-v is smaller than current key of v
            if (graph[u][v] != 0 && !mstSet[v] && graph[u][v] < key[v]) {
                parent[v] = u;
                key[v] = graph[u][v];
            }
        }
    }
    
    // Print the constructed MST
    printMST(parent, graph, vertices);
}

int main() {
    int vertices = 5;
    int graph[MAX_VERTICES][MAX_VERTICES] = {
        {0, 2, 0, 6, 0},
        {2, 0, 3, 8, 5},
        {0, 3, 0, 0, 7},
        {6, 8, 0, 0, 9},
        {0, 5, 7, 9, 0}
    };
    
    printf("Minimum Spanning Tree using Prim's Algorithm:\\n");
    primMST(graph, vertices);
    
    return 0;
}`;

export const KRUSKAL_CODE = `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_VERTICES 100
#define MAX_EDGES 1000

// Structure to represent an edge
typedef struct {
    int src, dest, weight;
} Edge;

// Structure to represent a graph
typedef struct {
    int vertices, edges;
    Edge edge[MAX_EDGES];
} Graph;

// Structure for Union-Find (Disjoint Set)
typedef struct {
    int parent[MAX_VERTICES];
    int rank[MAX_VERTICES];
} UnionFind;

// Initialize Union-Find structure
void initUnionFind(UnionFind* uf, int vertices) {
    for (int i = 0; i < vertices; i++) {
        uf->parent[i] = i;
        uf->rank[i] = 0;
    }
}

// Find operation with path compression
int find(UnionFind* uf, int i) {
    if (uf->parent[i] != i) {
        uf->parent[i] = find(uf, uf->parent[i]);
    }
    return uf->parent[i];
}

// Union operation by rank
void unionSets(UnionFind* uf, int x, int y) {
    int rootX = find(uf, x);
    int rootY = find(uf, y);
    
    if (rootX != rootY) {
        // Union by rank
        if (uf->rank[rootX] < uf->rank[rootY]) {
            uf->parent[rootX] = rootY;
        } else if (uf->rank[rootX] > uf->rank[rootY]) {
            uf->parent[rootY] = rootX;
        } else {
            uf->parent[rootY] = rootX;
            uf->rank[rootX]++;
        }
    }
}

// Comparison function for sorting edges by weight
int compareEdges(const void* a, const void* b) {
    Edge* edgeA = (Edge*)a;
    Edge* edgeB = (Edge*)b;
    return edgeA->weight - edgeB->weight;
}

// Kruskal's algorithm to find MST
void kruskalMST(Graph* graph) {
    int vertices = graph->vertices;
    Edge result[MAX_VERTICES]; // Store the result MST
    int e = 0; // Index for result[]
    int i = 0; // Index for sorted edges
    
    // Sort all edges in ascending order of their weights
    qsort(graph->edge, graph->edges, sizeof(Edge), compareEdges);
    
    // Initialize Union-Find structure
    UnionFind uf;
    initUnionFind(&uf, vertices);
    
    printf("Kruskal's MST Algorithm:\\n");
    printf("Edges in MST:\\n");
    printf("Edge\\tWeight\\n");
    
    int totalWeight = 0;
    
    // Process edges in sorted order
    while (e < vertices - 1 && i < graph->edges) {
        Edge nextEdge = graph->edge[i++];
        
        int x = find(&uf, nextEdge.src);
        int y = find(&uf, nextEdge.dest);
        
        // If including this edge doesn't cause a cycle, include it in result
        if (x != y) {
            result[e++] = nextEdge;
            unionSets(&uf, x, y);
            printf("%d - %d\\t%d\\n", nextEdge.src, nextEdge.dest, nextEdge.weight);
            totalWeight += nextEdge.weight;
        }
        // Else discard the edge (it would create a cycle)
    }
    
    printf("Total weight of MST: %d\\n", totalWeight);
}

// Function to add an edge to the graph
void addEdge(Graph* graph, int src, int dest, int weight) {
    graph->edge[graph->edges].src = src;
    graph->edge[graph->edges].dest = dest;
    graph->edge[graph->edges].weight = weight;
    graph->edges++;
}

int main() {
    Graph graph;
    graph.vertices = 4;
    graph.edges = 0;
    
    // Add edges: (src, dest, weight)
    addEdge(&graph, 0, 1, 10);
    addEdge(&graph, 0, 2, 6);
    addEdge(&graph, 0, 3, 5);
    addEdge(&graph, 1, 3, 15);
    addEdge(&graph, 2, 3, 4);
    
    kruskalMST(&graph);
    
    return 0;
}`;

// Algorithm configurations
export const ALGORITHM_CONFIGS = {
  BFS: {
    needsEndNode: false,
    weighted: false,
    directed: false,
    description: "Breadth-First Search explores graph level by level using a queue",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)"
  },
  DFS: {
    needsEndNode: false,
    weighted: false,
    directed: false,
    description: "Depth-First Search explores graph depth by depth using recursion or stack",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)"
  },
  DIJKSTRA: {
    needsEndNode: true,
    weighted: true,
    directed: false,
    description: "Dijkstra's algorithm finds shortest paths from source to all vertices",
    timeComplexity: "O((V + E) log V)",
    spaceComplexity: "O(V)"
  },
  PRIM: {
    needsEndNode: false,
    weighted: true,
    directed: false,
    description: "Prim's algorithm finds minimum spanning tree by growing tree from start vertex",
    timeComplexity: "O(E log V)",
    spaceComplexity: "O(V)"
  },
  KRUSKAL: {
    needsEndNode: false,
    weighted: true,
    directed: false,
    description: "Kruskal's algorithm finds minimum spanning tree using edge sorting and union-find",
    timeComplexity: "O(E log E)",
    spaceComplexity: "O(V)"
  }
};
