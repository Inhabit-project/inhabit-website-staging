import { useMutation } from "@tanstack/react-query";
import { usersService } from "../services/rest/user";
import { UserDto } from "src/services/dtos/user.dto";

export function useSendKycEmail() {
  const { sendKycEmail } = usersService();

  return useMutation({
    mutationFn: async (dto: UserDto) => {
      const result = await sendKycEmail(dto);
      if (!result.success) throw result.error;
      return result.data; // void
    },
  });
}
