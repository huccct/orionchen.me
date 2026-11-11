export const evaluationPrompts = {
  A: '提取用户所问商品的退货期限。只输出 JSON：{"days":天数}。',
  B: '仅依据资料提取用户所问商品的退货期限，注意例外条款。资料未提及时 days 为 null，不猜测。只输出 JSON：{"days":天数或null}。',
}
export type EvalVersion = keyof typeof evaluationPrompts
export type EvalSlice = 'all' | 'typical' | 'edge'
export type EvalMetric = 'schema' | 'correct'
type Observation = {
  output: string
  firstMs: number
  totalMs: number
  inputTokens: number
  outputTokens: number
}
// ponytail: 人工固定观测用于教学，评分实际运行；接真实评测时替换为带版本与来源的运行记录。
export const evaluationCases: {
  id: string
  label: string
  group: Exclude<EvalSlice, 'all'>
  input: string
  expected: number | null
  reason: string
  runs: Record<EvalVersion, Observation>
}[] = [
  {
    id: 'standard',
    label: '明确期限',
    group: 'typical',
    input: '资料：普通商品可在 7 天内退货。问题：普通商品的退货期限？',
    expected: 7,
    reason: '直接提取资料明确的 7 天。',
    runs: {
      A: { output: '{"days":7}', firstMs: 200, totalMs: 600, inputTokens: 80, outputTokens: 8 },
      B: { output: '{"days":7}', firstMs: 300, totalMs: 800, inputTokens: 130, outputTokens: 8 },
    },
  },
  {
    id: 'format',
    label: '格式偏离',
    group: 'typical',
    input: '资料：鞋类可在 14 天内退货。问题：鞋类的退货期限？',
    expected: 14,
    reason: '应返回 {"days":14}。纯文本“14天”语义可读，但不符合接口约定。',
    runs: {
      A: { output: '{"days":14}', firstMs: 220, totalMs: 650, inputTokens: 85, outputTokens: 8 },
      B: { output: '14天', firstMs: 280, totalMs: 700, inputTokens: 135, outputTokens: 3 },
    },
  },
  {
    id: 'exception',
    label: '例外条款',
    group: 'edge',
    input:
      '资料：一般商品 14 天内可退，未拆封耳机例外，可在 30 天内退货。问题：未拆封耳机的退货期限？',
    expected: 30,
    reason: '应使用例外条款的 30 天，而不是默认的 14 天。',
    runs: {
      A: { output: '{"days":14}', firstMs: 240, totalMs: 700, inputTokens: 110, outputTokens: 8 },
      B: { output: '{"days":30}', firstMs: 350, totalMs: 1000, inputTokens: 160, outputTokens: 8 },
    },
  },
  {
    id: 'missing',
    label: '资料缺失',
    group: 'edge',
    input: '资料：会员享受免运费。问题：会员商品的退货期限？',
    expected: null,
    reason: '资料没有退货期限，应返回 null；不得从常识补一个天数。',
    runs: {
      A: { output: '{"days":7}', firstMs: 210, totalMs: 650, inputTokens: 75, outputTokens: 8 },
      B: { output: '{"days":null}', firstMs: 320, totalMs: 900, inputTokens: 125, outputTokens: 8 },
    },
  },
]

export function gradeEvaluation(output: string, expected: number | null) {
  let value: unknown
  try {
    value = JSON.parse(output)
  } catch {
    return { schema: false, correct: false }
  }
  if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value) ||
    Object.keys(value).length !== 1 ||
    !('days' in value)
  )
    return { schema: false, correct: false }
  const schema =
    value.days === null ||
    (typeof value.days === 'number' && Number.isSafeInteger(value.days) && value.days >= 0)
  return { schema, correct: schema && value.days === expected }
}

export function compareEvaluation(slice: EvalSlice, metric: EvalMetric) {
  const cases = evaluationCases.filter((item) => slice === 'all' || item.group === slice)
  const results = (['A', 'B'] as const).map((version) => {
    const rows = cases.map((item) => ({
      ...item,
      ...item.runs[version],
      ...gradeEvaluation(item.runs[version].output, item.expected),
    }))
    return {
      version,
      rows,
      passed: rows.filter((row) => row[metric]).length,
      firstMs: rows.reduce((sum, row) => sum + row.firstMs, 0) / rows.length,
      totalMs: rows.reduce((sum, row) => sum + row.totalMs, 0) / rows.length,
      inputTokens: rows.reduce((sum, row) => sum + row.inputTokens, 0),
      outputTokens: rows.reduce((sum, row) => sum + row.outputTokens, 0),
    }
  })
  const [a, b] = results
  return {
    results,
    count: cases.length,
    winner:
      a!.passed === b!.passed
        ? ('tie' as const)
        : a!.passed > b!.passed
          ? ('A' as const)
          : ('B' as const),
  }
}
