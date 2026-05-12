/**
 * Binary Search Algorithm Implementation
 * Time Complexity: O(log n)
 * Space Complexity: O(1) for iterative, O(log n) for recursive
 */

export const binarySearchIterative = (array, target, onStep) => {
  const steps = [];
  let left = 0;
  let right = array.length - 1;
  let found = false;
  let foundIndex = -1;

  while (left <= right && !found) {
    const mid = Math.floor((left + right) / 2);
    
    // Record step for visualization
    const step = {
      left,
      right,
      mid,
      comparing: array[mid],
      target,
      action: `Comparing ${target} with ${array[mid]} at index ${mid}`
    };

    if (onStep) {
      onStep(step);
    }
    steps.push(step);

    if (array[mid] === target) {
      found = true;
      foundIndex = mid;
      step.action = `Found ${target} at index ${mid}!`;
      step.found = true;
    } else if (array[mid] < target) {
      left = mid + 1;
      step.action = `${array[mid]} < ${target}, searching right half`;
    } else {
      right = mid - 1;
      step.action = `${array[mid]} > ${target}, searching left half`;
    }
  }

  if (!found) {
    steps.push({
      left,
      right,
      mid: -1,
      action: `${target} not found in array`,
      notFound: true
    });
  }

  return { steps, found, index: foundIndex };
};

export const binarySearchRecursive = (array, target, left = 0, right = array.length - 1, steps = [], onStep) => {
  if (left > right) {
    const step = {
      left,
      right,
      mid: -1,
      action: `${target} not found in array`,
      notFound: true
    };
    steps.push(step);
    if (onStep) {
      onStep(step);
    }
    return { steps, found: false, index: -1 };
  }

  const mid = Math.floor((left + right) / 2);
  const step = {
    left,
    right,
    mid,
    comparing: array[mid],
    target,
    action: `Comparing ${target} with ${array[mid]} at index ${mid}`
  };

  if (onStep) {
    onStep(step);
  }
  steps.push(step);

  if (array[mid] === target) {
    step.action = `Found ${target} at index ${mid}!`;
    step.found = true;
    return { steps, found: true, index: mid };
  } else if (array[mid] < target) {
    step.action = `${array[mid]} < ${target}, searching right half`;
    return binarySearchRecursive(array, target, mid + 1, right, steps, onStep);
  } else {
    step.action = `${array[mid]} > ${target}, searching left half`;
    return binarySearchRecursive(array, target, left, mid - 1, steps, onStep);
  }
};
