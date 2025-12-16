import { Address } from "thirdweb";
import { getHost } from "..";
import { APIError, ServiceResult } from "@/models/api.model";
import axios from "axios";
import { Hex, MessageDefinition } from "viem";

type RelayService = {
  getTransferFromMessageDefinition: (body: {
    address: Address;
    message: string;
    signature: Hex;
    from: Address;
    to: Address;
    tokenId: bigint;
  }) => ServiceResult<MessageDefinition>;
};

export function relayServices(): RelayService {
  const { host } = getHost();
  const endpoint = "relay";

  const url = `${host}/${endpoint}`;

  // GET
  const getTransferFromMessageDefinition = async (
    body: Parameters<RelayService["getTransferFromMessageDefinition"]>[0]
  ): Promise<ServiceResult<MessageDefinition>> => {
    try {
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

  return {
    getTransferFromMessageDefinition:
      getTransferFromMessageDefinition as unknown as RelayService["getTransferFromMessageDefinition"],
  };
}
