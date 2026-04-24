const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'public/docs');
const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.html'));

// The sequence of pages for perfect routing
const pageSequence = [
    { title: "DSA HOME", url: "index.html" },
    { title: "DSA Intro", url: "dsa-intro.html" },
    { title: "DSA Simple Algorithm", url: "simple-algorithm.html" },
    { title: "DSA Arrays", url: "arrays.html" },
    { title: "Array Operations", url: "array-operations.html" },
    { title: "Multi-dimensional Arrays", url: "multi-dimensional-arrays.html" },
    { title: "DSA Bubble Sort", url: "bubble-sort.html" },
    { title: "DSA Selection Sort", url: "selection-sort.html" },
    { title: "DSA Insertion Sort", url: "insertion-sort.html" },
    { title: "DSA Quick Sort", url: "quick-sort.html" },
    { title: "DSA Counting Sort", url: "counting-sort.html" },
    { title: "DSA Radix Sort", url: "radix-sort.html" },
    { title: "DSA Merge Sort", url: "merge-sort.html" },
    { title: "DSA Linear Search", url: "linear-search.html" },
    { title: "DSA Binary Search", url: "binary-search.html" },
    { title: "DSA Linked Lists", url: "linked-lists.html" },
    { title: "DSA Linked Lists Memory", url: "linked-lists-memory.html" },
    { title: "DSA Linked Lists Types", url: "linked-lists-types.html" },
    { title: "Linked Lists Operations", url: "linked-lists-operations.html" },
    { title: "DSA Stacks", url: "stacks.html" },
    { title: "DSA Queues", url: "queues.html" },
    { title: "DSA Hash Tables", url: "hash-tables.html" },
    { title: "DSA Hash Maps", url: "hash-maps.html" },
    { title: "DSA Trees", url: "trees.html" },
    { title: "DSA Binary Trees", url: "binary-trees.html" },
    { title: "DSA Pre-order Traversal", url: "tree-pre-order.html" },
    { title: "DSA In-order Traversal", url: "tree-in-order.html" },
    { title: "DSA Post-order Traversal", url: "tree-post-order.html" },
    { title: "DSA Array Implementation", url: "tree-array-implementation.html" },
    { title: "DSA Binary Search Trees", url: "binary-search-trees.html" },
    { title: "DSA AVL Trees", url: "avl-trees.html" },
    { title: "DSA Graphs", url: "graphs.html" },
    { title: "Graphs Implementation", url: "graphs-implementation.html" },
    { title: "DSA Graphs Traversal", url: "graphs-traversal.html" },
    { title: "DSA Cycle Detection", url: "graphs-cycle-detection.html" },
    { title: "DSA Shortest Path", url: "shortest-path.html" },
    { title: "DSA Dijkstra's", url: "dijkstras.html" },
    { title: "DSA Bellman-Ford", url: "bellman-ford.html" },
    { title: "Minimum Spanning Tree", url: "minimum-spanning-tree.html" },
    { title: "DSA Prim's", url: "prims.html" },
    { title: "DSA Kruskal's", url: "kruskals.html" },
    { title: "DSA Maximum Flow", url: "maximum-flow.html" },
    { title: "DSA Ford-Fulkerson", url: "ford-fulkerson.html" },
    { title: "DSA Edmonds-Karp", url: "edmonds-karp.html" }
];

