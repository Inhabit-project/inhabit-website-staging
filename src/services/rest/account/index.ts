import { getHost } from "..";
import { Address } from "viem";
import axiosInstance from "../../../config/axios.config";
import { APIError, ServiceResult } from "../../../models/api.model";

export function accountsService() {
  const { host } = getHost();

  const getNonce = async (address: Address): Promise<ServiceResult<string>> => {
    try {
      const response = await axiosInstance.get<string>(
        `${host}/accounts/getNonce/${address}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      const apiError = error as APIError;
      return { success: false, error: apiError };
    }
  };

  return { getNonce };
}
