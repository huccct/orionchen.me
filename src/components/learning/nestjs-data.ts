export const branches = [
  {
    id: 'foundation',
    title: '基础',
    question: '代码在哪里运行？',
    terms: ['Node.js', 'TypeScript', 'HTTP / REST', 'CLI / 调试'],
    description:
      'Node.js 提供运行环境，TypeScript 帮你在开发时检查类型，HTTP 定义客户端与服务端如何交流。它们是地基，不是 NestJS 专属知识。',
    example:
      '浏览器发出 GET /users/42；Node.js 接收连接，Nest 把请求交给对应路由。TypeScript 类型不会自动校验这次网络输入。',
    task: '启动项目，用 curl 或接口工具请求一个 GET 接口；改动返回值，观察热重载。',
    mistake: '类型声明会在编译后擦除。写了 email: string，不代表外部传入的一定是字符串。',
    doc: 'https://docs.nestjs.com/first-steps',
    related: '/blog/cursor-chrome-debug-nestjs',
    relatedTitle: '用 Chrome 调试 NestJS',
  },
  {
    id: 'structure',
    title: '组织',
    question: '组件怎样协作？',
    terms: ['Module', 'Controller', 'Provider / Service', 'DI / IoC'],
    description:
      'Module 划定依赖边界；Controller 接住 HTTP 请求；Service 执行业务规则。依赖注入让框架负责创建和连接实例。',
    example:
      'UsersController 声明依赖 UsersService。它不需要自己 new 一个 Service，也不应该直接承担所有业务规则。',
    task: '把用户查询放进 UsersService，通过构造函数注入到 Controller，再从接口返回结果。',
    mistake:
      '把文件移进某个文件夹不会自动注册模块。providers 注册能力，exports 和 imports 决定跨模块共享。',
    doc: 'https://docs.nestjs.com/modules',
    related: '/blog/dto-dao-mvc-explained',
    relatedTitle: 'DTO、DAO 与 MVC 的分工',
  },
  {
    id: 'request',
    title: '请求',
    question: '一次调用经过哪里？',
    terms: ['Middleware', 'Guard', 'Interceptor', 'Pipe', 'Exception Filter'],
    description:
      '请求经过预处理、访问判断、输入校验后进入业务。拦截器包围执行过程；异常处理器负责未捕获的异常。',
    example:
      '管理员创建用户：Guard 判断权限，Pipe 检查邮箱，Service 执行创建。任何一关失败，后续业务都不应继续。',
    task: '发送一个非法邮箱，确认接口返回 400，而且没有执行创建用户的数据库操作。',
    mistake:
      'Filter 不是成功请求的最后一站。Interceptor 的进入阶段在 Pipe 之前，返回阶段在业务之后。',
    doc: 'https://docs.nestjs.com/faq/request-lifecycle',
  },
  {
    id: 'data',
    title: '数据',
    question: '信息怎样正确保存？',
    terms: ['DTO / Entity', 'Repository / ORM', 'SQL / JOIN', '约束 / 事务 / 迁移'],
    description:
      'DTO 描述传输边界，Entity 映射持久化结构，Repository 或 ORM 负责数据访问。数据库约束与事务保护数据正确性。',
    example:
      '两次并发请求可能同时查到“邮箱不存在”。只有数据库唯一约束才能兜住最终的重复写入，Service 再把冲突转成可理解的错误。',
    task: '创建用户与关联资料时模拟第二次写入失败，验证事务会整体回滚。',
    mistake: 'TypeORM 只是可选工具。先理解数据模型与一致性，再选择 ORM；换工具不会改变这些问题。',
    doc: 'https://docs.nestjs.com/techniques/database',
    related: '/blog/dto-dao-mvc-explained',
    relatedTitle: '先分清 DTO 与数据访问层',
  },
  {
    id: 'security',
    title: '安全',
    question: '谁能做什么？',
    terms: ['认证 / JWT', '授权 / RBAC', '输入校验', '输出序列化'],
    description:
      '认证回答“你是谁”，授权回答“你能做什么”。输入校验限制进入系统的数据；明确的响应映射限制离开系统的数据。',
    example:
      '持有有效令牌的普通用户已经登录，但仍然不能调用管理员接口。返回用户资料时也不能带上密码哈希。',
    task: '分别用未登录、普通用户、管理员访问同一受保护接口，比较 401、403 与成功响应。',
    mistake: 'JWT 通常只是签名，不是加密，载荷可以被读取。不要把密码或密钥写进令牌。',
    doc: 'https://docs.nestjs.com/security/authentication',
  },
  {
    id: 'engineering',
    title: '工程',
    question: '服务怎样持续可靠？',
    terms: ['配置', '日志 / 异常', '单元 / E2E 测试', '部署 / Docker / PM2'],
    description:
      '配置隔离环境，日志串联现场，测试验证行为，部署让构建产物持续运行。业务写完之后，这条线依然贯穿每次改动。',
    example:
      '测试环境连接独立数据库；接口失败时，用请求 ID 找到相关日志；上线前用 E2E 测试验证认证和创建用户流程。',
    task: '为 Service 的一条业务规则写单测，再为接口的成功与拒绝场景各写一个 E2E 测试。',
    mistake:
      '不要把生产密钥提交进仓库，也不要在日志中打印完整令牌。Docker 是运行方式，不会替你保证业务正确。',
    doc: 'https://docs.nestjs.com/fundamentals/testing',
    related: '/blog/nestjs-configuration-explained',
    relatedTitle: '从 .env 到 YAML 理解配置',
  },
]

