import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { ensureEnvVar } from "./src/utils/ensure-env.util";
import compression from "vite-plugin-compression";
import { config } from "dotenv";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const host = ensureEnvVar(process.env.HOST || env.HOST, "HOST");
  const port = Number(ensureEnvVar(process.env.PORT || env.PORT, "PORT"));
  const domain = ensureEnvVar(process.env.DOMAIN || env.DOMAIN, "DOMAIN");

  return {
    plugins: [
      react(),
      // Enable gzip compression
      compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240, // Only compress files larger than 10KB
        deleteOriginFile: false, // Keep original files
      }),
      // Enable brotli compression
      compression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 10240, // Only compress files larger than 10KB
        deleteOriginFile: false, // Keep original files
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    preview: {
      allowedHosts: [domain],
      port,
      strictPort: true,
    },
    server: {
      allowedHosts: [domain],
      host,
      port,
      strictPort: true,
    },
  };
});
