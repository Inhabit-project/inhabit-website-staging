import { Address } from "thirdweb";
import { getHost } from "..";
import { APIError, ServiceResult } from "@/models/api.model";
import axios from "axios";
import { Hex, MessageDefinition } from "viem";
import {
  ForwardRequestData,
  mapForwardRequestDataToDto,
} from "@/models/forwarder-request-data.model";

type RelayService = {
  getTransferFromMessageDefinition: (data: {
    address: Address;
    message: string;
    signature: Hex;
    from: Address;
    to: Address;
    tokenId: bigint;
  }) => ServiceResult<MessageDefinition>;
  transferFrom: (data: {
    chainId: number;
    address: Address;
    message: string;
    signature: Hex;
    request: ForwardRequestData;
  }) => ServiceResult<void>;
};

export function relayServices(): RelayService {
  const { host } = getHost();
  const endpoint = "relay";

  const url = `${host}/${endpoint}`;

  // POST
  const getTransferFromMessageDefinition = async (
    data: Parameters<RelayService["getTransferFromMessageDefinition"]>[0]
  ): Promise<ServiceResult<MessageDefinition>> => {
    try {
      const tokenId = data.tokenId.toString();
      const body = {
        address: data.address,
        message: data.message,
        signature: data.signature,
        from: data.from,
        to: data.to,
        tokenId,
      };
      const response = await axios.post<MessageDefinition>(
        `${url}/getTransferFromMessageDefinition`,
        body
      );
      return { success: true, data: response.data };
    } catch (error) {
      const apiError = error as APIError;
      return { success: false, error: apiError };
    }
  };

  const transferFrom = async (
    data: Parameters<RelayService["transferFrom"]>[0]
  ): Promise<ServiceResult<void>> => {
    try {
      const body = {
        ...data,
        request: mapForwardRequestDataToDto(data.request),
      };

      console.log("body:", body);

      const response = await axios.post<void>(`${url}/transferFrom`, body);
      return { success: true, data: response.data };
    } catch (error) {
      const apiError = error as APIError;
      return { success: false, error: apiError };
    }
  };

  return {
    getTransferFromMessageDefinition:
      getTransferFromMessageDefinition as unknown as RelayService["getTransferFromMessageDefinition"],
    transferFrom: transferFrom as unknown as RelayService["transferFrom"],
  };
}
