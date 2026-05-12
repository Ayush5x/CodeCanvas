/**
 * Boyer-Moore Majority Vote Algorithm Logic
 * This file contains the step-by-step logic for the algorithm.
 * Each step is asynchronous to allow for UI synchronization.
 */

export const BOYER_MOORE_CODE = [
  { text: "export const findMajority = (nums) => {", indent: 0, kw: 'export' },
  { text: "  let candidate = null;", indent: 2, kw: 'let' },
  { text: "  let count = 0;", indent: 2, kw: 'let' },
  { text: "", indent: 0 },
  { text: "  for (let num of nums) {", indent: 2, kw: 'for' },
  { text: "    if (count === 0) {", indent: 4, kw: 'if' },
  { text: "      candidate = num;", indent: 6 },
  { text: "    }", indent: 4 },
  { text: "", indent: 0 },
  { text: "    if (num === candidate) {", indent: 4, kw: 'if' },
  { text: "      count++;", indent: 6 },
  { text: "    } else {", indent: 4, kw: 'else' },
  { text: "      count--;", indent: 6 },
  { text: "    }", indent: 4 },
  { text: "  }", indent: 2 },
  { text: "", indent: 0 },
  { text: "  return candidate;", indent: 2, kw: 'return' },
  { text: "};", indent: 0 }
];

// Mapping of logical steps to code line indices
export const STEPS = {
  START: 0,
  INIT_VARS: 1,
  FOR_LOOP: 4,
  CHECK_COUNT_ZERO: 5,
  SET_CANDIDATE: 6,
  CHECK_MATCH: 9,
  INCREMENT_COUNT: 10,
  DECREMENT_COUNT: 12,
  LOOP_END: 14,
  RETURN: 16
};

export const INITIAL_STATE = {
  candidate: null,
  count: 0,
  index: -1,
  currentLine: -1,
  status: "Initializing System...",
  isFinished: false,
  pulseType: null // 'up', 'down', or null
};
