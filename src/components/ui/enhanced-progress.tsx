"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface EnhancedProgressProps {
  value?: number
  className?: string
  showLabel?: boolean
  variant?: "default" | "seo" | "aeo"
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

export function EnhancedProgress({
  value = 0,
  className,
  showLabel = true,
  variant = "default",
  size = "md",
  animated = true,
}: EnhancedProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  // Height based on size
  const heightClasses = {
    sm: "h-3",
    md: "h-5",
    lg: "h-7",
  }

  // Gradient based on variant
  const gradientClasses = {
    default: "from-[#6da7cc] via-[#7bb5d5] to-[#86c444]",
    seo: "from-[#6da7cc] via-[#7bb5d5] to-[#5c96bb]",
    aeo: "from-[#86c444] via-[#7bb538] to-[#6da033]",
  }

  // Glow color based on variant
  const glowColor = {
    default: "0 0 20px rgba(109, 167, 204, 0.4), 0 0 40px rgba(134, 196, 68, 0.2)",
    seo: "0 0 20px rgba(109, 167, 204, 0.5), 0 0 40px rgba(109, 167, 204, 0.3)",
    aeo: "0 0 20px rgba(134, 196, 68, 0.5), 0 0 40px rgba(134, 196, 68, 0.3)",
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-full",
        "bg-gradient-to-r from-gray-200/50 to-gray-300/50",
        "backdrop-blur-sm",
        "shadow-inner",
        heightClasses[size],
        className
      )}
      style={{
        boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Progress fill */}
      <div
        className={cn(
          "h-full rounded-full relative overflow-hidden",
          "bg-gradient-to-r",
          gradientClasses[variant],
          animated && "transition-all duration-700 ease-out"
        )}
        style={{
          width: `${clampedValue}%`,
          boxShadow: clampedValue > 10 ? glowColor[variant] : "none",
        }}
      >
        {/* Glossy overlay effect */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent"
          style={{
            borderRadius: "inherit",
          }}
        />

        {/* Shimmer effect */}
        {animated && clampedValue > 0 && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
            style={{
              animation: "shimmer 2s infinite",
              backgroundSize: "200% 100%",
            }}
          />
        )}

        {/* Percentage label inside bar */}
        {showLabel && clampedValue > 15 && (
          <div className="absolute inset-0 flex items-center justify-end pr-3">
            <span
              className={cn(
                "font-bold text-white drop-shadow-lg",
                size === "sm" && "text-[10px]",
                size === "md" && "text-xs",
                size === "lg" && "text-sm"
              )}
            >
              {Math.round(clampedValue)}%
            </span>
          </div>
        )}
      </div>

      {/* Percentage label outside bar (for low values) */}
      {showLabel && clampedValue <= 15 && clampedValue > 0 && (
        <div className="absolute inset-0 flex items-center justify-end pr-3">
          <span
            className={cn(
              "font-bold text-gray-600",
              size === "sm" && "text-[10px]",
              size === "md" && "text-xs",
              size === "lg" && "text-sm"
            )}
          >
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
    </div>
  )
}

// Add shimmer animation to global CSS or include it here
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
    .animate-shimmer {
      animation: shimmer 2s infinite;
    }
  `
  if (!document.querySelector('style[data-shimmer]')) {
    style.setAttribute('data-shimmer', 'true')
    document.head.appendChild(style)
  }
}
