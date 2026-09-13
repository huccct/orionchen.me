import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'

it('exports pickable room furniture and the dog within the asset budgets', () => {
  for (const room of ['writing', 'works', 'reading', 'town', 'resident']) {
    const asset = readFileSync(
      `public/models/${room === 'town' ? 'paper-town' : room === 'resident' ? 'resident' : `interior-${room}`}.glb`
    )
    expect(asset.readUInt32LE(0)).toBe(0x46546c67)
    const gltf = JSON.parse(asset.subarray(20, 20 + asset.readUInt32LE(12)).toString())
    const names = gltf.nodes.map((node: { name: string }) => node.name)
    expect(names).toEqual(
      expect.arrayContaining(
        room === 'town'
          ? ['dog', 'dog-tail', 'dog-leg-0', 'writing', 'reading', 'works']
          : room === 'resident'
            ? ['resident', 'head', 'arm-left', 'arm-right', 'leg-left', 'leg-right']
            : ['shell', 'desk', 'shelf']
      )
    )
    if (room === 'works') expect(names).toContain('screen')
    expect(names).not.toContain('cat')
    expect(asset.length).toBeLessThan(room === 'town' ? 2_000_000 : 500_000)
  }
})
