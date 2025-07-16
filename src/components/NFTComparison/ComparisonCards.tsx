import React, { useMemo, useState, JSX } from "react";
import { Campaign } from "@/models/campaign.model";
import { RightType } from "@/models/right.model";
import { Collection } from "@/models/collection.model";

type FundLevel = "min" | "full";

interface FeatureRow {
  category: RightType;
  label: string;
  description?: string;
  values: Record<string, Record<FundLevel, boolean | string>>;
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block align-middle"
    >
      <rect width="20" height="20" rx="4" fill="#D57300" />
      <path
        d="M6 10.5L9 13.5L14 8.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function EmptyCheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block align-middle"
    >
      <rect
        width="20"
        height="20"
        rx="4"
        fill="#1c3625"
        stroke="#D57300"
        strokeWidth="2"
      />
    </svg>
  );
}

type Props = { campaign: Campaign };

export function ComparisonCards({ campaign }: Props): JSX.Element {
  const categoryOrder: RightType[] = [
    "LAND RIGHT",
    "GOVERNANCE RIGHT",
    "ART RIGHT",
    "MONITORING RIGHT",
    "UTILITY RIGHTS",
    "EDUCATION RIGHT",
    "ASSET RIGHT",
  ];

  const packages = useMemo(
    () => campaign.collections.map((c) => c.symbol.toUpperCase()), // o c.name
    [campaign]
  );

  const features: FeatureRow[] = useMemo(() => {
    const map = new Map<string, FeatureRow>();

    campaign.collections.forEach((col: Collection) => {
      const pkg = col.symbol.toUpperCase(); // misma clave que en packages

      col.rights.forEach((right) => {
        right.details.forEach((detail) => {
          const key = `${right.type}|${detail.title}`; // id único de fila

          if (!map.has(key)) {
            map.set(key, {
              category: right.type,
              label: detail.title,
              description: detail.description,
              values: {}, // se llenará debajo
            });
          }

          map.get(key)!.values[pkg] = {
            min: detail.minimum_fundraise,
            full: detail.full_fundraise,
          };
        });
      });
    });

    const result = Array.from(map.values());
    result.sort(
      (a, b) =>
        categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    );

    return result;
  }, [campaign]);

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  let lastCategory = "";

  return (
    <div className="overflow-x-auto pb-4 min-w-fit">
      {/* Header row */}
      <div className="flex bg-[#1a2b14] text-white font-bold text-base border-b border-white/10">
        {/* sticky blank cell */}
        <div
          className="px-4 py-3 border-r border-white/10 bg-[#1c3625] sticky left-0 z-10"
          style={{ width: "clamp(140px,45vw,220px)" }}
        />
        {packages.map((pkg) => (
          <div
            key={pkg}
            className="flex flex-col flex-1 min-w-[220px] border-r border-white/10 last:border-r-0"
          >
            <div className="text-center py-2 border-b border-white/10">
              {pkg}
            </div>
            <div className="flex">
              <div className="w-1/2 text-xs text-white/80 py-1 text-center border-r border-white/10">
                MINIMUM
                <br />
                FUNDRAISE
              </div>
              <div className="w-1/2 text-xs text-white/80 py-1 text-center">
                FULL
                <br />
                FUNDRAISE
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature rows */}
      {features.map((feature, idx) => {
        const showCategory = feature.category !== lastCategory;
        lastCategory = feature.category;
        const hasDescription = !!feature.description;
        const isOpen = openIdx === idx;

        return (
          <React.Fragment key={`${feature.category}-${feature.label}`}>
            {showCategory && (
              <div className="flex bg-white/5 font-bold text-white uppercase tracking-wide border-b border-white/10">
                <div className="w-full px-4 py-2">{feature.category}</div>
              </div>
            )}

            <div className="flex border-b border-white/10">
              {/* sticky label cell */}
              <div
                className="px-4 py-3 border-r border-white/10 bg-[#1a2b14] sticky left-0 z-10"
                style={{ width: "clamp(140px,45vw,220px)" }}
              >
                <div className="flex items-start gap-2">
                  <span className="font-bold text-white text-sm">
                    {feature.label}
                  </span>
                  {hasDescription && (
                    <button
                      className="text-white/70 hover:text-white focus:outline-none"
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      aria-label={isOpen ? "Hide" : "Show"}
                    >
                      <span
                        className={`inline-block transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      >
                        ▶
                      </span>
                    </button>
                  )}
                </div>
                {hasDescription && isOpen && (
                  <div className="mt-1 text-white/80 text-xs bg-[#232323] rounded p-2 border border-white/10">
                    {feature.description}
                  </div>
                )}
              </div>

              {/* Data cells */}
              <div className="flex flex-1">
                {packages.map((pkg) => (
                  <div
                    key={pkg}
                    className="flex flex-1 min-w-[220px] border-r border-white/10 last:border-r-0"
                  >
                    {(["min", "full"] as const).map((fund) => {
                      const val = feature.values[pkg]?.[fund];
                      return (
                        <div
                          key={fund}
                          className="w-1/2 flex items-center justify-center py-3"
                        >
                          {val === true ? (
                            <CheckIcon />
                          ) : val === false || val === undefined ? (
                            <EmptyCheckIcon />
                          ) : (
                            <span className="font-semibold text-white text-sm">
                              {val}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
