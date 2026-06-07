export function GrowthDeskLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rounded square background */}
      <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />

      {/* Bar chart — growth bars */}
      <rect x="5" y="18" width="4" height="9" rx="1.5" fill="white" opacity="0.6" />
      <rect x="11" y="13" width="4" height="14" rx="1.5" fill="white" opacity="0.8" />
      <rect x="17" y="8" width="4" height="19" rx="1.5" fill="white" />

      {/* Upward trend sparkle dot */}
      <circle cx="25.5" cy="6.5" r="2.5" fill="white" opacity="0.9" />
      {/* Trend line connecting bars to dot */}
      <path
        d="M7 21 L13 16 L19 11 L25.5 6.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}
