import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollManager } from "../utils/scrollManager";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use Lenis for smooth scroll to top if available, fallback to window.scrollTo
    if (scrollManager && typeof scrollManager.scrollTo === "function") {
      scrollManager.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop; 