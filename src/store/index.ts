import { create } from "zustand";
import { WalletClient } from "viem";
import { InhabitContract } from "../services/blockchain/contracts/inhabit";
import { UsdcContract } from "../services/blockchain/contracts/usdc";
import { UsdtContract } from "../services/blockchain/contracts/usdt";
import { Collection } from "src/models/collection.model";
import { Campaign } from "src/models/campaign.model";

type Store = {
  campaign: Campaign | null;
  campaignLoading: boolean;
  campaigns: Campaign[];
  campaignsLoading: boolean;
  collections: Collection[];
  inhabit: InhabitContract;
  usdc: UsdcContract;
  usdt: UsdtContract;
  getCampaign: (campaignId: number) => Promise<Campaign | null>;
  getCampaignCollections: (campaignId: number) => Promise<Collection[]>;
  getCampaigns: () => Promise<Campaign[]>;
  setCampaign: (campaign: Campaign) => void;
  setCollections: (collections: Collection[]) => void;
  setWalletClient: (walletClient: WalletClient) => void;
};

export const useStore = create<Store>((set, get) => {
  const inhabit = new InhabitContract();
  const usdc = new UsdcContract();
  const usdt = new UsdtContract();

  return {
    campaign: null,
    campaignLoading: true,
    campaigns: [],
    campaignsLoading: true,
    collections: [],
    inhabit,
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

    setWalletClient: (walletClient: WalletClient) => {
      get().inhabit.setWalletClient(walletClient);
    },
  };
});
