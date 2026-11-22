import { describe, expect, it } from 'vitest'

import { toSpeakableText } from '../speech-output'

describe('toSpeakableText', () => {
  it('strips markdown, citations and code', () => {
    expect(
      toSpeakableText(
        '**Hi** [link](http://x.y) there [1]\n```js\ncode()\n```\n`inline`'
      )
    ).toBe('Hi link there inline')
  })
})
