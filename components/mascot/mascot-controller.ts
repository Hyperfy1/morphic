import type {
  GazeTarget,
  MascotMode,
  MascotState,
  MouthShape
} from '@/lib/contracts/mascot'

export type ChatStatus = 'submitted' | 'streaming' | 'ready' | 'error'

export function clampGaze(g: GazeTarget): GazeTarget {
  const c = (n: number) =>
    Number.isFinite(n) ? Math.max(-1, Math.min(1, n)) : 0
  return { x: c(g.x), y: c(g.y) }
}

/** Pure derivation of mascot mode; speaking takes priority over chat status. */
export function deriveMode(status: ChatStatus, speaking: boolean): MascotMode {
  if (status === 'error') return 'error'
  if (speaking) return 'speaking'
  if (status === 'submitted' || status === 'streaming') return 'thinking'
  return 'idle'
}

const VOWEL_SHAPES: Record<string, MouthShape> = {
  a: 'wide',
  e: 'wide',
  i: 'small',
  o: 'round',
  u: 'round'
}

/** Approximate mouth shape from the first vowel of a spoken word. */
export function mouthForWord(word: string): MouthShape {
  const m = word.toLowerCase().match(/[aeiou]/)
  return m ? VOWEL_SHAPES[m[0]] : 'small'
}

export function createMascotState(input: {
  status: ChatStatus
  speaking: boolean
  gaze: GazeTarget
  mouth: MouthShape
}): MascotState {
  const mode = deriveMode(input.status, input.speaking)
  return {
    mode,
    gaze: clampGaze(input.gaze),
    mouth: mode === 'speaking' ? input.mouth : 'closed'
  }
}
