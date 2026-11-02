import { describe, expect, it } from 'vitest'
import { requestSteps } from '@/components/learning/nestjs-data'

describe('NestJS request teaching model', () => {
  it('shows interceptor entry before validation and return after persistence', () => {
    const names = requestSteps('success').map((step) => step.name)
    expect(names.indexOf('Interceptor · 进入')).toBeLessThan(names.indexOf('Pipe'))
    expect(names.indexOf('Repository → 数据库')).toBeLessThan(names.indexOf('Interceptor · 返回'))
    expect(names.at(-1)).toBe('响应 → 201')
    expect(names.some((name) => name.includes('异常处理'))).toBe(false)
  })

  it('does not execute validation or business after a permission rejection', () => {
    const names = requestSteps('unauthorized').map((step) => step.name)
    expect(names).toEqual(['Middleware', 'Guard · 拒绝', '异常处理 → 403'])
  })

  it('does not execute business or persistence after input validation fails', () => {
    const names = requestSteps('invalid').map((step) => step.name)
    expect(names).toContain('Interceptor · 进入')
    expect(names).toContain('Pipe · 拒绝')
    expect(names.some((name) => /Controller|Repository/.test(name))).toBe(false)
    expect(names.at(-1)).toBe('异常处理 → 400')
  })

  it('explains the explicit database-error translation and skips success mapping on conflicts', () => {
    const steps = requestSteps('conflict')
    expect(steps.find((step) => step.name === 'Repository · 冲突')?.detail).toContain(
      'Nest 不会自动'
    )
    expect(steps.some((step) => step.name === 'Interceptor · 返回')).toBe(false)
    expect(steps.at(-1)?.name).toBe('异常处理 → 409')
  })
})
