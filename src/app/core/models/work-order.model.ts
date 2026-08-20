export type WorkOrderRegion = 'AMER' | 'EMEA' | 'APAC';
export type WorkOrderStatus = 'New' | 'Planned' | 'In Progress' | 'Blocked' | 'Done';

export interface WorkOrder {
  id: string;
  site: string;
  region: WorkOrderRegion;
  status: WorkOrderStatus;
  priority: number;
  owner: string;
  slaDueAt: string;
  lastUpdatedAt: string;
  progressPct: number;
  note?: string;
}

export interface UpdateWorkOrderPayload {
  status?: WorkOrderStatus;
  note?: string;
  lastUpdatedAt?: string;
}

export interface SummaryMetrics {
  totalCount: number;
  overdueCount: number;
  withinSlaCount: number;
  blockedCount: number;
  slaCompliancePct: number;
}
