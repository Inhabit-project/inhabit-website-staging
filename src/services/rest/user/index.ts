import { Address } from "viem";
import { getHost } from "..";
import axiosInstance from "../../../config/axios.config";
import { APIError, ServiceResult } from "../../../models/api.model";
import { UserDto } from "src/services/dtos/user.dto";

export function userServices() {
  const { host } = getHost();

  // GET
  const getKycHardDone = async (
    address: Address
  ): Promise<ServiceResult<boolean>> => {
    try {
      const response = await axiosInstance.get<boolean>(
        `${host}/users/doneKycHard/${address}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      const apiError = error as APIError;
      return { success: false, error: apiError };
    }
  };

  const getHasKycHardSent = async (
    address: Address
  ): Promise<ServiceResult<boolean>> => {
    try {
      const response = await axiosInstance.get<boolean>(
        `${host}/users/hashKycHard/${address}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      const apiError = error as APIError;
      return { success: false, error: apiError };
    }
  };

  // POST
  const sendKycEmail = async (dto: UserDto): Promise<ServiceResult<string>> => {
    try {
      const response = await axiosInstance.post<void>(
        `${host}/users/sendKycEmail`,
        dto
      );
      return { success: true };
    } catch (error) {
      const apiError = error as APIError;
      return { success: false, error: apiError };
    }
  };

  return {
    getKycHardDone,
    getHasKycHardSent,
    sendKycEmail,
  };
}
