import React, { JSX, useRef, useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

import { DOMAIN, SIWE_MESSAGE } from "../../../config/const";
import { User } from "../../../models/user.model";
// import { accountsService } from "@/services/rest/account";
// import { authService } from "@/services/rest/auth";
// import { useStore } from "../../../store";
import { checksumAddress, Hex, isAddress } from "viem";
type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
import logoWhite from "/assets/logo-foundation-blanco.svg";

export function Modal(props: Props): JSX.Element {
  // props
  const { isOpen, setIsOpen } = props;
  // hooks
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // external hooks
  const { address, chainId } = useAccount();
  // const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  // store
  // const fetchUser = useStore((state) => state.fetchUser);

  // services
  // const { getNonce } = accountsService();
  // const { login } = authService();
  const signMessage = async () => {
    setIsLoading(true);

    if (!chainId || !address || !isAddress(address)) {
      // TODO: Handle error with toast or notification
      throw new Error("Invalid wallet address or chainId");
    }

    try {
      // const nonce: string | null = await getNonce(address);

      // if (!nonce) {
      //   throw new Error("Error fetching nonce");
      // }

      const issuedAt: string = new Date().toISOString();

      const siweMessage = new SiweMessage({
        ...SIWE_MESSAGE,
        address: checksumAddress(address),
        chainId,
        // nonce,
        issuedAt,
        domain: DOMAIN,
      });

      const message: string = siweMessage.prepareMessage();

      const signature: Hex = await signMessageAsync({ message });

      const user: User = {
        address,
        nonce: "1", // nonce,
        message,
        signature,
      };

      // const response: string | null = await login(user);

      // if (!response) {
      //   throw new Error("Error logging in");
      // }

      // fetchUser(address);

      // TODO: Handle response
      setIsOpen(false);
    } catch (error) {
      console.error("❌", error);
      // TODO: Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    // disconnect();
    setIsOpen(false);
  };

  return (
    <dialog
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      open={isOpen}
      ref={modalRef}
    >
      {/* Backdrop con blur siguiendo la estética del proyecto */}
      <div
        className="fixed inset-0 bg-[#1c3625]/15 backdrop-blur-md"
        onClick={closeModal}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md mx-4">
        {/* Modal Content con gradiente y blur del proyecto */}
        <div className="relative bg-gradient-to-br from-[#f6ffea]/95 via-[#f6ffea]/98 to-[#deedcb]/95 backdrop-blur-lg rounded-3xl border-2 border-[#dbeab2] shadow-xl overflow-hidden">
          {/* Decorative top gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#dbeab2] via-[#d57300] to-[#1c3625]"></div>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <img
                src={logoWhite}
                alt="Foundation Logo"
                className="w-32 h-32 filter drop-shadow-lg"
              />
            </div>

            {/* Title - usando tipografía del proyecto */}
            <h3 className="mb-6 heading-4 text-[#1c3625]">
              Verify your account
            </h3>

            {/* Description - usando body text del proyecto */}
            <p className="mb-8 body-S text-[#1c3625]/80 leading-relaxed">
              To finish connecting, you must sign a message in your wallet to
              verify that you are the owner of this account
            </p>

            {/* Buttons Container */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Primary Button - Sign Message */}
              <button
                onClick={signMessage}
                disabled={isLoading}
                className="btn-primary-n w-full sm:w-auto min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    Waiting...
                  </span>
                ) : (
                  "Sign message"
                )}
              </button>

              {/* Secondary Button - Cancel */}
              <button
                onClick={closeModal}
                disabled={isLoading}
                className="btn-secondary w-full sm:w-auto min-w-[120px] disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            {/* Additional info text */}
            <p className="mt-6 text-xs font-nunito text-[#1c3625]/60 leading-relaxed">
              This signature will not trigger any blockchain transaction or cost
              any gas fees
            </p>
          </div>
        </div>
      </div>
    </dialog>
  );
}
