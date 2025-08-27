
import { evaluatePurchase } from '../src/index';
import { PurchaseRequest, SpendPolicy } from '@abrid/types';
import assert from 'node:assert';

const baseReq: PurchaseRequest = {
  id: 'req1',
  employeeId: 'emp1',
  employeeRole: 'EMPLOYEE',
  project: { id: 'proj1', name: 'Main House' },
  timestamp: new Date().toISOString(),
  amount: 100,
  vendor: 'HomeDepot',
  mcc: '5211',
  method: 'CARD',
  description: 'Paint'
};

const basePolicy: SpendPolicy = {
  projectId: 'proj1',
  maxPerPurchase: 200,
  dailyLimit: 500,
  weeklyLimit: 1500,
  vendorAllowlist: ['HomeDepot', 'Lowes'],
  mccAllowlist: ['5211', '1520'],
  timeWindow: { hours: [8,9,10,11,12,13,14,15,16,17,18], days: [1,2,3,4,5], timezone: 'America/Los_Angeles' },
  requirePreauth: true,
  requireReceipt: true,
  blockCashWithdrawals: true
};

{
  const res = evaluatePurchase(baseReq, basePolicy, { dayTotal: 0, weekTotal: 0 });
  assert.equal(res.allowed, true);
}

{
  const over = { ...baseReq, amount: 1000 };
  const res = evaluatePurchase(over, basePolicy, { dayTotal: 0, weekTotal: 0 });
  assert.equal(res.allowed, false);
}

{
  const badVendor = { ...baseReq, vendor: 'RandomStore' };
  const res = evaluatePurchase(badVendor, basePolicy);
  assert.equal(res.allowed, false);
}

console.log("rules-engine tests passed");
