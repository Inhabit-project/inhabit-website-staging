import { create } from "zustand";
import { Address, Hex, keccak256, toBytes, WalletClient } from "viem";
import { InhabitContract } from "../services/blockchain/contracts/inhabit";
import { Collection } from "../models/collection.model";
import { Campaign } from "../models/campaign.model";
import { userServices } from "../services/rest/user";
import { CURRENCY, ERROR, KYC_TYPE } from "../config/enums";
import { Group } from "@/models/group.model";
import { ERC20Contract } from "@/services/blockchain/contracts/erc20";
import {
  CCOP_JSON,
  CHAIN,
  CUSD_JSON,
  USDC_JSON,
  USDT_JSON,
  VITE_COOKIE_RATE_EXCHANGE,
} from "@/config/const";
import Cookies from "js-cookie";
import { currencyExchangeRatesService } from "@/services/rest/currency-exchange-rates";
import { Nft } from "@/models/nft.model";
import { thirdwebService } from "@/services/rest/thirdweb";

// Flag to prevent duplicate exchange rate API calls
let isExchangeRateFetching = false;

type Store = {
  campaign: Campaign | null;
  campaignLoading: boolean;
  campaigns: Campaign[];
  campaignsLoading: boolean;
  collection: Collection | null;
  collections: Collection[];
  group: Group | null;
  groupsLoading: boolean;
  isKycHardCompleted: boolean;
  isKycSoftCompleted: boolean;
  hasSentKycHard: boolean;
  hasSentKycSoft: boolean;
  inhabit: InhabitContract;
  isPollingKyc: boolean;
  lastCampaign: Campaign | null;
  ccop: ERC20Contract;
  cusd: ERC20Contract;
  usdc: ERC20Contract;
  usdt: ERC20Contract;
  usdToCopRate: number;
  walletsNfts: Nft[];
  getCampaign: (campaignId: number) => Promise<Campaign | null>;
  getCampaigns: () => Promise<Campaign[]>;
  getGroup: (campaignId: number, referral: Hex) => Promise<Group | null>;
  getHasSentKyc: (address: Address, kycType: KYC_TYPE) => Promise<boolean>;
  getIsKycCompleted: (address: Address, kycType: KYC_TYPE) => Promise<boolean>;
  getWalletNfts: (address: Address) => Promise<Nft[]>;
  getUsdToCopRate: (
    currencyFrom: CURRENCY,
    currencyTo: CURRENCY
  ) => Promise<number>;
  isCampaignReferral: (
    campaignId: number,
    referral: string
  ) => Promise<boolean>;
  setCampaign: (campaign: Campaign) => void;
  startKycPolling: (address: Address, requiresHardKyc: boolean) => void;
  setCollection: (collection: Collection) => void;
  setCollections: (collections: Collection[]) => void;
  setKycSent: (kycType: KYC_TYPE, sent: boolean) => void;
  setWalletClient: (walletClient: WalletClient) => void;
};

