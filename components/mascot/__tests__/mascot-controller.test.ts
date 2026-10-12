import { describe, expect, it } from 'vitest'

import {
  clampGaze,
  createMascotState,
  deriveMode,
  mouthForWord
} from '../mascot-controller'

describe('mascot controller', () => {
  it('derives mode with speaking priority', () => {
    expect(deriveMode('streaming', true)).toBe('speaking')
    expect(deriveMode('streaming', false)).toBe('thinking')
    expect(deriveMode('ready', false)).toBe('idle')
    expect(deriveMode('error', true)).toBe('error')
  })
  it('clamps gaze', () => {
    expect(clampGaze({ x: 5, y: -5 })).toEqual({ x: 1, y: -1 })
    expect(clampGaze({ x: NaN, y: 0 })).toEqual({ x: 0, y: 0 })
  })
  it('maps vowels to shapes and closes mouth when not speaking', () => {
    expect(mouthForWord('hello')).toBe('wide')
    expect(mouthForWord('go')).toBe('round')
    expect(
      createMascotState({
        status: 'ready',
        speaking: false,
        gaze: { x: 0, y: 0 },
        mouth: 'wide'
      }).mouth
    ).toBe('closed')
  })
})
