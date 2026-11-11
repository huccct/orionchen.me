export const toolScenarios = {
  search: '只读查文章',
  save: '查询后保存笔记',
  invalid: '保存参数不合法',
  forbidden: '没有笔记写权限',
  failure: '工具返回业务错误',
  timeout: '已写入，响应丢失',
}
export type ToolScenario = keyof typeof toolScenarios
export type ToolDecision = 'pending' | 'approve' | 'deny'
export type ToolRecovery = 'pending' | 'query' | 'retry'
export const sampleNote = {
  notebook: '我的学习笔记',
  title: '上下文学习摘记',
  body: '摘要需要保留硬约束，并保留原文定位。',
  operationKey: 'note-op-001',
}
export function validNoteArguments(value: unknown): value is typeof sampleNote {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const args = value as Record<string, unknown>
  return (
    Object.keys(args).length === 4 &&
    Object.keys(sampleNote).every(
      (key) =>
        typeof args[key] === 'string' &&
        (args[key] as string).trim().length > 0 &&
        (args[key] as string).length <= 200
    ) &&
    args.notebook === '我的学习笔记'
  )
}
export type ToolTraceStep = {
  title: string
  actor: string
  detail: string
  state: string
  writes: number
  payload?: string
  gate?: 'approval' | 'recovery'
}

