import { useState } from "react";

import SinglyLinkedListVisualizer from "../components/SinglyLinkedListVisualizer";
import SinglyLinkedListCodeViewer from "../components/SinglyLinkedListCodeViewer";
import SinglyLinkedListExplanation from "../components/SinglyLinkedListExplanation";

const SinglyPage = () => {
  const [nodes, setNodes] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="linkedlist-page">
      <SinglyLinkedListVisualizer
        nodes={nodes}
        onNodesChange={setNodes}
        onAnimationUpdate={(line, step, animating) => {
          setCurrentLine(line);
          setCurrentStep(step);
          setIsAnimating(animating);
        }}
      />

      <SinglyLinkedListCodeViewer
        nodes={nodes}
        currentLine={currentLine}
        isAnimating={isAnimating}
        onStepChange={(step) => setCurrentStep(step)}
      />

      <SinglyLinkedListExplanation />
    </div>
  );
};

export default SinglyPage;