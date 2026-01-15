import { EXCHANGERATE_API_KEY } from "@/config/const";
import { APIError, ServiceResult } from "@/models/api.model";
import { RateExchangeResponse } from "@/services/dtos/rate-exchange-response";
import { CURRENCY } from "@/config/enums";
import axios from "axios";

export function currencyExchangeRatesService() {
  const host: string = getHost();

  const getExchangeRates = async (
    currencyFrom: CURRENCY,
    currencyTo: CURRENCY
  ): Promise<ServiceResult<number>> => {
    try {
      const response = await axios.get<RateExchangeResponse>(
        `${host}&source=${currencyFrom}&currencies=${currencyTo}`
      );

      const rate = response.data.quotes[`${currencyFrom}${currencyTo}`];

      if (!rate) {
        throw new Error("Rate not found");
      }

      return { success: true, data: rate };
    } catch (error) {
      console.error("❌", error);
      const apiError = error as APIError;
      return { success: false, error: apiError };
    }
  };

  return {
    getExchangeRates,
  };
}
function getHost(): string {
  const url: string = "https://api.exchangerate.host/live";
  const accessKey: string = EXCHANGERATE_API_KEY;

  const host: string = `${url}?access_key=${accessKey}`;

  return host;
}
