import { getHost } from "..";
import { APIError, ServiceResult } from "../../../models/api.model";
import { SiweMessage } from "siwe";
import axiosInstance from "@/config/axios.config";
import { Address, Hex } from "viem";

type AccountsService = {
  getSiweMessage: (data: Partial<SiweMessage>) => ServiceResult<string>;
  saveOrder: (data: {
    chainId: number;
    address: Address;
    message: string;
    signature: Hex;
    reference: string;
    to: Address;
    referral: Hex;
    campaignId: string;
    collectionId: string;
    paymentToken: Address;
    paymentAmount: number;
  }) => ServiceResult<string>;
};

export function accountsService(): AccountsService {
  const { host } = getHost();
  const endpoint = "accounts";

  const url = `${host}/${endpoint}`;

  // POST
  const getSiweMessage = async (
    data: Parameters<AccountsService["getSiweMessage"]>[0]
  ): Promise<ServiceResult<string>> => {
    try {
      const response = await axiosInstance.post<string>(
        `${url}/getSiweMessage`,
        data
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌", error);
      const apiError = error as APIError;
      return { success: false, error: apiError };
    }
  };

  const saveOrder = async (
    data: Parameters<AccountsService["saveOrder"]>[0]
  ): Promise<ServiceResult<string>> => {
    try {
      const response = await axiosInstance.post<string>(
        `${url}/saveOrder`,
        data
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌", error);
      const apiError = error as APIError;
      return { success: false, error: apiError };
    }
  };

  return {
    getSiweMessage:
      getSiweMessage as unknown as AccountsService["getSiweMessage"],
    saveOrder: saveOrder as unknown as AccountsService["saveOrder"],
  };
}
