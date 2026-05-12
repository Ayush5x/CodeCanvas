import { useParams } from "react-router-dom"

// Import all feature components
import Sorting from "../features/sorting/components/SortingVisualizer"
import StackQueue from "../features/stackQueue/components/StackQueueVisualizer"
import Tree from "../features/tree/components/TreeHome"
import Graphs from "../features/graphs/components/GraphAlgorithmsList"
import LinkedList from "../features/linkedList/components/LinkedListHome"
import HashTable from "../features/hashTable/components/HashTableVisualizer"
import Pathfinding from "../features/pathfinding/components/PathfindingVisualizer"
import Recursion from "../features/recursion/components/RecursionVisualizer"
import Greedy from "../features/greedyAlgorithms/components/GreedyAlgorithmsList"
import Search from "../features/searchAlgos/components/SearchHomepage"
import Pointers from "../features/pointers/PointersPage"
import DS2 from "../features/ds2/components/DS2HomePage"
import Flowchart from "../features/flowcharts/components/BlockBasedAlgorithmBuilder"
import Quiz from "../features/quiz/components/landingpage"
import Archive from "../features/archive/components/landingpage"


const FEATURE_MAP = {
  sorting: Sorting,

  // 🔥 add all mappings here
  "stack-queue": StackQueue,
  tree: Tree,
  graphs: Graphs,
  "linked-list": LinkedList,
  "hash-table": HashTable,
  pathfinding: Pathfinding,
  recursion: Recursion,
  greedy: Greedy,
  search: Search,
  pointers: Pointers,
  ds2: DS2,
  flowcharts:Flowchart,
  quiz:Quiz,
  archive:Archive



}

export default function InnerPage() {
  const { topic } = useParams()

  const Component = FEATURE_MAP[topic]

  if (!Component) {
    return <h1 style={{ color: "white" }}>404 - Feature Not Found</h1>
  }

  return <Component />
}

