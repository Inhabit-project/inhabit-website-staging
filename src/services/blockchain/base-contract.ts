import {
  Abi,
  Address,
  WalletClient,
  createPublicClient,
  getContract,
  http,
} from "viem";

import { estimateFeesPerGas } from "viem/actions";
import { CHAIN, HTTP_TRANSPORT } from "@/config/const";

export class BaseContract {
  private address: Address;
  private abi: Abi;
  private publicClient: ReturnType<typeof createPublicClient>;
  private walletClient: WalletClient | null;

  constructor(contractJson: any, walletClient?: WalletClient) {
    this.address = contractJson.proxy as Address;
    this.abi = contractJson.abi;

    this.publicClient = createPublicClient({
      chain: CHAIN,
      transport: http(HTTP_TRANSPORT),
    });

    this.walletClient = walletClient ?? null;
  }

  // =========================
  //         GETTERS
  // =========================

  public getAddress() {
    if (!this.address) {
      throw new Error("Contract address not set. Please set it first.");
    }
    return this.address;
  }

  public getPublicClient() {
    return this.publicClient;
  }

  public getWalletClient() {
    return this.walletClient;
  }

  // =========================
  //         SETTERS
  // =========================

  public setWalletClient(walletClient: WalletClient) {
    this.walletClient = walletClient;
  }

  // =========================
  //       PUBLIC METHODS
  // =========================

  // =========================
  //     PROTECTED METHODS
  // =========================

  protected async getFees() {
    if (!this.walletClient) {
      throw new Error("walletClient not set. Call setWalletClient() first.");
    }

    return await estimateFeesPerGas(this.walletClient);
  }

  protected getReadContract() {
    return getContract({
      address: this.address,
      abi: this.abi,
      client: {
        public: this.publicClient,
      },
    });
  }

  protected getWriteContract() {
    if (!this.walletClient) {
      throw new Error("walletClient not set. Call setWalletClient() first.");
    }

    return getContract({
      address: this.address,
      abi: this.abi,
      client: {
        public: this.publicClient,
        wallet: this.walletClient,
      },
    });
  }
}
