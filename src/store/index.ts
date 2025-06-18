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
  collections: Collection[];
  inhabit: InhabitContract;
  usdc: UsdcContract;
  usdt: UsdtContract;
  getCampaign: (campaignId: number) => Promise<Campaign>;
  getCampaignCollections: (campaignId: number) => Promise<Collection[]>;
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

    setCampaign: (campaign: Campaign) => {
      set({ campaign });
    },

    setCollections: (collections: Collection[]) => {
      set({ collections });
    },

    setWalletClient: (walletClient: WalletClient) => {
      get().inhabit.setWalletClient(walletClient);
    },
  };
});
