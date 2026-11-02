'use client'

import { useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react'
import { challenges, reflectionTasks, requestSteps, type Scenario } from './nestjs-data'
import './nestjs-explorer.css'

const scenarios: { id: Scenario; label: string }[] = [
  { id: 'success', label: '正常创建' },
  { id: 'unauthorized', label: '没有权限' },
  { id: 'invalid', label: '邮箱格式错误' },
  { id: 'conflict', label: '邮箱已存在' },
]

export function RequestWalkthrough() {
  const [scenario, setScenario] = useState<Scenario>('success')
  const [step, setStep] = useState(0)
  const [prediction, setPrediction] = useState<Scenario | null>(null)
  const [observing, setObserving] = useState(false)
  const steps = requestSteps(scenario)
  const current = steps[step]!
  return (
    <section aria-label="请求生命周期演示">
      <div className="nest-intro">
        <h2>跟着一次请求，穿过后端。</h2>
        <p>
          管理员创建用户：<code>POST /users</code>。换一个条件，看看执行在哪里停下。
        </p>
      </div>
      <div className="nest-choices" aria-label="请求场景">
        {scenarios.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={scenario === item.id}
            onClick={() => {
              setScenario(item.id)
              setStep(0)
              setPrediction(null)
              setObserving(false)
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <fieldset className="nest-prediction">
        <legend>先预测：这次请求会怎样结束？</legend>
        <p>选好上面的条件，再写下你的判断。随后展开真实的模拟路径。</p>
        <div className="nest-choices">
          {[
            { id: 'success', label: '写入成功，返回 201' },
            { id: 'unauthorized', label: '在 Guard 拒绝，返回 403' },
            { id: 'invalid', label: '在 Pipe 拒绝，返回 400' },
            { id: 'conflict', label: '写入冲突，返回 409' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={prediction === item.id}
              disabled={observing}
              onClick={() => setPrediction(item.id as Scenario)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="nest-action"
          disabled={prediction === null || observing}
          onClick={() => setObserving(true)}
        >
          验证预测，观察路径 <ArrowRight size={15} aria-hidden="true" />
        </button>
      </fieldset>
      {observing && (
        <>
          <p className="nest-prediction-result" role="status">
            {prediction === scenario
              ? '预测与结果一致。接下来逐步解释为什么。'
              : '结果与你的预测不同。沿着下面的路径，找出第一次分歧。'}{' '}
            最终结果：{steps.at(-1)?.name}。
          </p>
          <div className="nest-flow-layout">
            <ol className="nest-flow" aria-label="执行步骤">
              {steps.map((item, index) => (
                <li
                  key={`${scenario}-${item.name}`}
                  data-state={index === step ? 'current' : index < step ? 'done' : 'waiting'}
                >
                  <button
                    type="button"
                    onClick={() => setStep(index)}
                    aria-current={step === index ? 'step' : undefined}
                  >
                    <span className="nest-step-number">
                      {index < step ? <Check size={13} aria-hidden="true" /> : index + 1}
                    </span>
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="nest-step-detail">
              <div aria-live="polite" aria-atomic="true">
                <p className="nest-step-count">
                  第 {step + 1} / {steps.length} 步
                </p>
                <h3>{current.name}</h3>
                <p>{current.detail}</p>
                <pre>
                  <code>{current.code}</code>
                </pre>
              </div>
              <div className="nest-controls">
                <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>
                  <ArrowLeft size={15} aria-hidden="true" />
                  上一步
                </button>
                <button
                  type="button"
                  disabled={step === steps.length - 1}
                  onClick={() => setStep(step + 1)}
                >
                  下一步
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
                <button type="button" aria-label="重新走一遍" onClick={() => setStep(0)}>
                  <RotateCcw size={16} aria-hidden="true" />
                </button>
              </div>
              <p className="nest-note">
                教学模拟，不会发送真实请求。示例拦截器只处理成功响应；错误继续交给异常处理器。
              </p>
            </div>
          </div>
        </>
      )}
      <p className="nest-rule">
        记住拦截器的两个方向：进入在 Pipe 之前，返回在业务之后。Filter 只处理未捕获的异常。
      </p>
    </section>
  )
}

export function ModuleWorkshop() {
  const [exported, setExported] = useState(true)
  const [imported, setImported] = useState(true)
  const [prediction, setPrediction] = useState<string | null>(null)
  const [experiment, setExperiment] = useState(false)
  const connected = exported && imported
  return (
    <section aria-label="模块依赖实验">
      <div className="nest-intro">
        <h2>目录放在一起，能力就能共享吗？</h2>
        <p>AuthService 登录时需要查用户。试着断开一条声明，看依赖还能不能接上。</p>
      </div>
      <fieldset className="nest-prediction">
        <legend>先预测：断开任意一条声明后，会发生什么？</legend>
        <div className="nest-choices">
          {['仍然能注入', '无法解析依赖'].map((item) => (
            <button
              key={item}
              type="button"
              disabled={experiment}
              aria-pressed={prediction === item}
              onClick={() => setPrediction(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          className="nest-action"
          type="button"
          disabled={prediction === null || experiment}
          onClick={() => setExperiment(true)}
        >
          开始实验：允许修改声明 <ArrowRight size={15} aria-hidden="true" />
        </button>
      </fieldset>
      <div className="nest-module-root">
        AppModule <span>imports: [UsersModule, AuthModule]</span>
      </div>
      <div className="nest-modules">
        <section className="nest-module">
          <h3>UsersModule</h3>
          <p>提供用户能力</p>
          <div className="nest-provider">
            UsersController <ArrowDown size={16} aria-hidden="true" /> UsersService
          </div>
          <code>providers: [UsersService]</code>
          <label>
            <input
              type="checkbox"
              disabled={!experiment}
              checked={exported}
              onChange={(event) => setExported(event.target.checked)}
            />
            exports: [UsersService]
          </label>
        </section>
        <div className="nest-connection" data-connected={connected}>
          <ArrowRight size={26} aria-hidden="true" />
          <span>{connected ? '可注入' : '未接通'}</span>
        </div>
        <section className="nest-module">
          <h3>AuthModule</h3>
          <p>使用用户能力</p>
          <div className="nest-provider">
            AuthController <ArrowDown size={16} aria-hidden="true" /> AuthService
          </div>
          <code>providers: [AuthService]</code>
          <label>
            <input
              type="checkbox"
              disabled={!experiment}
              checked={imported}
              onChange={(event) => setImported(event.target.checked)}
            />
            imports: [UsersModule]
          </label>
        </section>
      </div>
      <div className="nest-module-result" aria-live="polite" aria-atomic="true">
        {experiment && !connected && (
          <p className="nest-prediction-result">
            {prediction === '无法解析依赖'
              ? '预测正确。试着恢复声明，验证依赖是否重新接通。'
              : '这次与预测不同。AppModule 的导入不会替代使用方的显式依赖。'}
          </p>
        )}
        <h3>
          {connected
            ? '依赖接通：AuthService 能拿到 UsersService。'
            : '依赖未接通：Nest 无法解析 UsersService。'}
        </h3>
        <p>
          {!exported
            ? 'UsersService 虽然已在 UsersModule 注册，但还没有对外导出。其他模块看不到它。'
            : !imported
              ? 'UsersModule 已开放 UsersService，但 AuthModule 没有导入 UsersModule。AppModule 导入两个模块不会让它们自动共享能力。'
              : 'UsersModule 注册并导出能力，AuthModule 导入提供者模块，Nest 再把 UsersService 注入 AuthService。'}
        </p>
        <pre>
          <code>{'constructor(private readonly usersService: UsersService) {}'}</code>
        </pre>
      </div>
      <p className="nest-note">
        这是普通模块的简化模型，假设 Provider 已正确注册且没有其他来源。全局模块、自定义
        token、动态模块与作用域留到需要时再学。
      </p>
    </section>
  )
}

export function Practice({ onExplore }: { onExplore: (id: string) => void }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const question = challenges[index]!
  const answer = answers[index]
  return (
    <section aria-label="理解自测">
      <div className="nest-intro">
        <h2>遇到问题，先找到它的位置。</h2>
        <p>不考装饰器拼写。试着判断：这个问题应该交给谁？</p>
      </div>
      <Reflection onExplore={onExplore} />
      <details className="nest-deeper">
        <summary>再做四道快速判断题</summary>
        <div className="nest-practice">
          <p className="nest-step-count">
            问题 {index + 1} / {challenges.length}
          </p>
          <h3>{question.question}</h3>
          <div className="nest-answers">
            {question.options.map((option, i) => (
              <button
                type="button"
                key={option}
                aria-pressed={answer === i}
                onClick={() => setAnswers({ ...answers, [index]: i })}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {option}
              </button>
            ))}
          </div>
          {answer !== undefined && (
            <div className="nest-feedback" aria-live="polite">
              <strong>
                {answer === question.answer
                  ? '对，找到了它的职责。'
                  : '再想一层：这个组件能守住这个边界吗？'}
              </strong>
              <p>{question.explanation}</p>
              <button type="button" onClick={() => onExplore(question.concept)}>
                回到知识树看关系 <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          )}
          <div className="nest-controls">
            <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}>
              上一题
            </button>
            <button
              type="button"
              disabled={index === challenges.length - 1}
              onClick={() => setIndex(index + 1)}
            >
              下一题
            </button>
            <button
              type="button"
              onClick={() => {
                setAnswers({})
                setIndex(0)
              }}
            >
              重新练习
            </button>
          </div>
        </div>
      </details>
    </section>
  )
}

function Reflection({ onExplore }: { onExplore: (id: string) => void }) {
  const [index, setIndex] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const task = reflectionTasks[index]!
  return (
    <div className="nest-reflection">
      <div className="nest-choices" aria-label="理解检查类型">
        {reflectionTasks.map((item, i) => (
          <button
            key={item.kind}
            type="button"
            aria-pressed={index === i}
            onClick={() => setIndex(i)}
          >
            {item.kind}
          </button>
        ))}
      </div>
      <h3>{task.title}</h3>
      <p>{task.prompt}</p>
      <label htmlFor="nest-reasoning">先用自己的话写下推理</label>
      <textarea
        id="nest-reasoning"
        rows={5}
        value={responses[index] ?? ''}
        onChange={(event) => setResponses({ ...responses, [index]: event.target.value })}
        placeholder="我会先检查……因为……我会用……验证。"
      />
      <p className="nest-note">
        只保留在当前视图，不上传、不自动评分。切换学习视图或刷新后会清空。
      </p>
      <details className="nest-code" key={task.kind}>
        <summary>需要一点提示</summary>
        <p>{task.hint}</p>
      </details>
      <button
        className="nest-action"
        type="button"
        disabled={!(responses[index] ?? '').trim()}
        onClick={() => setRevealed({ ...revealed, [index]: true })}
      >
        对照推理要点 <ArrowRight size={15} aria-hidden="true" />
      </button>
      {revealed[index] && (
        <div className="nest-feedback" aria-live="polite">
          <h4>对照你的解释，而不是只看答案</h4>
          <ul>
            {task.criteria.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>指出自己遗漏的一环，再改写上面的解释。能换一个例子说通，才比“看懂了”更接近理解。</p>
          <button type="button" onClick={() => onExplore(task.concept)}>
            回到知识树补这一环 <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
