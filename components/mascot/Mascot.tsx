import type { MascotState, MouthShape } from '@/lib/contracts/mascot'
import { cn } from '@/lib/utils'

const MOUTH_PATHS: Record<MouthShape, string> = {
  closed: 'M108 180 Q128 184 148 180',
  small: 'M114 178 Q128 190 142 178',
  wide: 'M100 176 Q128 206 156 176 Z',
  round: 'M118 176 Q128 200 138 176 Q128 170 118 176 Z'
}

const MAX_PUPIL_OFFSET = 8

/** Pure presentational mascot: renders exactly what MascotState says. */
export function Mascot({
  state,
  className,
  ...props
}: React.ComponentProps<'svg'> & { state: MascotState }) {
  const dx = state.gaze.x * MAX_PUPIL_OFFSET
  const dy = state.gaze.y * MAX_PUPIL_OFFSET
  return (
    <svg
      viewBox="0 0 256 256"
      role="img"
      aria-label={`Assistant mascot, ${state.mode}`}
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-8', className)}
      {...props}
    >
      <circle cx="128" cy="128" r="128" fill="black" />
      <g transform={`translate(${dx} ${dy})`}>
        <ellipse cx="102" cy="112" rx="18" ry="18" fill="white" />
        <ellipse cx="154" cy="112" rx="18" ry="18" fill="white" />
      </g>
      <path
        d={MOUTH_PATHS[state.mouth]}
        fill={state.mouth === 'closed' ? 'none' : 'white'}
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  )
}
