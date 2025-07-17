import { useContact } from "./useContact";

export function useApiContact() {
  const contactMutation = useContact();

  return {
    contact: contactMutation,
  };
}
