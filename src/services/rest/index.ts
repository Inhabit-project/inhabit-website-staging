import { ensureEnvVar } from "../../utils/ensure-env-var.util";

export function getHost() {
  const host: string = ensureEnvVar(
    import.meta.env.VITE_BACKEND_HOST,
    "VITE_BACKEND_HOST"
  );

  return { host };
}
