type ReportId = 'A' | 'B'

export function auditReportCall({
  scope,
  tool,
  report,
  approvedReport,
}: {
  scope: 'read' | 'read-write'
  tool: 'read_report' | 'write_report'
  report: ReportId
  approvedReport: ReportId | null
}) {
  // ponytail: the identities are fixed and the report ID is the only editable argument in this lab.
  let reason: 'allowed' | 'scope_denied' | 'approval_required' | 'approval_target_mismatch' =
    'allowed'
  if (tool === 'write_report') {
    if (scope === 'read') reason = 'scope_denied'
    else if (approvedReport === null) reason = 'approval_required'
    else if (approvedReport !== report) reason = 'approval_target_mismatch'
  }

  return {
    delegator: 'learning-user',
    actor: 'report-agent',
    scope,
    tool,
    report,
    approvedReport,
    decision: reason === 'allowed' ? 'allow' : 'deny',
    reason,
  }
}
