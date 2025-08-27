
import { useState } from 'react';
import type { PurchaseRequest, SpendPolicy } from '@abrid/types';

export default function Home() {
  const [result, setResult] = useState<any>(null);

  const samplePolicy: SpendPolicy = {
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

  const submit = async () => {
    const req: PurchaseRequest = {
      id: 'ui-'+Date.now(),
      employeeId: 'emp1',
      employeeRole: 'EMPLOYEE',
      project: { id: 'proj1', name: 'Main House' },
      timestamp: new Date().toISOString(),
      amount: 120,
      vendor: 'HomeDepot',
      mcc: '5211',
      method: 'CARD',
      description: 'Primer + Caulk'
    };
    const r = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ request: req, policy: samplePolicy, employeeSpend: { dayTotal: 50, weekTotal: 200 } })
    });
    setResult(await r.json());
  };

  return (
    <main style={{maxWidth: 800, margin: '40px auto', fontFamily: 'ui-sans-serif'}}>
      <h1>Abrid Admin Dashboard (MVP)</h1>
      <p>Click below to evaluate a sample purchase against the spend policy.</p>
      <button onClick={submit} style={{padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd'}}>Evaluate Sample Purchase</button>
      {result && (
        <pre style={{marginTop: 20, background: '#fafafa', padding: 16, borderRadius: 8}}>
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
