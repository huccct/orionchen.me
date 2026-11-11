export const llmScenarios = {
  success: '正常完成',
  truncated: '输出达到上限',
  disconnected: '收到文字后断流',
  refusal: '模型拒绝',
  rateLimit: '开始前临时限流',
} as const
export type LlmScenario = keyof typeof llmScenarios
type Step = { title: string; state: string; text: string; detail: string; usable: boolean }
// ponytail: 固定教学轨迹，不模拟网络或模型判断；真实接入需消费完整 SDK 事件并校验结果。
export function llmTrace(scenario: LlmScenario): Step[] {
  const steps: Step[] = [
    {
      title: '服务端准备请求',
      state: '尚未生成',
      text: '',
      usable: false,
      detail: '完成身份与用量检查，组合指令、输入和输出约定。密钥不进入浏览器。',
    },
  ]
  if (scenario === 'rateLimit')
    return [
      ...steps,
      {
        title: '请求被临时限流',
        state: '未开始 · 可有限重试',
        text: '',
        usable: false,
        detail:
          '本例是临时速率限制。结合 HTTP 状态与 error.code 判断，遵守有效 Retry-After，在整体截止时间内有限退避；额度耗尽不适用。',
      },
    ]
  steps.push({
    title: '响应开始',
    state: '生成中',
    text: '',
    usable: false,
    detail: '收到 response.created。请求已经建立，但还没有可供业务消费的结果。',
  })
  if (scenario === 'refusal')
    return [
      ...steps,
      {
        title: '识别拒绝内容',
        state: '拒绝 · 无业务结果',
        text: '无法协助此请求。',
        usable: false,
        detail:
          '这是示意拒绝文本，不是目标 JSON。即使响应随后完成，也应走拒绝分支，不强行解析或盲目重试。',
      },
    ]
  const partial = '{"summary":"流式输出让用户更早'
  steps.push({
    title: '收到文字增量',
    state: '生成中 · 仅预览',
    text: partial,
    usable: false,
    detail: '收到 response.output_text.delta。可以展示预览，但片段尚不是完整、校验通过的业务对象。',
  })
  if (scenario === 'truncated')
    return [
      ...steps,
      {
        title: '输出未完成',
        state: '未完成 · 输出上限',
        text: partial,
        usable: false,
        detail:
          '最终响应标记 incomplete，原因为 max_output_tokens。提示未完成，调整预算或缩小任务后重新请求，不能标记成功。',
      },
    ]
  if (scenario === 'disconnected')
    return [
      ...steps,
      {
        title: '连接意外中断',
        state: '结果未知 · 未收到终态',
        text: partial,
        usable: false,
        detail:
          '本地断流不能判断服务端最终是否完成。标记未完成，提供重新生成；新尝试单独展示，不拼接旧片段。',
      },
    ]
  const text = '{"summary":"流式输出让用户更早看到内容。"}'
  return [
    ...steps,
    {
      title: '响应完整结束',
      state: '响应完成 · 待校验',
      text,
      usable: false,
      detail: '收到 response.completed。仍需检查拒绝、解析结构，并核对业务要求。',
    },
    {
      title: '应用校验通过',
      state: '业务可用',
      text,
      usable: true,
      detail:
        '本例预设 schema 和摘要要求均通过检查。真实项目应执行运行时校验；schema 无法保证事实正确。',
    },
  ]
}
