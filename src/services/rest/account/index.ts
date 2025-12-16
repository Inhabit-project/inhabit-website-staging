import { getHost } from "..";
import { APIError, ServiceResult } from "../../../models/api.model";
import { SiweMessage } from "siwe";
import axiosInstance from "@/config/axios.config";

export function accountsService() {
  const { host } = getHost();

  const getSiweMessage = async (
    partialSiweMessage: Partial<SiweMessage>
  ): Promise<ServiceResult<string>> => {
    try {
      const response = await axiosInstance.post<string>(
        `${host}/accounts/getSiweMessage`,
        partialSiweMessage
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌", error);
      const apiError = error as APIError;
      return { success: false, error: apiError };
    }
  };

  return { getSiweMessage };
}
