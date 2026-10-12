import type { MouthShape } from './mascot'

export interface SpeechRequest {
  id: string
  text: string
}

export type SpeechEvent =
  | { type: 'start'; id: string }
  | { type: 'boundary'; id: string; charIndex: number; word: string }
  | { type: 'viseme'; id: string; shape: MouthShape }
  | { type: 'end'; id: string }
  | { type: 'error'; id: string; message: string }

export interface SpeechEngine {
  isSupported(): boolean
  speak(request: SpeechRequest, onEvent: (event: SpeechEvent) => void): void
  cancel(): void
}
