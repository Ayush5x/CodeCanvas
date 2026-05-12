const challenges = [
  {
    id: 1,
    title: "Reverse an Array",
    category: "Arrays",
    level: "Easy",
    complexity: "O(n)",
    mem: "MEM_0x401",
    icon: "🚀",
    description: "Given an array, write a function to reverse it in place.",
    template: "function reverseArray(arr) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [[1, 2, 3]], expected: [3, 2, 1] },
      { input: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5] },
      { input: [["a", "b", "c"]], expected: ["c", "b", "a"] }
    ],
    verify: (fn) => {
      return challenges[0].testCases.every(tc => {
        const inputCopy = JSON.parse(JSON.stringify(tc.input));
        fn(...inputCopy);
        return JSON.stringify(inputCopy[0]) === JSON.stringify(tc.expected);
      });
    }
  },
  {
    id: 2,
    title: "Valid Parentheses",
    category: "Stacks",
    level: "Easy",
    complexity: "O(n)",
    mem: "MEM_0x41C",
    icon: "📚",
    description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    template: "function isValid(s) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: ["()"], expected: true },
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false },
      { input: ["([)]"], expected: false }
    ],
    verify: (fn) => {
      return challenges[1].testCases.every(tc => fn(...tc.input) === tc.expected);
    }
  },
  {
    id: 3,
    title: "Binary Search",
    category: "Search",
    level: "Easy",
    complexity: "O(log n)",
    mem: "MEM_0x48C",
    icon: "🔍",
    description: "Given a sorted array of integers and a target value, return the index if the target is found. If not, return -1.",
    template: "function search(nums, target) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 }
    ],
    verify: (fn) => {
      return challenges[2].testCases.every(tc => fn(...tc.input) === tc.expected);
    }
  },
  {
    id: 4,
    title: "Two Sum",
    category: "Hash Tables",
    level: "Easy",
    complexity: "O(n)",
    mem: "MEM_0x446",
    icon: "🔗",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    template: "function twoSum(nums, target) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] }
    ],
    verify: (fn) => {
      return challenges[3].testCases.every(tc => {
        const res = fn(...tc.input);
        return JSON.stringify(res.sort()) === JSON.stringify(tc.expected.sort());
      });
    }
  },
  {
    id: 5,
    title: "Maximum Subarray",
    category: "Optimization",
    level: "Medium",
    complexity: "O(n)",
    mem: "MEM_0x4C4",
    icon: "📈",
    description: "Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    template: "function maxSubArray(nums) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { input: [[1]], expected: 1 },
      { input: [[5, 4, -1, 7, 8]], expected: 23 }
    ],
    verify: (fn) => {
      return challenges[4].testCases.every(tc => fn(...tc.input) === tc.expected);
    }
  },
  {
    id: 6,
    title: "Fibonacci Sequence",
    category: "Recursion",
    level: "Easy",
    complexity: "O(2^n)",
    mem: "MEM_0x49A",
    icon: "🔄",
    description: "Write a function to return the n-th Fibonacci number.",
    template: "function fib(n) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [2], expected: 1 },
      { input: [4], expected: 3 },
      { input: [10], expected: 55 }
    ],
    verify: (fn) => {
      return challenges[5].testCases.every(tc => fn(...tc.input) === tc.expected);
    }
  },
  {
    id: 7,
    title: "Merge Sorted Arrays",
    category: "Sorting",
    level: "Easy",
    complexity: "O(n+m)",
    mem: "MEM_0x47E",
    icon: "⚖️",
    description: "Merge two sorted arrays into one sorted array.",
    template: "function merge(nums1, nums2) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [[1, 2, 3], [2, 5, 6]], expected: [1, 2, 2, 3, 5, 6] },
      { input: [[1], []], expected: [1] }
    ],
    verify: (fn) => {
      return challenges[6].testCases.every(tc => JSON.stringify(fn(...tc.input)) === JSON.stringify(tc.expected));
    }
  },
  {
    id: 8,
    title: "Path Exists",
    category: "Graphs",
    level: "Medium",
    complexity: "O(V+E)",
    mem: "MEM_0x454",
    icon: "🗺️",
    description: "Given a graph as an adjacency list, return true if a path exists between start and end nodes.",
    template: "function hasPath(graph, start, end) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [{ 0: [1, 2], 1: [2], 2: [0, 3], 3: [3] }, 0, 3], expected: true },
      { input: [{ 0: [1], 1: [0], 2: [3], 3: [2] }, 0, 2], expected: false }
    ],
    verify: (fn) => {
      return challenges[7].testCases.every(tc => fn(...tc.input) === tc.expected);
    }
  {
    id: 9,
    title: "Best Time to Buy and Sell Stock",
    category: "Optimization",
    level: "Easy",
    complexity: "O(n)",
    mem: "MEM_0x4D2",
    icon: "💰",
    description: "You are given an array prices where prices[i] is the price of a given stock on the i-th day. Return the maximum profit you can achieve.",
    template: "function maxProfit(prices) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { input: [[7, 6, 4, 3, 1]], expected: 0 }
    ],
    verify: (fn) => challenges[8].testCases.every(tc => fn(...tc.input) === tc.expected)
  },
  {
    id: 10,
    title: "Single Number",
    category: "Arrays",
    level: "Easy",
    complexity: "O(n)",
    mem: "MEM_0x4E1",
    icon: "1️⃣",
    description: "Given a non-empty array of integers, every element appears twice except for one. Find that single one.",
    template: "function singleNumber(nums) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [[2, 2, 1]], expected: 1 },
      { input: [[4, 1, 2, 1, 2]], expected: 4 },
      { input: [[1]], expected: 1 }
    ],
    verify: (fn) => challenges[9].testCases.every(tc => fn(...tc.input) === tc.expected)
  },
  {
    id: 11,
    title: "Climbing Stairs",
    category: "Recursion",
    level: "Easy",
    complexity: "O(n)",
    mem: "MEM_0x4F5",
    icon: "🪜",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    template: "function climbStairs(n) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [2], expected: 2 },
      { input: [3], expected: 3 },
      { input: [5], expected: 8 }
    ],
    verify: (fn) => challenges[10].testCases.every(tc => fn(...tc.input) === tc.expected)
  },
  {
    id: 12,
    title: "Missing Number",
    category: "Arrays",
    level: "Easy",
    complexity: "O(n)",
    mem: "MEM_0x501",
    icon: "❓",
    description: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
    template: "function missingNumber(nums) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [[3, 0, 1]], expected: 2 },
      { input: [[0, 1]], expected: 2 },
      { input: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8 }
    ],
    verify: (fn) => challenges[11].testCases.every(tc => fn(...tc.input) === tc.expected)
  },
  {
    id: 13,
    title: "Contains Duplicate",
    category: "Hash Tables",
    level: "Easy",
    complexity: "O(n)",
    mem: "MEM_0x51A",
    icon: "👯",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    template: "function containsDuplicate(nums) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [[1, 2, 3, 1]], expected: true },
      { input: [[1, 2, 3, 4]], expected: false },
      { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true }
    ],
    verify: (fn) => challenges[12].testCases.every(tc => fn(...tc.input) === tc.expected)
  },
  {
    id: 14,
    title: "Search Insert Position",
    category: "Search",
    level: "Easy",
    complexity: "O(log n)",
    mem: "MEM_0x52F",
    icon: "📍",
    description: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
    template: "function searchInsert(nums, target) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [[1, 3, 5, 6], 5], expected: 2 },
      { input: [[1, 3, 5, 6], 2], expected: 1 },
      { input: [[1, 3, 5, 6], 7], expected: 4 }
    ],
    verify: (fn) => challenges[13].testCases.every(tc => fn(...tc.input) === tc.expected)
  },
  {
    id: 15,
    title: "Remove Linked List Elements",
    category: "Linked Lists",
    level: "Easy",
    complexity: "O(n)",
    mem: "MEM_0x542",
    icon: "✂️",
    description: "Given the head of a linked list and an integer val, remove all the nodes of the linked list that has Node.val == val, and return the new head.",
    template: "// Node structure: { val: number, next: Node }\nfunction removeElements(head, val) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [{ val: 1, next: { val: 2, next: { val: 6, next: { val: 3, next: null } } } }, 6], expected: { val: 1, next: { val: 2, next: { val: 3, next: null } } } }
    ],
    verify: (fn) => {
      // Simplified verification for this demo
      const res = fn(challenges[14].testCases[0].input[0], challenges[14].testCases[0].input[1]);
      return JSON.stringify(res) === JSON.stringify(challenges[14].testCases[0].expected);
    }
  {
    id: 16,
    title: "Palindrome Check",
    category: "Search",
    level: "Easy",
    complexity: "O(n)",
    mem: "MEM_0x55A",
    icon: "↔️",
    description: "Given a string, return true if it is a palindrome and false otherwise.",
    template: "function isPalindrome(s) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: ["racecar"], expected: true },
      { input: ["hello"], expected: false }
    ],
    verify: (fn) => challenges[15].testCases.every(tc => fn(...tc.input) === tc.expected)
  },
  {
    id: 17,
    title: "Find Minimum in Rotated Sorted Array",
    category: "Search",
    level: "Medium",
    complexity: "O(log n)",
    mem: "MEM_0x56B",
    icon: "📉",
    description: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Find the minimum element of this array.",
    template: "function findMin(nums) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [[3, 4, 5, 1, 2]], expected: 1 },
      { input: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 }
    ],
    verify: (fn) => challenges[16].testCases.every(tc => fn(...tc.input) === tc.expected)
  },
  {
    id: 18,
    title: "Intersection of Two Arrays",
    category: "Arrays",
    level: "Easy",
    complexity: "O(n+m)",
    mem: "MEM_0x57C",
    icon: "✖️",
    description: "Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique.",
    template: "function intersection(nums1, nums2) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [[1, 2, 2, 1], [2, 2]], expected: [2] },
      { input: [[4, 9, 5], [9, 4, 9, 8, 4]], expected: [9, 4] }
    ],
    verify: (fn) => {
      return challenges[17].testCases.every(tc => {
        const res = fn(...tc.input);
        return JSON.stringify(res.sort()) === JSON.stringify(tc.expected.sort());
      });
    }
  },
  {
    id: 19,
    title: "Binary Tree Inorder Traversal",
    category: "Trees",
    level: "Easy",
    complexity: "O(n)",
    mem: "MEM_0x58D",
    icon: "🌳",
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    template: "// Node structure: { val: number, left: Node, right: Node }\nfunction inorderTraversal(root) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: [{ val: 1, left: null, right: { val: 2, left: { val: 3, left: null, right: null }, right: null } }], expected: [1, 3, 2] }
    ],
    verify: (fn) => {
      const res = fn(challenges[18].testCases[0].input[0]);
      return JSON.stringify(res) === JSON.stringify(challenges[18].testCases[0].expected);
    }
  },
  {
    id: 20,
    title: "Valid Anagram",
    category: "Hash Tables",
    level: "Easy",
    complexity: "O(n)",
    mem: "MEM_0x59E",
    icon: "🔤",
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    template: "function isAnagram(s, t) {\n  // Write your code here\n  \n}",
    testCases: [
      { input: ["anagram", "nagaram"], expected: true },
      { input: ["rat", "car"], expected: false }
    ],
    verify: (fn) => challenges[19].testCases.every(tc => fn(...tc.input) === tc.expected)
  }
];

// Helper to get challenge by ID
function getChallenge(id) {
  return challenges.find(c => c.id == id);
}


