export function CoinStack({ className = "", size = 80 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 金币堆叠 */}
      <g className="animate-bounce" style={{ animationDuration: "2s" }}>
        {/* 底部金币 */}
        <ellipse cx="40" cy="65" rx="25" ry="8" fill="#FFA500" />
        <ellipse cx="40" cy="63" rx="25" ry="8" fill="#FFD700" />
        <ellipse cx="40" cy="63" rx="20" ry="6" fill="#FFB347" />
        <text x="35" y="65" fontSize="10" fill="#8B7355" fontWeight="bold">￥</text>

        {/* 中间金币 */}
        <ellipse cx="40" cy="50" rx="25" ry="8" fill="#FFA500" />
        <ellipse cx="40" cy="48" rx="25" ry="8" fill="#FFD700" />
        <ellipse cx="40" cy="48" rx="20" ry="6" fill="#FFB347" />
        <text x="35" y="50" fontSize="10" fill="#8B7355" fontWeight="bold">￥</text>

        {/* 顶部金币 */}
        <ellipse cx="40" cy="35" rx="25" ry="8" fill="#FFA500" />
        <ellipse cx="40" cy="33" rx="25" ry="8" fill="#FFD700" />
        <ellipse cx="40" cy="33" rx="20" ry="6" fill="#FFB347" />
        <text x="35" y="35" fontSize="10" fill="#8B7355" fontWeight="bold">￥</text>

        {/* 最顶上的金币（稍微倾斜） */}
        <ellipse cx="40" cy="18" rx="20" ry="7" fill="#FFA500" opacity="0.8" />
        <ellipse cx="40" cy="17" rx="20" ry="7" fill="#FFD700" />
        <ellipse cx="40" cy="17" rx="16" ry="5" fill="#FFB347" />
        <text x="36" y="19" fontSize="8" fill="#8B7355" fontWeight="bold">￥</text>
      </g>

      {/* 闪光效果 */}
      <g fill="#FFF4CC" className="animate-pulse">
        <circle cx="15" cy="25" r="2" />
        <circle cx="65" cy="15" r="2" style={{ animationDelay: "0.3s" }} />
        <circle cx="68" cy="45" r="1.5" style={{ animationDelay: "0.5s" }} />
        <circle cx="12" cy="60" r="1.5" style={{ animationDelay: "0.7s" }} />
      </g>

      {/* 小星星 */}
      <path
        d="M72 30 L74 28 L76 30 L74 32 Z"
        fill="#FFD700"
        className="animate-pulse"
        style={{ animationDelay: "0.2s" }}
      />
    </svg>
  );
}
