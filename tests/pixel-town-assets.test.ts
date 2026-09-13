import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'

it('ships all pixel rooms and transparent, registered four-frame character strips within their budgets', () => {
  for (const room of ['town', 'writing', 'works', 'reading']) {
    const image = readFileSync(`public/images/pixel-town/${room}.webp`)
    expect(image.toString('ascii', 8, 12)).toBe('WEBP')
    expect(image.length).toBeLessThan(1_500_000)
  }
  for (const actor of ['dog', 'reader', 'gardener']) {
    const image = readFileSync(`public/images/pixel-town/${actor}.png`)
    expect(image.toString('ascii', 1, 4)).toBe('PNG')
    expect(image.readUInt32BE(16)).toBe(1024)
    expect(image.readUInt32BE(20)).toBe(320)
    expect(image[25]).toBe(6) // RGBA: scenery must show through the sprite padding.
    expect(image.length).toBeLessThan(500_000)
  }
})
