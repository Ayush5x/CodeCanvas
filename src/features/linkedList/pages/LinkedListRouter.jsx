import { useParams } from "react-router-dom";

import SinglyPage from "./SinglyPage";
import DoublyPage from "./DoublyPage";
import CircularPage from "./CircularPage";

const LinkedListRouter = () => {
  const { type } = useParams();

  switch (type) {
    case "single":
      return <SinglyPage />;
    case "double":
      return <DoublyPage />;
    case "circular":
      return <CircularPage />;
    default:
      return <div>404 - Invalid Linked List Type</div>;
  }
};

export default LinkedListRouter;