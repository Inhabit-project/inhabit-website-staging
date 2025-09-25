import { create } from "zustand";
import { Address, Hex, keccak256, toBytes, WalletClient } from "viem";
import { InhabitContract } from "../services/blockchain/contracts/inhabit";
import { Collection } from "../models/collection.model";
import { Campaign } from "../models/campaign.model";
import { userServices } from "../services/rest/user";
import { ERROR, KYC_TYPE } from "../config/enums";
import { Group } from "@/models/group.model";
import { ERC20Contract } from "@/services/blockchain/contracts/erc20";
import { CCOP_JSON, CUSD_JSON, USDC_JSON, USDT_JSON } from "@/config/const";

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
  getCampaign: (campaignId: number) => Promise<Campaign | null>;
  getCampaigns: () => Promise<Campaign[]>;
  getGroup: (campaignId: number, referral: Hex) => Promise<Group | null>;
  getHasSentKyc: (address: Address, kycType: KYC_TYPE) => Promise<boolean>;
  getIsKycCompleted: (address: Address, kycType: KYC_TYPE) => Promise<boolean>;
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

    getCampaign: async (campaignId: number) => {
      return await get().inhabit.getCampaign(campaignId);
    },

    getCampaigns: async () => {
      set({ campaignsLoading: true });
      const campaigns = await get().inhabit.getCampaigns();
      console.log("campaigns", campaigns);
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