export type Scenario = 'success' | 'unauthorized' | 'invalid' | 'conflict'
export type RequestStep = { name: string; detail: string; code: string }
const middleware = {
  name: 'Middleware',
  detail: '接收 POST /users，附加请求 ID，方便关联后续日志。',
  code: 'requestId = "demo-001"',
}
const guard = {
  name: 'Guard',
  detail: '确认调用者已登录，并拥有管理员权限。认证和授权可以由不同守卫分别承担。',
  code: 'authenticated && role === "admin"',
}
const incoming = {
  name: 'Interceptor · 进入',
  detail: '开始计时，包围后续处理。这里还没有执行业务。',
  code: 'next.handle()',
}
const pipe = {
  name: 'Pipe',
  detail: 'ValidationPipe 根据 DTO 的校验规则检查邮箱，再把合法输入交给 Controller。',
  code: '@IsEmail() email: string',
}
export function requestSteps(scenario: Scenario): RequestStep[] {
  if (scenario === 'unauthorized')
    return [
      middleware,
      {
        name: 'Guard · 拒绝',
        detail: '令牌有效，但角色不是管理员。抛出 ForbiddenException，业务没有执行。',
        code: 'throw new ForbiddenException()',
      },
      {
        name: '异常处理 → 403',
        detail: '匹配的 Filter 或默认异常处理器生成错误响应。没有数据库写入。',
        code: '{ statusCode: 403, message: "Forbidden" }',
      },
    ]
  const start = [middleware, guard, incoming]
  if (scenario === 'invalid')
    return [
      ...start,
      {
        name: 'Pipe · 拒绝',
        detail:
          '输入不是有效邮箱，ValidationPipe 抛出 BadRequestException。Controller 与 Service 均未执行。',
        code: 'email = "not-an-email"',
      },
      {
        name: '异常处理 → 400',
        detail: '此示例的拦截器不捕获错误，因此错误继续传播到异常处理器。',
        code: '{ statusCode: 400, message: ["email must be an email"] }',
      },
    ]
  const business = [
    ...start,
    pipe,
    {
      name: 'Controller → Service',
      detail: 'Controller 调用 Service。业务层处理创建规则，并委托数据访问层写入。',
      code: 'return this.usersService.create(dto)',
    },
  ]
  if (scenario === 'conflict')
    return [
      ...business,
      {
        name: 'Repository · 冲突',
        detail:
          '数据库唯一约束拒绝重复邮箱。示例中 Service 识别该错误并转成 ConflictException；Nest 不会自动完成这次转换。',
        code: 'throw new ConflictException("邮箱已存在")',
      },
      {
        name: '异常处理 → 409',
        detail: '未被拦截器处理的异常交给异常处理器，响应中不暴露 SQL 或内部堆栈。',
        code: '{ statusCode: 409, message: "邮箱已存在" }',
      },
    ]
  return [
    ...business,
    {
      name: 'Repository → 数据库',
      detail: '插入用户记录。唯一约束保护邮箱不重复；成功写入后返回实体。',
      code: 'await repository.save(user)',
    },
    {
      name: 'Interceptor · 返回',
      detail: '示例中的响应映射只保留公开字段，并记录耗时；密码哈希不进入响应。',
      code: '({ id: user.id, email: user.email })',
    },
    {
      name: '响应 → 201',
      detail: 'POST 创建成功，客户端收到新用户的公开资料。所有数据都是教学示例，没有发出真实请求。',
      code: '{ id: 42, email: "hello@example.com" }',
    },
  ]
}

