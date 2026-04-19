import { cn } from "@/lib/utils";

interface AdjustmentsProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

export function Adjustments({
  size = 16,
  color = "currentColor",
  className,
  ...props
}: AdjustmentsProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
      {...props}
    >
      {/* Left line */}
      <line
        x1="5"
        y1="3"
        x2="5"
        y2="21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="5" cy="14" r="2.5" stroke={color} strokeWidth="2" fill="white" />

      {/* Center line */}
      <line
        x1="12"
        y1="3"
        x2="12"
        y2="21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="8" r="2.5" stroke={color} strokeWidth="2" fill="white" />

      {/* Right line */}
      <line
        x1="19"
        y1="3"
        x2="19"
        y2="21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="19" cy="14" r="2.5" stroke={color} strokeWidth="2" fill="white" />
    </svg>
  );
}
