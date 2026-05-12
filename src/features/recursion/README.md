# Recursion Visualizer

A comprehensive educational tool that visualizes recursive algorithms through interactive tree diagrams, call stack visualization, and step-by-step code execution.

## Features

### 🌳 **Visual Tree Representation**
- **Binary Tree Layout**: Shows the recursive call structure as a tree where each node represents a function call
- **Node States**: Different visual states for active calls, completed calls, and base cases
- **Color Coding**: 
  - Orange nodes indicate base cases
  - Blue glowing nodes show the currently active call
  - Green nodes represent completed calls with results

### 📚 **Call Stack Visualization**
- **Real-time Stack**: Shows the current state of the call stack during execution
- **Frame Information**: Displays function name, parameters, and current line number
- **Stack Growth**: Visual representation of how the stack grows and shrinks during recursion

### 💻 **Interactive Code Display**
- **Syntax Highlighting**: Clean, readable C code with proper formatting
- **Line Highlighting**: Current execution line is highlighted during animation
- **Step Descriptions**: Detailed explanations of what's happening at each step

### 🎮 **Animation Controls**
- **Play/Pause**: Control animation playback
- **Step Forward/Backward**: Manual step-through for detailed analysis
- **Speed Control**: Adjustable animation speed (slider from slow to fast)
- **Reset**: Return to the beginning of the algorithm

## Supported Algorithms

### 1. **Fibonacci Sequence**
```c
int fibonacci(int n) {
    if (n <= 1)        // Base case
        return n;      // Return n
    return fibonacci(n-1) + fibonacci(n-2);
}
```
- **Purpose**: Classic recursive example showing exponential branching
- **Complexity**: O(2^n) time, demonstrating the inefficiency of naive recursion
- **Educational Value**: Perfect for understanding how recursion creates a tree structure

### 2. **Greatest Common Divisor (Euclidean Algorithm)**
```c
int gcd(int a, int b) {
    if (b == 0)        // Base case
        return a;      // Return a
    return gcd(b, a % b);
}
```
- **Purpose**: Efficient recursive algorithm with linear depth
- **Complexity**: O(log min(a, b)) time
- **Educational Value**: Shows how recursion can be efficient with proper problem reduction

### 3. **Fast Exponentiation (Exponentiation by Squaring)**
```c
int power(int base, int exp) {
    if (exp == 0) return 1;    // Base case
    if (exp == 1) return base; // Base case
    if (exp % 2 == 0) {
        int half = power(base, exp/2);
        return half * half;
    }
    return base * power(base, exp-1);
}
```
- **Purpose**: Optimized recursive algorithm using divide-and-conquer
- **Complexity**: O(log exp) time compared to O(exp) naive approach
- **Educational Value**: Demonstrates how clever recursion can achieve logarithmic complexity

## Educational Content

### Algorithm-Specific Explanations
Each algorithm includes detailed explanations covering:
- **What the algorithm does**: Clear problem statement and purpose
- **Recursive structure**: How the problem breaks down into subproblems
- **Base cases**: When and why recursion stops
- **Time complexity**: Big-O analysis with visual demonstration
- **Practical insights**: Real-world applications and optimizations

### Visual Learning Approach
- **Tree metaphor**: Consistent visualization showing recursion as tree traversal
- **Call stack metaphor**: Understanding how function calls accumulate in memory
- **Step-by-step breakdown**: Each recursive call explained in detail
- **Pattern recognition**: Identifying common recursive patterns

## User Interface

### Input Controls
- **Algorithm Selection**: Dropdown to choose between Fibonacci, GCD, and Fast Exponentiation
- **Input Parameters**: 
  - Fibonacci: Single number (e.g., "5")
  - GCD: Two numbers separated by comma (e.g., "12, 8")
  - Fast Exponentiation: Base and exponent (e.g., "2, 5")

### Visualization Panels
- **Left Panel**: Recursion tree and call stack visualization
- **Right Panel**: Code display with line highlighting and step descriptions
- **Bottom Panel**: Comprehensive educational explanations

### Responsive Design
- **Desktop**: Two-column layout with tree/stack on left, code on right
- **Tablet**: Single column layout with stacked panels
- **Mobile**: Optimized controls and readable text sizing

## Technical Implementation

### State Management
- **React Hooks**: useState and useEffect for animation state
- **Step Tracking**: Complete history of all function calls and returns
- **Real-time Updates**: Synchronized visualization between tree, stack, and code

### Animation System
- **Configurable Speed**: User-controlled animation timing
- **Smooth Transitions**: CSS transitions for visual state changes
- **Pause/Resume**: Non-blocking animation with proper cleanup

### Algorithm Tracing
- **Step Generation**: Pre-computed execution steps for smooth playback
- **Node Tracking**: Unique identification of each recursive call
- **Result Propagation**: Visual representation of how results bubble up

## Usage Examples

### Teaching Scenarios
1. **Introduction to Recursion**: Start with Fibonacci to show basic concepts
2. **Efficiency Discussion**: Compare Fibonacci's exponential growth with GCD's efficiency
3. **Advanced Techniques**: Use Fast Exponentiation to demonstrate divide-and-conquer

### Learning Progression
1. **Observe**: Watch the complete animation to get overall understanding
2. **Step Through**: Use manual controls to examine each step carefully
3. **Experiment**: Try different input values to see how patterns change
4. **Analyze**: Study the educational content to understand the theory

## Browser Compatibility
- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Features
- Keyboard navigation support
- High contrast color scheme
- Screen reader friendly structure
- Adjustable animation speeds for different learning needs