// ponytail: 纯教学轨迹，计数不是实际数据库写入；上线执行器需持久化事务、权限与幂等记录。
export function toolCallTrace(
  scenario: ToolScenario,
  decision: ToolDecision = 'pending',
  recovery: ToolRecovery = 'pending'
): ToolTraceStep[] {
  const steps: ToolTraceStep[] = [
    {
      title: '发现工具',
      actor: 'Host 内的 MCP Client → MCP Server',
      state: '尚未执行',
      writes: 0,
      detail:
        'Client 用 tools/list 获取工具说明与 inputSchema，Host 选择暴露给模型。列出工具不等于调用，更不等于授予写权限。',
      payload:
        '工具：search_articles({ query: string })\n工具：save_note({ notebook, title, body, operationKey })\n这里只显示教学签名，不是完整 MCP 报文。',
    },
    {
      title: '模型提出查询',
      actor: '模型 → Host',
      state: '等待执行侧检查',
      writes: 0,
      detail:
        '模型提议 search_articles。Host 检查工具白名单、查询参数和文章访问权限，再由 Client 路由到工具服务。',
      payload: '模型调用 ID：model-search-1\n工具：search_articles\n参数：{ "query": "上下文" }',
    },
    {
      title: '执行查询并返回',
      actor: 'MCP Server → Client → Host',
      state: '查询成功',
      writes: 0,
      detail:
        '授权的只读查询返回固定教学文章片段。Host 校验结果并关联原调用 ID，把结果交回模型；查询没有保存笔记。',
      payload:
        'tools/call → search_articles\n模拟结果：{ articleId: "article-demo", title: "上下文学习", excerpt: "摘要需要保留硬约束，并保留原文定位。" }',
    },
  ]
  if (scenario === 'search')
    return [
      ...steps,
      {
        title: '回答并结束',
        actor: '模型 → 用户',
        state: '已完成只读任务',
        writes: 0,
        detail:
          '回答“找到《上下文学习》”，并引用 article-demo。工具成功后仍需检查是否完成用户任务；本例没有写入请求。',
      },
    ]
  const args = scenario === 'invalid' ? { ...sampleNote, body: 42 } : sampleNote
  steps.push({
    title: '模型提出保存',
    actor: '模型 → Host',
    state: '尚未保存',
    writes: 0,
    detail:
      '模型根据查询结果提议保存摘记。这仍然只是工具名和参数，尚未产生副作用。operationKey 是应用的业务操作键，不是 MCP 自动提供的去重功能。',
    payload: JSON.stringify(
      { modelCallId: 'model-save-1', tool: 'save_note', arguments: args },
      null,
      2
    ),
  })
  if (!validNoteArguments(args))
    return [
      ...steps,
      {
        title: '参数校验拒绝',
        actor: 'Host 执行边界',
        state: '未调用保存工具',
        writes: 0,
        detail:
          'body 必须是非空字符串，收到数字 42。先修正参数，不能原样重试。此处是本地拦截；真实 MCP Server 仍必须独立校验所有输入。',
      },
    ]
  steps.push({
    title: '检查参数与权限',
    actor: 'Host / 工具服务的权限边界',
    state: scenario === 'forbidden' ? '无写权限' : '允许申请本次保存',
    writes: 0,
    detail:
      scenario === 'forbidden'
        ? '当前身份只有文章读取权限。笔记写权限不足，在确认前停止；用户点击确认不能绕过服务端鉴权。'
        : '参数通过实际 TypeScript 检查。场景预设当前身份可写“我的学习笔记”，应用再按策略确认这次具体内容。真实服务必须在执行时复查权限。',
  })
  if (scenario === 'forbidden') return steps
  steps.push({
    title: '确认具体写入',
    actor: '用户 ↔ Host',
    state:
      decision === 'pending'
        ? '等待模拟确认'
        : decision === 'approve'
          ? '已批准本次参数'
          : '已拒绝本次保存',
    writes: 0,
    gate: 'approval',
    detail:
      '本实验将保存设为需要一次确认。实际产品可根据风险和已有授权设置策略，并非所有写操作都必须重复询问。批准仅绑定下列目标与内容；参数改变需重新检查授权。',
    payload: JSON.stringify(sampleNote, null, 2),
  })
  if (decision === 'pending') return steps
  if (decision === 'deny')
    return [
      ...steps,
      {
        title: '停止保存',
        actor: 'Host → 用户',
        state: '已拒绝 · 未保存',
        writes: 0,
        detail:
          '不发出 save_note，不再调度保存步骤。查到的文章仍可用于回答；不能把拒绝描述成保存成功。',
      },
    ]
  if (scenario === 'failure')
    return [
      ...steps,
      {
        title: '工具返回业务错误',
        actor: 'MCP Server → Host',
        state: '保存失败',
        writes: 0,
        detail:
          '本场景预设笔记本容量已满，服务未写入。响应通过协议成功返回，但工具结果 isError=true；应告知用户并处理容量，不原样循环重试。',
        payload:
          '教学结果片段：{ isError: true, content: [{ type: "text", text: "Notebook quota exceeded" }] }',
      },
    ]
  steps.push({
    title: '执行已批准的保存',
    actor: 'Client → MCP Server → 笔记存储',
    state: '等待保存响应',
    writes: 1,
    detail:
      '模拟服务以 note-op-001 原子记录本次操作与笔记 note-demo-1。教学视角知道已写入 1 条，Host 此时尚未收到确认。',
    payload:
      'tools/call → save_note\n模型调用 ID：model-save-1\nMCP 请求 ID：rpc-save-1\n业务操作键：note-op-001',
  })
  if (scenario === 'timeout') {
    steps.push({
      title: '响应丢失，结果未知',
      actor: 'Host 执行器',
      state: '保存结果待核实',
      writes: 1,
      gate: 'recovery',
      detail:
        '超时仅表示 Host 未及时收到结果，不能推断“没有写入”。本例服务支持按业务键查询和同键重试；选一种方式继续。没有这些能力时，应保留未知状态并人工核实。',
    })
    if (recovery === 'pending') return steps
    steps.push({
      title: recovery === 'query' ? '按原操作键核实' : '同键重试一次',
      actor: 'Host → 工具服务',
      state: '已核实原笔记',
      writes: 1,
      detail:
        recovery === 'query'
          ? '通过应用提供的操作状态查询，找到 note-op-001 对应的 note-demo-1。查询不新增笔记。该查询能力不是 MCP 协议保证。'
          : '更换传输请求 ID 为 rpc-save-2，沿用相同参数和业务键 note-op-001。模拟服务返回原结果，不再写入；真实实现需要持久化去重、并发原子性和同键异参拒绝。',
      payload: '操作键：note-op-001\n返回笔记：note-demo-1\n新增笔记数：0',
    })
  }
  return [
    ...steps,
    {
      title: '回传结果并确认完成',
      actor: 'Host → 模型 → 用户',
      state: '保存成功',
      writes: 1,
      detail:
        'Host 校验保存结果与笔记 ID，关联 model-save-1 后交回模型。现在才可回答“已保存到我的学习笔记”。传输请求 ID、模型调用 ID 与业务操作键各司其职。',
      payload: '教学结果：{ noteId: "note-demo-1", operationKey: "note-op-001" }',
    },
  ]
}
