# Learning curriculum outline

Source snapshot: 2026-11-03. Generated from the composed React and NestJS map exports, preserving source domain/group order. This review outline records implemented conceptual coverage, not a claim that every API or ecosystem integration is covered. Update it when curriculum data changes.

The hierarchy is topic → domain → group → concept. Levels are 基础 (foundational), 进阶 (advanced), 工程 (engineering) and 生态 (ecosystem). Each listed node provides an explanation, usage guidance, misconception, learning goal and relationships in its inspector. Code is optional. Official links are the source-authored references; listing a link does not imply a fresh network verification.

## Coverage and experiment boundaries

- React covers primary client, server-boundary, engineering and ecosystem decisions. The only interactive render model is a fixed synchronous event comparing three direct updates with three updater functions from zero. It excludes concurrent interruption, Suspense, Server Components, flushSync and extra Strict Mode development calls; it is not realtime tracing or a performance tool.
- React exposes the related render experiment from `queue`, `snapshot`, `commit`, `use-state` and `events`. Other concepts have conceptual explanation and practice goals without a dedicated simulation.
- NestJS covers primary backend architecture, protocols, data, security, async, distributed and operational decisions. Its module and request experiments are deterministic browser teaching models, not a running backend, database, queue or distributed deployment.
- NestJS organization-domain (`structure`) concepts link to the related module experiment; request/security-domain concepts link to the related request experiment. A related experiment does not demonstrate every advanced concept in that domain.
- Reflection activities ask for explanation, debugging and transfer within their stated scenarios. They do not grade mastery of this entire outline. Responses persist only within the current mounted practice view and clear on learning-view changes, refresh or departure.

## Source ownership

- Shared schema/layout: `src/components/learning/map-types.ts`, `map-layout.ts` and `knowledge-map-workspace.tsx`.
- React outline: `src/components/learning/react-map-data.ts`, composing foundational nodes and `react-curriculum.ts`; activity mapping: `react-explorer.tsx`.
- NestJS outline: `src/components/learning/nestjs-map-data.ts`, composing `nestjs-data.ts` and `nestjs-curriculum.ts`; activity mapping: `nestjs-mindmap.tsx`.

## React

Current source: 14 domains, 31 groups, 63 concepts. Counts describe this snapshot and are not layout constraints.

### 语言与平台

React 建立在什么之上？

#### 语言基础