export const concepts = [
  {
    id: 'node',
    branch: 'foundation',
    name: 'Node.js',
    role: '运行环境',
    why: '让 JavaScript 在服务器上接收网络请求、访问文件与数据库。NestJS 是运行在它上面的框架。',
    link: 'Node.js 承载 HTTP 服务；Nest 再把请求分派给 Controller。',
    check: '能把 Node.js、NestJS 和 TypeScript 分别说成运行环境、框架和语言。',
    docs: 'https://docs.nestjs.com/first-steps',
  },
  {
    id: 'ts',
    branch: 'foundation',
    name: 'TypeScript',
    role: '开发时的类型约束',
    why: '用类型、接口、泛型和类表达代码之间的约定。装饰器元数据也是 Nest 组织组件的重要基础。',
    link: 'DTO 可以用 class 表达结构，但运行时校验仍需要 Pipe 与校验规则。',
    check: '能解释为什么 email: string 拦不住外部传来的数字。',
    docs: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html',
  },
  {
    id: 'http',
    branch: 'foundation',
    name: 'HTTP / REST',
    role: '客户端与服务端的契约',
    why: 'HTTP 方法、路径、请求体和状态码共同描述一次交互。REST 是组织资源接口的常见风格。',
    link: 'Controller 把 HTTP 路由映射到方法；异常处理把失败映射回 HTTP 响应。',
    check: '能描述 POST /users 的输入、成功响应，以及 400 和 403 的区别。',
    docs: 'https://docs.nestjs.com/controllers',
  },
  {
    id: 'module',
    branch: 'structure',
    name: 'Module',
    role: '组织与依赖边界',
    why: '把同一业务能力的组件组织起来，并声明它依赖什么、对外提供什么。文件夹只是摆放位置，Module 才声明可见性。',
    link: 'providers 注册 → exports 开放 → 使用方 imports 导入 → 构造函数注入。',
    check: '能解释为什么 AppModule 同时导入两个模块，不等于它们能互相使用私有 Provider。',
    docs: 'https://docs.nestjs.com/modules',
  },
  {
    id: 'controller',
    branch: 'structure',
    name: 'Controller',
    role: '接口入口',
    why: '声明路由，接收已经处理过的输入，调用业务能力并返回结果。保持入口薄，业务规则才能复用和测试。',
    link: 'Pipe → Controller → Service。HTTP 细节尽量留在入口，数据库细节交给数据访问层。',
    check: '新增一个查用户接口时，能把路由声明与用户查询规则分开。',
    docs: 'https://docs.nestjs.com/controllers',
  },
  {
    id: 'service',
    branch: 'structure',
    name: 'Service / DI',
    role: '业务能力与装配',
    why: 'Service 通常是一种 Provider。依赖注入根据类或 token 找到已注册的能力，交给需要它的组件。',
    link: 'Controller 依赖 Service，Service 依赖 Repository；测试时可以用替身替换依赖。',
    check: '能区分“用 new 创建对象”和“向容器声明我需要这个依赖”。',
    docs: 'https://docs.nestjs.com/providers',
  },
  {
    id: 'middleware',
    branch: 'request',
    name: 'Middleware',
    role: '请求预处理',
    why: '在路由处理之前执行通用预处理，例如附加请求 ID。它能访问请求与响应，但不像 Guard 那样拥有路由执行上下文。',
    link: '请求 → Middleware → Guard。不要因为它先执行，就把所有校验和权限都塞进去。',
    check: '给全站请求附加 requestId，能说明为什么适合放在 Middleware。',
    docs: 'https://docs.nestjs.com/middleware',
  },
  {
    id: 'pipe',
    branch: 'request',
    name: 'Pipe',
    role: '校验与转换输入',
    why: '在参数进入处理方法之前验证或转换它。ValidationPipe 结合 DTO 校验规则，ParseIntPipe 可把路径参数转成整数。',
    link: 'Interceptor 进入 → Pipe → Controller。校验失败会阻止业务执行。',
    check: '访问 /users/abc 时，能在 ID 进入业务层前拒绝它。',
    docs: 'https://docs.nestjs.com/pipes',
  },
  {
    id: 'interceptor',
    branch: 'request',
    name: 'Interceptor',
    role: '包围执行过程',
    why: '在调用前后附加逻辑，例如耗时统计、响应映射，也可以用 RxJS 处理错误。它有“进入”和“返回”两个方向。',
    link: '进入时在 Pipe 之前，返回时在 Service 之后。多个拦截器按先入后出的顺序返回。',
    check: '能画出全局和路由拦截器的进入、返回顺序。',
    docs: 'https://docs.nestjs.com/interceptors',
  },
  {
    id: 'filter',
    branch: 'request',
    name: 'Exception Filter',
    role: '未捕获异常的出口',
    why: '把未处理的异常转成合适的响应。默认异常处理器已能处理常见 HTTP 异常，只有需要定制时才编写 Filter。',
    link: '失败处 → 匹配的 Filter 或默认处理器 → 错误响应。成功请求不会经过它。',
    check: '能解释为什么自己 catch 并处理的错误不会再触发异常过滤器。',
    docs: 'https://docs.nestjs.com/exception-filters',
  },
  {
    id: 'dto',
    branch: 'data',
    name: 'DTO / Entity',
    role: '传输形状与存储形状',
    why: 'DTO 描述接口如何收发数据；Entity 描述持久化映射。两者经常不同，不能直接把数据库对象当成公开接口。',
    link: '输入 DTO → Service → Entity；返回时再映射成公开数据，去掉密码哈希等字段。',
    check: '能说出创建用户 DTO、用户表和公开响应各有哪些不同字段。',
    docs: 'https://docs.nestjs.com/techniques/validation',
  },
  {
    id: 'repository',
    branch: 'data',
    name: 'Repository / ORM',
    role: '数据访问',
    why: '把查询和持久化细节隔离在数据访问层。ORM 帮你映射对象与数据库，但不能替代理解 SQL、关联和索引。',
    link: 'Service 调用 Repository；Repository 与数据库交流。TypeORM、Prisma 或直接 SQL 都是选择。',
    check: '能解释业务规则为什么不该依赖 HTTP 请求对象，也不该散落在查询语句里。',
    docs: 'https://docs.nestjs.com/techniques/database',
  },
  {
    id: 'transaction',
    branch: 'data',
    name: '约束 / 事务',
    role: '保证数据正确',
    why: '唯一约束保护不变量；事务让多次写入作为一个整体提交或回滚。应用层先查再写无法单独解决并发重复。',
    link: '业务意图 → 事务内写入 → 数据库约束兜底 → 业务层识别并转译冲突。',
    check: '创建订单后扣库存失败，能说明哪些操作应该一起回滚。',
    docs: 'https://docs.nestjs.com/techniques/database#transactions',
  },
  {
    id: 'auth',
    branch: 'security',
    name: '认证 / JWT',
    role: '确认你是谁',
    why: '验证身份后建立会话或签发令牌。JWT 是一种令牌格式；验证签名、有效期等条件后才能信任声明。',
    link: '登录验证 → 签发令牌 → 后续请求验证令牌 → 授权判断。认证成功不等于拥有全部权限。',
    check: '能解释为什么不能把密码放进 JWT 载荷。',
    docs: 'https://docs.nestjs.com/security/authentication',
  },
  {
    id: 'guard',
    branch: 'security',
    name: 'Guard / 授权',
    role: '决定是否放行',
    why: 'Guard 可根据当前路由、用户身份和权限规则决定是否执行处理方法。它常用于认证入口和角色、权限判断。',
    link: 'Middleware → Guard → Interceptor。普通用户即使已登录，也可能在这里被拒绝。',
    check: '“只有管理员可以创建用户”，能把检查放到合适的执行边界。',
    docs: 'https://docs.nestjs.com/guards',
  },
  {
    id: 'serialization',
    branch: 'security',
    name: '输出边界',
    role: '只返回允许公开的数据',
    why: '明确映射响应字段，或配置序列化拦截器。数据库实体包含的信息常常比客户端应该看到的多。',
    link: 'Service 返回对象 → 响应映射 / 序列化 → 客户端。前端不显示字段并不等于后端没泄露它。',
    check: '检查真实响应 JSON，确认 passwordHash 没有出现。',
    docs: 'https://docs.nestjs.com/techniques/serialization',
  },
  {
    id: 'config',
    branch: 'engineering',
    name: '配置 / 日志',
    role: '区分环境与定位现场',
    why: '配置把环境差异与业务代码分开，日志把故障现场串起来。启动时验证必需配置，用请求 ID 关联日志。',
    link: '配置提供运行参数；请求流各阶段产生日志，帮助定位失败属于哪一层。',
    check: '能用一条失败请求的 ID 找到对应日志，而不打印令牌或密码。',
    docs: 'https://docs.nestjs.com/techniques/configuration',
  },
  {
    id: 'testing',
    branch: 'engineering',
    name: '单测 / E2E',
    role: '验证规则和协作',
    why: '单元测试隔离依赖验证业务规则；端到端测试从接口入口检查模块、校验、权限与业务能否一起工作。',
    link: 'DI 使替换依赖更方便；E2E 再验证这些组件真正连起来的行为。',
    check: '对同一接口测试成功、无权限、非法输入，而不只测返回 200。',
    docs: 'https://docs.nestjs.com/fundamentals/testing',
  },
  {
    id: 'deployment',
    branch: 'engineering',
    name: '构建 / 部署',
    role: '让服务可靠运行',
    why: '构建产物需要正确配置、进程管理和可观测性。容器只是运行方式，还要考虑健康检查、迁移和优雅关闭。',
    link: '测试通过 → 构建 → 注入环境配置 → 启动与健康检查 → 持续观察。',
    check: '能解释为什么本地启动成功不代表生产数据库与配置都已准备好。',
    docs: 'https://docs.nestjs.com/deployment',
  },
]

