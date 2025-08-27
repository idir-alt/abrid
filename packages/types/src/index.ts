
export type UserRole = 'ADMIN' | 'EMPLOYEE' | 'SUBCONTRACTOR';

export interface ProjectRef {
  id: string;
  name: string;
}

export interface PurchaseRequest {
  id: string;
  employeeId: string;
  employeeRole: UserRole;
  project: ProjectRef;
  timestamp: string; // ISO
  amount: number; // in USD
  vendor?: string;
  mcc?: string; // Merchant Category Code
  method?: 'TAP_TO_PAY' | 'CARD' | 'QR' | 'MANUAL';
  location?: { lat: number; lng: number };
  description?: string;
}

export interface RuleTimeWindow {
  days?: number[];      // 0=Sun ... 6=Sat
  hours?: number[];     // 0..23
  timezone?: string;    // e.g. 'America/Los_Angeles'
}

export interface SpendPolicy {
  projectId?: string;                 // limit policy to a project
  maxPerPurchase?: number;            // absolute cap for a single transaction
  dailyLimit?: number;                // daily aggregate cap per employee
  weeklyLimit?: number;               // weekly aggregate cap per employee
  vendorAllowlist?: string[];         // permitted vendors
  vendorBlocklist?: string[];         // blocked vendors
  mccAllowlist?: string[];            // permitted MCCs
  mccBlocklist?: string[];            // blocked MCCs
  timeWindow?: RuleTimeWindow;        // allowed time window
  requirePreauth?: boolean;           // if true, holds must be approved before capture
  requireReceipt?: boolean;           // require photo receipt upload
  blockCashWithdrawals?: boolean;     // no cash-like transactions
  geoFenceKm?: number;                // radius limit around project/site (future)
}

export interface EvaluationResult {
  allowed: boolean;
  reasons: string[];
  requiresPreauth?: boolean;
  requiresReceipt?: boolean;
  violated?: Partial<SpendPolicy>;
  policySnapshot: SpendPolicy;
}
