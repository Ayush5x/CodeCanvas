/**
 * Linear Search Algorithm Implementation
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */

export const linearSearch = (array, target, onStep) => {
  const steps = [];
  let found = false;
  let foundIndex = -1;

  for (let i = 0; i < array.length; i++) {
    const step = {
      currentIndex: i,
      comparing: array[i],
      target,
      action: `Comparing ${target} with ${array[i]} at index ${i}`
    };

    if (onStep) {
      onStep(step);
    }
    steps.push(step);

    if (array[i] === target) {
      found = true;
      foundIndex = i;
      step.action = `Found ${target} at index ${i}!`;
      step.found = true;
      break;
    } else {
      step.action = `${array[i]} ≠ ${target}, continue searching`;
    }
  }

  if (!found) {
    steps.push({
      currentIndex: -1,
      action: `${target} not found in array`,
      notFound: true
    });
  }

  return { steps, found, index: foundIndex };
};

/**
 * Jump Search Algorithm Implementation
 * Time Complexity: O(√n)
 * Space Complexity: O(1)
 */

export const jumpSearch = (array, target, onStep) => {
  const steps = [];
  const n = array.length;
  let jumpSize = Math.floor(Math.sqrt(n));
  let prev = 0;
  let found = false;
  let foundIndex = -1;

  // Jump search phase
  while (array[Math.min(jumpSize, n) - 1] < target) {
    const step = {
      jumpFrom: prev,
      jumpTo: jumpSize,
      comparing: array[Math.min(jumpSize, n) - 1],
      target,
      action: `Jumping: ${array[Math.min(jumpSize, n) - 1]} < ${target}, jump to next block`,
      phase: 'jumping'
    };

    if (onStep) {
      onStep(step);
    }
    steps.push(step);

    prev = jumpSize;
    jumpSize += Math.floor(Math.sqrt(n));

    if (prev >= n) {
      steps.push({
        action: `${target} not found in array`,
        notFound: true
      });
      return { steps, found: false, index: -1 };
    }
  }

  // Linear search phase in the identified block
  const end = Math.min(jumpSize, n);
  for (let i = prev; i < end; i++) {
    const step = {
      currentIndex: i,
      comparing: array[i],
      target,
      action: `Linear search in block: comparing ${target} with ${array[i]} at index ${i}`,
      phase: 'linear'
    };

    if (onStep) {
      onStep(step);
    }
    steps.push(step);

    if (array[i] === target) {
      found = true;
      foundIndex = i;
      step.action = `Found ${target} at index ${i}!`;
      step.found = true;
      break;
    }
  }

  if (!found) {
    steps.push({
      currentIndex: -1,
      action: `${target} not found in array`,
      notFound: true
    });
  }

  return { steps, found, index: foundIndex };
};
