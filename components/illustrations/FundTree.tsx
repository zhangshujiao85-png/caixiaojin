export function FundTree({ className = "", size = 120 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 花盆 */}
      <ellipse cx="60" cy="105" rx="25" ry="8" fill="#C1E1C1" />
      <path
        d="M40 75 L35 105 L85 105 L80 75 Z"
        fill="#FFB5BA"
        stroke="#E89D9F"
        strokeWidth="2"
      />
      <ellipse cx="60" cy="75" rx="20" ry="5" fill="#FFDAB9" />

      {/* 树干 */}
      <path
        d="M55 75 Q52 60 55 45"
        stroke="#8B7355"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* 树枝和金币 */}
      <g className="animate-bounce" style={{ animationDuration: "2s" }}>
        {/* 左枝 */}
        <path
          d="M55 55 Q45 50 35 55"
          stroke="#8B7355"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="35" cy="55" r="5" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
        <text x="33" y="57" fontSize="6" fill="#8B7355" fontWeight="bold">￥</text>
      </g>

      <g className="animate-bounce" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}>
        {/* 右枝 */}
        <path
          d="M55 50 Q65 45 75 50"
          stroke="#8B7355"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="75" cy="50" r="5" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
        <text x="73" y="52" fontSize="6" fill="#8B7355" fontWeight="bold">￥</text>
      </g>

      <g className="animate-bounce" style={{ animationDuration: "2.3s", animationDelay: "1s" }}>
        {/* 顶部枝 */}
        <path
          d="M55 45 Q58 35 62 30"
          stroke="#8B7355"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="62" cy="30" r="6" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
        <text x="59" y="32" fontSize="7" fill="#8B7355" fontWeight="bold">￥</text>
      </g>

      {/* 树叶 */}
      <circle cx="45" cy="48" r="8" fill="#C1E1C1" opacity="0.8" />
      <circle cx="75" cy="43" r="8" fill="#C1E1C1" opacity="0.8" />
      <circle cx="60" cy="35" r="10" fill="#C1E1C1" opacity="0.8" />

      {/* 小星星装饰 */}
      <g fill="#FFF4CC">
        <circle cx="42" cy="40" r="2" className="animate-pulse" />
        <circle cx="78" cy="55" r="2" className="animate-pulse" style={{ animationDelay: "0.3s" }} />
        <circle cx="55" cy="25" r="2" className="animate-pulse" style={{ animationDelay: "0.6s" }} />
      </g>
    </svg>
  );
}
