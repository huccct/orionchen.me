export const requestScenarios = {
  streaming: '实时传输',
  buffered: '代理缓冲',
  disconnected: '客户端断开',
}
export type RequestScenario = keyof typeof requestScenarios
export type RequestStep = {
  title: string
  detail: string
  generated: string
  buffered: string
  received: string
  visible: string
}

// ponytail: 固定三段教学数据，不模拟真实网络时钟；真实诊断需各层日志与浏览器计时。
export function requestTrace(scenario: RequestScenario, propagateCancel = true): RequestStep[] {
  const steps: RequestStep[] = [
    {
      title: '请求进入服务端',
      detail: '连接已就绪，校验通过。服务端准备以 text/event-stream 返回增量；此时还没有正文。',
      generated: '',
      buffered: '',
      received: '',
      visible: '',
    },
  ]
  let generated = '',
    received = ''
  for (const [index, chunk] of ['你好，', '这是', '流式回答。'].entries()) {
    const disconnected = scenario === 'disconnected' && index > 0
    if (disconnected && propagateCancel) {
      steps.push({
        title: '断开并传播取消',
        detail:
          '第一段显示后客户端中止 fetch。此模型中服务端立即收到断开，取消上游并清理资源；真实系统的取消可能有延迟。',
        generated,
        buffered: '',
        received,
        visible: received,
      })
      return steps
    }
    generated += chunk
    if (scenario !== 'buffered' && !disconnected) received += chunk
    steps.push({
      title: disconnected ? `断开后继续生成第 ${index + 1} 段` : `服务端生成第 ${index + 1} 段`,
      detail: disconnected
        ? '浏览器已断开，但服务端没有将取消传给上游；生成仍在继续，浏览器不会再收到内容。'
        : scenario === 'buffered'
          ? '代理暂存了本段，没有转发给浏览器。本模型设为正文完成后统一刷新；实际代理可能按大小或时间刷新。'
          : '本段被立即转发、解码并解析为完整事件，前端随后提交显示。本模型合并展示这几个阶段。',
      generated,
      buffered: scenario === 'buffered' ? generated : '',
      received,
      visible: received,
    })
  }
  if (scenario === 'buffered') received = generated
  steps.push({
    title: '生成结束',
    detail:
      scenario === 'buffered'
        ? '代理此时才发送全部数据，浏览器集中显示。总内容正确，但用户没有得到渐进反馈。'
        : scenario === 'disconnected'
          ? '上游生成完毕，但浏览器仍停在第一段。断开连接并未停止生成。'
          : '服务端发送应用层完成信号并结束响应，浏览器显示全部内容。',
    generated,
    buffered: '',
    received,
    visible: received,
  })
  return steps
}
