import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Core & Layout Components
import LandingPage from './pages/LandingPage';
import DSAHome from './features/home/components/DSAHome';
import IntroLoader from './components/Intro';
import ScrollToTop from './components/ScrollToTop';

// Algorithm Feature Components
import SearchAlgos from './features/searchAlgos/components/SearchAlgos';
import RecursionVisualizer from './features/recursion/components/RecursionVisualizer';
import PointerVisualizer from './features/pointers/PointersPage';
import LinkedListHome from "./features/linkedList/components/LinkedListHome";
import LinkedListRouter from "./features/linkedList/pages/LinkedListRouter";
import HashTableVisualizer from "./features/hashTable/components/HashTableVisualizer";
import DS2HomePage from './features/ds2/components/DS2HomePage';
import GreedyAlgorithms from './features/greedyAlgorithms/components/GreedyAlgorithms';
import FlowChart from "./features/flowcharts/components/BlockBasedAlgorithmBuilder";
import StackQueue from "./features/stackQueue/components/StackQueueVisualizer";
import PathFinding from "./features/pathfinding/components/PathfindingVisualizer";
import KleeAlgorithm from './features/klee/components/KleeAlgorithm';
import AboutUs from './features/about/components/AboutUs';

// Sorting Feature Components
import SortingAlgoHome from './features/sorting/components/SortingAlgoHome';
import BubbleSort from './features/sorting/components/BubbleSort';
import SelectionSort from './features/sorting/components/SelectionSort';
import InsertionSort from './features/sorting/components/InsertionSort';
import MergeSort from './features/sorting/components/MergeSort';
import HeapSortLab from './features/sorting/components/HeapSort';
import QuickSort from './features/sorting/components/QuickSort';

// Tree Feature Components
import TreeHome from "./features/tree/components/TreeHome";
import BSTVisualizer from './features/tree/components/BSTVisualizer'; 
import AVLTreeVisualizer from './features/tree/components/AVLTreeVisualizer';
import HeapVisualizer from './features/tree/components/HeapVisualizer';

// Graph Feature Components
import { 
  GraphAlgorithmsList, 
  BFSPage, 
  DFSPage, 
  DijkstraPage, 
  PrimPage, 
  KruskalPage 
} from "./features/graphs/components";

// Activity & Quiz Components
import Activity from "./features/Activity/ActivityList";
import QuizEngine from "./features/Activity/Quiz/QuizListPage";

// Quiz Detail Pages
import ArrayQuestion from "./features/Activity/Quiz/ArrayQuestions";
import LinkedListQuestion from "./features/Activity/Quiz/LinkedListQuestion";
import QuestionPointer from "./features/Activity/Quiz/PointersQuestion";
import StackQueueQuestions from "./features/Activity/Quiz/StackQueueQuestions";
import TreeQuestion from "./features/Activity/Quiz/TreeQuestions";
import PathFindingQuestions from "./features/Activity/Quiz/PathFindingQuestions";
import HashTableQuestions from "./features/Activity/Quiz/HashTableQuestions";
import GraphsQuestions from "./features/Activity/Quiz/GraphsQuestions";
import FlowChartQuestions from "./features/Activity/Quiz/FlowCharts";
import SortingAlgorithmsQuestions from "./features/Activity/Quiz/SortingAlgorithmQuestions";
import SearchAlgorithmsQuestions from "./features/Activity/Quiz/SearchQuestions";
import RecursionQuestions from "./features/Activity/Quiz/RecursionQuestions";
import GreedyAlgorithmsQuestions from "./features/Activity/Quiz/GreedyQuestions";
import DS2Questions from "./features/Activity/Quiz/DS2Questions";