export const challenges = [
  {
    question: 'URL 是 /users/abc，但业务需要一个整数 ID。应该先找谁？',
    options: ['Pipe', 'Repository', 'Module'],
    answer: 0,
    explanation: 'Pipe 在参数进入处理方法前校验或转换它。ParseIntPipe 可以拒绝这个无效 ID。',
    concept: 'pipe',
  },
  {
    question: '用户已经登录，但不允许删除别人的文章。判断应该落在哪个边界？',
    options: ['Middleware 记录日志', 'Guard 配合授权策略', 'DTO 的字段类型'],
    answer: 1,
    explanation:
      '授权判断操作权限；资源归属规则可以由策略或业务服务提供给 Guard，业务层也应维护必要的不变量。',
    concept: 'guard',
  },
  {
    question: '两个并发请求同时注册同一个邮箱，怎样保证最终不会重复？',
    options: ['Controller 中先查询', 'TypeScript 声明邮箱类型', '数据库唯一约束兜底'],
    answer: 2,
    explanation:
      '两个请求都可能先查到“不存在”。数据库唯一约束负责最终一致的拒绝，业务层把冲突转换成明确响应。',
    concept: 'transaction',
  },
  {
    question: 'UsersService 已注册并导出，但 AuthModule 仍然无法注入它。先检查什么？',
    options: [
      'AuthModule 是否 imports UsersModule',
      '是否加了一个新路由',
      '是否把文件移到同一个目录',
    ],
    answer: 0,
    explanation: '导出只是开放能力，使用方还需要导入提供该能力的模块。目录位置不决定 DI 可见性。',
    concept: 'module',
  },
]

