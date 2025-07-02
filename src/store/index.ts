import { create } from "zustand";
import { Address, WalletClient } from "viem";
import { InhabitContract } from "../services/blockchain/contracts/inhabit";
import { UsdcContract } from "../services/blockchain/contracts/usdc";
import { UsdtContract } from "../services/blockchain/contracts/usdt";
import { Collection } from "../models/collection.model";
import { Campaign } from "../models/campaign.model";
import { userServices } from "../services/rest/user";
import { MUST_DO_KYC_HARD } from "../config/const";

type Store = {
  campaign: Campaign | null;
  campaignLoading: boolean;
  campaigns: Campaign[];
  campaignsLoading: boolean;
  collections: Collection[];
  kycHardDone: boolean;
  kycHardSent: boolean;
  inhabit: InhabitContract;
  isPollingKyc: boolean;
  usdc: UsdcContract;
  usdt: UsdtContract;
  getCampaign: (campaignId: number) => Promise<Campaign | null>;
  getCampaignCollections: (campaignId: number) => Promise<Collection[]>;
  getCampaigns: () => Promise<Campaign[]>;
  setCampaign: (campaign: Campaign) => void;
  startKycPolling: (address: Address, price: number) => void;
  setCollections: (collections: Collection[]) => void;
  setWalletClient: (walletClient: WalletClient) => void;
  setKycHardSent: (sent: boolean) => void;
};

export const useStore = create<Store>((set, get) => {
  const {
    getKycHardDone: getKycHardDoneApi,
    getHasKycHardSent: getHardSentApi,
  } = userServices();

  const inhabit = new InhabitContract();
  const usdc = new UsdcContract();
  const usdt = new UsdtContract();

  return {
    campaign: null,
    campaignLoading: true,
    campaigns: [],
    campaignsLoading: true,
    collections: [],
    kycHardDone: false,
    kycHardSent: false,
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

    setCampaign: (campaign: Campaign) => {
      set({ campaign, campaignLoading: false });
    },

    setCollections: (collections: Collection[]) => {
      set({ collections });
    },

    setKycHardSent: (sent: boolean) => {
      set({ kycHardSent: sent });
    },

    setWalletClient: (walletClient: WalletClient) => {
      get().inhabit.setWalletClient(walletClient);
    },

    startKycPolling: async (address, price) => {
      const { kycHardSent, kycHardDone, isPollingKyc } = get();

      if (!MUST_DO_KYC_HARD(price)) return;
      if (kycHardSent) return;
      if (kycHardDone) return;
      if (isPollingKyc) return;

      if (await getHardSentApi(address)) {
        set({ kycHardSent: true });
      }

      set({ isPollingKyc: true });

      const interval = setInterval(async () => {
        const response = await getKycHardDoneApi(address);
        if (response.data) {
          clearInterval(interval);
          set({
            isPollingKyc: false,
            kycHardDone: true,
          });
        }
      }, 500);
    },
  };
});
