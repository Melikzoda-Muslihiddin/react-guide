export function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0e2230" />
      <g fill="none" stroke="#61dafb" strokeWidth="3">
        <ellipse cx="32" cy="32" rx="22" ry="8.5" />
        <ellipse cx="32" cy="32" rx="22" ry="8.5" transform="rotate(60 32 32)" />
        <ellipse cx="32" cy="32" rx="22" ry="8.5" transform="rotate(120 32 32)" />
      </g>
      <circle cx="32" cy="32" r="4.5" fill="#61dafb" />
    </svg>
  )
}
