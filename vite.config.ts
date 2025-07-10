import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { ensureEnvVar } from "./src/utils/ensure-env.util";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const host = ensureEnvVar(env.HOST, "HOST");
  const port = Number(ensureEnvVar(env.PORT, "PORT"));
  const domain = ensureEnvVar(env.DOMAIN, "DOMAIN");

  return {
    plugins: [react()],
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
