
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, ScrollView } from 'react-native';
import type { PurchaseRequest, SpendPolicy } from '@abrid/types';

export default function App() {
  const [amount, setAmount] = useState('120');
  const [result, setResult] = useState<any>(null);

  const policy: SpendPolicy = {
    projectId: 'proj1',
    maxPerPurchase: 200,
    dailyLimit: 500,
    weeklyLimit: 1500,
    vendorAllowlist: ['HomeDepot', 'Lowes'],
    mccAllowlist: ['5211', '1520'],
    timeWindow: { hours: [6,7,8,9,10,11,12,13,14,15,16,17,18], days: [1,2,3,4,5], timezone: 'America/Los_Angeles' },
    requirePreauth: true,
    requireReceipt: true,
    blockCashWithdrawals: true
  };

  const submit = async () => {
    const req: PurchaseRequest = {
      id: 'mobile-'+Date.now(),
      employeeId: 'emp1',
      employeeRole: 'EMPLOYEE',
      project: { id: 'proj1', name: 'Main House' },
      timestamp: new Date().toISOString(),
      amount: parseFloat(amount || '0'),
      vendor: 'HomeDepot',
      mcc: '5211',
      method: 'CARD',
      description: 'On-site materials'
    };
    try {
      // For local testing, hit the web API if running on same machine via tunnel/proxy,
      // or just evaluate locally in the mobile app in a future iteration.
      const res = await fetch('http://localhost:3000/api/evaluate', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ request: req, policy, employeeSpend: { dayTotal: 50, weekTotal: 200 } })
      });
      setResult(await res.json());
    } catch (e) {
      setResult({ error: String(e) });
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 8 }}>Abrid Mobile (MVP)</Text>
        <Text>Amount (USD)</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginVertical: 8 }}
        />
        <Button title="Evaluate Purchase" onPress={submit} />
        {result && (
          <View style={{ marginTop: 16 }}>
            <Text>Result:</Text>
            <Text selectable style={{ fontFamily: 'Courier' }}>{JSON.stringify(result, null, 2)}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
