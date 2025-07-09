import { useMutation } from "@tanstack/react-query";
import { userServices } from "../services/rest/user";
import { UserDto } from "src/services/dtos/user.dto";
import { ResendKycDto } from "@/services/dtos/resend-kyc.dto";

export function useSendKycEmail() {
  const { sendKycEmail } = userServices();

  return useMutation({
    mutationFn: async (dto: UserDto) => {
      const result = await sendKycEmail(dto);
      if (!result.success) throw result.error;
      return result.data; // void
    },
  });
}

export function useResendKycEmail() {
  const { resendKycEmail } = userServices();

  return useMutation({
    mutationFn: async (dto: ResendKycDto) => {
      const result = await resendKycEmail(dto);
      if (!result.success) throw result.error;
      return result.data; // void
    },
  });
}