export const conceptNotes: Record<
  string,
  { when: string; pitfall: string; code: string; related: string[] }
> = {
  node: {
    when: '排查服务为什么没有响应、某段计算为什么阻塞其他请求时。',
    pitfall: 'async 不会自动把 CPU 密集计算移到别的线程。同步重计算仍可能堵住事件循环。',
    code: 'const app = await NestFactory.create(AppModule)\nawait app.listen(3000)',
    related: ['http', 'deployment'],
  },
  ts: {
    when: '描述组件之间的约定，让重构时的类型错误提前暴露。',
    pitfall: 'interface 不会成为运行时的校验器；来自网络的数据仍然不可信。',
    code: 'interface PublicUser {\n  id: number\n  email: string\n}',
    related: ['dto', 'pipe'],
  },
  http: {
    when: '设计一个接口的路径、输入和成功或失败响应时。',
    pitfall: 'HTTP 200 并不能表达所有结果；创建、未登录、无权限和输入错误有不同语义。',
    code: '@Controller("users")\nexport class UsersController {\n  @Get(":id")\n  findOne(@Param("id", ParseIntPipe) id: number) { /* ... */ }\n}',
    related: ['controller', 'filter'],
  },
  module: {
    when: '拆分业务功能，或者另一个模块需要使用本模块的服务时。',
    pitfall: 'AppModule 同时导入两个模块，不会让这两个模块自动看见对方的私有 Provider。',
    code: '@Module({\n  providers: [UsersService],\n  exports: [UsersService],\n})\nexport class UsersModule {}\n\n@Module({ imports: [UsersModule], providers: [AuthService] })\nexport class AuthModule {}',
    related: ['service', 'controller'],
  },
  controller: {
    when: '把 HTTP 请求映射到一个应用能力，处理路径、参数和响应状态时。',
    pitfall: '不要把所有业务都写进 Controller；后台任务和测试也可能需要调用同一业务能力。',
    code: '@Post()\ncreate(@Body() dto: CreateUserDto) {\n  return this.usersService.create(dto)\n}',
    related: ['pipe', 'service', 'http'],
  },
  service: {
    when: '实现可以独立于 HTTP 入口存在的业务规则，或替换外部依赖做测试时。',
    pitfall:
      'Service 不是框架强制的一层，也不是所有 Provider 的同义词；Provider 还可以是工厂、值等。',
    code: '@Injectable()\nexport class UsersService {\n  constructor(private readonly repo: UsersRepository) {}\n}',
    related: ['module', 'repository', 'testing'],
  },
  middleware: {
    when: '给请求加追踪 ID，或做与具体路由业务无关的预处理时。',
    pitfall: '忘记调用 next() 且没有结束响应，会让请求悬挂；复杂路由权限更适合 Guard。',
    code: 'use(req, res, next) {\n  req.requestId = randomUUID()\n  next()\n}',
    related: ['guard', 'config'],
  },
  pipe: {
    when: '外部输入需要在进入业务前验证或转换，例如数字 ID、邮箱、分页参数。',
    pitfall: '只写 DTO 类型不会自动校验。需要注册 ValidationPipe 并为 DTO 添加校验规则。',
    code: 'app.useGlobalPipes(new ValidationPipe({\n  whitelist: true,\n  transform: true,\n}))\n\nclass CreateUserDto {\n  @IsEmail()\n  email: string\n}',
    related: ['dto', 'controller', 'interceptor'],
  },
  interceptor: {
    when: '需要围绕处理过程统一计时、映射返回值或处理 Observable 错误时。',
    pitfall: '成功响应的 map 不会自动处理错误；需要 catchError 才能显式接住错误流。',
    code: 'return next.handle().pipe(\n  map(user => ({ id: user.id, email: user.email }))\n)',
    related: ['pipe', 'serialization', 'filter'],
  },
  filter: {
    when: '默认异常响应不满足要求，需要统一错误格式或定制特定异常映射时。',
    pitfall: 'Filter 不是每次请求的必经站；已被应用代码处理的异常也不会再触发它。',
    code: 'throw new BadRequestException("邮箱格式不正确")\n// 默认异常处理器即可把 HTTP 异常转换为响应。',
    related: ['interceptor', 'http'],
  },
  dto: {
    when: '接口的输入、输出与数据库字段不同，或需要明确数据边界时。',
    pitfall: '把 Entity 原样返回可能泄露字段；DTO 类本身也不等于已开启验证或序列化。',
    code: 'class CreateUserDto {\n  @IsEmail()\n  email: string\n}\n// Entity 还可能包含 id、passwordHash、createdAt。',
    related: ['pipe', 'repository', 'serialization'],
  },
  repository: {
    when: '业务需要查询、写入数据，或者需要把数据库细节与业务规则隔离时。',
    pitfall: 'ORM 并不保证每条查询高效。关联加载、分页与索引仍要回到 SQL 和执行计划理解。',
    code: '// TypeORM 示例，数据访问层片段\nreturn this.usersRepository.findOneBy({ id })',
    related: ['service', 'dto', 'transaction'],
  },
  transaction: {
    when: '多个写操作必须一起成功，或需要确保并发下的唯一性等不变量时。',
    pitfall: '先查再写不能防住并发重复；事务中的操作也必须使用同一个事务上下文。',
    code: '// TypeORM 事务片段\nawait dataSource.transaction(async manager => {\n  await manager.save(order)\n  await manager.save(stockChange)\n})',
    related: ['repository', 'service'],
  },
  auth: {
    when: '登录、验证令牌、恢复当前用户身份时。',
    pitfall: '签名不等于加密；JWT 载荷可读。还需要验证有效期、签名及业务要求的声明。',
    code: 'const payload = await jwtService.verifyAsync(token)\n// 验证后，再把身份交给授权逻辑。',
    related: ['guard', 'serialization'],
  },
  guard: {
    when: '根据用户身份、角色或资源策略决定这次调用是否允许进入时。',
    pitfall: '登录成功不等于拥有权限；只在前端隐藏按钮无法保护后端接口。',
    code: '@UseGuards(JwtAuthGuard, RolesGuard)\n@Roles("admin")\n@Post()\ncreate(@Body() dto: CreateUserDto) { /* ... */ }\n// 守卫与 Roles 装饰器需要自行实现或接入。',
    related: ['auth', 'middleware', 'service'],
  },
  serialization: {
    when: '数据离开服务端之前，需要限定公开字段时。',
    pitfall:
      '加 @Exclude() 不是所有对象都自动生效，需正确配置序列化并满足实例转换要求。显式映射更直观。',
    code: 'return {\n  id: user.id,\n  email: user.email,\n}\n// 不把 passwordHash 放入响应。',
    related: ['dto', 'interceptor', 'auth'],
  },
  config: {
    when: '切换运行环境、检查启动参数，或沿请求追踪故障时。',
    pitfall: '环境变量通常是字符串，需要校验和必要转换；日志不要记录密钥或完整令牌。',
    code: 'const port = configService.get<number>("port")\n// 假设 port 已在配置加载时转换并验证。\nlogger.log({ requestId, action: "create-user" })',
    related: ['node', 'middleware', 'deployment'],
  },
  testing: {
    when: '改动业务规则、重构组件、验证权限与输入边界没有退化时。',
    pitfall: '只测“能返回成功”会漏掉拒绝路径；Mock 全部依赖也不能证明真实组件能协作。',
    code: 'const module = await Test.createTestingModule({\n  providers: [UsersService, {\n    provide: UsersRepository,\n    useValue: fakeRepository,\n  }],\n}).compile()',
    related: ['service', 'guard', 'deployment'],
  },
  deployment: {
    when: '把服务从开发机搬到可持续运行的环境时。',
    pitfall: '容器启动不代表服务健康；还要检查配置、数据库连接和关闭时的资源释放。',
    code: 'app.enableShutdownHooks()\nawait app.listen(port)\n// 环境还需配置健康检查、日志与进程管理。',
    related: ['config', 'testing', 'node'],
  },
}

