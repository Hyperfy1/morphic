export type MascotMode = 'idle' | 'thinking' | 'speaking' | 'error'

/** Normalized gaze vector; each axis is in [-1, 1]. */
export interface GazeTarget {
  x: number
  y: number
}

export type MouthShape = 'closed' | 'small' | 'wide' | 'round'

export interface MascotState {
  mode: MascotMode
  gaze: GazeTarget
  mouth: MouthShape
}
