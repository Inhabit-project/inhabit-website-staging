import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { scrollManager } from "./utils/scrollManager";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/globals.css";
import "./utils/gsap";
import { HelmetProvider } from "react-helmet-async";

// Font optimization utilities
import { initializeFontOptimization } from "./utils/fontOptimization";
import { initializeFontLoading, FontLoadingUtils } from "./utils/fontLoading";
import { initializeFontPreloading } from "./utils/fontPreloader";

// Optimized font imports with font-display: swap
// @fontsource packages only include latin subset by default. No cyrillic or vietnamese fonts are included.
import "@fontsource/montserrat/400.css"; // Regular
import "@fontsource/montserrat/700.css"; // Bold
import "@fontsource/nunito-sans/400.css"; // Regular
import "@fontsource/nunito-sans/600.css"; // SemiBold
import "@fontsource/abel/400.css"; // Regular

// Add font-display: swap CSS override and optimization
const fontDisplayStyle = document.createElement("style");
fontDisplayStyle.textContent = `
  @font-face {
    font-family: 'Montserrat';
    font-display: swap;
  }
  @font-face {
    font-family: 'Nunito Sans';
    font-display: swap;
  }
  @font-face {
    font-family: 'Abel';
    font-display: swap;
  }
`;
document.head.appendChild(fontDisplayStyle);

// Apply fallback fonts immediately
FontLoadingUtils.applyFallbacks();

import { RainbowKitProviderConfig } from "./config/rainbow-kit.config";
import { BrowserRouter } from "react-router";

// Initialize font optimization, loading, and preloading
initializeFontOptimization();
initializeFontLoading();
initializeFontPreloading();

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
