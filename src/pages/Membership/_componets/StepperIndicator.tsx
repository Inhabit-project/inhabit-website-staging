type Props = {
  step: 1 | 2;
};

export function StepperIndicator(props: Props): JSX.Element {
  const { step } = props;
  return (
    <ol className="flex flex-row items-center justify-center space-x-9">
      <li
        className={`flex items-center ${
          step === 1 ? "text-secondary" : "text-secondary/40"
        } space-x-2.5 rtl:space-x-reverse`}
      >
        <span
          className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0`}
          style={
            step === 1
              ? {
                  background: "var(--color-green-soft)",
                  color: "var(--color-secondary)",
                  border: "1px solid var(--color-green-soft)",
                }
              : {
                  border: "1px solid var(--color-secondary)",
                  color: "var(--color-secondary)",
                  opacity: 0.4,
                }
          }
        >
          1
        </span>
      </li>
      <li
        className={`flex items-center ${
          step === 2 ? "text-secondary" : "text-secondary/40"
        } space-x-2.5 rtl:space-x-reverse`}
      >
        <span
          className="flex items-center justify-center w-8 h-8 border rounded-full shrink-0"
          style={
            step === 2
              ? {
                  background: "var(--color-green-soft)",
                  color: "var(--color-secondary)",
                  border: "1px solid var(--color-green-soft)",
                }
              : {
                  border: "1px solid var(--color-secondary)",
                  color: "var(--color-secondary)",
                  opacity: 0.4,
                }
          }
        >
          2
        </span>
      </li>
    </ol>
  );
}
