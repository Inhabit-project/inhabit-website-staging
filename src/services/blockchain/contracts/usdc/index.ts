import {
  Address,
  WalletClient,
  createPublicClient,
  getContract,
  http,
} from "viem";
import { celoAlfajores } from "viem/chains";

import { HTTP_TRANSPORT, USDC_JSON } from "../../../../config/const";
import { formatUsdcToUsd } from "../../../../utils/usdc-format.utils";

export class UsdcContract {
  private address: Address;
  private publicClient: ReturnType<typeof createPublicClient>;
  private walletClient: WalletClient | null;

  constructor(walletClient?: WalletClient) {
    this.address = USDC_JSON.proxy as Address;

    this.publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: http(HTTP_TRANSPORT),
    });

    this.walletClient = walletClient ?? null;
  }

  setWalletClient(walletClient: WalletClient) {
    this.walletClient = walletClient;
  }

  private getReadContract() {
    return getContract({
      address: this.address,
      abi: USDC_JSON.abi,
      client: {
        public: this.publicClient,
      },
    });
  }

  private getWriteContract() {
    if (!this.walletClient) {
      throw new Error("walletClient not set. Call setWalletClient() first.");
    }

    return getContract({
      address: this.address,
      abi: USDC_JSON.abi,
      client: {
        public: this.publicClient,
        wallet: this.walletClient,
      },
    });
  }

  // =========================
  //        READ METHODS
  // =========================

  async getBalance(address: Address): Promise<number> {
    try {
      const contract = this.getReadContract();
      const balance = (await contract.read.balanceOf([address])) as bigint;
      return formatUsdcToUsd(balance);
    } catch (error) {
      console.error("❌", error);
      return 0;
    }
  }

  async allowance(owner: Address, spender: Address): Promise<number> {
    try {
      const contract = this.getReadContract();
      const allowance = (await contract.read.allowance([
        owner,
        spender,
      ])) as bigint;
      return formatUsdcToUsd(allowance);
    } catch (error) {
      console.error("❌", error);
      return 0;
    }
  }

  // =========================
  //        WRITE METHODS
  // =========================

  async approve(spender: Address, amount: bigint): Promise<string | undefined> {
    try {
      const contract = this.getWriteContract();
      const approveTx = await contract.write.approve([spender, amount]);

      await this.publicClient.waitForTransactionReceipt({
        hash: approveTx,
      });

      return approveTx;
    } catch (error) {
      console.error("❌", error);
      return undefined;
    }
  }
}
