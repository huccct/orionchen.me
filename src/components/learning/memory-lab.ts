const memoryHistory = [
  { day: 1, project: '博客', source: '用户确认', value: '每周发布' },
  { day: 2, project: '博客', source: '系统推测', value: '每天发布' },
  { day: 3, project: '博客', source: '用户确认', value: '每两周发布', expires: 5 },
  { day: 4, project: '课程', source: '用户确认', value: '每月发布' },
  { day: 6, project: '博客', source: '用户确认', value: '每月发布' },
  { day: 7, project: '博客', source: '用户确认', value: null },
] as const

export const memoryCases = [
  { day: 1, label: '首次保存', expected: '每周发布' },
  { day: 2, label: '出现系统推测', expected: '每周发布' },
  { day: 4, label: '用户更新，另一项目也有记录', expected: '每两周发布' },
  { day: 5, label: '新偏好到期', expected: null },
  { day: 6, label: '用户设置新的偏好', expected: '每月发布' },
  { day: 7, label: '用户撤回偏好', expected: null },
] as const

export function compareMemory(day: number) {
  // ponytail: one preference, fixed history in event order, and a manually advanced clock.
  const history = memoryHistory.filter((record) => record.day <= day)
  const latest = history.at(-1)
  const confirmed = history
    .filter((record) => record.project === '博客' && record.source === '用户确认')
    .at(-1)
  // Resolve the active revision before checking expiry. Expiry does not revive prior values.
  const expired = confirmed && 'expires' in confirmed && confirmed.expires <= day
  return {
    latest: latest?.value ?? null,
    scoped: expired ? null : (confirmed?.value ?? null),
    history,
  }
}
