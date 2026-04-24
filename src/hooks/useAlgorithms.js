import { useState, useEffect, useCallback } from 'react'
import { algorithmService } from '../services/api'

export function useAlgorithms(category = null) {
  const [algorithms, setAlgorithms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAlgorithms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await algorithmService.getAll(category)
      setAlgorithms(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch algorithms')
      // Fallback to static data if API fails
      setAlgorithms(getStaticAlgorithms(category))
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchAlgorithms()
  }, [fetchAlgorithms])

  return { algorithms, loading, error, refetch: fetchAlgorithms }
}

// Static fallback data
function getStaticAlgorithms(category) {
  const allAlgorithms = [
    { _id: '1', name: 'Bubble Sort', category: 'sorting', description: 'Simple comparison-based sorting algorithm' },
    { _id: '2', name: 'Merge Sort', category: 'sorting', description: 'Efficient divide and conquer sorting algorithm' },
    { _id: '3', name: 'Quick Sort', category: 'sorting', description: 'Fast partitioning-based sorting algorithm' },
    { _id: '4', name: 'Dijkstra', category: 'pathfinding', description: 'Shortest path algorithm for weighted graphs' },
    { _id: '5', name: 'A*', category: 'pathfinding', description: 'Heuristic-based optimal pathfinding algorithm' },
    { _id: '6', name: 'BFS Pathfinding', category: 'pathfinding', description: 'Level-order path search algorithm' },
    { _id: '7', name: 'BFS', category: 'graph', description: 'Breadth-first graph traversal' },
    { _id: '8', name: 'DFS', category: 'graph', description: 'Depth-first graph traversal' },
    { _id: '9', name: 'Topological Sort', category: 'graph', description: 'Linear ordering of DAG vertices' },
  ]

  if (category) {
    return allAlgorithms.filter((algo) => algo.category === category)
  }
  return allAlgorithms
}

export default useAlgorithms
