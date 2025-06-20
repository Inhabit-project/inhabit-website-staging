function NatureSpinner({
  size = "lg",
  showText = true,
  text = "Loading...",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  text?: string;
}) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main Spinner */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-[#dbeab2] via-[#d57300] to-[#1c3625] animate-spin"></div>

        {/* Inner circle with gradient background */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#f6ffea] to-[#deedcb] backdrop-blur-sm border border-[#dbeab2]/30"></div>

        {/* Center dot */}
        <div className="absolute inset-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#d57300] animate-pulse"></div>

        {/* Organic floating particles */}
        <div className="absolute -top-1 left-1/2 w-1 h-1 bg-[#dbeab2] rounded-full animate-ping"></div>
        <div className="absolute top-1/2 -right-1 w-1 h-1 bg-[#d57300] rounded-full animate-ping delay-300"></div>
        <div className="absolute -bottom-1 left-1/2 w-1 h-1 bg-[#1c3625] rounded-full animate-ping delay-700"></div>
      </div>

      {/* Loading Text */}
      {showText && (
        <p
          className={`${textSizes[size]} font-nunito text-[#1c3625] animate-pulse`}
        >
          {text}
        </p>
      )}
    </div>
  );
}

type Props = {
  text?: string;
};

export default function Spinner(props: Props) {
  const { text = "" } = props;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1c3625]/15 backdrop-blur-md">
      <NatureSpinner size="xl" text={text} />
    </div>
  );
}
