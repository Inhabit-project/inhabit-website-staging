import { useMutation } from "@tanstack/react-query";
import { contactServices } from "@/services/rest/contact";
import { ContactDto } from "@/services/dtos/contact.dto";

export function useContact() {
  const { contact } = contactServices();

  return useMutation({
    mutationFn: async (dto: ContactDto) => {
      const result = await contact(dto);
      if (!result.success) throw result.error;
      return result.data; // void
    },
  });
}
