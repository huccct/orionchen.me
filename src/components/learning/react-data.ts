export const reactConcepts = [
  {
    id: 'components',
    title: '组件与 JSX',
    question: '界面怎样拆成可以组合的部分？',
    terms: '组件 · JSX · 纯函数 · 列表与 key',
    description:
      '组件是描述 UI 的函数。React 调用组件，得到这一轮界面的描述；JSX 把结构写在逻辑旁边，最终仍然是 JavaScript。',
    example:
      '把文章列表拆成 ArticleList 和 ArticleItem。相同的组件可以接收不同文章，产生不同内容。',
    mistake:
      '不要在渲染中修改外部变量或发送请求。列表的 key 应稳定地标识数据；同一位置的类型或 key 改变，可能重置组件状态。',
    task: '给列表增加排序，解释为什么文章 ID 比数组下标更适合作为 key。',
    related: ['props', 'render'],
    doc: 'your-first-component',
    code: 'function Greeting({ name }) {\n  return <h2>你好，{name}</h2>\n}',
  },
  {
    id: 'props',
    title: 'Props 与组合',
    question: '组件之间怎样传递信息？',
    terms: 'Props · children · 单向数据流 · 回调',
    description:
      '父组件通过 props 把数据和回调交给子组件。子组件读取输入，用回调表达用户意图；children 让容器接纳不同内容。',
    example:
      'ArticleList 把 article 交给 ArticleItem；收藏按钮调用 onFavorite，由拥有状态的父组件更新数据。',
    mistake:
      'Props 是只读输入，不要直接修改。回调是函数，传递 onClick={handleClick} 与渲染时执行 handleClick() 不一样。',
    task: '让一个按钮组件只负责展示与通知，不在内部保存父组件已经拥有的收藏状态。',
    related: ['components', 'sharing'],
    doc: 'passing-props-to-a-component',
    code: '<FavoriteButton\n  active={favorite}\n  onToggle={() => setFavorite(v => !v)}\n/>',
  },
  {
    id: 'state',
    title: 'State 与事件',
    question: '交互产生的数据记在哪里？',
    terms: 'useState · 事件 · 更新队列 · 不可变更新',
    description:
      'State 保存组件在多次渲染之间的记忆。事件处理函数请求更新，React 再用新的状态渲染。普通局部变量不会替你保留这种记忆。',
    example:
      '收藏按钮点击后更新 favorite。更新数组时创建新数组，而不是原地 push 后继续使用旧引用。',
    mistake:
      'setter 不会改写当前事件里的状态快照。依赖前一次更新结果时，使用 setCount(n => n + 1)。Hook 放在组件或自定义 Hook 顶层。',
    task: '预测同一个事件中三次直接更新与三次函数式更新的差别，再去渲染实验验证。',
    related: ['render', 'sharing'],
    doc: 'queueing-a-series-of-state-updates',
    code: 'setCount(n => n + 1)\nsetCount(n => n + 1)\nsetCount(n => n + 1)',
  },
  {
    id: 'render',
    title: '渲染与状态快照',
    question: '重新渲染等于重建整个页面吗？',
    terms: '触发 · 渲染 · 提交 · 状态身份',
    description:
      '更新触发渲染，React 调用组件计算 UI，再在提交阶段把必要的差异应用到 DOM。一次渲染中的 props、state 和事件处理函数共同构成这一轮快照。',
    example:
      'count 从 0 变成 1，组件函数重新执行，但 DOM 可能只需要更新一个文本节点。渲染不代表所有 DOM 都被重建。',
    mistake:
      '不要把调用组件函数的次数等同于提交次数。开发模式的 Strict Mode 可能额外调用组件和更新函数，用来发现不纯逻辑。',
    task: '逐步解释：事件里 count 还是 0，为什么下一轮界面可以显示 3？',
    related: ['state', 'effects', 'components'],
    doc: 'render-and-commit',
    code: '// 当前渲染的快照：count = 0\nsetCount(count + 1)\nconsole.log(count) // 仍然是 0',
  },
  {
    id: 'effects',
    title: 'Effect 与同步',
    question: '什么时候需要与 React 外部同步？',
    terms: 'useEffect · 依赖 · cleanup · 外部系统',
    description:
      'Effect 用来把已提交的界面与外部系统同步，例如连接聊天室、订阅事件或控制第三方播放器。依赖变化时先清理旧同步，再建立新同步；卸载时也要清理。',
    example:
      'roomId 改变时断开旧聊天室，连接新聊天室。过滤列表这类可从 props 和 state 算出的值，直接在渲染时计算即可。',
    mistake:
      'Effect 不是“所有变化都放这里”。不要靠漏写依赖避免执行；开发 Strict Mode 会额外执行一次 setup → cleanup 检查。Effect 不在服务端渲染中执行。',
    task: '区分“点击购买发送请求”和“进入房间建立连接”：哪个属于事件，哪个属于同步？',
    related: ['render', 'state'],
    doc: 'synchronizing-with-effects',
    code: 'useEffect(() => {\n  const connection = connect(roomId)\n  return () => connection.disconnect()\n}, [roomId])',
  },
  {
    id: 'sharing',
    title: '状态共享与组织',
    question: '多个组件需要同一份数据怎么办？',
    terms: '状态提升 · 单一来源 · Context · Reducer',
    description:
      '把共享状态放到需要它的组件的最近公共父级，用 props 和回调连接。传递层次很深时考虑 Context；更新规则复杂时用 reducer 集中描述状态变化。',
    example:
      '搜索框和结果列表共享 query，把它放到 SearchPage。结果列表由 query 和 articles 计算，不再额外保存一份 filteredArticles。',
    mistake:
      'Context 解决跨层传递，不会自动消除重新渲染。不要把所有状态都提升到全局，也不要重复保存能推导出的数据。',
    task: '为购物车选择状态归属：商品行数量、总价与弹窗是否打开，哪些需要共享？',
    related: ['props', 'state'],
    doc: 'sharing-state-between-components',
    code: "const [query, setQuery] = useState('')\nconst visible = articles.filter(article =>\n  article.title.includes(query)\n)",
  },
] as const

