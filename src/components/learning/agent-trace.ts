export type AgentScenario = 'success' | 'timeout' | 'failure' | 'cancel'
export const agentScenarios: Record<AgentScenario, string> = {
  success: '正常成功',
  timeout: '已执行，但响应超时',
  failure: '参数校验失败',
  cancel: '提交后取消',
}
type TraceStep = { title: string; state: string; detail: string; writes: number }

// ponytail: 固定教学轨迹，不模拟网络或真实执行器；接入真实服务时需服务端状态与原子幂等记录。
export function agentTrace(scenario: AgentScenario, idempotent: boolean): TraceStep[] {
  const steps: TraceStep[] = [
    {
      title: '模型提出调用',
      state: '运行中',
      detail: '用户已授权创建一份报告。模型提出 create_report，应用尚未执行。',
      writes: 0,
    },
    {
      title: '应用检查边界',
      state: '运行中',
      detail: '检查工具白名单、参数 schema、资源权限与本次授权。',
      writes: 0,
    },
  ]
  if (scenario === 'failure')
    return [
      ...steps,
      {
        title: '拒绝无效参数',
        state: '失败',
        detail: '报告日期不合法。校验失败，工具没有执行；重试相同参数没有意义。',
        writes: 0,
      },
    ]
  steps.push({
    title: '工具提交结果',
    state: '等待工具响应',
    detail: '报告已在工具服务中创建。执行器还没有收到确认，二者知道的状态并不相同。',
    writes: 1,
  })
  if (scenario === 'cancel')
    return [
      ...steps,
      {
        title: '接收取消请求',
        state: '已取消 · 副作用待核实',
        detail:
          '停止调度后续模型步骤，并请求取消仍在进行的工作。本例报告已经提交，取消不会删除它；需查询后告知用户，删除属于另一个需授权的动作。',
        writes: 1,
      },
    ]
  if (scenario === 'timeout') {
    steps.push({
      title: '响应丢失，等待超时',
      state: '结果未知',
      detail:
        '执行器不能据超时断言失败。应查询结果，或在工具支持幂等时用同一键有限重试。下面对比一次重试的后果。',
      writes: 1,
    })
    steps.push({
      title: '重试一次',
      state: '等待工具响应',
      detail: idempotent
        ? '沿用同一业务操作的幂等键，工具返回已保存的报告，不重复创建。'
        : '未使用幂等保护，工具把重试当成新操作，又创建一份报告。这是要避免的反例。',
      writes: idempotent ? 1 : 2,
    })
  }
  return [
    ...steps,
    {
      title: '回传结果并结束',
      state: '成功',
      detail:
        scenario === 'timeout' && !idempotent
          ? '执行器拿到了成功响应，但产生了两份报告：技术上的成功不代表业务正确。'
          : '按调用 ID 回传结果，模型总结，任务保存完成状态。本例只包含一次工具操作。',
      writes: scenario === 'timeout' && !idempotent ? 2 : 1,
    },
  ]
}
