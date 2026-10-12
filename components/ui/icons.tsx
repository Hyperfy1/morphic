'use client'

import { cn } from '@/lib/utils'

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
      <circle
        cx="128"
        cy="128"
        r="108"
        fill="none"
        stroke="currentColor"
        strokeWidth="24"
      ></circle>
      <circle cx="102" cy="128" r="18" fill="currentColor"></circle>
      <circle cx="154" cy="128" r="18" fill="currentColor"></circle>
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
    />
  )
}

export { IconBlinkingLogo, IconLogo, IconLogoOutline }
