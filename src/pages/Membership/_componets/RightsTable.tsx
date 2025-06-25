import { JSX } from "react";
import { Right } from "src/models/right.model";

type Props = {
  rights: Right[];
};

export default function RightsTable(props: Props): JSX.Element {
  const { rights } = props;

  // Helper function to render values in the table cells
  const renderCellValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto"
        >
          <rect
            x="2"
            y="2"
            width="24"
            height="24"
            rx="2"
            fill="#E2EDD3"
            stroke="#D57300"
            strokeWidth="2.5"
          />
          <path
            d="M8 14.5L12 18L20 10"
            stroke="#D57300"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto"
        >
          <rect
            x="2"
            y="2"
            width="24"
            height="24"
            rx="2"
            fill="#E2EDD3"
            stroke="#D57300"
            strokeWidth="2.5"
          />
        </svg>
      );
    }

    // Para strings, renderizar como texto o badge especial
    if (value === "Basic level contents" || value === "Medium level contents") {
      return (
        <span className="inline-block px-3 py-1 bg-[#E2EDD3] border border-green-soft text-[#1C3625] font-bold text-xs rounded-none">
          {value}
        </span>
      );
    }

    return <span>{value}</span>;
  };

  return (
    <div className="overflow-x-auto border border-green-soft bg-[#E2EDD3] shadow-md">
      <table className="min-w-full text-left">
        <thead>
          <tr className="bg-[#E2EDD3] border-b border-green-soft">
            <th className="py-4 px-6 font-montserrat font-bold text-secondary text-base tracking-wide">
              {/* Column for the type of right */}
            </th>
            <th className="py-4 px-6 font-montserrat font-bold text-secondary text-base tracking-wide">
              RIGHT DETAIL
            </th>
            <th className="py-4 px-6 font-montserrat font-bold text-secondary text-base tracking-wide text-center">
              MINIMUM FUNDRAISE
            </th>
            <th className="py-4 px-6 font-montserrat font-bold text-secondary text-base tracking-wide text-center">
              FULL FUNDRAISE
            </th>
          </tr>
        </thead>
        <tbody className="font-nunito text-secondary text-[1rem]">
          {rights.map((right, rightIndex) =>
            right.details.map((detail, detailIndex) => (
              <tr
                key={`${rightIndex}-${detailIndex}`}
                className={`${
                  detailIndex < right.details.length - 1 ||
                  rightIndex < rights.length - 1
                    ? "border-b border-green-soft"
                    : ""
                } align-top`}
              >
                {/* First column: type of right */}
                {detailIndex === 0 ? (
                  <td
                    className="py-3 px-6 font-bold align-top"
                    rowSpan={right.details.length}
                  >
                    {right.type}
                  </td>
                ) : null}

                {/* Second column: right detail */}
                <td className="py-3 px-6 align-top">
                  <span className="font-bold">{detail.title}</span>
                  {detail.description && (
                    <>
                      <br />
                      {detail.description}
                    </>
                  )}
                </td>

                {/* Third column: minimum fundraise */}
                <td className="py-3 px-6 text-center align-top">
                  {renderCellValue(detail.minimum_fundraise)}
                </td>

                {/*  Fourth column: full fundraise */}
                <td className="py-3 px-6 text-center align-top">
                  {renderCellValue(detail.full_fundraise)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