export const reflectionTasks = [
  {
    kind: '解释',
    title: '不看图，向另一个人解释一次请求',
    prompt:
      '一个管理员提交了格式错误的邮箱。请按顺序说出执行到哪里、哪些组件不会执行，以及为什么。',
    criteria: [
      '先经过 Middleware、Guard 和拦截器进入阶段，再到 Pipe。',
      'Pipe 拒绝后，Controller、Service 与数据库写入不执行。',
      '本示例拦截器不捕获错误，最终由异常处理器返回 400。',
    ],
    hint: '拦截器有两个方向；不要把成功返回阶段也当作已经执行。',
    concept: 'pipe',
  },
  {
    kind: '排错',
    title: '明明导出了，为什么还是注入失败？',
    prompt:
      'UsersModule 已注册并导出 UsersService。AppModule 同时导入 UsersModule 和 AuthModule，但 AuthService 注入失败。写下你会先检查的声明、最小修复，以及如何验证。',
    criteria: [
      '检查 AuthModule 是否 imports UsersModule，而不是只看 AppModule。',
      '在使用方导入提供能力的模块；不要先靠重复注册 UsersService 掩盖边界问题。',
      '启动模块或通过测试编译 AuthModule，验证依赖能解析，并调用实际用户查询。',
    ],
    hint: '从“谁使用能力”出发，沿导入关系往回找。',
    concept: 'module',
  },
  {
    kind: '迁移应用',
    title: '从创建用户，换成创建订单',
    prompt:
      '需求变成：登录用户下单，数量必须为正整数，创建订单与扣库存必须一起成功。请为每条要求找到位置，再写出一个失败场景该如何验证。',
    criteria: [
      'Guard 做身份与访问判断，DTO + Pipe 校验数量。',
      'Service 承担下单规则；Repository 执行持久化，事务协调订单与库存写入。',
      '模拟扣库存失败，验证订单写入回滚；并发库存正确性还需条件更新、锁或合适隔离策略。',
    ],
    hint: '把“输入是否合法”“业务是否允许”“数据能否一起提交”分开想。',
    concept: 'transaction',
  },
]
