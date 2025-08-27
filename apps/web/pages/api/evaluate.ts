
import type { NextApiRequest, NextApiResponse } from 'next';
import { evaluatePurchase } from '@abrid/rules-engine';
import type { PurchaseRequest, SpendPolicy } from '@abrid/types';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
  try {
    const { request, policy, employeeSpend } = req.body as {
      request: PurchaseRequest; policy: SpendPolicy; employeeSpend?: any;
    };
    const out = evaluatePurchase(request, policy, employeeSpend);
    res.status(200).json(out);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || 'Bad request' });
  }
}
