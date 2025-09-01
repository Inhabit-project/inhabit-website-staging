import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollManager } from "./scrollManager";

// DEPRECATED: This hook is no longer needed. Scroll-to-top is now handled centrally in App.tsx after transitions.
export const useScrollToTopOnNavigation = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = async () => {
      try {
        await scrollManager.scrollTo(0, { immediate: true });
      } catch (error) {
        console.warn('Scroll to top failed, using fallback:', error);
        // Fallback to immediate scroll to top
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    };

    handleScroll();
  }, [pathname]);
};