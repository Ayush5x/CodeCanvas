/**
 * Greedy Job Scheduling with Deadlines Logic
 * This file contains the step-by-step logic for the algorithm.
 * Each step is asynchronous to allow for UI synchronization.
 */

export const JOB_SCHEDULING_CODE = [
  { text: "export const scheduleJobs = (jobs) => {", indent: 0, kw: 'export' },
  { text: "  // 1. Sort jobs by profit (descending)", indent: 2, kw: 'comment' },
  { text: "  jobs.sort((a, b) => b.profit - a.profit);", indent: 2 },
  { text: "", indent: 0 },
  { text: "  let maxD = Math.max(...jobs.map(j => j.deadline));", indent: 2, kw: 'let' },
  { text: "  let slots = new Array(maxD).fill(-1);", indent: 2, kw: 'let' },
  { text: "", indent: 0 },
  { text: "  for (let job of jobs) {", indent: 2, kw: 'for' },
  { text: "    // Search backwards from deadline", indent: 4, kw: 'comment' },
  { text: "    for (let j = job.deadline - 1; j >= 0; j--) {", indent: 4, kw: 'for' },
  { text: "      if (slots[j] === -1) {", indent: 6, kw: 'if' },
  { text: "        slots[j] = job.id;", indent: 8 },
  { text: "        break;", indent: 8, kw: 'break' },
  { text: "      }", indent: 6 },
  { text: "    }", indent: 4 },
  { text: "  }", indent: 2 },
  { text: "", indent: 0 },
  { text: "  return slots;", indent: 2, kw: 'return' },
  { text: "};", indent: 0 }
];

export const STEPS = {
  START: 0,
  SORT: 2,
  INIT_SLOTS: 5,
  FOR_JOBS: 7,
  FOR_SLOTS: 9,
  CHECK_SLOT: 10,
  FILL_SLOT: 11,
  NEXT_JOB: 14,
  RETURN: 17
};

export const INITIAL_STATE = {
  sortedJobs: [],
  slots: [], // Array of job IDs or null
  currentJobId: null,
  currentSlotIndex: -1,
  currentLine: -1,
  status: "Initializing System...",
  isFinished: false,
  totalProfit: 0,
  highlightedJobId: null
};
