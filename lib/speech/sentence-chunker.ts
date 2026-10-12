import { stripSourceContextBlocks } from '@/lib/render/strip-source-context-blocks'
import { stripSpecBlocks } from '@/lib/render/strip-spec-blocks'

/** Remove content that must not be read aloud (spec fences, source blocks, markdown). */
export function sanitizeForSpeech(text: string): string {
  return stripSpecBlocks(stripSourceContextBlocks(text))
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[\d+\]/g, '')
    .replace(/[*_`#>]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Splits streaming text into complete sentences. `rest` is the trailing
 * incomplete fragment, to be re-fed once more text has arrived.
 */
export function chunkSentences(text: string): {
  sentences: string[]
  rest: string
} {
  const sentences: string[] = []
  const re = /[^.!?\n]+[.!?]+(?=\s|$)|[^\n]+\n/g
  let last = 0
  let match: RegExpExecArray | null
  while ((match = re.exec(text)) !== null) {
    const s = match[0].trim()
    if (s) sentences.push(s)
    last = re.lastIndex
  }
  return { sentences, rest: text.slice(last) }
}
