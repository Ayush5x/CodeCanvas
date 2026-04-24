import { useState } from "react";

import CircularLinkedList from "../components/CircularLinkedListVisualizer";
import CircularLinkedListCodevisualizer from "../components/CircularLinkedListCodeViewer";
import CircularLinkListExplanation from "../components/CircularLinkedListExplanation"


const CircularPage = () => {
  const [nodes, setNodes] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <>

    <div className="linkedlist-page">
      <CircularLinkedList nodes={nodes} onNodesChange={setNodes} />
    </div>
<CircularLinkedListCodevisualizer/>
<CircularLinkListExplanation/>
    </>
  );
};

export default CircularPage;
