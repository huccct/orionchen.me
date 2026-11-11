export type RetrievalMethod = 'keyword' | 'vector'

// ponytail: 四条公开的虚构教学片段和手工二维向量；接真实检索时用同一模型生成问题与文档向量。
export const ragChunks = [
  {
    id: 'cancel',
    title: '任务手册 · 取消',
    text: '取消操作会阻止后续步骤，但不会自动回滚已经提交的操作。',
    vector: [1, 0.1],
  },
  {
    id: 'report',
    title: '任务手册 · 报告',
    text: '报告创建后作为独立记录保存。删除报告需要另一次授权操作。',
    vector: [0.9, 0.2],
  },
  {
    id: 'subscription',
    title: '账户手册 · 订阅',
    text: '取消订阅后，当前周期仍可使用服务，下个周期不再续费。',
    vector: [0.8, 0.6],
  },
  {
    id: 'conflict',
    title: '接口手册 · E409',
    text: 'E409 表示记录版本冲突。先重新读取最新版本，再核实是否提交修改。',
    vector: [0, 1],
  },
]

export const ragQueries = [
  {
    id: 'cancel',
    label: '同义表达',
    text: '停止任务，会撤销已生成的报告吗？',
    terms: ['停止', '撤销'],
    vector: [1, 0],
    relevant: ['cancel', 'report'],
    explanation:
      '本题标注需要两条证据：取消不回滚，以及报告独立保存。关键词“停止 / 撤销”未出现在片段中；二维向量刻意安排了同义表达的教学例子。',
  },
  {
    id: 'code',
    label: '精确错误码',
    text: 'E409 应该怎么处理？',
    terms: ['E409'],
    vector: [0.8, 0.6],
    relevant: ['conflict'],
    explanation:
      '精确匹配 E409 可直接找到接口手册。手工向量刻意把问题放在了错误的位置，用于说明语义表示可能失误，不代表真实模型的错误率。',
  },
  {
    id: 'missing',
    label: '资料里没有答案',
    text: '已删除的报告还能恢复多少天？',
    terms: ['恢复'],
    vector: [1, 0],
    relevant: [],
    explanation:
      '四条资料都没有说明恢复期限。即使“取消”片段余弦分数很高，也不能据此编造天数；应该说明证据不足。',
  },
]

export function cosineSimilarity(a: number[], b: number[]) {
  if (!a.length || a.length !== b.length || ![...a, ...b].every(Number.isFinite))
    throw new Error('向量必须非空、等维且只包含有限数值')
  const aLength = Math.hypot(...a)
  const bLength = Math.hypot(...b)
  if (!aLength || !bLength || !Number.isFinite(aLength) || !Number.isFinite(bLength))
    throw new Error('向量长度必须有限且大于零')
  return Math.max(
    -1,
    Math.min(
      1,
      a.reduce((sum, value, i) => sum + (value / aLength) * (b[i]! / bLength), 0)
    )
  )
}

export function retrieveExample(queryId: string, method: RetrievalMethod, topK: number) {
  const query = ragQueries.find((item) => item.id === queryId)
  if (
    !query ||
    !['keyword', 'vector'].includes(method) ||
    !Number.isInteger(topK) ||
    topK < 1 ||
    topK > ragChunks.length
  )
    throw new Error('请选择有效的教学问题、检索方式和 K 值')
  const ranked = ragChunks
    .map((chunk) => ({
      ...chunk,
      score:
        method === 'vector'
          ? cosineSimilarity(query.vector, chunk.vector)
          : query.terms.filter((term) => chunk.text.toLowerCase().includes(term.toLowerCase()))
              .length,
    }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
  // ponytail: 关键词只保留有命中的片段；向量不设阈值，以展示无答案问题也会返回近邻。
  const selected = ranked.filter((chunk) => method === 'vector' || chunk.score > 0).slice(0, topK)
  const hits = selected.filter((chunk) => query.relevant.includes(chunk.id)).length
  return {
    ranked,
    selected,
    recall: query.relevant.length ? hits / query.relevant.length : null,
    sufficient: query.relevant.length > 0 && hits === query.relevant.length,
    context: selected.map((chunk) => `[${chunk.id}] ${chunk.title}\n${chunk.text}`).join('\n\n'),
  }
}
