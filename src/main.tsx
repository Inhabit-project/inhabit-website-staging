import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { scrollManager } from "./utils/scrollManager";
import "./utils/gsap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import fonts
import "@fontsource/montserrat/300.css"; // Light
import "@fontsource/montserrat/400.css"; // Regular
import "@fontsource/montserrat/500.css"; // Medium
import "@fontsource/montserrat/700.css"; // Bold
import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/600.css";
import { RainbowKitProviderConfig } from "./config/rainbow-kit.config";

const queryClient = new QueryClient();

// Initialize smooth scrolling
scrollManager.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RainbowKitProviderConfig>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </RainbowKitProviderConfig>
  </React.StrictMode>
);
