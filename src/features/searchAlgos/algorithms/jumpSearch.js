/**
 * Jump Search Algorithm Implementation
 * Time Complexity: O(√n)
 * Space Complexity: O(1)
 */

export const jumpSearch = (array, target, onStep) => {
  const steps = [];
  const n = array.length;
  const jumpSize = Math.floor(Math.sqrt(n));
  let left = 0;
  let right = 0;
  let found = false;
  let foundIndex = -1;

  // Jump phase - find the block
  while (right < n && array[right] < target) {
    left = right;
    right += jumpSize;
    
    const step = {
      phase: 'jumping',
      left,
      right: Math.min(right, n - 1),
      jumpSize,
      comparing: array[Math.min(right, n - 1)],
      target,
      action: `Jumping by ${jumpSize}: checking if ${target} > ${array[Math.min(right, n - 1)]} at index ${Math.min(right, n - 1)}`
    };

    if (onStep) {
      onStep(step);
    }
    steps.push(step);
  }

  // Linear search phase within the identified block
  steps.push({
    phase: 'linear_start',
    left,
    right: Math.min(right, n),
    action: `Found potential block [${left}, ${Math.min(right, n - 1)}]. Starting linear search...`
  });

  for (let i = left; i < Math.min(right, n); i++) {
    const step = {
      phase: 'linear',
      left,
      right: Math.min(right, n),
      current: i,
      comparing: array[i],
      target,
      action: `Linear search: comparing ${target} with ${array[i]} at index ${i}`
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

    if (array[i] > target) {
      step.action = `${array[i]} > ${target}, element not in array`;
      step.notFound = true;
      break;
    }
  }

  if (!found && !steps[steps.length - 1].notFound) {
    steps.push({
      phase: 'not_found',
      action: `${target} not found in array`,
      notFound: true
    });
  }

  return { steps, found, index: foundIndex, jumpSize };
};
