import {
  Address,
  WalletClient,
  createPublicClient,
  getContract,
  http,
} from "viem";
import { celoAlfajores } from "viem/chains";

import { HTTP_TRANSPORT, USDT_JSON } from "../../../../config/const";
import {
  formatUsdcToUsd,
  parseUsdToUsdc,
} from "../../../../utils/usdc-format.utils";
import { estimateFeesPerGas } from "viem/actions";

export class UsdtContract {
  private address: Address;
  private publicClient: ReturnType<typeof createPublicClient>;
  private walletClient: WalletClient | null;

  constructor(walletClient?: WalletClient) {
    this.address = USDT_JSON.proxy as Address;

    this.publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: http(HTTP_TRANSPORT),
    });

    this.walletClient = walletClient ?? null;
  }

  setWalletClient(walletClient: WalletClient) {
    this.walletClient = walletClient;
  }

  getAddress() {
    if (!this.address) {
      throw new Error("Contract address not set. Please set it first.");
    }
    return this.address;
  }

  private getReadContract() {
    return getContract({
      address: this.address,
      abi: USDT_JSON.abi,
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
      abi: USDT_JSON.abi,
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

  async approve(spender: Address, amount: number): Promise<string | undefined> {
    try {
      const contract = this.getWriteContract();
      const fees = await estimateFeesPerGas(this.publicClient);
      const approveTx = await contract.write.approve(
        [spender, parseUsdToUsdc(amount)],
        {
          maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
          maxFeePerGas: fees.maxFeePerGas,
        }
      );

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
