'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { MouthShape } from '@/lib/contracts/mascot'
import type { SpeechEvent } from '@/lib/contracts/speech'
import {
  chunkSentences,
  sanitizeForSpeech
} from '@/lib/speech/sentence-chunker'
import { SpeechQueue } from '@/lib/speech/speech-queue'
import { webSpeechEngine } from '@/lib/speech/web-speech-engine'

import { mouthForWord } from '../mascot/mascot-controller'

/**
 * Feed the full (growing) assistant text via `feed`; complete sentences are
 * spoken as they appear. `cancel` implements barge-in.
 */
export function useSpeech() {
  const [speaking, setSpeaking] = useState(false)
  const [mouth, setMouth] = useState<MouthShape>('closed')
  const spokenLength = useRef(0)
  const queue = useRef<SpeechQueue | null>(null)

  useEffect(() => {
    const q = new SpeechQueue(webSpeechEngine, (e: SpeechEvent) => {
      if (e.type === 'start') setSpeaking(true)
      if (e.type === 'boundary') setMouth(mouthForWord(e.word))
      if (e.type === 'end' || e.type === 'error') {
        setSpeaking(false)
        setMouth('closed')
      }
    })
    queue.current = q
    return () => q.cancel()
  }, [])

  const feed = useCallback((fullText: string, done: boolean) => {
    const text = sanitizeForSpeech(fullText)
    const pending = text.slice(spokenLength.current)
    const { sentences, rest } = chunkSentences(pending)
    sentences.forEach(s => queue.current?.enqueue(s))
    spokenLength.current = text.length - rest.length
    if (done && rest.trim()) {
      queue.current?.enqueue(rest.trim())
      spokenLength.current = text.length
    }
  }, [])

  const cancel = useCallback(() => {
    queue.current?.cancel()
    spokenLength.current = 0
    setSpeaking(false)
    setMouth('closed')
  }, [])

  return { speaking, mouth, feed, cancel }
}
