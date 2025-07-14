import { create } from "zustand";
import { Address, keccak256, toBytes, WalletClient } from "viem";
import { InhabitContract } from "../services/blockchain/contracts/inhabit";
import { UsdcContract } from "../services/blockchain/contracts/usdc";
import { UsdtContract } from "../services/blockchain/contracts/usdt";
import { Collection } from "../models/collection.model";
import { Campaign } from "../models/campaign.model";
import { userServices } from "../services/rest/user";
import { ERROR, KYC_TYPE } from "../config/enums";
import { Group } from "@/models/group.model";

type Store = {
  campaign: Campaign | null;
  campaignLoading: boolean;
  campaigns: Campaign[];
  campaignsLoading: boolean;
  collection: Collection | null;
  collections: Collection[];
  groups: Group[];
  groupsLoading: boolean;
  isKycHardCompleted: boolean;
  isKycSoftCompleted: boolean;
  hasSentKycHard: boolean;
  hasSentKycSoft: boolean;
  inhabit: InhabitContract;
  isPollingKyc: boolean;
  usdc: UsdcContract;
  usdt: UsdtContract;
  getCampaign: (campaignId: number) => Promise<Campaign | null>;
  getCampaignCollections: (campaignId: number) => Promise<Collection[]>;
  getCampaigns: () => Promise<Campaign[]>;
  getGroups: () => Promise<Group[]>;
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
  const usdc = new UsdcContract();
  const usdt = new UsdtContract();

  return {
    campaign: null,
    campaignLoading: true,
    campaigns: [],
    campaignsLoading: true,
    collection: null,
    collections: [],
    groups: [],
    groupsLoading: true,
    isKycHardCompleted: false,
    isKycSoftCompleted: false,
    hasSentKycHard: false,
    hasSentKycSoft: false,
    inhabit,
    isPollingKyc: false,
    usdc,
    usdt,

    getCampaign: async (campaignId: number) => {
      set({ campaignLoading: true });
      const campaign = await get().inhabit.getCampaign(campaignId);
      set({ campaign, campaignLoading: false });
      return campaign;
    },

    getCampaignCollections: async (campaignId: number) => {
      const collections = await get().inhabit.getCampaignCollections(
        campaignId
      );
      set({ collections });
      return collections;
    },

    getCampaigns: async () => {
      set({ campaignsLoading: true });
      const campaigns = await get().inhabit.getCampaigns();
      set({ campaigns, campaignsLoading: false });
      return campaigns;
    },

    isCampaignReferral: async (campaignId: number, referral: string) => {
      const referralEncripted = keccak256(toBytes(referral));
      return await get().inhabit.isCampaignReferralSupported(
        campaignId,
        referralEncripted
      );
    },

    getGroups: async () => {
      set({ groupsLoading: true });
      const groups = await get().inhabit.getGroups();
      set({ groups });
      return groups;
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

    setWalletClient: (walletClient: WalletClient) => {
      get().inhabit.setWalletClient(walletClient);
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
      }, 500);
    },
  };
});
