import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollManager } from "./scrollManager";

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