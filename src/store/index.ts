import { create } from "zustand";
import { WalletClient } from "viem";
import { InhabitContract } from "../services/blockchain/contracts/inhabit";
import { Collection } from "src/models/collection.model";
import { Campaign } from "src/models/campaign.model";

type Store = {
  inhabit: InhabitContract;
  getCampaign: (campaignId: number) => Promise<Campaign>;
  getCampaignCollections: (campaignId: number) => Promise<Collection[]>;

  campaign: Campaign | null;
  collections: Collection[];

  setCampaign: (campaign: Campaign) => void;
  setCollections: (collections: Collection[]) => void;
  setWalletClient: (walletClient: WalletClient) => void;
};

export const useStore = create<Store>((set, get) => {
  const inhabit = new InhabitContract();

  return {
    inhabit,
    campaign: null,
    collections: [],

    getCampaign: async (campaignId: number) => {
      const campaign = await get().inhabit.getCampaign(campaignId);
      set({ campaign });
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
