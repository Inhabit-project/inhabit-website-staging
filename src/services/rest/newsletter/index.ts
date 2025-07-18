import { getHost } from "..";
import axiosInstance from "../../../config/axios.config";
import { APIError, ServiceResult } from "../../../models/api.model";
import { SubscriptionDto } from "@/services/dtos/subscription.dto";

export function newsletterServices() {
  const { host } = getHost();

  // POST
  const subscribe = async (
    dto: SubscriptionDto
  ): Promise<ServiceResult<string>> => {
    try {
      await axiosInstance.post<void>(`${host}/newsletter/subscribe`, dto);
      return { success: true };
    } catch (error) {
      const apiError = error as APIError;
      console.error("❌", error);
      return { success: false, error: apiError };
    }
  };

  return {
    subscribe,
  };
}
