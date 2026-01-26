export function PiggyBankGirl({ className = "", size = 120 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 身体（存钱罐） */}
      <ellipse cx="60" cy="70" rx="35" ry="30" fill="#FFB5BA" />
      <ellipse cx="60" cy="70" rx="32" ry="27" fill="#FFDAB9" />

      {/* 高光 */}
      <ellipse cx="50" cy="60" rx="8" ry="5" fill="white" opacity="0.5" />

      {/* 猪耳朵 */}
      <ellipse cx="35" cy="50" rx="8" ry="10" fill="#FFB5BA" />
      <ellipse cx="35" cy="50" rx="5" ry="7" fill="#FFDAB9" />
      <ellipse cx="85" cy="50" rx="8" ry="10" fill="#FFB5BA" />
      <ellipse cx="85" cy="50" rx="5" ry="7" fill="#FFDAB9" />

      {/* 猪鼻子 */}
      <ellipse cx="60" cy="72" rx="10" ry="8" fill="#FFB5BA" />
      <circle cx="56" cy="72" r="3" fill="#E89D9F" />
      <circle cx="64" cy="72" r="3" fill="#E89D9F" />

      {/* 眼睛 */}
      <circle cx="48" cy="60" r="5" fill="white" />
      <circle cx="48" cy="60" r="3" fill="#333" />
      <circle cx="49" cy="59" r="1" fill="white" />

      <circle cx="72" cy="60" r="5" fill="white" />
      <circle cx="72" cy="60" r="3" fill="#333" />
      <circle cx="73" cy="59" r="1" fill="white" />

      {/* 腮红 */}
      <ellipse cx="40" cy="68" rx="6" ry="4" fill="#FFB5BA" opacity="0.6" />
      <ellipse cx="80" cy="68" rx="6" ry="4" fill="#FFB5BA" opacity="0.6" />

      {/* 蝴蝶结 */}
      <path d="M30 45 L25 40 L30 45 L35 40 Z" fill="#E0CCFF" />
      <circle cx="30" cy="45" r="3" fill="#E0CCFF" />
      <path d="M25 43 Q30 45 25 47" fill="#D4B3FF" />
      <path d="M35 43 Q30 45 35 47" fill="#D4B3FF" />

      {/* 腿 */}
      <rect x="40" y="95" width="8" height="12" rx="4" fill="#FFB5BA" />
      <rect x="72" y="95" width="8" height="12" rx="4" fill="#FFB5BA" />

      {/* 投币口 */}
      <rect x="52" y="45" width="16" height="6" rx="3" fill="#C1E1C1" />

      {/* 金币（正在投入） */}
      <g className="animate-bounce" style={{ animationDuration: "1.5s" }}>
        <ellipse cx="60" cy="38" rx="7" ry="5" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
        <text x="57" y="40" fontSize="6" fill="#8B7355" fontWeight="bold">￥</text>
      </g>

      {/* 小爱心装饰 */}
      <g fill="#FFB5BA" opacity="0.6">
        <path
          d="M95 55 Q97 53 99 55 Q101 57 99 59 L97 61 L95 59 Q93 57 95 55 Z"
          className="animate-pulse"
        />
        <path
          d="M25 80 Q27 78 29 80 Q31 82 29 84 L27 86 L25 84 Q23 82 25 80 Z"
          className="animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </g>
    </svg>
  );
}
