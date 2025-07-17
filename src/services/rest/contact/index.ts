import { ContactDto } from "@/services/dtos/contact.dto";
import { getHost } from "..";
import axiosInstance from "../../../config/axios.config";
import { APIError, ServiceResult } from "../../../models/api.model";

export function contactServices() {
  const { host } = getHost();

  // POST
  const contact = async (dto: ContactDto): Promise<ServiceResult<string>> => {
    try {
      await axiosInstance.post<void>(`${host}/contact`, dto);
      return { success: true };
    } catch (error) {
      const apiError = error as APIError;
      console.error("❌", error);
      return { success: false, error: apiError };
    }
  };

  return {
    contact,
  };
}
