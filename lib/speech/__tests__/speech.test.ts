import { describe, expect, it, vi } from 'vitest'

import type { SpeechEngine } from '@/lib/contracts/speech'

import { chunkSentences, sanitizeForSpeech } from '../sentence-chunker'
import { SpeechQueue } from '../speech-queue'

describe('chunkSentences', () => {
  it('splits complete sentences and keeps the remainder', () => {
    expect(chunkSentences('Hi there. How are you? Fine')).toEqual({
      sentences: ['Hi there.', 'How are you?'],
      rest: ' Fine'
    })
  })
})

describe('sanitizeForSpeech', () => {
  it('removes spec blocks, links and citations', () => {
    expect(
      sanitizeForSpeech('See [docs](http://x.y) [1].\n```spec\n{}\n```\nDone.')
    ).toBe('See docs . Done.')
  })
})

describe('SpeechQueue', () => {
  it('speaks sequentially and cancel drops pending', () => {
    const done: Array<() => void> = []
    const spoken: string[] = []
    const engine: SpeechEngine = {
      isSupported: () => true,
      speak: (r, cb) => {
        spoken.push(r.text)
        done.push(() => cb({ type: 'end', id: r.id }))
      },
      cancel: vi.fn()
    }
    const q = new SpeechQueue(engine)
    q.enqueue('a')
    q.enqueue('b')
    expect(spoken).toEqual(['a'])
    done[0]()
    expect(spoken).toEqual(['a', 'b'])
    q.enqueue('c')
    q.cancel()
    expect(engine.cancel).toHaveBeenCalled()
  })
})
