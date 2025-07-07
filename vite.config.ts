import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { ensureEnvVar } from "./src/utils/ensure-env.util";

const host = ensureEnvVar(process.env.VITE_HOST || "0.0.0.0", "VITE_HOST");
const port = Number(ensureEnvVar(process.env.VITE_PORT || "5173", "VITE_PORT"));

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host,
    port: port,
    strictPort: true,
    hmr: {
      port: port,
    },
  },
});
