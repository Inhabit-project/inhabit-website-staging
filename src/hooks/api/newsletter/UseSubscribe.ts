import { useMutation } from "@tanstack/react-query";
import { newsletterServices } from "@/services/rest/newsletter";
import { SubscriptionDto } from "@/services/dtos/subscription.dto";

export function useSubscribe() {
  const { subscribe } = newsletterServices();

  return useMutation({
    mutationFn: async (dto: SubscriptionDto) => {
      const result = await subscribe(dto);
      if (!result.success) throw result.error;
      return result.data; // void
    },
  });
}
