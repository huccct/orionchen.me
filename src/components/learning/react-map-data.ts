import { reactConcepts } from './react-data'
import type { MapBranch, MapConcept, MapNote } from './knowledge-map-workspace'

export const reactMapBranches: MapBranch[] = [
  { id: 'components', title: '组件与 JSX', question: '界面怎样拆分？' },
  { id: 'props', title: 'Props 与组合', question: '信息怎样传递？' },
  { id: 'state', title: 'State 与事件', question: '交互怎样被记住？' },
  { id: 'render', title: '渲染与快照', question: '界面何时更新？' },
  { id: 'effects', title: 'Effect 与同步', question: '怎样连接外部系统？' },
  { id: 'sharing', title: '共享与组织', question: '状态应该放在哪里？' },
]

// Each leaf introduces one mechanism; its branch supplies the surrounding context.
const leaves = [
  [
    'component',
    'components',
    '组件',
    '可复用的界面函数',
    '把界面拆成有名字、可复用的部分。React 调用组件函数，得到这一轮 UI 描述；组件名以大写字母开头。',
    'your-first-component',
    'function Greeting({ name }) {\n  return <h2>你好，{name}</h2>\n}',
  ],
  [
    'jsx',
    'components',
    'JSX',
    '用 JavaScript 描述结构',
    '在标记里用花括号嵌入表达式。JSX 不是 HTML 字符串；标签需要闭合，多项返回内容需要一个共同容器或 Fragment。',
    'writing-markup-with-jsx',
    'return (\n  <>\n    <h1>{title}</h1>\n    <p>{summary}</p>\n  </>\n)',
  ],
  [
    'keys',
    'components',
    '列表与 key',
    '识别列表中的同一项',
    '稳定 key 帮 React 在插入、删除、重排时识别同一项。key 在兄弟节点间唯一；排序列表通常用数据 ID，而不是位置。',
    'rendering-lists',
    'articles.map(article => (\n  <Article key={article.id} article={article} />\n))',
  ],
  [
    'props',
    'props',
    'Props',
    '父组件传下来的只读输入',
    '父组件传递数据，子组件读取数据来描述界面。Props 可以包含对象和函数，但子组件不能把输入当成自己的可变状态。',
    'passing-props-to-a-component',
    '<Avatar person={user} size={80} />',
  ],
  [
    'children',
    'props',
    'children / 组合',
    '让容器接纳不同内容',
    '通过 children 把内容嵌入布局容器。容器负责边框或布局，调用方决定放什么，避免为每种内容重新写一个容器。',
    'passing-props-to-a-component',
    'function Panel({ children }) {\n  return <section>{children}</section>\n}',
  ],
  [
    'callbacks',
    'props',
    '回调与单向数据流',
    '让子组件表达操作意图',
    '状态向下传，事件通过回调交给拥有状态的一方处理。传递函数，不要在渲染时就调用它。',
    'responding-to-events',
    '<Button onClick={handleSave}>保存</Button>',
  ],
  [
    'use-state',
    'state',
    'useState',
    '跨渲染保留组件记忆',
    'useState 返回这一轮状态和 setter。setter 请求下一轮更新，不会改写当前函数里的状态变量。Hook 应在组件或自定义 Hook 顶层调用。',
    'state-a-components-memory',
    'const [count, setCount] = useState(0)\n// 在事件处理函数里调用\nsetCount(count + 1)',
  ],
  [
    'events',
    'state',
    '事件处理',
    '响应一次明确的用户操作',
    '在点击、输入等事件中执行业务动作或请求状态更新。由用户操作触发的购买请求通常属于事件，而不是 Effect。',
    'responding-to-events',
    'function handleClick() {\n  setCount(n => n + 1)\n}\nreturn <button onClick={handleClick}>{count}</button>',
  ],
  [
    'queue',
    'state',
    '更新队列',
    '把多次更新按顺序计算',
    '同一事件内的直接传值读取同一份状态快照。函数式更新接收队列中前一个结果，因此连续三次加一可以累加到三。',
    'queueing-a-series-of-state-updates',
    'setCount(n => n + 1)\nsetCount(n => n + 1)\nsetCount(n => n + 1)',
  ],
  [
    'snapshot',
    'render',
    '状态快照',
    '固定这一轮看到的数据',
    '每次渲染都有自己的 props、state 和事件处理函数。即使请求了更新，当前事件中的变量仍属于创建它的那一轮渲染。',
    'state-as-a-snapshot',
    '// 当前渲染 count = 0\nsetCount(count + 1)\nconsole.log(count) // 0',
  ],
  [
    'commit',
    'render',
    '渲染与提交',
    '计算界面，再应用差异',
    '渲染阶段调用组件计算 UI；提交阶段修改必要的 DOM。重新渲染不等于重建所有 DOM，渲染调用次数也不等于提交次数。',
    'render-and-commit',
    '// 数据更新 → 计算下一轮 JSX → 提交 DOM 差异\nreturn <button>{count}</button>',
  ],
  [
    'identity',
    'render',
    '状态身份与重置',
    '用位置、类型和 key 识别组件',
    'React 把状态关联到渲染树中的组件身份。在相同位置改变组件类型或 key，可以让旧状态被丢弃并创建新状态。',
    'preserving-and-resetting-state',
    '<Chat key={recipient.id} recipient={recipient} />',
  ],
  [
    'effect',
    'effects',
    'useEffect',
    '同步 React 之外的系统',
    '提交后用 Effect 同步订阅、连接或第三方控件。它不是计算派生数据的默认位置，也不在服务端渲染期间执行。',
    'synchronizing-with-effects',
    'useEffect(() => {\n  const connection = connect(roomId)\n  return () => connection.disconnect()\n}, [roomId])',
  ],
  [
    'dependencies',
    'effects',
    '依赖数组',
    '声明同步所依赖的响应式值',
    'Effect 读取的响应式值需要声明为依赖。依赖改变意味着同步条件变了，应重新同步；不要通过漏写依赖来压制重新执行。',
    'removing-effect-dependencies',
    'useEffect(() => {\n  document.title = title\n}, [title])',
  ],
  [
    'cleanup',
    'effects',
    '清理与 Strict Mode',
    '让同步可以停止和重新建立',
    '依赖变化时先清理旧 Effect，再建立新同步；卸载时也清理。开发 Strict Mode 可能额外执行 setup → cleanup → setup，帮助暴露缺少清理的问题。',
    'synchronizing-with-effects',
    'useEffect(() => {\n  window.addEventListener("resize", onResize)\n  return () => window.removeEventListener("resize", onResize)\n}, [onResize])',
  ],
  [
    'lifting',
    'sharing',
    '状态提升',
    '把共享状态放到公共父级',
    '多个组件需要协调时，把状态放到最近的公共父级。用 props 分发当前值，用回调请求修改，避免各自保存一份导致不同步。',
    'sharing-state-between-components',
    "const [query, setQuery] = useState('')\nreturn <>\n  <Search value={query} onChange={setQuery} />\n  <Results query={query} />\n</>",
  ],
  [
    'context',
    'sharing',
    'Context',
    '跨层传递共享输入',
    '当 props 需要穿过许多不使用它的中间组件时，Context 可以提供读取通道。它不是自动优化渲染的工具，也不意味着所有状态都应该全局化。',
    'passing-data-deeply-with-context',
    '<ThemeContext value={theme}>\n  <Page />\n</ThemeContext>',
  ],
  [
    'reducer',
    'sharing',
    'Reducer 与派生数据',
    '集中更新规则，减少重复状态',
    '更新逻辑复杂时用 reducer 根据旧状态和 action 计算新状态。总价、筛选结果等可由现有数据算出的值通常直接计算，避免保存重复状态。',
    'extracting-state-logic-into-a-reducer',
    'const total = items.reduce(\n  (sum, item) => sum + item.price * item.quantity,\n  0\n)',
  ],
] as const

export const reactMapConcepts: MapConcept[] = leaves.map(([id, branch, name, role, why, doc]) => {
  const parent = reactConcepts.find((item) => item.id === branch)!
  return {
    id,
    branch,
    name,
    role,
    why,
    link: parent.description,
    check: parent.task,
    docs: `https://react.dev/learn/${doc}`,
  }
})
export const reactMapNotes: Record<string, MapNote> = Object.fromEntries(
  leaves.map(([id, branch, , , , , code]) => {
    const parent = reactConcepts.find((item) => item.id === branch)!
    return [
      id,
      {
        when: parent.example,
        pitfall: parent.mistake,
        code,
        related: parent.related.map((related) => leaves.find((item) => item[1] === related)![0]),
      },
    ]
  })
)
