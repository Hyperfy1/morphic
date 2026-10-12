import type { SpeechEngine } from '@/lib/contracts/speech'

export const webSpeechEngine: SpeechEngine = {
  isSupported: () =>
    typeof window !== 'undefined' && 'speechSynthesis' in window,
  speak(request, onEvent) {
    const u = new SpeechSynthesisUtterance(request.text)
    u.onstart = () => onEvent({ type: 'start', id: request.id })
    u.onboundary = e => {
      if (e.name && e.name !== 'word') return
      const word = request.text.slice(e.charIndex).split(/\s/)[0] ?? ''
      onEvent({
        type: 'boundary',
        id: request.id,
        charIndex: e.charIndex,
        word
      })
    }
    u.onend = () => onEvent({ type: 'end', id: request.id })
    u.onerror = e => {
      // 'canceled'/'interrupted' are expected on barge-in
      onEvent(
        e.error === 'canceled' || e.error === 'interrupted'
          ? { type: 'end', id: request.id }
          : { type: 'error', id: request.id, message: e.error }
      )
    }
    window.speechSynthesis.speak(u)
  },
  cancel() {
    if (this.isSupported()) window.speechSynthesis.cancel()
  }
}
