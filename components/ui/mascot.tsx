import { useId } from 'react'

import { cn } from '@/lib/utils'

export interface MascotProps extends React.ComponentProps<'svg'> {
  /** Horizontal eye offset in SVG units (-1..1 scaled by maxEyeOffset) */
  eyeX?: number
  /** Vertical eye offset */
  eyeY?: number
  /** Mouth openness from 0 (closed) to 1 (fully open) */
  mouthOpen?: number
  /** When true the eyes are squashed shut */
  blinking?: boolean
  /** Class applied to each eye (e.g. for CSS blink animations) */
  eyeClassName?: string
}

export const MAX_EYE_OFFSET = 7

/**
 * Holographic, translucent gold "$" mascot with solid green eyes on a black
 * backdrop. Shared by IconLogo, IconBlinkingLogo and AnimatedLogo.
 */
export function Mascot({
  ref,
  eyeX = 0,
  eyeY = 0,
  mouthOpen = 0,
  blinking = false,
  eyeClassName,
  className,
  ...props
}: MascotProps) {
  const uid = useId().replace(/:/g, '')
  const gold = `mascot-gold-${uid}`
  const holo = `mascot-holo-${uid}`
  const glow = `mascot-glow-${uid}`
  const open = Math.min(1, Math.max(0, mouthOpen))
  const mouthRy = 2 + open * 12
  const eyeRy = blinking ? 1 : 12

  return (
    <svg
      ref={ref}
      viewBox="0 0 256 256"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-4', className)}
      {...props}
    >
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff2b0" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#f5b301" stopOpacity="0.85" />
          <stop offset="1" stopColor="#b8780a" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id={holo} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#7df9ff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#ff7bf5" stopOpacity="0.35" />
        </linearGradient>
        <filter id={glow} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="128" cy="128" r="128" fill="#000" />
      <g filter={`url(#${glow})`}>
        <path
          d="M128 28v200"
          stroke={`url(#${gold})`}
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M176 82c-6-14-24-22-48-22-28 0-46 12-46 32 0 44 94 24 94 70 0 20-20 34-48 34-26 0-46-10-52-28"
          fill="none"
          stroke={`url(#${gold})`}
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M176 82c-6-14-24-22-48-22-28 0-46 12-46 32 0 44 94 24 94 70 0 20-20 34-48 34-26 0-46-10-52-28"
          fill="none"
          stroke={`url(#${holo})`}
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g
        fill="#22ff66"
        style={{ transform: `translate(${eyeX}px, ${eyeY}px)` }}
        data-testid="mascot-eyes"
      >
        <ellipse
          cx="106"
          cy="112"
          rx="12"
          ry={eyeRy}
          className={eyeClassName}
        />
        <ellipse
          cx="150"
          cy="112"
          rx="12"
          ry={eyeRy}
          className={eyeClassName}
        />
      </g>
      <ellipse
        cx="128"
        cy="148"
        rx="14"
        ry={mouthRy}
        fill="#000"
        stroke="#22ff66"
        strokeWidth="3"
        data-testid="mascot-mouth"
      />
    </svg>
  )
}
