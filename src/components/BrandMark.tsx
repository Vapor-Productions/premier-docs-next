export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="brand-mark"
    >
      <rect width="32" height="32" rx="7" fill="var(--accent)" />
      <path d="M8 21 16 9l8 12h-4.6L16 15.8 12.6 21Z" fill="#fff" />
      <path d="M12.6 24h6.8L16 19.2Z" fill="#fff" opacity="0.75" />
    </svg>
  );
}

export function BrandLockup() {
  return (
    <span className="brand-lockup">
      <BrandMark />
      <span className="brand-lockup__text">
        Premier Planner
        <span className="brand-lockup__tag">Docs</span>
      </span>
    </span>
  );
}
