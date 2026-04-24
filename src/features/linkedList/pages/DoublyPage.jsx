import { useState } from "react";

import DoublyLinkedListVisualizer from "../components/DoublyLinkedListVisualizer";
import DoublyLinkedListExplanation from "../components/DoublyLinkedListExplanation";
import DoublyLinkedListCodeViewer from "../components/DoublyLinkedListCodeViewer";

const DoublyPage = () => {
  const [nodes, setNodes] = useState([]);
   const [currentLine, setCurrentLine] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="linkedlist-page">
      <DoublyLinkedListVisualizer
        nodes={nodes}
        onNodesChange={setNodes}
      />
<DoublyLinkedListCodeViewer
nodes={nodes}onNodesChange={setNodes}
        onAnimationUpdate={(line, step, animating) => {
          setCurrentLine(line);
          setCurrentStep(step);
          setIsAnimating(animating);
        }}/>


      <DoublyLinkedListExplanation />
    </div>
  );
};

export default DoublyPage;