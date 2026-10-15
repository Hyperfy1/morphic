import { useId } from 'react'

const S_PATH =
  'M166 84C166 58 90 56 90 100C90 134 166 122 166 158C166 202 88 198 88 170'

export const EYE_COLOR = '#00FF55'

/**
 * Holographic gold "$" body on a black circle. Eyes are passed as children so
 * callers can animate them.
 */
export function DollarLogoArt({
  outline = false,
  children
}: {
  outline?: boolean
  children?: React.ReactNode
}) {
  const uid = useId().replace(/:/g, '')
  const gold = `${uid}-gold`
  const holo = `${uid}-holo`
  const glow = `${uid}-glow`

  return (
    <>
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#FFF1A8" />
        </linearGradient>
        <linearGradient id={holo} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#00FFFF" />
          <stop offset="50%" stopColor="#FF00FF" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
        <filter id={glow} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="128" cy="128" r="128" fill="black" />
      <g filter={`url(#${glow})`} strokeLinecap="round" fill="none">
        {outline ? (
          <>
            <path d={S_PATH} stroke={`url(#${gold})`} strokeWidth="8" />
            <path d="M128 40V216" stroke={`url(#${gold})`} strokeWidth="8" />
          </>
        ) : (
          <>
            <g
              opacity="0.85"
              stroke={`url(#${gold})`}
              strokeWidth="26"
              className="motion-safe:animate-pulse"
            >
              <path d={S_PATH} />
              <path d="M128 40V216" strokeWidth="16" />
            </g>
            <g opacity="0.25" stroke={`url(#${holo})`} strokeWidth="10">
              <path d={S_PATH} />
              <path d="M128 40V216" strokeWidth="6" />
            </g>
          </>
        )}
      </g>
      {children}
    </>
  )
}
