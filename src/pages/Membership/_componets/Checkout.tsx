import { JSX, useEffect, useRef, useState } from "react";
import { ConnectButton } from "../../../ui/ConnectButton";
import usdcImage from "../../../assets/images/tokens/USDC.svg";
import usdtImage from "../../../assets/images/tokens/USDT.svg";
import { useTokenBalance } from "../../../hooks/useTokensBalance";
import { useAccount, useSignMessage } from "wagmi";
import { Indicator, indicators } from "../../../assets/json/form/indicators";
import { z } from "zod";
import { KYC_HARD_AMOUNT_USD } from "../../../config/const";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import privacyPolicyPDF from "../../../assets/pdf/privacy-policy.pdf";
import { useNonce } from "../../../hooks/useNonce";
import { generateSiweMessage } from "../../../utils/generate-siwe-message.util";
import { useSendKycEmail } from "../../../hooks/useKycEmail";
import { KYC_TYPE } from "../../../config/enums";
import { mapUserToUserDto } from "../../../services/mapping/mapUserToUserDto";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  membershipContract: string;
  price: number;
};

// TODO: clean form data on submit success
export function Checkout(props: Props): JSX.Element {
  const schema = z
    .object({
      firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters")
        .regex(
          /^[a-zA-Z\s]+$/,
          "First name can only contain letters and spaces"
        ),

      lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters")
        .regex(
          /^[a-zA-Z\s]+$/,
          "Last name can only contain letters and spaces"
        ),

      email: z
        .string()
        .email("Please enter a valid email address")
        .min(5, "Email must be at least 5 characters")
        .max(100, "Email must be less than 100 characters"),

      countryCode: z.string().optional(),
      cellphone: z.string().optional(),

      telegramHandle: z
        .string()
        .min(3, "Telegram handle must be at least 3 characters")
        .max(32, "Telegram handle must be less than 32 characters")
        .regex(/^@?[a-zA-Z0-9_]+$/, "Invalid telegram handle format")
        .optional()
        .or(z.literal("")),

      termsAcceptance: z
        .boolean()
        .refine(
          (val) => val === true,
          "You must accept the terms and conditions"
        ),

      MembershipAgreetment: z
        .boolean()
        .refine(
          (val) => val === true,
          "You must accept the Membership Agreement"
        ),

      kycAcceptance: z
        .boolean()
        .refine((val) => val === true, "You must accept the KYC terms"),
    })
    .superRefine((data, ctx) => {
      const { countryCode, cellphone, kycAcceptance } = data;

      if (countryCode && !cellphone) {
        ctx.addIssue({
          path: ["cellphone"],
          code: z.ZodIssueCode.custom,
          message: "Phone number is required when country is selected",
        });
      }

      if (countryCode && cellphone && !/^\d{10}$/.test(cellphone)) {
        ctx.addIssue({
          path: ["cellphone"],
          code: z.ZodIssueCode.custom,
          message: "Phone number must be 10 digits and only numbers",
        });
      }

      if (price < KYC_HARD_AMOUNT_USD && kycAcceptance !== true) {
        ctx.addIssue({
          path: ["kycAcceptance"],
          code: z.ZodIssueCode.custom,
          message: "You must accept the KYC terms",
        });
      }
    });

  type Form = z.infer<typeof schema>;

  // props
  const { membershipContract, price, setIsOpen } = props;

  // hooks
  const [selectedIndicator, setSelectedIndicator] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // external hooks
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { referral } = useParams();

  const { register, handleSubmit, setValue, watch } = useForm<Form>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const {
    usdcBalance,
    usdcAllowance,
    usdtBalance,
    usdtAllowance,
    hasSufficientBalance,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useTokenBalance(price);

  const { mutate: fetchNonce, isPending: isNoncePending } = useNonce();
  const { mutate: sendKycEmail, isPending: isKycPending } = useSendKycEmail();

  // effects
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // variables and functions
  const selectedIndicatorData = indicators.find(
    (indicator) => indicator.code === selectedIndicator
  );

  const handleIndicatorSelect = (indicator: Indicator) => {
    setSelectedIndicator(indicator.code);
    setValue("countryCode", indicator.code);
    setIsDropdownOpen(false);
  };

  const formDisabled = !address || (!hasSufficientBalance && price > 0);

  const onSubmit = (data: Form) => {
    if (!address || !chainId) return;

    fetchNonce(address, {
      onSuccess: async (nonce) => {
        if (!nonce) return;

        const message = generateSiweMessage(chainId, address, nonce);
        const signature = await signMessageAsync({ message });
        const dto = mapUserToUserDto({
          address,
          message,
          signature,
          nonce,
          kycType: price < KYC_HARD_AMOUNT_USD ? KYC_TYPE.SOFT : KYC_TYPE.HARD,
          name: data.firstName,
          lastName: data.lastName,
          email: data.email,
          indicator: data.countryCode,
          cellphone: data.cellphone,
          telegramUser: data.telegramHandle,
        });

        sendKycEmail(dto, {
          onSuccess: () => {
            alert("✅ KYC request sent successfully!");
          },

          onError: (error) => {
            console.error("❌", error);
            alert("Error sending KYC request. Please try again.");
          },
        });
      },
      onError: (error) => {
        console.error("❌", error);
        alert("Error signing message. Please try again.");
      },
    });
  };

  const onError = (formErrors: Record<string, { message?: string }>) => {
    const values = watch();
    const messages = Object.entries(formErrors)
      .filter(([key]) => {
        if (key === "cellphone") {
          return !!values.countryCode;
        }

        if (key === "kycAcceptance" && price < KYC_HARD_AMOUNT_USD) {
          return true;
        }

        return [
          "firstName",
          "lastName",
          "email",
          "termsAcceptance",
          "MembershipAgreetment",
        ].includes(key);
      })
      .map(([, error]) => error?.message)
      .filter(Boolean)
      .join("\n");

    if (messages) alert(messages);
  };

  return (
    <div className="w-full max-w-lg bg-menu-backdrop backdrop-blur-lg rounded-3xl shadow-xl border border-green-soft p-8 flex flex-col gap-6 self-start sticky top-8">
      <ConnectButton />
      {/* Form */}
      {/* TODO: add i18n for labels and placeholders */}
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <fieldset disabled={formDisabled} className="contents">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="body-S block text-secondary font-semibold mb-1">
                First Name*
              </label>
              <input
                type="text"
                className="input-main"
                placeholder="Enter your name"
                {...register("firstName")}
              />
            </div>
            <div>
              <label className="body-S block text-secondary font-semibold mb-1">
                Last Name*
              </label>
              <input
                type="text"
                className="input-main"
                placeholder="Enter your last name"
                {...register("lastName")}
              />
            </div>
          </div>
          <div>
            <label className="body-S block text-secondary font-semibold mb-1">
              E-Mail*
            </label>
            <input
              type="email"
              className="input-main"
              placeholder="your@email.com"
              {...register("email")}
            />
          </div>
          {/* Indicator + Cellphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative" ref={dropdownRef}>
              <label className="body-S block text-secondary font-semibold mb-1">
                Country Code
              </label>
              <div
                className="custom-dropdown-trigger"
                onClick={() => {
                  if (!formDisabled) setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                <div className="custom-dropdown-display">
                  {selectedIndicatorData ? (
                    <span>
                      {selectedIndicatorData.flag} {selectedIndicatorData.name}{" "}
                      ({selectedIndicatorData.code})
                    </span>
                  ) : (
                    <span className="placeholder-text">Select country</span>
                  )}
                </div>
                <div
                  className={`custom-dropdown-arrow ${
                    isDropdownOpen ? "open" : ""
                  }`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>
              {isDropdownOpen && (
                <div className="custom-dropdown-menu">
                  <div className="custom-dropdown-content">
                    {/* TODO: added no indicator option */}
                    {indicators.map((indicator: Indicator, index: number) => (
                      <div
                        key={index}
                        className={`custom-dropdown-option ${
                          formDisabled ? "pointer-events-none opacity-50" : ""
                        }`}
                        onClick={() => {
                          if (!formDisabled) handleIndicatorSelect(indicator);
                        }}
                      >
                        <span className="flag">{indicator.flag}</span>
                        <span className="country-name">{indicator.name}</span>
                        <span className="country-code">({indicator.code})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <input
                type="hidden"
                {...register("countryCode")}
                value={selectedIndicator}
              />
            </div>

            <div>
              <label className="body-S block text-secondary font-semibold mb-1">
                Cellphone
              </label>
              <input
                type="tel"
                className="input-main"
                placeholder={
                  selectedIndicatorData ? "1234567890" : "Select country first"
                }
                disabled={!selectedIndicator}
                {...register("cellphone")}
              />
            </div>
          </div>
          {/* Telegram handle */}
          <div>
            <label className="body-S block text-secondary font-semibold mb-1">
              Telegram handle
            </label>
            <input
              type="text"
              className="input-main"
              placeholder="@pepioperez"
              {...register("telegramHandle")}
            />
          </div>
          {/* Checkboxes */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="flex items-start gap-2 text-xs text-secondary">
              <input
                type="checkbox"
                className="mt-1"
                {...register("termsAcceptance")}
              />
              <span>
                I consent to the processing of my personal data in accordance
                with the{" "}
                <a
                  href={privacyPolicyPDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#D57300] hover:underline inline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </a>
              </span>
            </label>
            <label className="flex items-start gap-2 text-xs text-secondary">
              <input
                type="checkbox"
                className="mt-1"
                {...register("MembershipAgreetment")}
              />
              <span>
                I consent to adhere to the{" "}
                <button
                  type="button"
                  className="font-bold text-[#D57300] hover:underline inline normal-case"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(
                      membershipContract,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                >
                  Membership Agreement
                </button>{" "}
                and accept its terms and conditions, granting me rights and
                benefits related to this Land and Project, and acknowledge this
                action as a valid electronic signature.
              </span>
            </label>

            {price < KYC_HARD_AMOUNT_USD && (
              <label className="flex items-start gap-2 text-xs text-secondary">
                <input
                  type="checkbox"
                  className="mt-1"
                  {...register("kycAcceptance")}
                />
                I understand that I'll need to complete a KYC Verification to
                eventually fully access the rights and benefits associated with
                my membership.
              </label>
            )}
          </div>
          {/* Summary */}
          <div className="bg-green-soft/30 rounded-xl p-4 pt-0 flex flex-col gap-2 mt-2">
            <div className="flex justify-between">
              <span className="body-S text-secondary font-bold">Balance</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="body-S text-secondary">USDC</span>
              <div className="flex items-center space-x-3">
                <span className="body-S text-secondary">
                  ${usdcBalance.toFixed(2)}
                </span>
                <img
                  src={usdcImage}
                  alt="USDC"
                  className="inline-block w-9 h-9 ml-1"
                />
              </div>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="body-S text-secondary">USDT</span>
              <div className="flex items-center space-x-3">
                <span className="body-S text-secondary">
                  ${usdtBalance.toFixed(2)}{" "}
                </span>
                <img
                  src={usdtImage}
                  alt="USDC"
                  className="inline-block w-9 h-9 ml-1"
                />
              </div>
            </div>
            {/* TODO: add to i18n */}
            {/* TODO: add styles */}
            {address && !hasSufficientBalance && (
              <label className="flex justify-center p-1  text-xs text-secondary">
                "You don't have enough balance to buy this membership"
              </label>
            )}
            {/* <div className="flex justify-between text-secondary font-bold text-lg">
              <span className="body-M text-secondary">
                Total taxes included
              </span>
              <span className="body-M text-secondary">
                $ {membership.valueUSD} USD
              </span>
            </div> */}
          </div>
          <button
            className="btn-secondary w-full mt-4"
            type="submit"
            disabled={formDisabled}
          >
            Get here your NFT
          </button>
        </fieldset>
      </form>
    </div>
  );
}