const sidebarHTML = `<aside id="sidebar" class="sidebar">
    <div class="sidebar-header">
      <h2>DSA Tutorial</h2>
    </div>
    <nav class="sidebar-nav">
      <div class="sidebar-category">DSA Tutorial</div>
      <ul>
        <li><a href="index.html">DSA HOME</a></li>
        <li><a href="dsa-intro.html">DSA Intro</a></li>
        <li><a href="simple-algorithm.html">DSA Simple Algorithm</a></li>
      </ul>
      
      <div class="sidebar-category">Arrays</div>
      <ul>
        <li><a href="arrays.html">DSA Arrays</a></li>
        <li><a href="array-operations.html">Array Operations</a></li>
        <li><a href="multi-dimensional-arrays.html">Multi-dimensional Arrays</a></li>
      </ul>

      <div class="sidebar-category">Sorting Algorithms</div>
      <ul>
        <li><a href="bubble-sort.html">DSA Bubble Sort</a></li>
        <li><a href="selection-sort.html">DSA Selection Sort</a></li>
        <li><a href="insertion-sort.html">DSA Insertion Sort</a></li>
        <li><a href="quick-sort.html">DSA Quick Sort</a></li>
        <li><a href="counting-sort.html">DSA Counting Sort</a></li>
        <li><a href="radix-sort.html">DSA Radix Sort</a></li>
        <li><a href="merge-sort.html">DSA Merge Sort</a></li>
      </ul>

      <div class="sidebar-category">Searching Algorithms</div>
      <ul>
        <li><a href="linear-search.html">DSA Linear Search</a></li>
        <li><a href="binary-search.html">DSA Binary Search</a></li>
      </ul>
      
      <div class="sidebar-category">Linked Lists</div>
      <ul>
        <li><a href="linked-lists.html">DSA Linked Lists</a></li>
        <li><a href="linked-lists-memory.html">DSA Linked Lists in Memory</a></li>
        <li><a href="linked-lists-types.html">DSA Linked Lists Types</a></li>
        <li><a href="linked-lists-operations.html">Linked Lists Operations</a></li>
      </ul>

      <div class="sidebar-category">Stacks & Queues</div>
      <ul>
        <li><a href="stacks.html">DSA Stacks</a></li>
        <li><a href="queues.html">DSA Queues</a></li>
      </ul>

      <div class="sidebar-category">Hash Tables</div>
      <ul>
        <li><a href="hash-tables.html">DSA Hash Tables</a></li>
        <li><a href="hash-maps.html">DSA Hash Maps</a></li>
      </ul>
      
      <div class="sidebar-category">Trees</div>
      <ul>
        <li><a href="trees.html">DSA Trees</a></li>
        <li><a href="binary-trees.html">DSA Binary Trees</a></li>
        <li><a href="tree-pre-order.html">DSA Pre-order Traversal</a></li>
        <li><a href="tree-in-order.html">DSA In-order Traversal</a></li>
        <li><a href="tree-post-order.html">DSA Post-order Traversal</a></li>
        <li><a href="tree-array-implementation.html">DSA Array Implementation</a></li>
        <li><a href="binary-search-trees.html">DSA Binary Search Trees</a></li>
        <li><a href="avl-trees.html">DSA AVL Trees</a></li>
      </ul>
      
      <div class="sidebar-category">Graphs</div>
      <ul>
        <li><a href="graphs.html">DSA Graphs</a></li>
        <li><a href="graphs-implementation.html">Graphs Implementation</a></li>
        <li><a href="graphs-traversal.html">DSA Graphs Traversal</a></li>
        <li><a href="graphs-cycle-detection.html">DSA Cycle Detection</a></li>
      </ul>

      <div class="sidebar-category">Shortest Path</div>
      <ul>
        <li><a href="shortest-path.html">DSA Shortest Path</a></li>
        <li><a href="dijkstras.html">DSA Dijkstra's</a></li>
        <li><a href="bellman-ford.html">DSA Bellman-Ford</a></li>
      </ul>

      <div class="sidebar-category">Minimum Spanning Tree</div>
      <ul>
        <li><a href="minimum-spanning-tree.html">Minimum Spanning Tree</a></li>
        <li><a href="prims.html">DSA Prim's</a></li>
        <li><a href="kruskals.html">DSA Kruskal's</a></li>
      </ul>

      <div class="sidebar-category">Maximum Flow</div>
      <ul>
        <li><a href="maximum-flow.html">DSA Maximum Flow</a></li>
        <li><a href="ford-fulkerson.html">DSA Ford-Fulkerson</a></li>
        <li><a href="edmonds-karp.html">DSA Edmonds-Karp</a></li>
      </ul>
    </nav>
    <a href="/" class="back-link">← Back to CodeCanvas</a>
  </aside>`;

files.forEach(file => {
    const filePath = path.join(docsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 0. Update Head with Tailwind and Lucide
    const headInjection = `
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        .nav-blur { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        #visualizers-dropdown.show { display: block; opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        #mobile-menu.open { max-height: 500px; opacity: 1; }
    </style>`;
    
    if (!content.includes('cdn.tailwindcss.com')) {
        content = content.replace('</head>', headInjection + '\n</head>');
    }

    // 1. Remove Navbar/Header Sections
    const navRegex = /<header class="top-nav">[\s\S]*?<\/header>/g;
    const headerWrapperRegex = /<header id="header-wrapper"[\s\S]*?<\/header>/g;
    
    content = content.replace(headerWrapperRegex, '');
    content = content.replace(navRegex, '');
    content = content.replace(/<header[\s\S]*?<\/header>/g, '');

    // 2. Update Sidebar
    const sideStart = content.indexOf('<aside id="sidebar" class="sidebar">');
    if (sideStart !== -1) {
        const sideEnd = content.indexOf('</aside>', sideStart) + '</aside>'.length;
        content = content.substring(0, sideStart) + sidebarHTML + content.substring(sideEnd);
    }

    // 3. Update Pagination
    const currentIndex = pageSequence.findIndex(p => p.url === file);
    if (currentIndex !== -1) {
        const prev = currentIndex > 0 ? pageSequence[currentIndex - 1] : null;
        const next = currentIndex < pageSequence.length - 1 ? pageSequence[currentIndex + 1] : null;

        let paginationHTML = `<div class="pagination-top">`;
        if (prev) {
            paginationHTML += `\n      <a href="${prev.url}" class="btn">&lt; Prev</a>`;
        } else {
            paginationHTML += `\n      <a href="/" class="btn">&lt; Home</a>`;
        }

        const start = Math.max(0, currentIndex - 2);
        const end = Math.min(pageSequence.length - 1, currentIndex + 2);
        for (let i = start; i <= end; i++) {
            paginationHTML += `\n      <a href="${pageSequence[i].url}" class="btn ${i === currentIndex ? 'active' : ''}">${i + 1}</a>`;
        }

        if (next) {
            paginationHTML += `\n      <a href="${next.url}" class="btn">Next &gt;</a>`;
        }
        paginationHTML += `\n    </div>`;

        const regex = /<div class="pagination-top"[\s\S]*?<\/div>/g;
        content = content.replace(regex, paginationHTML);
    }

    // 4. Inject Flicker-Prevention Script (Inline in Head)
    const flickerScript = `
    <script>
        (function() {
            try {
                const mode = localStorage.getItem('focus-mode');
                if (mode) {
                    const root = document.documentElement;
                    root.classList.add('no-transition');
                    root.classList.add('focus-' + mode);
                }
            } catch (e) {}
        })();
    </script>`;

    // Remove existing flicker script if present to avoid duplication
    content = content.replace(/<script>\s*\(function\(\)\s*\{\s*const mode = localStorage\.getItem\('focus-mode'\);[\s\S]*?<\/script>/g, '');
    
    // Inject before </head>
    content = content.replace('</head>', flickerScript + '\n</head>');

    fs.writeFileSync(filePath, content);
    console.log(`Synced ${file}`);
});