| Concept                         | Level | Official reference                                                  |
| ------------------------------- | ----- | ------------------------------------------------------------------- |
| 闭包与不可变数据 (`js-model`)   | 基础  | [Documentation](https://react.dev/learn/updating-objects-in-state)  |
| Promise 与异步顺序 (`async-js`) | 基础  | [Documentation](https://react.dev/learn/synchronizing-with-effects) |

#### 平台与类型

| Concept                              | Level | Official reference                                            |
| ------------------------------------ | ----- | ------------------------------------------------------------- |
| TypeScript 与类型边界 (`typescript`) | 工程  | [Documentation](https://react.dev/learn/typescript)           |
| DOM、事件与浏览器 (`dom-platform`)   | 基础  | [Documentation](https://react.dev/learn/responding-to-events) |

### 组件与 JSX

界面怎样拆分？

#### 核心概念

| Concept             | Level | Official reference                                               |
| ------------------- | ----- | ---------------------------------------------------------------- |
| 组件 (`component`)  | 基础  | [Documentation](https://react.dev/learn/your-first-component)    |
| JSX (`jsx`)         | 基础  | [Documentation](https://react.dev/learn/writing-markup-with-jsx) |
| 列表与 key (`keys`) | 基础  | [Documentation](https://react.dev/learn/rendering-lists)         |

#### 组件契约

| Concept                          | Level | Official reference                                               |
| -------------------------------- | ----- | ---------------------------------------------------------------- |
| 纯渲染与条件渲染 (`pure-render`) | 基础  | [Documentation](https://react.dev/learn/keeping-components-pure) |

#### 跨树与逃生口

| Concept                       | Level | Official reference                                                  |
| ----------------------------- | ----- | ------------------------------------------------------------------- |
| Portal 与事件归属 (`portals`) | 进阶  | [Documentation](https://react.dev/reference/react-dom/createPortal) |

### Props 与组合

信息怎样传递？

#### 核心概念

| Concept                        | Level | Official reference                                                    |
| ------------------------------ | ----- | --------------------------------------------------------------------- |
| Props (`props`)                | 基础  | [Documentation](https://react.dev/learn/passing-props-to-a-component) |
| children / 组合 (`children`)   | 基础  | [Documentation](https://react.dev/learn/passing-props-to-a-component) |
| 回调与单向数据流 (`callbacks`) | 基础  | [Documentation](https://react.dev/learn/responding-to-events)         |

### State 与事件

交互怎样被记住？

#### 核心概念

| Concept                | Level | Official reference                                                          |
| ---------------------- | ----- | --------------------------------------------------------------------------- |
| useState (`use-state`) | 基础  | [Documentation](https://react.dev/learn/state-a-components-memory)          |
| 事件处理 (`events`)    | 基础  | [Documentation](https://react.dev/learn/responding-to-events)               |
| 更新队列 (`queue`)     | 基础  | [Documentation](https://react.dev/learn/queueing-a-series-of-state-updates) |

#### 状态建模

| Concept                               | Level | Official reference                                                    |
| ------------------------------------- | ----- | --------------------------------------------------------------------- |
| 状态结构与不可变更新 (`state-design`) | 进阶  | [Documentation](https://react.dev/learn/choosing-the-state-structure) |

### 渲染与快照

界面何时更新？

#### 核心概念

| Concept                     | Level | Official reference                                                      |
| --------------------------- | ----- | ----------------------------------------------------------------------- |
| 状态快照 (`snapshot`)       | 基础  | [Documentation](https://react.dev/learn/state-as-a-snapshot)            |
| 渲染与提交 (`commit`)       | 基础  | [Documentation](https://react.dev/learn/render-and-commit)              |
| 状态身份与重置 (`identity`) | 基础  | [Documentation](https://react.dev/learn/preserving-and-resetting-state) |

### Effect 与同步

怎样连接外部系统？

#### 核心概念

| Concept                        | Level | Official reference                                                    |
| ------------------------------ | ----- | --------------------------------------------------------------------- |
| useEffect (`effect`)           | 基础  | [Documentation](https://react.dev/learn/synchronizing-with-effects)   |
| 依赖数组 (`dependencies`)      | 基础  | [Documentation](https://react.dev/learn/removing-effect-dependencies) |
| 清理与 Strict Mode (`cleanup`) | 基础  | [Documentation](https://react.dev/learn/synchronizing-with-effects)   |

#### 同步时机

| Concept                                  | Level | Official reference                                                 |
| ---------------------------------------- | ----- | ------------------------------------------------------------------ |
| useLayoutEffect 与测量 (`layout-effect`) | 进阶  | [Documentation](https://react.dev/reference/react/useLayoutEffect) |
| useEffectEvent (`effect-event`)          | 进阶  | [Documentation](https://react.dev/reference/react/useEffectEvent)  |

### 共享与组织

状态应该放在哪里？

#### 核心概念

| Concept                        | Level | Official reference                                                             |
| ------------------------------ | ----- | ------------------------------------------------------------------------------ |
| 状态提升 (`lifting`)           | 基础  | [Documentation](https://react.dev/learn/sharing-state-between-components)      |
| Context (`context`)            | 基础  | [Documentation](https://react.dev/learn/passing-data-deeply-with-context)      |
| Reducer 与派生数据 (`reducer`) | 基础  | [Documentation](https://react.dev/learn/extracting-state-logic-into-a-reducer) |

### Hook 与复用

逻辑与命令式能力怎样组织？

#### 逻辑复用

| Concept                             | Level | Official reference                                                       |
| ----------------------------------- | ----- | ------------------------------------------------------------------------ |
| 自定义 Hook 与规则 (`custom-hooks`) | 进阶  | [Documentation](https://react.dev/learn/reusing-logic-with-custom-hooks) |

#### 命令式边界

| Concept                            | Level | Official reference                                                     |
| ---------------------------------- | ----- | ---------------------------------------------------------------------- |
| useRef 与 DOM 引用 (`ref`)         | 进阶  | [Documentation](https://react.dev/reference/react/useRef)              |
| useImperativeHandle (`imperative`) | 进阶  | [Documentation](https://react.dev/reference/react/useImperativeHandle) |

#### 外部集成

| Concept                                        | Level | Official reference                                                      |
| ---------------------------------------------- | ----- | ----------------------------------------------------------------------- |
| useSyncExternalStore (`external-store`)        | 进阶  | [Documentation](https://react.dev/reference/react/useSyncExternalStore) |
| useDebugValue 与库级 Hook (`hook-diagnostics`) | 进阶  | [Documentation](https://react.dev/reference/react/hooks)                |

### 表单与 Actions

输入、提交与反馈怎样协作？

#### 输入建模

| Concept                              | Level | Official reference                                                      |
| ------------------------------------ | ----- | ----------------------------------------------------------------------- |
| 受控与非受控输入 (`controlled`)      | 基础  | [Documentation](https://react.dev/reference/react-dom/components/input) |
| 校验、错误与焦点 (`form-validation`) | 工程  | [Documentation](https://react.dev/reference/react-dom/components/form)  |

#### 提交与反馈

| Concept                                   | Level | Official reference                                                         |
| ----------------------------------------- | ----- | -------------------------------------------------------------------------- |
| 表单 Action 与 useActionState (`actions`) | 进阶  | [Documentation](https://react.dev/reference/react/useActionState)          |
| useFormStatus (`form-status`)             | 进阶  | [Documentation](https://react.dev/reference/react-dom/hooks/useFormStatus) |
| useOptimistic 与回滚 (`optimistic`)       | 进阶  | [Documentation](https://react.dev/reference/react/useOptimistic)           |

### 异步与并发

等待时怎样保持可用？

#### 数据生命周期

| Concept                           | Level | Official reference                                                      |
| --------------------------------- | ----- | ----------------------------------------------------------------------- |
| 请求竞态与取消 (`fetch-race`)     | 工程  | [Documentation](https://react.dev/learn/you-might-not-need-an-effect)   |
| 服务端状态与缓存 (`server-state`) | 生态  | [Documentation](https://react.dev/learn/build-a-react-app-from-scratch) |

#### 并发呈现

| Concept                                         | Level | Official reference                                                  |
| ----------------------------------------------- | ----- | ------------------------------------------------------------------- |
| Suspense 与 lazy (`suspense`)                   | 进阶  | [Documentation](https://react.dev/reference/react/Suspense)         |
| useTransition / startTransition (`transitions`) | 进阶  | [Documentation](https://react.dev/reference/react/useTransition)    |
| useDeferredValue (`deferred`)                   | 进阶  | [Documentation](https://react.dev/reference/react/useDeferredValue) |

#### 资源读取

| Concept                          | Level | Official reference                                          |
| -------------------------------- | ----- | ----------------------------------------------------------- |
| use 与资源读取 (`use-resource`)  | 进阶  | [Documentation](https://react.dev/reference/react/use)      |
| Activity 与视图保留 (`activity`) | 进阶  | [Documentation](https://react.dev/reference/react/Activity) |

### 服务端与边界

代码在哪里执行？

#### 渲染入口

| Concept                             | Level | Official reference                                                        |
| ----------------------------------- | ----- | ------------------------------------------------------------------------- |
| createRoot 与 hydrateRoot (`roots`) | 进阶  | [Documentation](https://react.dev/reference/react-dom/client/hydrateRoot) |
| SSR、流式输出与静态生成 (`ssr`)     | 进阶  | [Documentation](https://react.dev/reference/react-dom/server)             |

#### 服务端边界

| Concept                                             | Level | Official reference                                                 |
| --------------------------------------------------- | ----- | ------------------------------------------------------------------ |
| Server Components (`rsc`)                           | 进阶  | [Documentation](https://react.dev/reference/rsc/server-components) |
| use client 边界 (`client-boundary`)                 | 进阶  | [Documentation](https://react.dev/reference/rsc/use-client)        |
| Server Functions 与 use server (`server-functions`) | 进阶  | [Documentation](https://react.dev/reference/rsc/server-functions)  |

#### 资源与部署

| Concept                                 | Level | Official reference                                       |
| --------------------------------------- | ----- | -------------------------------------------------------- |
| cache 与请求级复用 (`server-cache`)     | 进阶  | [Documentation](https://react.dev/reference/react/cache) |
| 资源提示与文档元数据 (`resource-hints`) | 进阶  | [Documentation](https://react.dev/reference/react-dom)   |

### 性能与诊断

怎样用证据优化？

#### 测量与定位

| Concept                           | Level | Official reference                                          |
| --------------------------------- | ----- | ----------------------------------------------------------- |
| Profiler 与性能轨迹 (`profiling`) | 工程  | [Documentation](https://react.dev/reference/react/Profiler) |

#### 减少无效工作

| Concept                                      | Level | Official reference                                      |
| -------------------------------------------- | ----- | ------------------------------------------------------- |
| memo / useMemo / useCallback (`memoization`) | 进阶  | [Documentation](https://react.dev/reference/react/memo) |
| React Compiler (`compiler`)                  | 工程  | [Documentation](https://react.dev/learn/react-compiler) |

#### 规模与加载

| Concept                         | Level | Official reference                                                      |
| ------------------------------- | ----- | ----------------------------------------------------------------------- |
| 长列表、拆包与预取 (`large-ui`) | 工程  | [Documentation](https://react.dev/learn/build-a-react-app-from-scratch) |

### 质量与可访问性

怎样验证真实用户体验？

#### 故障隔离

| Concept                           | Level | Official reference                                           |
| --------------------------------- | ----- | ------------------------------------------------------------ |
| 错误边界与恢复 (`error-boundary`) | 进阶  | [Documentation](https://react.dev/reference/react/Component) |

#### 用户可达性

| Concept                     | Level | Official reference                                       |
| --------------------------- | ----- | -------------------------------------------------------- |
| 语义、焦点与 useId (`a11y`) | 工程  | [Documentation](https://react.dev/reference/react/useId) |

#### 测试与诊断

| Concept                                 | Level | Official reference                                            |
| --------------------------------------- | ----- | ------------------------------------------------------------- |
| 交互测试、act 与端到端 (`testing`)      | 工程  | [Documentation](https://react.dev/reference/react/act)        |
| StrictMode 与 Hook 检查 (`lint-strict`) | 工程  | [Documentation](https://react.dev/reference/react/StrictMode) |

### 应用与生态

怎样组成可维护的产品？

#### 应用组装

| Concept                                  | Level | Official reference                                                    |
| ---------------------------------------- | ----- | --------------------------------------------------------------------- |
| 路由、框架与数据层 (`framework-routing`) | 生态  | [Documentation](https://react.dev/learn/creating-a-react-app)         |
| 样式与组件系统 (`styling`)               | 生态  | [Documentation](https://react.dev/learn/passing-props-to-a-component) |

#### 维护与演进

| Concept                                          | Level | Official reference                                        |
| ------------------------------------------------ | ----- | --------------------------------------------------------- |
| 类组件、旧 API 与升级 (`legacy-migration`)       | 工程  | [Documentation](https://react.dev/reference/react/legacy) |
| 稳定版、Canary 与实验能力 (`version-boundaries`) | 工程  | [Documentation](https://react.dev/versions)               |

## NestJS

Current source: 13 domains, 42 groups, 73 concepts. Counts describe this snapshot and are not layout constraints.

### 基础

代码在哪里运行？

#### 核心概念

| Concept              | Level | Official reference                                                                  |
| -------------------- | ----- | ----------------------------------------------------------------------------------- |
| Node.js (`node`)     | 基础  | [Documentation](https://docs.nestjs.com/first-steps)                                |
| TypeScript (`ts`)    | 基础  | [Documentation](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) |
| HTTP / REST (`http`) | 基础  | [Documentation](https://docs.nestjs.com/controllers)                                |

#### 语言与运行时

| Concept                                | Level | Official reference                                                     |
| -------------------------------------- | ----- | ---------------------------------------------------------------------- |
| 事件循环与异步 I/O (`node-async`)      | 基础  | [Documentation](https://docs.nestjs.com/first-steps)                   |
| 装饰器与运行时元数据 (`ts-decorators`) | 基础  | [Documentation](https://docs.nestjs.com/fundamentals/custom-providers) |

#### 应用入口

| Concept                              | Level | Official reference                                               |
| ------------------------------------ | ----- | ---------------------------------------------------------------- |
| Bootstrap 与应用上下文 (`bootstrap`) | 基础  | [Documentation](https://docs.nestjs.com/standalone-applications) |

### 组织

组件怎样协作？

#### 核心概念

| Concept                   | Level | Official reference                                   |
| ------------------------- | ----- | ---------------------------------------------------- |
| Module (`module`)         | 基础  | [Documentation](https://docs.nestjs.com/modules)     |
| Controller (`controller`) | 基础  | [Documentation](https://docs.nestjs.com/controllers) |
| Service / DI (`service`)  | 基础  | [Documentation](https://docs.nestjs.com/providers)   |

### 请求

一次调用经过哪里？

#### 核心概念

| Concept                     | Level | Official reference                                         |
| --------------------------- | ----- | ---------------------------------------------------------- |
| Middleware (`middleware`)   | 基础  | [Documentation](https://docs.nestjs.com/middleware)        |
| Pipe (`pipe`)               | 基础  | [Documentation](https://docs.nestjs.com/pipes)             |
| Interceptor (`interceptor`) | 基础  | [Documentation](https://docs.nestjs.com/interceptors)      |
| Exception Filter (`filter`) | 基础  | [Documentation](https://docs.nestjs.com/exception-filters) |

#### 请求边界

| Concept                              | Level | Official reference                                             |
| ------------------------------------ | ----- | -------------------------------------------------------------- |
| 路由参数与响应控制 (`routing-http`)  | 基础  | [Documentation](https://docs.nestjs.com/controllers)           |
| ValidationPipe 与转换 (`validation`) | 进阶  | [Documentation](https://docs.nestjs.com/techniques/validation) |

#### 执行模型

| Concept                                             | Level | Official reference                                                      |
| --------------------------------------------------- | ----- | ----------------------------------------------------------------------- |
| 请求生命周期与绑定范围 (`request-order`)            | 进阶  | [Documentation](https://docs.nestjs.com/faq/request-lifecycle)          |
| 自定义装饰器与元数据 (`custom-decorators`)          | 进阶  | [Documentation](https://docs.nestjs.com/custom-decorators)              |
| ExecutionContext 与 Reflector (`execution-context`) | 进阶  | [Documentation](https://docs.nestjs.com/fundamentals/execution-context) |

### 数据

信息怎样正确保存？

#### 核心概念

| Concept                         | Level | Official reference                                                        |
| ------------------------------- | ----- | ------------------------------------------------------------------------- |
| DTO / Entity (`dto`)            | 基础  | [Documentation](https://docs.nestjs.com/techniques/validation)            |
| Repository / ORM (`repository`) | 基础  | [Documentation](https://docs.nestjs.com/techniques/database)              |
| 约束 / 事务 (`transaction`)     | 基础  | [Documentation](https://docs.nestjs.com/techniques/database#transactions) |

#### 持久化接入

| Concept                                    | Level | Official reference                                           |
| ------------------------------------------ | ----- | ------------------------------------------------------------ |
| TypeORM、Prisma 与 MongoDB (`orm-options`) | 进阶  | [Documentation](https://docs.nestjs.com/techniques/database) |

#### 查询与模型

| Concept                           | Level | Official reference                                           |
| --------------------------------- | ----- | ------------------------------------------------------------ |
| 分页、索引与 N+1 (`query-design`) | 工程  | [Documentation](https://docs.nestjs.com/techniques/database) |

#### 数据演进

| Concept                         | Level | Official reference                                           |
| ------------------------------- | ----- | ------------------------------------------------------------ |
| 迁移与兼容性发布 (`migrations`) | 工程  | [Documentation](https://docs.nestjs.com/techniques/database) |

#### 一致性边界

| Concept                        | Level | Official reference                                           |
| ------------------------------ | ----- | ------------------------------------------------------------ |
| 幂等与并发控制 (`consistency`) | 工程  | [Documentation](https://docs.nestjs.com/techniques/database) |

#### 访问加速

| Concept                    | Level | Official reference                                          |
| -------------------------- | ----- | ----------------------------------------------------------- |
| 缓存、TTL 与失效 (`cache`) | 进阶  | [Documentation](https://docs.nestjs.com/techniques/caching) |

### 安全

谁能做什么？

#### 核心概念

| Concept                    | Level | Official reference                                                |
| -------------------------- | ----- | ----------------------------------------------------------------- |
| 认证 / JWT (`auth`)        | 基础  | [Documentation](https://docs.nestjs.com/security/authentication)  |
| Guard / 授权 (`guard`)     | 基础  | [Documentation](https://docs.nestjs.com/guards)                   |
| 输出边界 (`serialization`) | 基础  | [Documentation](https://docs.nestjs.com/techniques/serialization) |

#### 身份与权限

| Concept                                    | Level | Official reference                                               |
| ------------------------------------------ | ----- | ---------------------------------------------------------------- |
| 认证策略与会话生命周期 (`auth-strategies`) | 进阶  | [Documentation](https://docs.nestjs.com/security/authentication) |
| RBAC、策略与资源授权 (`policies`)          | 进阶  | [Documentation](https://docs.nestjs.com/security/authorization)  |

#### 输入与隔离

| Concept                                   | Level | Official reference                                              |
| ----------------------------------------- | ----- | --------------------------------------------------------------- |
| 租户隔离与数据最小化 (`security-context`) | 工程  | [Documentation](https://docs.nestjs.com/security/authorization) |

#### Web 防护

| Concept                                       | Level | Official reference                                     |
| --------------------------------------------- | ----- | ------------------------------------------------------ |
| CORS、CSRF、Helmet 与 Cookie (`web-security`) | 工程  | [Documentation](https://docs.nestjs.com/security/csrf) |

#### 滥用防护

| Concept                       | Level | Official reference                                              |
| ----------------------------- | ----- | --------------------------------------------------------------- |
| 限流与代理信任 (`rate-limit`) | 工程  | [Documentation](https://docs.nestjs.com/security/rate-limiting) |

### 工程

服务怎样持续可靠？

#### 核心概念

| Concept                    | Level | Official reference                                                |
| -------------------------- | ----- | ----------------------------------------------------------------- |
| 配置 / 日志 (`config`)     | 基础  | [Documentation](https://docs.nestjs.com/techniques/configuration) |
| 单测 / E2E (`testing`)     | 基础  | [Documentation](https://docs.nestjs.com/fundamentals/testing)     |
| 构建 / 部署 (`deployment`) | 基础  | [Documentation](https://docs.nestjs.com/deployment)               |

#### 测试策略

| Concept                                     | Level | Official reference                                            |
| ------------------------------------------- | ----- | ------------------------------------------------------------- |
| 单元、集成、契约与 E2E (`testing-layers`)   | 工程  | [Documentation](https://docs.nestjs.com/fundamentals/testing) |
| TestingModule 与依赖替换 (`test-overrides`) | 进阶  | [Documentation](https://docs.nestjs.com/fundamentals/testing) |

#### 配置与交付

| Concept                              | Level | Official reference                                                |
| ------------------------------------ | ----- | ----------------------------------------------------------------- |
| 配置校验与秘密管理 (`configuration`) | 工程  | [Documentation](https://docs.nestjs.com/techniques/configuration) |
| CI、容器与发布回滚 (`ci-release`)    | 工程  | [Documentation](https://docs.nestjs.com/deployment)               |

### 依赖与生命周期

复杂依赖怎样管理？

#### 依赖注册

| Concept                             | Level | Official reference                                                     |
| ----------------------------------- | ----- | ---------------------------------------------------------------------- |
| 自定义 token 与 Provider (`tokens`) | 进阶  | [Documentation](https://docs.nestjs.com/fundamentals/custom-providers) |
| 异步 Provider (`async-providers`)   | 进阶  | [Documentation](https://docs.nestjs.com/fundamentals/async-providers)  |

#### 模块封装

| Concept                                  | Level | Official reference                                                    |
| ---------------------------------------- | ----- | --------------------------------------------------------------------- |
| 动态模块与配置构建器 (`dynamic-modules`) | 进阶  | [Documentation](https://docs.nestjs.com/fundamentals/dynamic-modules) |

#### 实例生命周期

| Concept                           | Level | Official reference                                                     |
| --------------------------------- | ----- | ---------------------------------------------------------------------- |
| 单例、请求与瞬态作用域 (`scopes`) | 进阶  | [Documentation](https://docs.nestjs.com/fundamentals/injection-scopes) |
| 生命周期与优雅关闭 (`lifecycle`)  | 进阶  | [Documentation](https://docs.nestjs.com/fundamentals/lifecycle-events) |

#### 依赖诊断

| Concept                         | Level | Official reference                                                        |
| ------------------------------- | ----- | ------------------------------------------------------------------------- |
| 循环依赖与 ModuleRef (`cycles`) | 进阶  | [Documentation](https://docs.nestjs.com/fundamentals/circular-dependency) |

### API 契约与协议

怎样定义和演进接口？

#### HTTP 契约

| Concept                         | Level | Official reference                                             |
| ------------------------------- | ----- | -------------------------------------------------------------- |
| OpenAPI 与文档 (`openapi`)      | 工程  | [Documentation](https://docs.nestjs.com/openapi/introduction)  |
| 版本管理与兼容性 (`versioning`) | 工程  | [Documentation](https://docs.nestjs.com/techniques/versioning) |

#### GraphQL

| Concept                                        | Level | Official reference                                           |
| ---------------------------------------------- | ----- | ------------------------------------------------------------ |
| Schema、Resolver 与类型策略 (`graphql`)        | 进阶  | [Documentation](https://docs.nestjs.com/graphql/quick-start) |
| GraphQL 加载、订阅与复杂度 (`graphql-runtime`) | 工程  | [Documentation](https://docs.nestjs.com/graphql/complexity)  |

#### 数据传输

| Concept                      | Level | Official reference                                              |
| ---------------------------- | ----- | --------------------------------------------------------------- |
| 文件上传与流式响应 (`files`) | 进阶  | [Documentation](https://docs.nestjs.com/techniques/file-upload) |

### 异步任务与调度

工作怎样可靠地延后？

#### 后台工作

| Concept                      | Level | Official reference                                         |
| ---------------------------- | ----- | ---------------------------------------------------------- |
| BullMQ 与任务队列 (`queues`) | 进阶  | [Documentation](https://docs.nestjs.com/techniques/queues) |

#### 时间与事件

| Concept                               | Level | Official reference                                                  |
| ------------------------------------- | ----- | ------------------------------------------------------------------- |
| 定时任务与分布式执行 (`scheduling`)   | 进阶  | [Documentation](https://docs.nestjs.com/techniques/task-scheduling) |
| 进程内事件与持久消息 (`local-events`) | 进阶  | [Documentation](https://docs.nestjs.com/techniques/events)          |

### 实时通信

怎样持续推送消息？

#### 双向通信

| Concept                             | Level | Official reference                                           |
| ----------------------------------- | ----- | ------------------------------------------------------------ |
| Gateway 与 WebSocket (`websockets`) | 进阶  | [Documentation](https://docs.nestjs.com/websockets/gateways) |
| 适配器、房间与多实例 (`ws-scale`)   | 工程  | [Documentation](https://docs.nestjs.com/websockets/adapter)  |

#### 单向推送

| Concept                   | Level | Official reference                                                     |
| ------------------------- | ----- | ---------------------------------------------------------------------- |
| SSE 与 Observable (`sse`) | 进阶  | [Documentation](https://docs.nestjs.com/techniques/server-sent-events) |

#### 流的生命周期

| Concept                                  | Level | Official reference                                    |
| ---------------------------------------- | ----- | ----------------------------------------------------- |
| RxJS、取消与背压边界 (`cleanup-streams`) | 进阶  | [Documentation](https://docs.nestjs.com/interceptors) |

### 微服务与消息

跨进程如何协作？

#### 通信模型

| Concept                                | Level | Official reference                                            |
| -------------------------------------- | ----- | ------------------------------------------------------------- |
| Transport 与请求 / 事件 (`transports`) | 进阶  | [Documentation](https://docs.nestjs.com/microservices/basics) |
| gRPC 与 Protobuf (`grpc`)              | 进阶  | [Documentation](https://docs.nestjs.com/microservices/grpc)   |

#### 消息系统

| Concept                                | Level | Official reference                                           |
| -------------------------------------- | ----- | ------------------------------------------------------------ |
| Kafka、RabbitMQ 与消息语义 (`brokers`) | 进阶  | [Documentation](https://docs.nestjs.com/microservices/kafka) |

#### 可靠性

| Concept                                     | Level | Official reference                                              |
| ------------------------------------------- | ----- | --------------------------------------------------------------- |
| 确认、重试、死信与幂等 (`message-delivery`) | 工程  | [Documentation](https://docs.nestjs.com/microservices/rabbitmq) |
| 超时、补偿与跨服务事务 (`distributed-flow`) | 工程  | [Documentation](https://docs.nestjs.com/microservices/basics)   |

### 可观测与运维

怎样发现并处理故障？

#### 上下文与追踪

| Concept                                         | Level | Official reference                                                   |
| ----------------------------------------------- | ----- | -------------------------------------------------------------------- |
| AsyncLocalStorage 与关联 ID (`request-context`) | 工程  | [Documentation](https://docs.nestjs.com/recipes/async-local-storage) |
| 日志、指标与分布式追踪 (`operations-metrics`)   | 工程  | [Documentation](https://docs.nestjs.com/techniques/logger)           |

#### 服务运行

| Concept                                  | Level | Official reference                                              |
| ---------------------------------------- | ----- | --------------------------------------------------------------- |
| 健康检查、存活与就绪 (`health`)          | 工程  | [Documentation](https://docs.nestjs.com/recipes/terminus)       |
| Express、Fastify 与平台差异 (`adapters`) | 进阶  | [Documentation](https://docs.nestjs.com/techniques/performance) |

#### 容量与故障

| Concept                         | Level | Official reference                                              |
| ------------------------------- | ----- | --------------------------------------------------------------- |
| 超时、负载与降级 (`resilience`) | 工程  | [Documentation](https://docs.nestjs.com/techniques/http-module) |

### 架构与工程演进

系统怎样长期可维护？

#### 模块化设计

| Concept                                    | Level | Official reference                               |
| ------------------------------------------ | ----- | ------------------------------------------------ |
| 领域边界与模块化单体 (`domain-boundaries`) | 工程  | [Documentation](https://docs.nestjs.com/modules) |

#### 业务建模

| Concept                       | Level | Official reference                                    |
| ----------------------------- | ----- | ----------------------------------------------------- |
| CQRS、命令与领域事件 (`cqrs`) | 进阶  | [Documentation](https://docs.nestjs.com/recipes/cqrs) |

#### 复用与维护

| Concept                                           | Level | Official reference                                              |
| ------------------------------------------------- | ----- | --------------------------------------------------------------- |
| Monorepo、库与 CLI (`monorepo`)                   | 工程  | [Documentation](https://docs.nestjs.com/cli/monorepo)           |
| 外部 SDK、邮件与对象存储 (`integration-boundary`) | 生态  | [Documentation](https://docs.nestjs.com/techniques/http-module) |
