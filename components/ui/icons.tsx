'use client'

import { cn } from '@/lib/utils'

import { DollarLogoArt, EYE_COLOR } from './dollar-logo'

function IconLogo({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 256 256"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-4', className)}
      {...props}
    >
      <DollarLogoArt>
        <circle cx="102" cy="128" r="18" fill={EYE_COLOR}></circle>
        <circle cx="154" cy="128" r="18" fill={EYE_COLOR}></circle>
      </DollarLogoArt>
    </svg>
  )
import { AnimatedLogo } from './animated-logo'
import { Mascot } from './mascot'

function IconLogo({ className, ...props }: React.ComponentProps<'svg'>) {
  return <Mascot className={cn('size-4', className)} {...props} />
}

function IconLogoOutline({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 256 256"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-4', className)}
      {...props}
    >
      <DollarLogoArt outline>
        <circle
          cx="128"
          cy="128"
          r="120"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
        ></circle>
        <circle cx="102" cy="128" r="18" fill={EYE_COLOR}></circle>
        <circle cx="154" cy="128" r="18" fill={EYE_COLOR}></circle>
      </DollarLogoArt>
    </svg>
  )
}

function IconBlinkingLogo({
  className,
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <AnimatedLogo
      animate={false}
      className={cn('size-4', className)}
      {...props}
    >
      <DollarLogoArt>
        <ellipse
          cx="102"
          cy="128"
          rx="18"
          ry="18"
          fill={EYE_COLOR}
          className="blink"
        ></ellipse>
        <ellipse
          cx="154"
          cy="128"
          rx="18"
          ry="18"
          fill={EYE_COLOR}
          className="blink"
        ></ellipse>
      </DollarLogoArt>
    </svg>
    />
  )
}

export { IconBlinkingLogo, IconLogo, IconLogoOutline }
