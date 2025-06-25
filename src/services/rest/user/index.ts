import { getHost } from "..";
import axiosInstance from "../../../config/axios.config";
import { APIError, ServiceResult } from "../../../models/api.model";
import { UserDto } from "src/services/dtos/user.dto";

export function usersService() {
  const { host } = getHost();

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

  return { sendKycEmail };
}
