'use client'

import { type RefObject, useEffect } from 'react'

import type { GazeTarget } from '@/lib/contracts/mascot'

import { clampGaze } from './mascot-controller'

/**
 * Tracks the pointer relative to `ref` and calls onGaze at most once per
 * animation frame, so consumers can write to DOM/CSS vars without re-rendering.
 */
export function useGaze(
  ref: RefObject<Element | null>,
  onGaze: (g: GazeTarget) => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    let last: PointerEvent | null = null
    const flush = () => {
      frame = 0
      const el = ref.current
      if (!el || !last) return
      const r = el.getBoundingClientRect()
      const dx = last.clientX - (r.left + r.width / 2)
      const dy = last.clientY - (r.top + r.height / 2)
      const range = Math.max(window.innerWidth, window.innerHeight) / 2
      onGaze(clampGaze({ x: dx / range, y: dy / range }))
    }
    const onMove = (e: PointerEvent) => {
      last = e
      if (!frame) frame = requestAnimationFrame(flush)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref, onGaze, enabled])
}
