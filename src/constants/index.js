/**
 * Application-wide constants and theme configuration
 * This file contains all shared constants used across the DSA Website
 * Import specific constants in components: import { COLORS, ANIMATION_SPEEDS } from '../../../constants';
 */

// Memory pool settings for linked list visualization
export const MEMORY_POOL_SIZE = 10;

// Animation timing constants - used across all visualizers
export const ANIMATION_SPEEDS = {
  SLOW: 2000,        // 2 seconds per step
  MEDIUM: 800,       // Default speed
  FAST: 300,         // Quick animations
  VERY_FAST: 100,    // Very fast
  ULTRA_FAST: 50,    // Ultra fast
  INSTANT: 10        // Minimal delay
};

// Consolidated application constants for backward compatibility
export const APP_CONSTANTS = {
  ANIMATION: {
    DEFAULT_SPEED: 800,
    MIN_SPEED: 10,
    MAX_SPEED: 2000,
    SPEED_STEP: 10
  },
  UI: {
    ERROR_DISPLAY_DURATION: 3000,
    SUCCESS_DISPLAY_DURATION: 2000
  },
  INPUT: {
    DEBOUNCE_DELAY: 300
  }
};

/**
 * Global color scheme - Dark theme consistent across all visualizers
 * These colors are used for:
 * - Node states (active, inactive, highlighted)
 * - UI elements (buttons, panels, borders)
 * - Code highlighting backgrounds
 * - Animation states (success, error, warning)
 */
export const COLORS = {
  // Primary action colors
  PRIMARY: '#58a6ff',        // Blue - primary buttons, links, highlights
  SECONDARY: '#238636',      // Green - success states, normal operations
  DANGER: '#f85149',         // Red - errors, delete operations
  WARNING: '#d29922',        // Yellow - warnings, cautions
  SUCCESS: '#238636',        // Green - successful operations
  
  // Node visualization colors
  NODE_ACTIVE: '#5bc9b1',    // Teal - currently processing/highlighted nodes
  NODE_INACTIVE: '#30363d',  // Gray - inactive/default nodes
  NODE_VISITING: '#f39c12',  // Orange - nodes being visited in traversals
  
  // Interface colors
  BACKGROUND: '#0d1117',     // Main dark background
  SURFACE: '#161b22',        // Panels, cards, elevated surfaces
  BORDER: '#30363d',         // Borders, dividers
  TEXT_PRIMARY: '#c9d1d9',   // Main text color
  TEXT_SECONDARY: '#8b949e', // Secondary text, labels
  
  // Code highlighting colors
  CODE_HIGHLIGHT: 'rgba(88, 166, 255, 0.3)',     // Blue background for current line
  CODE_ERROR: 'rgba(248, 81, 73, 0.4)',          // Red background for errors
  CODE_BORDER_HIGHLIGHT: '#58a6ff',               // Blue left border for current line
  CODE_BORDER_ERROR: '#f85149'                    // Red left border for errors
};

// Grid configuration for pathfinding visualizer
export const PATHFINDING_GRID = {
  MIN_ROWS: 8,
  MIN_COLS: 20,
  MAX_ROWS: 15,
  MAX_COLS: 35,
  DEFAULT_ROWS: 12,
  DEFAULT_COLS: 25
};

// Tree visualizer constraints
export const TREE_LIMITS = {
  MAX_DEPTH: 4,          // Maximum tree depth for reliable display
  MAX_HEIGHT: 5,         // Resulting maximum height
  NODE_RADIUS: 22,       // Standard node circle radius
  MIN_SPACING: 60,       // Minimum space between nodes
  LEVEL_HEIGHT: 70       // Vertical space between tree levels
};

// Default dimensions for visualizer panels
export const PANEL_DIMENSIONS = {
  MIN_WIDTH: 300,
  MAX_WIDTH: 1200,
  MIN_HEIGHT: 400,
  MAX_HEIGHT: 800,
  CODE_PANEL_FLEX: 1,    // Equal split for code/visualization panels
  VIZ_PANEL_FLEX: 1
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  MOBILE: '768px',
  TABLET: '1024px',
  DESKTOP: '1200px'
};

// Route paths for consistent navigation
export const ROUTES = {
  HOME: '/',
  LINKED_LIST: '/linked-list',
  SORTING: '/sorting',
  STACKS_QUEUES: '/stacks-queues',
  TREES: '/trees',
  TREES_BST: '/trees/bst',
  TREES_AVL: '/trees/avl',
  TREES_HEAP: '/trees/heap',
  PATHFINDING: '/pathfinding',
  ABOUT: '/about'
};

// Algorithm complexity notations for educational content
export const COMPLEXITY = {
  CONSTANT: 'O(1)',
  LOGARITHMIC: 'O(log n)',
  LINEAR: 'O(n)',
  LINEAR_LOGARITHMIC: 'O(n log n)',
  QUADRATIC: 'O(n²)',
  CUBIC: 'O(n³)',
  EXPONENTIAL: 'O(2^n)',
  FACTORIAL: 'O(n!)'
};