export const useStore = create<Store>((set, get) => {
  const { isKycCompleted: isKycCompletedApi, hasSentKyc: hasSentKycApi } =
    userServices();

  const { getExchangeRates } = currencyExchangeRatesService();

  const { getWalletNftsForContractAddresses } = thirdwebService();

  const inhabit = new InhabitContract();
  const ccop = new ERC20Contract(CCOP_JSON);
  const cusd = new ERC20Contract(CUSD_JSON);
  const usdc = new ERC20Contract(USDC_JSON);
  const usdt = new ERC20Contract(USDT_JSON);

  return {
    campaign: null,
    campaignLoading: true,
    campaigns: [],
    campaignsLoading: true,
    collection: null,
    collections: [],
    group: null,
    groups: [],
    groupsLoading: true,
    isKycHardCompleted: false,
    isKycSoftCompleted: false,
    hasSentKycHard: false,
    hasSentKycSoft: false,
    inhabit,
    isPollingKyc: false,
    lastCampaign: null,
    ccop,
    cusd,
    usdc,
    usdt,
    usdToCopRate: 0,
    walletsNfts: [],
    getCampaign: async (campaignId: number) => {
      return await get().inhabit.getCampaign(campaignId);
    },

    getCampaigns: async () => {
      set({ campaignsLoading: true });
      const campaigns = await get().inhabit.getCampaigns();
      const lastCampaign = campaigns[campaigns.length - 1];
      set({ campaigns, campaignsLoading: false, lastCampaign });
      return campaigns;
    },

    getGroup: async (campaignId: number, referral: Hex) => {
      return await get().inhabit.getGroup(campaignId, referral);
    },

    getIsKycCompleted: async (address: Address, kycType: KYC_TYPE) => {
      const serviceResponse = await isKycCompletedApi(address, kycType);

      if (kycType === KYC_TYPE.HARD) {
        set({ isKycHardCompleted: serviceResponse.data });
      } else if (kycType === KYC_TYPE.SOFT) {
        set({ isKycSoftCompleted: serviceResponse.data });
      } else {
        console.warn(`${ERROR.UNKNOWN_KYC_TYPE}: ${kycType}`);
      }

      return serviceResponse.data ?? false;
    },

    getHasSentKyc: async (address: Address, kycType: KYC_TYPE) => {
      const serviceResponse = await hasSentKycApi(address, kycType);

      if (kycType === KYC_TYPE.HARD) {
        set({ hasSentKycHard: serviceResponse.data });
      } else if (kycType === KYC_TYPE.SOFT) {
        set({ hasSentKycSoft: serviceResponse.data });
      } else {
        console.warn(`${ERROR.UNKNOWN_KYC_TYPE}: ${kycType}`);
      }

      return serviceResponse.data ?? false;
    },

    getUsdToCopRate: async (currencyFrom: CURRENCY, currencyTo: CURRENCY) => {
      // Fallback rate in case API fails (approximate USD to COP rate)
      const FALLBACK_USD_TO_COP_RATE = 3800;
      const isProduction = window.location.protocol === "https:";

      const cookieRateExchange = Cookies.get(VITE_COOKIE_RATE_EXCHANGE);

      // If cookie exists and has a valid value, use it
      if (cookieRateExchange) {
        const cachedRate = Number(cookieRateExchange);
        if (cachedRate > 0) {
          set({ usdToCopRate: cachedRate });
          return cachedRate;
        }
      }

      // Prevent duplicate API calls (e.g., from React Strict Mode)
      if (isExchangeRateFetching) {
        return get().usdToCopRate || FALLBACK_USD_TO_COP_RATE;
      }

      isExchangeRateFetching = true;

      try {
        const serviceResponse = await getExchangeRates(
          currencyFrom,
          currencyTo
        );

        let usdToCopRate = FALLBACK_USD_TO_COP_RATE;

        if (serviceResponse.success && serviceResponse.data) {
          usdToCopRate = serviceResponse.data;
        } else {
          console.warn(
            "⚠️ Exchange rate API failed, using fallback rate:",
            FALLBACK_USD_TO_COP_RATE
          );
        }

        // Save to cookie (shorter expiry if using fallback)
        const expiryHours = serviceResponse.success ? 24 : 1;
        const expiryDate = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

        Cookies.set(VITE_COOKIE_RATE_EXCHANGE, usdToCopRate.toString(), {
          expires: expiryDate,
          path: "/",
          sameSite: "lax",
          secure: isProduction,
        });

        set({ usdToCopRate: usdToCopRate });
        return usdToCopRate;
      } finally {
        isExchangeRateFetching = false;
      }
    },

    getWalletNfts: async (address: Address) => {
      const campaigns = get().campaigns;

      if (campaigns.length === 0) {
        set({ walletsNfts: [] });
        return [];
      }

      const collectionAddresses = campaigns
        .map((campaign) =>
          campaign.collections.map((collection) => collection.address)
        )
        .flat();

      if (collectionAddresses.length === 0) {
        set({ walletsNfts: [] });
        return [];
      }

      const serviceResponse = await getWalletNftsForContractAddresses(
        address,
        collectionAddresses,
        CHAIN.id
      );

      if (
        !serviceResponse.success ||
        !serviceResponse?.data ||
        serviceResponse?.data.length === 0
      ) {
        set({ walletsNfts: [] });
        return [];
      }

      set({ walletsNfts: serviceResponse.data });
      return serviceResponse.data;
    },

    setCampaign: (campaign: Campaign) => {
      set({ campaign, campaignLoading: false });
    },

    setCollection: (collection: Collection) => {
      set({ collection });
    },
    setCollections: (collections: Collection[]) => {
      set({ collections });
    },

    setKycSent: (kycType: KYC_TYPE, sent: boolean) => {
      if (kycType === KYC_TYPE.HARD) {
        set({ hasSentKycHard: sent });
      } else if (kycType === KYC_TYPE.SOFT) {
        set({ hasSentKycSoft: sent });
      } else {
        console.warn(`${ERROR.UNKNOWN_KYC_TYPE}: ${kycType}`);
      }
    },

    startKycPolling: async (address, requiresHardKyc) => {
      const { hasSentKycHard, isKycHardCompleted, isPollingKyc } = get();

      if (!requiresHardKyc) return;
      if (!hasSentKycHard) return;
      if (isKycHardCompleted) return;
      if (isPollingKyc) return;

      set({ isPollingKyc: true });

      const interval = setInterval(async () => {
        const isKycCompletedResult = await isKycCompletedApi(
          address,
          KYC_TYPE.HARD
        );

        const done = isKycCompletedResult.data;
        if (!done) {
          return;
        }

        clearInterval(interval);
        set({
          isPollingKyc: false,
          isKycHardCompleted: true,
        });
      }, 5000);
    },
  };
});
