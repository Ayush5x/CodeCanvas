import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This tells the browser to reset scroll to the top-left
    window.scrollTo(0, 0);
  }, [pathname]); // This triggers every time the URL changes

  return null;
};

export default ScrollToTop;