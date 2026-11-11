export const reviewDecisions = {
  fix: '需要修改代码',
  verify: '需要补充验证',
  accept: '本题范围内可接受',
} as const
export type ReviewDecision = keyof typeof reviewDecisions
export type ReviewCandidate = 'A' | 'B' | 'C'
const correctDiff = `- <span>{topic.title}</span>
+ <Link href={\`\${localePathPrefix[topic.lang]}/learning/\${topic.slug}\`}>
+   {topic.title}
+ </Link>`
// ponytail: 候选 diff 和验证记录是教学改写，不是本仓库的真实故障或 CI 日志。
export const reviewCandidates: Record<
  ReviewCandidate,
  {
    diff: string
    evidence: string[]
    decision: ReviewDecision
    explanation: string
    followup: string
  }
> = {
  A: {
    diff: `- <span>{topic.title}</span>
+ <Link href={\`\${localePathPrefix[locale]}/learning/\${topic.slug}\`}>
+   {topic.title}
+ </Link>`,
    evidence: ['类型检查通过。', '中文页面点击中文卡片：到达 /learning/llm。', '其余场景未记录。'],
    decision: 'fix',
    explanation:
      '英文页面没有英文内容时会回退展示中文卡片。locale 是页面语言，topic.lang 才是内容语言。用 locale 拼接会访问不存在的 /en/learning/llm。类型检查无法识别这个业务错误。',
    followup:
      '英文列表回退中文内容时，当前生成 /en/learning/llm，预期 /learning/llm。请按内容语言生成链接，并补上英文回退的回归用例，再检查卡片实际导航。',
  },
  B: {
    diff: correctDiff,
    evidence: [
      '类型检查通过。',
      '仅运行“中文页面 → 中文卡片”的链接断言，结果通过。',
      '未测试英文回退、英文内容，也没有浏览器与构建记录。',
    ],
    decision: 'verify',
    explanation:
      '这段链接逻辑符合内容语言约定，但提交的证据只覆盖中文常规路径。缺少验证不等于已经发现代码错误，应补充英文回退、英文内容与实际交互证据。',
    followup:
      '暂未发现该片段的链接错误。请补充英文页面回退中文内容、英文内容自己的链接用例，并验证键盘激活、窄屏可用和生产构建；报告实际结果及未覆盖范围。',
  },
  C: {
    diff: correctDiff,
    evidence: [
      '三条行为断言通过：中文 → 中文、英文 → 中文回退、英文 → 英文。',
      '类型、Lint 与生产构建通过；浏览器验证点击目标和键盘激活。',
      '390px 与桌面宽度下卡片可见可用；完整 diff 只包含卡片链接和相关测试。以上为本题预设记录。',
    ],
    decision: 'accept',
    explanation:
      '代码与已给出的验证记录覆盖了本题约定，可以在这个有限范围内接受。真实审查仍须核实最新 diff 与记录来源；本题不证明整个网站无缺陷，也不代表已经获得发布授权。',
    followup:
      '记录本次行为变化、验证范围和剩余限制。将所需文件单独提交，在明确发布授权后部署，再检查线上页面。',
  },
}
export const reviewCases = [
  {
    id: 'zh',
    label: '中文页面 → 中文内容',
    locale: 'zh',
    topicLang: 'zh',
    slug: 'llm',
    expected: '/learning/llm',
  },
  {
    id: 'fallback',
    label: '英文页面 → 中文回退',
    locale: 'en',
    topicLang: 'zh',
    slug: 'llm',
    expected: '/learning/llm',
  },
  {
    id: 'en',
    label: '英文页面 → 英文内容（假设已有译文）',
    locale: 'en',
    topicLang: 'en',
    slug: 'llm',
    expected: '/en/learning/llm',
  },
] as const

// 只运行固定片段的链接推导，不执行任意代码，也不访问所生成的 URL。
export function inspectReview(candidate: ReviewCandidate) {
  return reviewCases.map((item) => {
    const lang = candidate === 'A' ? item.locale : item.topicLang
    const actual = `${lang === 'en' ? '/en' : ''}/learning/${item.slug}`
    return { ...item, actual, passed: actual === item.expected }
  })
}