export default function App() {
  const location = useLocation();
  const isBaseUrl = location.pathname === '/';
  const [introFinished, setIntroFinished] = useState(!isBaseUrl);

  return (
    <>
       {isBaseUrl && !introFinished && (
        <IntroLoader onLoadingComplete={() => setIntroFinished(true)} />
      )}

      {(introFinished || !isBaseUrl) && ( 
        <>
        <ScrollToTop/>
        <Routes>
          {/* Main Entry Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/dsa" element={<DSAHome />} />
          <Route path='/about' element={<AboutUs/>} />

          {/* Search Algorithms */}
          <Route path="/dsa/search" element={<SearchAlgos />} />
          <Route path="/dsa/search/:algo" element={<SearchAlgos />} />

          {/* Sorting Algorithms */}
          <Route path="/dsa/sorting" element={<SortingAlgoHome />} />
          <Route path="/dsa/sorting/bubble" element={<BubbleSort />} />
          <Route path="/dsa/sorting/selection" element={<SelectionSort />} />
          <Route path="/dsa/sorting/insertion" element={<InsertionSort />} />
          <Route path="/dsa/sorting/merge" element={<MergeSort />} />
          <Route path="/dsa/sorting/heap" element={<HeapSortLab />} />
          <Route path="/dsa/sorting/quick" element={<QuickSort />} />

          {/* Core DSA Modules */}
          <Route path="/dsa/recursion" element={<RecursionVisualizer />} />
          <Route path="/dsa/recursion/:algo" element={<RecursionVisualizer />} />
          <Route path="/dsa/pointers" element={<PointerVisualizer />} />
          <Route path="/dsa/linked-list" element={<LinkedListHome />} />
          <Route path="/dsa/linked-list/:type" element={<LinkedListRouter />} />
          <Route path="/dsa/hash-table" element={<HashTableVisualizer />} />
          <Route path="/dsa/stack-queue" element={<StackQueue />} />
          <Route path="/dsa/tree" element={<TreeHome />} />
          <Route path="/dsa/tree/bst" element={<BSTVisualizer />} />
          <Route path="/dsa/tree/avl" element={<AVLTreeVisualizer />} />
          <Route path="/dsa/tree/heap" element={<HeapVisualizer />} />
          <Route path="/dsa/pathfinding" element={<PathFinding />} />

          {/* Graph Section */}
          <Route path="/dsa/graphs" element={<GraphAlgorithmsList />} />
          <Route path="/dsa/graphs/bfs" element={<BFSPage />} />
          <Route path="/dsa/graphs/dfs" element={<DFSPage />} />
          <Route path="/dsa/graphs/dijkstra" element={<DijkstraPage />} />
          <Route path="/dsa/graphs/prim" element={<PrimPage />} />
          <Route path="/dsa/graphs/kruskal" element={<KruskalPage />} />

          {/* DS2 & Advanced Algorithms */}
          <Route path="/dsa/ds2" element={<DS2HomePage />} />
          <Route path='/dsa/ds2/klee' element={<KleeAlgorithm/>} />
          <Route path="/dsa/greedy/*" element={<GreedyAlgorithms />} />
          <Route path="/dsa/flowcharts" element={<FlowChart />} />

          {/* Activity & Hub Section */}
          <Route path="/activity" element={<Activity />} />
          <Route path="/activity/quiz" element={<QuizEngine />} />
          <Route path="/activity/exam" element={<div>Exam Section Coming Soon</div>} />

          {/* Quiz Routes */}
          <Route path="/activity/quiz/arrays" element={<ArrayQuestion />} />
          <Route path="/activity/quiz/linkedlist" element={<LinkedListQuestion />}  />
          <Route path="/activity/quiz/pointers" element={<QuestionPointer />} />
          <Route path="/activity/quiz/stacks-queues" element={<StackQueueQuestions />} />
          <Route path="/activity/quiz/trees" element={<TreeQuestion />} />
          <Route path="/activity/quiz/pathfinding" element={<PathFindingQuestions />} />
          <Route path="/activity/quiz/hashtables" element={<HashTableQuestions />} />
          <Route path="/activity/quiz/graphs" element={<GraphsQuestions />} />
          <Route path="/activity/quiz/flowcharts" element={<FlowChartQuestions />} />
          <Route path="/activity/quiz/sorting-algorithms" element={<SortingAlgorithmsQuestions />} />
          <Route path="/activity/quiz/search-algorithms" element={<SearchAlgorithmsQuestions />} />
          <Route path="/activity/quiz/recursion" element={<RecursionQuestions />} />
          <Route path="/activity/quiz/greedy-algorithms" element={<GreedyAlgorithmsQuestions />} />
          <Route path="/activity/quiz/ds2" element={<DS2Questions />} />

        </Routes>
        </>
      )}  
    </>
  );
}