import { ensureEnvVar } from "../../utils/ensure-env-var.util";

export function getHost() {
  const host: string = ensureEnvVar(
    import.meta.env.VITE_WORDPRESS_HOST,
    "VITE_WORDPRESS_HOST"
  );

  return { host };
}
