import { useSubscribe } from "./UseSubscribe";

export function useApiNewsletter() {
  const subscribeMutation = useSubscribe();

  return {
    subscribe: subscribeMutation,
  };
}
