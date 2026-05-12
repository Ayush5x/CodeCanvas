// LeetCode data organized by topics
// This data is parsed and structured from the README.md file

export const leetCodeData = {
  'linked-list': {
    title: 'Linked List',
    description: 'Master linked list operations, traversals, and manipulation techniques.',
    questions: [
      {
        id: 'll1',
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
        solutionUrl: 'https://leetcode.com/problems/reverse-linked-list/solutions/',
        tags: ['Linked List', 'Recursion', 'Iterative'],
        dateAdded: '2024-01-15'
      },
      {
        id: 'll2',
        title: 'Merge Two Sorted Lists',
        difficulty: 'Easy',
        description: 'You are given the heads of two sorted linked lists list1 and list2.',
        leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/',
        solutionUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/solutions/',
        tags: ['Linked List', 'Merge', 'Recursion'],
        dateAdded: '2024-01-16'
      },
      {
        id: 'll3',
        title: 'Remove Nth Node From End of List',
        difficulty: 'Medium',
        description: 'Given the head of a linked list, remove the nth node from the end of the list.',
        leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
        solutionUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/solutions/',
        tags: ['Linked List', 'Two Pointers'],
        dateAdded: '2024-01-17'
      },
      {
        id: 'll4',
        title: 'Add Two Numbers',
        difficulty: 'Medium',
        description: 'You are given two non-empty linked lists representing two non-negative integers.',
        leetcodeUrl: 'https://leetcode.com/problems/add-two-numbers/',
        solutionUrl: 'https://leetcode.com/problems/add-two-numbers/solutions/',
        tags: ['Linked List', 'Math', 'Recursion'],
        dateAdded: '2024-01-18'
      },
      {
        id: 'll5',
        title: 'Copy List with Random Pointer',
        difficulty: 'Medium',
        description: 'A linked list of length n is given such that each node contains an additional random pointer.',
        leetcodeUrl: 'https://leetcode.com/problems/copy-list-with-random-pointer/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Linked List', 'Hash Table'],
        dateAdded: '2024-01-19'
      }
    ]
  },

  'stacks-queues': {
    title: 'Stacks & Queues',
    description: 'Learn stack and queue operations, LIFO/FIFO principles, and their applications.',
    questions: [
      {
        id: 'sq1',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Stack', 'String'],
        dateAdded: '2024-01-20'
      },
      {
        id: 'sq2',
        title: 'Implement Queue using Stacks',
        difficulty: 'Easy',
        description: 'Implement a first in first out (FIFO) queue using only two stacks.',
        leetcodeUrl: 'https://leetcode.com/problems/implement-queue-using-stacks/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Stack', 'Queue', 'Design'],
        dateAdded: '2024-01-21'
      },
      {
        id: 'sq3',
        title: 'Min Stack',
        difficulty: 'Medium',
        description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
        leetcodeUrl: 'https://leetcode.com/problems/min-stack/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Stack', 'Design'],
        dateAdded: '2024-01-22'
      },
      {
        id: 'sq4',
        title: 'Evaluate Reverse Polish Notation',
        difficulty: 'Medium',
        description: 'You are given an array of strings tokens that represents an arithmetic expression in Reverse Polish Notation.',
        leetcodeUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Stack', 'Array', 'Math'],
        dateAdded: '2024-01-23'
      },
      {
        id: 'sq5',
        title: 'Daily Temperatures',
        difficulty: 'Medium',
        description: 'Given an array of integers temperatures represents the daily temperatures.',
        leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Stack', 'Array', 'Monotonic Stack'],
        dateAdded: '2024-01-24'
      }
    ]
  },

  'trees': {
    title: 'Trees',
    description: 'Explore binary trees, BSTs, tree traversals, and tree-based algorithms.',
    questions: [
      {
        id: 't1',
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'Easy',
        description: 'Given the root of a binary tree, return its maximum depth.',
        leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'],
        dateAdded: '2024-01-25'
      },
      {
        id: 't2',
        title: 'Invert Binary Tree',
        difficulty: 'Easy',
        description: 'Given the root of a binary tree, invert the tree, and return its root.',
        leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'],
        dateAdded: '2024-01-26'
      },
      {
        id: 't3',
        title: 'Same Tree',
        difficulty: 'Easy',
        description: 'Given the roots of two binary trees p and q, write a function to check if they are the same or not.',
        leetcodeUrl: 'https://leetcode.com/problems/same-tree/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'],
        dateAdded: '2024-01-27'
      },
      {
        id: 't4',
        title: 'Validate Binary Search Tree',
        difficulty: 'Medium',
        description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
        leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Tree', 'DFS', 'BST', 'Binary Tree'],
        dateAdded: '2024-01-28'
      },
      {
        id: 't5',
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'Medium',
        description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values.',
        leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Tree', 'BFS', 'Binary Tree'],
        dateAdded: '2024-01-29'
      }
    ]
  },

  'sorting': {
    title: 'Sorting Algorithms',
    description: 'Master different sorting techniques and their time/space complexities.',
    questions: [
      {
        id: 's1',
        title: 'Sort Colors',
        difficulty: 'Medium',
        description: 'Given an array nums with n objects colored red, white, or blue, sort them in-place.',
        leetcodeUrl: 'https://leetcode.com/problems/sort-colors/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Two Pointers', 'Sorting'],
        dateAdded: '2024-02-01'
      },
      {
        id: 's2',
        title: 'Merge Intervals',
        difficulty: 'Medium',
        description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
        leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Sorting'],
        dateAdded: '2024-02-02'
      },
      {
        id: 's3',
        title: 'Largest Number',
        difficulty: 'Medium',
        description: 'Given a list of non-negative integers nums, arrange them such that they form the largest number.',
        leetcodeUrl: 'https://leetcode.com/problems/largest-number/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'String', 'Greedy', 'Sorting'],
        dateAdded: '2024-02-03'
      },
      {
        id: 's4',
        title: 'Top K Frequent Elements',
        difficulty: 'Medium',
        description: 'Given an integer array nums and an integer k, return the k most frequent elements.',
        leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Hash Table', 'Divide and Conquer', 'Sorting', 'Heap'],
        dateAdded: '2024-02-04'
      },
      {
        id: 's5',
        title: 'Meeting Rooms II',
        difficulty: 'Medium',
        description: 'Given an array of meeting time intervals, find the minimum number of conference rooms required.',
        leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms-ii/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Two Pointers', 'Greedy', 'Sorting', 'Heap'],
        dateAdded: '2024-02-05'
      }
    ]
  },

  'pathfinding': {
    title: 'Pathfinding',
    description: 'Learn graph algorithms, shortest path, and pathfinding techniques.',
    questions: [
      {
        id: 'p1',
        title: 'Number of Islands',
        difficulty: 'Medium',
        description: 'Given an m x n 2D binary grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands.',
        leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'DFS', 'BFS', 'Union Find', 'Matrix'],
        dateAdded: '2024-02-06'
      },
      {
        id: 'p2',
        title: 'Shortest Path in Binary Matrix',
        difficulty: 'Medium',
        description: 'Given an n x n binary matrix grid, return the length of the shortest clear path in the matrix.',
        leetcodeUrl: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'BFS', 'Matrix'],
        dateAdded: '2024-02-07'
      },
      {
        id: 'p3',
        title: 'Course Schedule',
        difficulty: 'Medium',
        description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.',
        leetcodeUrl: 'https://leetcode.com/problems/course-schedule/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['DFS', 'BFS', 'Graph', 'Topological Sort'],
        dateAdded: '2024-02-08'
      },
      {
        id: 'p4',
        title: 'Network Delay Time',
        difficulty: 'Medium',
        description: 'You are given a network of n nodes, labeled from 1 to n.',
        leetcodeUrl: 'https://leetcode.com/problems/network-delay-time/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['DFS', 'BFS', 'Graph', 'Shortest Path', 'Heap'],
        dateAdded: '2024-02-09'
      },
      {
        id: 'p5',
        title: 'Word Ladder',
        difficulty: 'Hard',
        description: 'A transformation sequence from word beginWord to word endWord using a dictionary wordList.',
        leetcodeUrl: 'https://leetcode.com/problems/word-ladder/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Hash Table', 'String', 'BFS'],
        dateAdded: '2024-02-10'
      }
    ]
  },

  'hash-tables': {
    title: 'Hash Tables',
    description: 'Master hash table operations, collision resolution, and hash-based algorithms.',
    questions: [
      {
        id: 'ht1',
        title: 'Two Sum',
        difficulty: 'Easy',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Hash Table'],
        dateAdded: '2024-02-11'
      },
      {
        id: 'ht2',
        title: 'Group Anagrams',
        difficulty: 'Medium',
        description: 'Given an array of strings strs, group the anagrams together.',
        leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Hash Table', 'String', 'Sorting'],
        dateAdded: '2024-02-12'
      },
      {
        id: 'ht3',
        title: 'Longest Consecutive Sequence',
        difficulty: 'Medium',
        description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.',
        leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Hash Table', 'Union Find'],
        dateAdded: '2024-02-13'
      },
      {
        id: 'ht4',
        title: 'Valid Anagram',
        difficulty: 'Easy',
        description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
        leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Hash Table', 'String', 'Sorting'],
        dateAdded: '2024-02-14'
      },
      {
        id: 'ht5',
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        description: 'Given an integer array nums, return true if any value appears at least twice in the array.',
        leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Hash Table', 'Sorting'],
        dateAdded: '2024-02-15'
      }
    ]
  },

  'heaps': {
    title: 'Heaps (Priority Queues)',
    description: 'Learn heap operations, priority queues, and heap-based algorithms.',
    questions: [
      {
        id: 'h1',
        title: 'Kth Largest Element in an Array',
        difficulty: 'Medium',
        description: 'Given an integer array nums and an integer k, return the kth largest element in the array.',
        leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Divide and Conquer', 'Sorting', 'Heap', 'Quickselect'],
        dateAdded: '2024-02-16'
      },
      {
        id: 'h2',
        title: 'Top K Frequent Elements',
        difficulty: 'Medium',
        description: 'Given an integer array nums and an integer k, return the k most frequent elements.',
        leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Hash Table', 'Divide and Conquer', 'Sorting', 'Heap'],
        dateAdded: '2024-02-17'
      },
      {
        id: 'h3',
        title: 'Find Median from Data Stream',
        difficulty: 'Hard',
        description: 'The median is the middle value in an ordered integer list. Design a data structure that supports adding integers and finding the median.',
        leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Two Pointers', 'Design', 'Sorting', 'Heap', 'Data Stream'],
        dateAdded: '2024-02-18'
      },
      {
        id: 'h4',
        title: 'K Closest Points to Origin',
        difficulty: 'Medium',
        description: 'Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin.',
        leetcodeUrl: 'https://leetcode.com/problems/k-closest-points-to-origin/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Math', 'Divide and Conquer', 'Geometry', 'Sorting', 'Heap'],
        dateAdded: '2024-02-19'
      },
      {
        id: 'h5',
        title: 'Last Stone Weight',
        difficulty: 'Easy',
        description: 'You are given an array of integers stones where stones[i] is the weight of the ith stone.',
        leetcodeUrl: 'https://leetcode.com/problems/last-stone-weight/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Heap', 'Priority Queue'],
        dateAdded: '2024-02-20'
      }
    ]
  },

  'dynamic-programming': {
    title: 'Dynamic Programming',
    description: 'Master dynamic programming patterns, memoization, and optimization problems.',
    questions: [
      {
        id: 'dp1',
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps.',
        leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Math', 'Dynamic Programming', 'Memoization'],
        dateAdded: '2024-02-21'
      },
      {
        id: 'dp2',
        title: 'House Robber',
        difficulty: 'Medium',
        description: 'You are a professional robber planning to rob houses along a street. You cannot rob two adjacent houses.',
        leetcodeUrl: 'https://leetcode.com/problems/house-robber/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Dynamic Programming'],
        dateAdded: '2024-02-22'
      },
      {
        id: 'dp3',
        title: 'Coin Change',
        difficulty: 'Medium',
        description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.',
        leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Dynamic Programming', 'BFS'],
        dateAdded: '2024-02-23'
      },
      {
        id: 'dp4',
        title: 'Longest Increasing Subsequence',
        difficulty: 'Medium',
        description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
        leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Binary Search', 'Dynamic Programming'],
        dateAdded: '2024-02-24'
      },
      {
        id: 'dp5',
        title: 'Unique Paths',
        difficulty: 'Medium',
        description: 'There is a robot on an m x n grid. The robot is initially located at the top-left corner.',
        leetcodeUrl: 'https://leetcode.com/problems/unique-paths/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Math', 'Dynamic Programming', 'Combinatorics'],
        dateAdded: '2024-02-25'
      }
    ]
  },

  'backtracking': {
    title: 'Backtracking',
    description: 'Learn backtracking algorithms for solving constraint satisfaction problems.',
    questions: [
      {
        id: 'bt1',
        title: 'Generate Parentheses',
        difficulty: 'Medium',
        description: 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
        leetcodeUrl: 'https://leetcode.com/problems/generate-parentheses/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['String', 'Dynamic Programming', 'Backtracking'],
        dateAdded: '2024-02-26'
      },
      {
        id: 'bt2',
        title: 'Combination Sum',
        difficulty: 'Medium',
        description: 'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations.',
        leetcodeUrl: 'https://leetcode.com/problems/combination-sum/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Backtracking'],
        dateAdded: '2024-02-27'
      },
      {
        id: 'bt3',
        title: 'Permutations',
        difficulty: 'Medium',
        description: 'Given an array nums of distinct integers, return all the possible permutations.',
        leetcodeUrl: 'https://leetcode.com/problems/permutations/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Backtracking'],
        dateAdded: '2024-02-28'
      },
      {
        id: 'bt4',
        title: 'Subsets',
        difficulty: 'Medium',
        description: 'Given an integer array nums of unique elements, return all possible subsets (the power set).',
        leetcodeUrl: 'https://leetcode.com/problems/subsets/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Backtracking', 'Bit Manipulation'],
        dateAdded: '2024-03-01'
      },
      {
        id: 'bt5',
        title: 'N-Queens',
        difficulty: 'Hard',
        description: 'The n-queens puzzle is the problem of placing n queens on an n×n chessboard such that no two queens attack each other.',
        leetcodeUrl: 'https://leetcode.com/problems/n-queens/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Backtracking'],
        dateAdded: '2024-03-02'
      }
    ]
  },

  'greedy-algorithms': {
    title: 'Greedy Algorithms',
    description: 'Master greedy algorithmic approaches and optimization strategies.',
    questions: [
      {
        id: 'ga1',
        title: 'Jump Game',
        difficulty: 'Medium',
        description: 'You are given an integer array nums. You are initially positioned at the array\'s first index.',
        leetcodeUrl: 'https://leetcode.com/problems/jump-game/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Dynamic Programming', 'Greedy'],
        dateAdded: '2024-03-03'
      },
      {
        id: 'ga2',
        title: 'Gas Station',
        difficulty: 'Medium',
        description: 'There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].',
        leetcodeUrl: 'https://leetcode.com/problems/gas-station/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Greedy'],
        dateAdded: '2024-03-04'
      },
      {
        id: 'ga3',
        title: 'Meeting Rooms II',
        difficulty: 'Medium',
        description: 'Given an array of meeting time intervals, find the minimum number of conference rooms required.',
        leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms-ii/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Two Pointers', 'Greedy', 'Sorting', 'Heap'],
        dateAdded: '2024-03-05'
      },
      {
        id: 'ga4',
        title: 'Non-overlapping Intervals',
        difficulty: 'Medium',
        description: 'Given an array of intervals, find the minimum number of intervals you need to remove.',
        leetcodeUrl: 'https://leetcode.com/problems/non-overlapping-intervals/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Dynamic Programming', 'Greedy', 'Sorting'],
        dateAdded: '2024-03-06'
      },
      {
        id: 'ga5',
        title: 'Best Time to Buy and Sell Stock II',
        difficulty: 'Medium',
        description: 'You are given an integer array prices where prices[i] is the price of a given stock on the ith day.',
        leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Dynamic Programming', 'Greedy'],
        dateAdded: '2024-03-07'
      }
    ]
  },

  'binary-search': {
    title: 'Binary Search',
    description: 'Master binary search algorithms and search techniques on sorted data.',
    questions: [
      {
        id: 'bs1',
        title: 'Binary Search',
        difficulty: 'Easy',
        description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.',
        leetcodeUrl: 'https://leetcode.com/problems/binary-search/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Binary Search'],
        dateAdded: '2024-03-08'
      },
      {
        id: 'bs2',
        title: 'Search in Rotated Sorted Array',
        difficulty: 'Medium',
        description: 'There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is rotated.',
        leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Binary Search'],
        dateAdded: '2024-03-09'
      },
      {
        id: 'bs3',
        title: 'Find First and Last Position of Element in Sorted Array',
        difficulty: 'Medium',
        description: 'Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.',
        leetcodeUrl: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Binary Search'],
        dateAdded: '2024-03-10'
      },
      {
        id: 'bs4',
        title: 'Search a 2D Matrix',
        difficulty: 'Medium',
        description: 'You are given an m x n integer matrix matrix with the following two properties: Each row is sorted in non-decreasing order.',
        leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Binary Search', 'Matrix'],
        dateAdded: '2024-03-11'
      },
      {
        id: 'bs5',
        title: 'Find Minimum in Rotated Sorted Array',
        difficulty: 'Medium',
        description: 'Suppose an array of length n sorted in ascending order is rotated between 1 and n times.',
        leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Binary Search'],
        dateAdded: '2024-03-12'
      }
    ]
  },

  'bit-manipulation': {
    title: 'Bit Manipulation',
    description: 'Learn bitwise operations, bit masking, and bit-level algorithms.',
    questions: [
      {
        id: 'bm1',
        title: 'Single Number',
        difficulty: 'Easy',
        description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.',
        leetcodeUrl: 'https://leetcode.com/problems/single-number/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Bit Manipulation'],
        dateAdded: '2024-03-13'
      },
      {
        id: 'bm2',
        title: 'Number of 1 Bits',
        difficulty: 'Easy',
        description: 'Write a function that takes the binary representation of an unsigned integer and returns the number of \'1\' bits it has.',
        leetcodeUrl: 'https://leetcode.com/problems/number-of-1-bits/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Divide and Conquer', 'Bit Manipulation'],
        dateAdded: '2024-03-14'
      },
      {
        id: 'bm3',
        title: 'Counting Bits',
        difficulty: 'Easy',
        description: 'Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1\'s in the binary representation of i.',
        leetcodeUrl: 'https://leetcode.com/problems/counting-bits/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Dynamic Programming', 'Bit Manipulation'],
        dateAdded: '2024-03-15'
      },
      {
        id: 'bm4',
        title: 'Reverse Bits',
        difficulty: 'Easy',
        description: 'Reverse bits of a given 32 bits unsigned integer.',
        leetcodeUrl: 'https://leetcode.com/problems/reverse-bits/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Divide and Conquer', 'Bit Manipulation'],
        dateAdded: '2024-03-16'
      },
      {
        id: 'bm5',
        title: 'Missing Number',
        difficulty: 'Easy',
        description: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.',
        leetcodeUrl: 'https://leetcode.com/problems/missing-number/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Hash Table', 'Math', 'Binary Search', 'Bit Manipulation', 'Sorting'],
        dateAdded: '2024-03-17'
      }
    ]
  },

  'trie': {
    title: 'Trie (Prefix Tree)',
    description: 'Master trie data structure for efficient string operations and prefix matching.',
    questions: [
      {
        id: 'tr1',
        title: 'Implement Trie (Prefix Tree)',
        difficulty: 'Medium',
        description: 'A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.',
        leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Hash Table', 'String', 'Design', 'Trie'],
        dateAdded: '2024-03-18'
      },
      {
        id: 'tr2',
        title: 'Word Search II',
        difficulty: 'Hard',
        description: 'Given an m x n board of characters and a list of strings words, return all words on the board.',
        leetcodeUrl: 'https://leetcode.com/problems/word-search-ii/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'String', 'Backtracking', 'Trie', 'Matrix'],
        dateAdded: '2024-03-19'
      },
      {
        id: 'tr3',
        title: 'Search Suggestions System',
        difficulty: 'Medium',
        description: 'You are given an array of strings products and a string searchWord.',
        leetcodeUrl: 'https://leetcode.com/problems/search-suggestions-system/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'String', 'Trie'],
        dateAdded: '2024-03-20'
      },
      {
        id: 'tr4',
        title: 'Design Add and Search Words Data Structure',
        difficulty: 'Medium',
        description: 'Design a data structure that supports adding new words and finding if a string matches any previously added string.',
        leetcodeUrl: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['String', 'Depth-First Search', 'Design', 'Trie'],
        dateAdded: '2024-03-21'
      },
      {
        id: 'tr5',
        title: 'Word Break',
        difficulty: 'Medium',
        description: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
        leetcodeUrl: 'https://leetcode.com/problems/word-break/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Hash Table', 'String', 'Dynamic Programming', 'Trie'],
        dateAdded: '2024-03-22'
      }
    ]
  },

  'sliding-window': {
    title: 'Sliding Window',
    description: 'Master sliding window techniques for array and string problems.',
    questions: [
      {
        id: 'sw1',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        description: 'Given a string s, find the length of the longest substring without repeating characters.',
        leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Hash Table', 'String', 'Sliding Window'],
        dateAdded: '2024-03-23'
      },
      {
        id: 'sw2',
        title: 'Minimum Window Substring',
        difficulty: 'Hard',
        description: 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t is included.',
        leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Hash Table', 'String', 'Sliding Window'],
        dateAdded: '2024-03-24'
      },
      {
        id: 'sw3',
        title: 'Longest Repeating Character Replacement',
        difficulty: 'Medium',
        description: 'You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character.',
        leetcodeUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Hash Table', 'String', 'Sliding Window'],
        dateAdded: '2024-03-25'
      },
      {
        id: 'sw4',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day.',
        leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Dynamic Programming'],
        dateAdded: '2024-03-26'
      },
      {
        id: 'sw5',
        title: 'Permutation in String',
        difficulty: 'Medium',
        description: 'Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.',
        leetcodeUrl: 'https://leetcode.com/problems/permutation-in-string/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Hash Table', 'Two Pointers', 'String', 'Sliding Window'],
        dateAdded: '2024-03-27'
      }
    ]
  },

  'two-pointers': {
    title: 'Two Pointers',
    description: 'Learn two-pointer techniques for array and linked list problems.',
    questions: [
      {
        id: 'tp1',
        title: 'Two Sum II - Input Array Is Sorted',
        difficulty: 'Medium',
        description: 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.',
        leetcodeUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Two Pointers', 'Binary Search'],
        dateAdded: '2024-03-28'
      },
      {
        id: 'tp2',
        title: '3Sum',
        difficulty: 'Medium',
        description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
        leetcodeUrl: 'https://leetcode.com/problems/3sum/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Two Pointers', 'Sorting'],
        dateAdded: '2024-03-29'
      },
      {
        id: 'tp3',
        title: 'Container With Most Water',
        difficulty: 'Medium',
        description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).',
        leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Two Pointers', 'Greedy'],
        dateAdded: '2024-03-30'
      },
      {
        id: 'tp4',
        title: 'Trapping Rain Water',
        difficulty: 'Hard',
        description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack', 'Monotonic Stack'],
        dateAdded: '2024-03-31'
      },
      {
        id: 'tp5',
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
        leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/',
        solutionUrl: 'https://leetcode.com/problems/solutions/',
        tags: ['Two Pointers', 'String'],
        dateAdded: '2024-04-01'
      }
    ]
  }
};
