import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const categories = [
  {
    title: "DSA Tutorial",
    items: [
      { name: "DSA HOME", path: "/docs" },
      { name: "DSA Intro", path: "/docs/dsa-intro" },
      { name: "DSA Simple Algorithm", path: "/docs/simple-algorithm" },
    ]
  },
  {
    title: "Arrays",
    items: [
      { name: "DSA Arrays", path: "/docs/arrays" },
      { name: "Array Operations", path: "/docs/array-operations" },
      { name: "Multi-dimensional Arrays", path: "/docs/multi-dimensional-arrays" },
    ]
  },
  {
    title: "Sorting Algorithms",
    items: [
      { name: "DSA Bubble Sort", path: "/docs/bubble-sort" },
      { name: "DSA Selection Sort", path: "/docs/selection-sort" },
      { name: "DSA Insertion Sort", path: "/docs/insertion-sort" },
      { name: "DSA Quick Sort", path: "/docs/quick-sort" },
      { name: "DSA Counting Sort", path: "/docs/counting-sort" },
      { name: "DSA Radix Sort", path: "/docs/radix-sort" },
      { name: "DSA Merge Sort", path: "/docs/merge-sort" },
    ]
  },
  {
    title: "Searching Algorithms",
    items: [
      { name: "DSA Linear Search", path: "/docs/linear-search" },
      { name: "DSA Binary Search", path: "/docs/binary-search" },
    ]
  },
  {
    title: "Linked Lists",
    items: [
      { name: "DSA Linked Lists", path: "/docs/linked-lists" },
      { name: "DSA Linked Lists in Memory", path: "/docs/linked-lists-memory" },
      { name: "DSA Linked Lists Types", path: "/docs/linked-lists-types" },
      { name: "Linked Lists Operations", path: "/docs/linked-lists-operations" },
    ]
  },
  {
    title: "Stacks & Queues",
    items: [
      { name: "DSA Stacks", path: "/docs/stacks" },
      { name: "DSA Queues", path: "/docs/queues" },
    ]
  },
  {
    title: "Hash Tables",
    items: [
      { name: "DSA Hash Tables", path: "/docs/hash-tables" },
      { name: "DSA Hash Maps", path: "/docs/hash-maps" },
    ]
  },
  {
    title: "Trees",
    items: [
      { name: "DSA Trees", path: "/docs/trees" },
      { name: "DSA Binary Trees", path: "/docs/binary-trees" },
      { name: "DSA Pre-order Traversal", path: "/docs/tree-pre-order" },
      { name: "DSA In-order Traversal", path: "/docs/tree-in-order" },
      { name: "DSA Post-order Traversal", path: "/docs/tree-post-order" },
      { name: "DSA Array Implementation", path: "/docs/tree-array-implementation" },
      { name: "DSA Binary Search Trees", path: "/docs/binary-search-trees" },
      { name: "DSA AVL Trees", path: "/docs/avl-trees" },
    ]
  },
  {
    title: "Graphs",
    items: [
      { name: "DSA Graphs", path: "/docs/graphs" },
      { name: "Graphs Implementation", path: "/docs/graphs-implementation" },
      { name: "DSA Graphs Traversal", path: "/docs/graphs-traversal" },
      { name: "DSA Cycle Detection", path: "/docs/graphs-cycle-detection" },
    ]
  },
  {
    title: "Shortest Path",
    items: [
      { name: "DSA Shortest Path", path: "/docs/shortest-path" },
      { name: "DSA Dijkstra's", path: "/docs/dijkstras" },
      { name: "DSA Bellman-Ford", path: "/docs/bellman-ford" },
    ]
  },
  {
    title: "Minimum Spanning Tree",
    items: [
      { name: "Minimum Spanning Tree", path: "/docs/minimum-spanning-tree" },
      { name: "DSA Prim's", path: "/docs/prims" },
      { name: "DSA Kruskal's", path: "/docs/kruskals" },
    ]
  },
  {
    title: "Maximum Flow",
    items: [
      { name: "DSA Maximum Flow", path: "/docs/maximum-flow" },
      { name: "DSA Ford-Fulkerson", path: "/docs/ford-fulkerson" },
      { name: "DSA Edmonds-Karp", path: "/docs/edmonds-karp" },
    ]
  }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside id="sidebar" className="sidebar">
      <div className="sidebar-header">
        <h2 className="text-xl font-bold">DSA Tutorial</h2>
      </div>
      <nav className="sidebar-nav">
        {categories.map((cat, idx) => (
          <div key={idx}>
            <div className="sidebar-category mt-4 mb-2 text-xs font-semibold uppercase text-neutral-500">{cat.title}</div>
            <ul className="space-y-1">
              {cat.items.map((item, i) => (
                <li key={i}>
                  <Link 
                    to={item.path} 
                    className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                      location.pathname === item.path 
                        ? "bg-emerald-500/10 text-emerald-500 font-medium" 
                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <Link to="/" className="back-link mt-8 block text-sm text-neutral-500 hover:text-white">← Back to CodeCanvas</Link>
    </aside>
  );
};

export default Sidebar;
