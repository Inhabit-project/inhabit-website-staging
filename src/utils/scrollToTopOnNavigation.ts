import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollManager } from "./scrollManager";

// DEPRECATED: This hook is no longer needed. Scroll-to-top is now handled centrally in App.tsx after transitions.
export const useScrollToTopOnNavigation = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (scrollManager && typeof scrollManager.scrollTo === "function") {
      scrollManager.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pathname]);
};