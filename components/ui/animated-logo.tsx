'use client'

import { useEffect, useRef, useState } from 'react'

import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { cn } from '@/lib/utils'

import { Mascot, MAX_EYE_OFFSET } from './mascot'

export function AnimatedLogo({
  animate = true,
  speaking = false,
  className,
  ...props
}: React.ComponentProps<'svg'> & {
  /** True while the assistant is generating a reply */
  animate?: boolean
  /** True while the reply is being spoken aloud */
  speaking?: boolean
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isBlinking, setIsBlinking] = useState(false)
  const [eye, setEye] = useState({ x: 0, y: 0 })
  const [mouthOpen, setMouthOpen] = useState(0)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const talking = animate || speaking

  // Blink while idle (when talking, the eyes track the user instead)
  useEffect(() => {
    if (talking || reducedMotion) return

    let blinkTimeoutId: ReturnType<typeof setTimeout> | undefined
    let nextBlinkTimeoutId: ReturnType<typeof setTimeout>

    const scheduleBlink = () => {
      nextBlinkTimeoutId = setTimeout(
        () => {
          setIsBlinking(true)
          blinkTimeoutId = setTimeout(() => {
            setIsBlinking(false)
            scheduleBlink()
          }, 180)
        },
        Math.random() * 5000 + 2000
      )
    }

    scheduleBlink()

    return () => {
      if (blinkTimeoutId) clearTimeout(blinkTimeoutId)
      clearTimeout(nextBlinkTimeoutId)
    }
  }, [talking, reducedMotion])

  // Eyes follow the pointer while replying
  useEffect(() => {
    if (!talking || reducedMotion) return

    const handleMove = (clientX: number, clientY: number) => {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const dx = clientX - (rect.left + rect.width / 2)
      const dy = clientY - (rect.top + rect.height / 2)
      const dist = Math.hypot(dx, dy) || 1
      const strength = Math.min(1, dist / 200)
      setEye({
        x: (dx / dist) * MAX_EYE_OFFSET * strength,
        y: (dy / dist) * MAX_EYE_OFFSET * strength
      })
    }

    const onMouse = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) handleMove(t.clientX, t.clientY)
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch)
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [talking, reducedMotion])

  // Mouth moves while generating / speaking
  useEffect(() => {
    if (!talking || reducedMotion) return
    const id = setInterval(() => setMouthOpen(Math.random()), 140)
    return () => clearInterval(id)
  }, [talking, reducedMotion])

  const tracking = talking && !reducedMotion
  const eyeX = tracking ? eye.x : 0
  const eyeY = tracking ? eye.y : 0
  const mouth = !talking ? 0 : reducedMotion ? 0.5 : mouthOpen

  return (
    <Mascot
      ref={svgRef}
      className={cn('size-8', className)}
      eyeX={eyeX}
      eyeY={eyeY}
      mouthOpen={mouth}
      blinking={isBlinking && !talking}
      {...props}
    />
  )
}
