import express from 'express'
import Algorithm from '../models/Algorithm.js'

const router = express.Router()

// Get all algorithms
router.get('/', async (req, res) => {
  try {
    const { category } = req.query
    const filter = category ? { category } : {}
    const algorithms = await Algorithm.find(filter).sort({ name: 1 })
    res.json(algorithms)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single algorithm
router.get('/:id', async (req, res) => {
  try {
    const algorithm = await Algorithm.findById(req.params.id)
    if (!algorithm) {
      return res.status(404).json({ message: 'Algorithm not found' })
    }
    res.json(algorithm)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create algorithm
router.post('/', async (req, res) => {
  try {
    const algorithm = new Algorithm(req.body)
    const savedAlgorithm = await algorithm.save()
    res.status(201).json(savedAlgorithm)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Seed default algorithms
router.post('/seed', async (req, res) => {
  try {
    const defaultAlgorithms = [
      { name: 'Bubble Sort', category: 'sorting', description: 'Simple comparison-based sorting algorithm', complexity: { time: 'O(n²)', space: 'O(1)' } },
      { name: 'Merge Sort', category: 'sorting', description: 'Efficient divide and conquer sorting algorithm', complexity: { time: 'O(n log n)', space: 'O(n)' } },
      { name: 'Quick Sort', category: 'sorting', description: 'Fast partitioning-based sorting algorithm', complexity: { time: 'O(n log n)', space: 'O(log n)' } },
      { name: 'Dijkstra', category: 'pathfinding', description: 'Shortest path algorithm for weighted graphs', complexity: { time: 'O(V² + E)', space: 'O(V)' } },
      { name: 'A*', category: 'pathfinding', description: 'Heuristic-based optimal pathfinding algorithm', complexity: { time: 'O(E)', space: 'O(V)' } },
      { name: 'BFS Pathfinding', category: 'pathfinding', description: 'Level-order path search algorithm', complexity: { time: 'O(V + E)', space: 'O(V)' } },
      { name: 'BFS', category: 'graph', description: 'Breadth-first graph traversal', complexity: { time: 'O(V + E)', space: 'O(V)' } },
      { name: 'DFS', category: 'graph', description: 'Depth-first graph traversal', complexity: { time: 'O(V + E)', space: 'O(V)' } },
      { name: 'Topological Sort', category: 'graph', description: 'Linear ordering of DAG vertices', complexity: { time: 'O(V + E)', space: 'O(V)' } },
    ]

    await Algorithm.deleteMany({})
    const algorithms = await Algorithm.insertMany(defaultAlgorithms)
    res.status(201).json({ message: 'Database seeded', count: algorithms.length })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
