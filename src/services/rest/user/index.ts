import { Address } from "viem";
import { getHost } from "..";
import axiosInstance from "../../../config/axios.config";
import { APIError, ServiceResult } from "../../../models/api.model";
import { UserDto } from "src/services/dtos/user.dto";
import { KYC_TYPE } from "src/config/enums";

export function userServices() {
  const { host } = getHost();

  // GET
  const isKycCompleted = async (
    address: Address,
    kycType: KYC_TYPE
  ): Promise<ServiceResult<boolean>> => {
    try {
      const response = await axiosInstance.get<boolean>(
        `${host}/users/${address}/isKycCompleted//${kycType}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      const apiError = error as APIError;
      console.error("❌", error);
      return { success: false, error: apiError };
    }
  };

  const hasSentKyc = async (
    address: Address,
    kycType: KYC_TYPE
  ): Promise<ServiceResult<boolean>> => {
    try {
      const response = await axiosInstance.get<boolean>(
        `${host}/users/${address}/hasSentKyc/${kycType}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      const apiError = error as APIError;
      console.error("❌", error);
      return { success: false, error: apiError };
    }
  };

  // POST
  const sendKycEmail = async (dto: UserDto): Promise<ServiceResult<string>> => {
    try {
      await axiosInstance.post<void>(`${host}/users/sendKyc`, dto);
      return { success: true };
    } catch (error) {
      const apiError = error as APIError;
      console.error("❌", error);
      return { success: false, error: apiError };
    }
  };

  return {
    isKycCompleted,
    hasSentKyc,
    sendKycEmail,
  };
}
