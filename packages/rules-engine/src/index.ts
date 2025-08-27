
import { PurchaseRequest, SpendPolicy, EvaluationResult } from '@abrid/types';
import { timezoneOffset } from 'tz-offset';

function inTimeWindow(iso: string, window?: SpendPolicy['timeWindow']): boolean {
  if (!window) return true;
  const dt = new Date(iso);
  // Adjust hour by timezone if provided
  let hour = dt.getUTCHours();
  let day = dt.getUTCDay();
  if (window.timezone) {
    const offset = timezoneOffset(window.timezone, dt);
    const local = new Date(dt.getTime() + offset);
    hour = local.getHours();
    day = local.getDay();
  }
  if (window.hours && !window.hours.includes(hour)) return false;
  if (window.days && !window.days.includes(day)) return false;
  return true;
}

function blockedByList(value: string | undefined, allow?: string[], block?: string[]): {blocked: boolean, reason?: string} {
  if (!value) return { blocked: false };
  if (block && block.includes(value)) {
    return { blocked: true, reason: `Blocked by list: ${value}` };
  }
  if (allow && allow.length && !allow.includes(value)) {
    return { blocked: true, reason: `Not in allowlist: ${value}` };
  }
  return { blocked: false };
}

export interface EmployeePeriodSpend {
  dayTotal?: number;
  weekTotal?: number;
}

export function evaluatePurchase(
  req: PurchaseRequest,
  policy: SpendPolicy,
  employeeSpend: EmployeePeriodSpend = {}
): EvaluationResult {
  const reasons: string[] = [];
  let allowed = true;

  if (policy.projectId && policy.projectId !== req.project.id) {
    allowed = false;
    reasons.push(`Policy restricted to project ${policy.projectId}`);
  }

  if (policy.maxPerPurchase !== undefined && req.amount > policy.maxPerPurchase) {
    allowed = false;
    reasons.push(`Amount ${req.amount} exceeds maxPerPurchase ${policy.maxPerPurchase}`);
  }

  if (policy.dailyLimit !== undefined && (employeeSpend.dayTotal || 0) + req.amount > policy.dailyLimit) {
    allowed = false;
    reasons.push(`Daily limit exceeded: ${(employeeSpend.dayTotal || 0)} + ${req.amount} > ${policy.dailyLimit}`);
  }

  if (policy.weeklyLimit !== undefined && (employeeSpend.weekTotal || 0) + req.amount > policy.weeklyLimit) {
    allowed = false;
    reasons.push(`Weekly limit exceeded: ${(employeeSpend.weekTotal || 0)} + ${req.amount} > ${policy.weeklyLimit}`);
  }

  const vendorCheck = blockedByList(req.vendor, policy.vendorAllowlist, policy.vendorBlocklist);
  if (vendorCheck.blocked) {
    allowed = false;
    reasons.push(vendorCheck.reason!);
  }

  const mccCheck = blockedByList(req.mcc, policy.mccAllowlist, policy.mccBlocklist);
  if (mccCheck.blocked) {
    allowed = false;
    reasons.push(mccCheck.reason!);
  }

  if (!inTimeWindow(req.timestamp, policy.timeWindow)) {
    allowed = false;
    reasons.push(`Outside allowed time window`);
  }

  if (policy.blockCashWithdrawals && req.mcc === '6011') {
    allowed = false;
    reasons.push(`Cash-like transaction blocked (MCC 6011)`);
  }

  const result: EvaluationResult = {
    allowed,
    reasons,
    requiresPreauth: !!policy.requirePreauth,
    requiresReceipt: !!policy.requireReceipt,
    violated: allowed ? undefined : policy,
    policySnapshot: policy
  };

  return result;
}

// Helper to aggregate employee spend (stub for now; real system would query a datastore)
export function aggregateEmployeeSpend(requests: PurchaseRequest[], sinceISO: string): EmployeePeriodSpend {
  const since = new Date(sinceISO).getTime();
  const now = Date.now();
  const oneDay = 24*60*60*1000;
  const oneWeek = 7*oneDay;

  let dayTotal = 0;
  let weekTotal = 0;

  for (const r of requests) {
    const t = new Date(r.timestamp).getTime();
    if (now - t <= oneDay) dayTotal += r.amount;
    if (now - t <= oneWeek) weekTotal += r.amount;
  }

  return { dayTotal, weekTotal };
}
