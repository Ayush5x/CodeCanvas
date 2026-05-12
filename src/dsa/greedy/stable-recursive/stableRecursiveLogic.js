/**
 * Stable Recursive Greedy Algorithm (Activity Selection) Logic
 * This file contains the step-by-step recursive logic for the algorithm.
 */

export const STABLE_RECURSIVE_CODE = [
  { text: "export const activitySelect = (S, i, n) => {", indent: 0, kw: 'export' },
  { text: "  let m = i + 1;", indent: 2, kw: 'let' },
  { text: "", indent: 0 },
  { text: "  // Search for the first activity that starts", indent: 2, kw: 'comment' },
  { text: "  // after activity i finishes", indent: 2, kw: 'comment' },
  { text: "  while (m <= n && S[m].start < S[i].finish) {", indent: 2, kw: 'while' },
  { text: "    m++;", indent: 4 },
  { text: "  }", indent: 2 },
  { text: "", indent: 0 },
  { text: "  if (m <= n) {", indent: 2, kw: 'if' },
  { text: "    return [S[m], ...activitySelect(S, m, n)];", indent: 4, kw: 'return' },
  { text: "  } else {", indent: 2, kw: 'else' },
  { text: "    return [];", indent: 4, kw: 'return' },
  { text: "  }", indent: 2 },
  { text: "};", indent: 0 }
];

export const STEPS = {
  START: 0,
  INIT_M: 1,
  WHILE_START: 5,
  INCREMENT_M: 6,
  IF_VALID: 9,
  RECURSIVE_CALL: 10,
  BASE_CASE: 12
};

export const INITIAL_STATE = {
  activities: [],
  selectedIds: [],
  discardedIds: [],
  currentIndex: -1,
  currentM: -1,
  currentLine: -1,
  status: "Initializing System...",
  isFinished: false,
  stack: [], // Visual recursion stack
  depth: 0
};
