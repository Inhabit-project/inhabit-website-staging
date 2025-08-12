import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { scrollManager } from "./utils/scrollManager";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/globals.css";
import "./utils/gsap";
import { HelmetProvider } from "react-helmet-async";

// Optimized font loading
import { initializeOptimizedFontLoading } from "./utils/optimizedFontLoader";

// Fonts are now loaded via HTML head with optimal preloading
// No need for CSS imports that could block rendering

import { RainbowKitProviderConfig } from "./config/rainbow-kit.config";
import { BrowserRouter } from "react-router";

// Initialize optimized font loading
initializeOptimizedFontLoading();

// Initialize smooth scrolling
scrollManager.init();

function isSafari() {
  // This will match Safari but not Chrome or Edge
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

if (!isSafari() && CSS.supports("scroll-snap-type: y mandatory")) {
  if (!document.getElementById("dynamic-scroll-snap-style")) {
    const style = document.createElement("style");
    style.id = "dynamic-scroll-snap-style";
    style.textContent = `
      *, ::after, ::before {
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        scroll-snap-type: y mandatory;
        scroll-snap-align: start;
      }
    `;
    document.head.appendChild(style);
  }
} else {
  const style = document.getElementById("dynamic-scroll-snap-style");
  if (style) style.remove();
}

if (CSS.supports("scroll-snap-type: y mandatory")) {
  document.documentElement.classList.add("supports-scroll-snap");
} else {
  document.documentElement.classList.remove("supports-scroll-snap");
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <RainbowKitProviderConfig>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </RainbowKitProviderConfig>
    </HelmetProvider>
  </React.StrictMode>
);
