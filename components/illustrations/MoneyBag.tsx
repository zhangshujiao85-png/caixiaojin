export function MoneyBag({ className = "", size = 100 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 袋子绳子 */}
      <path
        d="M35 30 L35 20 Q50 15 65 20 L65 30"
        stroke="#FFB5BA"
        strokeWidth="4"
        fill="none"
      />
      <circle cx="50" cy="18" r="4" fill="#FFD700" />

      {/* 袋子主体 */}
      <path
        d="M30 30 Q25 40 25 55 Q25 80 50 85 Q75 80 75 55 Q75 40 70 30 Z"
        fill="#FFB5BA"
      />
      <path
        d="M32 32 Q28 42 28 55 Q28 78 50 82 Q72 78 72 55 Q72 42 68 32 Z"
        fill="#FFDAB9"
      />

      {/* 高光 */}
      <ellipse cx="40" cy="45" rx="8" ry="5" fill="white" opacity="0.4" />

      {/* 金币符号 */}
      <text
        x="50"
        y="60"
        fontSize="28"
        fill="#FFB5BA"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        ￥
      </text>

      {/* 闪光效果 */}
      <g className="animate-pulse">
        <path
          d="M20 40 L22 38 L24 40 L22 42 Z"
          fill="#FFD700"
        />
        <path
          d="M78 50 L80 48 L82 50 L80 52 Z"
          fill="#FFD700"
        />
        <circle cx="30" cy="70" r="2" fill="#FFF4CC" />
        <circle cx="70" cy="70" r="2" fill="#FFF4CC" />
      </g>

      {/* 小星星 */}
      <g fill="#FFF4CC" opacity="0.8">
        <circle cx="18" cy="55" r="1.5" className="animate-pulse" />
        <circle cx="82" cy="40" r="1.5" className="animate-pulse" style={{ animationDelay: "0.3s" }} />
      </g>
    </svg>
  );
}
