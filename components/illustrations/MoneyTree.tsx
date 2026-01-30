export function MoneyTree({ className = "", size = 120 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Trunk */}
      <path d="M55 100 Q60 80 58 60" stroke="#C1E1C1" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M58 70 Q50 65 45 68" stroke="#C1E1C1" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M58 80 Q66 75 72 78" stroke="#C1E1C1" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Leaves */}
      <ellipse cx="60" cy="35" rx="25" ry="20" fill="#C1E1C1" opacity="0.8" />
      <ellipse cx="45" cy="45" rx="15" ry="12" fill="#C1E1C1" opacity="0.7" />
      <ellipse cx="75" cy="45" rx="15" ry="12" fill="#C1E1C1" opacity="0.7" />
      <ellipse cx="50" cy="25" rx="12" ry="10" fill="#C1E1C1" opacity="0.6" />
      <ellipse cx="70" cy="25" rx="12" ry="10" fill="#C1E1C1" opacity="0.6" />

      {/* Coins hanging from tree */}
      <g className="animate-bounce" style={{ animationDuration: "2s" }}>
        <ellipse cx="45" cy="60" rx="6" ry="5" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
        <text x="42" y="62" fontSize="5" fill="#8B7355" fontWeight="bold">￥</text>
      </g>

      <g className="animate-bounce" style={{ animationDuration: "2.5s", animationDelay: "0.3s" }}>
        <ellipse cx="75" cy="55" rx="6" ry="5" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
        <text x="72" y="57" fontSize="5" fill="#8B7355" fontWeight="bold">￥</text>
      </g>

      <g className="animate-bounce" style={{ animationDuration: "3s", animationDelay: "0.6s" }}>
        <ellipse cx="60" cy="65" rx="7" ry="6" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
        <text x="56" y="68" fontSize="6" fill="#8B7355" fontWeight="bold">￥</text>
      </g>

      {/* Small hearts */}
      <g fill="#FFB5BA" opacity="0.5">
        <path
          d="M30 35 Q31 33 33 35 Q35 37 33 39 L31 41 L29 39 Q27 37 29 35 Z"
          className="animate-pulse"
        />
        <path
          d="M90 30 Q91 28 93 30 Q95 32 93 34 L91 36 L89 34 Q87 32 89 30 Z"
          className="animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </g>

      {/* Ground */}
      <ellipse cx="60" cy="105" rx="30" ry="8" fill="#C1E1C1" opacity="0.3" />
    </svg>
  );
}
