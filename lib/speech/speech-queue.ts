import type { SpeechEngine, SpeechEvent } from '@/lib/contracts/speech'

/** Speaks sentences one at a time; cancel() drops everything pending. */
export class SpeechQueue {
  private pending: string[] = []
  private speaking = false
  private counter = 0

  constructor(
    private engine: SpeechEngine,
    private onEvent: (event: SpeechEvent) => void = () => {}
  ) {}

  enqueue(text: string) {
    if (!text.trim() || !this.engine.isSupported()) return
    this.pending.push(text)
    this.next()
  }

  cancel() {
    this.pending = []
    this.speaking = false
    this.engine.cancel()
  }

  private next() {
    if (this.speaking) return
    const text = this.pending.shift()
    if (text === undefined) return
    this.speaking = true
    const id = `utt-${this.counter++}`
    this.engine.speak({ id, text }, event => {
      this.onEvent(event)
      if (event.type === 'end' || event.type === 'error') {
        this.speaking = false
        this.next()
      }
    })
  }
}
