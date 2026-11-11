export type GenerationContext = 'rain' | 'sun'
export type GenerationMode = 'sample' | 'greedy'
export const generationContexts = { rain: '窗外正在下雨', sun: '窗外阳光明媚' }
export const generationDraws = [
  [0.18, 0.72, 0.41, 0.9],
  [0.84, 0.24, 0.63, 0.1],
]

// ponytail: 手工转移表只演示生成循环；研究真实语言分布时再接入模型。
export function generationScores(context: GenerationContext, tokens: string[]) {
  if (tokens.includes('<EOS>')) return []
  if (!tokens.length)
    return [
      { token: '带上', score: context === 'rain' ? 2 : 0.5 },
      { token: '戴上', score: context === 'sun' ? 2 : 0.5 },
      { token: '准备好', score: 1 },
    ]
  if (tokens.length === 1)
    return [
      { token: '雨伞', score: (context === 'rain' ? 2 : 0) + (tokens[0] === '带上' ? 1 : 0) },
      { token: '太阳镜', score: (context === 'sun' ? 2 : 0) + (tokens[0] === '戴上' ? 1 : 0) },
      { token: '水壶', score: tokens[0] === '准备好' ? 2 : 0.5 },
    ]
  if (tokens.length === 2)
    return [
      { token: '再出门。', score: 2 },
      { token: '吧。', score: 1 },
    ]
  return [{ token: '<EOS>', score: 0 }]
}

export function generationProbabilities(
  scores: { token: string; score: number }[],
  temperature: number
) {
  if (!Number.isFinite(temperature) || temperature <= 0) throw new Error('温度必须大于 0')
  if (!scores.length) return []
  const max = Math.max(...scores.map((item) => item.score))
  const weights = scores.map((item) => Math.exp((item.score - max) / temperature))
  const sum = weights.reduce((a, b) => a + b, 0)
  return scores.map((item, i) => ({ ...item, probability: weights[i]! / sum }))
}

export function generationTrace(
  context: GenerationContext,
  temperature: number,
  mode: GenerationMode,
  draws: number[],
  limit = 4
) {
  if (!draws.length || draws.some((draw) => !Number.isFinite(draw) || draw < 0 || draw >= 1))
    throw new Error('抽样值须在 [0, 1) 内')
  const tokens: string[] = []
  const trace = []
  for (let i = 0; i < limit; i++) {
    const candidates = generationProbabilities(generationScores(context, tokens), temperature)
    if (!candidates.length) break
    const draw = draws[i % draws.length]!
    let cumulative = 0
    const selected =
      mode === 'greedy'
        ? candidates.reduce((best, item) => (item.probability > best.probability ? item : best))
        : (candidates.find((item) => (cumulative += item.probability) > draw) ??
          candidates[candidates.length - 1]!)
    trace.push({
      prefix: tokens.join(''),
      candidates,
      draw,
      selected: selected.token,
      output: tokens.join('') + (selected.token === '<EOS>' ? '' : selected.token),
      stop: selected.token === '<EOS>' ? 'eos' : i === limit - 1 ? 'limit' : null,
    })
    tokens.push(selected.token)
    if (selected.token === '<EOS>') break
  }
  return trace
}
