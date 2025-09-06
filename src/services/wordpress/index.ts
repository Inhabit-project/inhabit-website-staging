import { ensureEnvVar } from "../../utils/ensure-env-var.util";

export function getHost() {
  const host: string = ensureEnvVar(
    import.meta.env.VITE_WORDPRESS_HOST,
    "VITE_WORDPRESS_HOST"
  );

  // Remove trailing slash to prevent double slashes
  const cleanHost = host.endsWith('/') ? host.slice(0, -1) : host;

  return { host: cleanHost };
}