export type UpdateMode = 'replace' | 'updater'
export function renderTrace(mode: UpdateMode) {
  const values = mode === 'replace' ? [1, 1, 1] : [1, 2, 3]
  return [
    {
      title: '事件触发',
      detail: '这一轮渲染的 count = 0。点击事件里的三次调用都读取同一份快照。',
      value: 0,
      dom: 0,
      code: 'onClick → 当前快照 count = 0',
    },
    {
      title: '更新入队',
      detail:
        mode === 'replace'
          ? '三次 count + 1 都算出 1，依次入队三个“替换为 1”。当前事件里的 count 仍为 0。'
          : '三次调用入队三个更新函数。函数稍后读取队列中前一步的结果，而不是固定读取 0。',
      value: 0,
      dom: 0,
      code:
        mode === 'replace'
          ? '队列：[替换为 1, 替换为 1, 替换为 1]'
          : '队列：[n => n + 1, n => n + 1, n => n + 1]',
    },
    {
      title: '计算下一轮',
      detail:
        '事件处理结束后，React 处理更新队列，并调用组件计算下一轮 UI。这时还不能把计算结果当作已提交的 DOM。',
      value: values[2],
      dom: 0,
      code: `队列计算：0 → ${values.join(' → ')}\n下一轮 JSX：<button>${values[2]}</button>`,
    },
    {
      title: '提交到 DOM',
      detail:
        'React 将必要的差异应用到 DOM，按钮文本更新。三次 setter 调用不意味着三次独立的页面提交。',
      value: values[2],
      dom: values[2],
      code: `DOM 文本："0" → "${values[2]}"`,
    },
  ]
}

export const reactReflections = [
  {
    title: '解释',
    prompt: '三次 setCount(count + 1) 为什么只得到 1？请把快照、队列和提交串起来解释。',
    hint: '先写出每次 count + 1 的输入值。',
    criteria:
      '同一个事件捕获 count = 0；三个替换更新都是 1；处理队列后的状态是 1，提交后 DOM 才变为 1。',
    concept: 'state',
  },
  {
    title: '排错',
    prompt: '聊天组件每次切换 roomId 都连接新房间，却不断收到旧房间消息。你会检查哪里，怎样验证？',
    hint: '旧连接在何时断开？依赖是否覆盖 roomId？',
    criteria:
      '检查 Effect 的 roomId 依赖与清理函数；切换房间时断开旧连接；卸载后也没有残留订阅。用连接和断开日志验证，注意开发 Strict Mode 的额外检查。',
    concept: 'effects',
  },
  {
    title: '迁移',
    prompt: '两个商品组件和购物车总价需要保持同步。状态该放在哪里？总价需要单独保存吗？',
    hint: '谁同时需要数量？哪些数据可以计算出来？',
    criteria:
      '把购物车数量放在使用者的公共父级或适当的共享层；子组件通过回调请求修改；总价由价格和数量推导，避免多份数据不一致。',
    concept: 'sharing',
  },
] as const
