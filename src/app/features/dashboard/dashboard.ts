import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SummaryMetrics, WorkOrder } from '@core/models/work-order.model';
import { WorkOrderService } from './services/work-order.service';
import { SharedModule } from '@shared/shared-module';
import {StatusUpdateModel } from '../status-update-model/status-update-model';
import { WorkOrderView } from './work-order-view';
import { MetricCard } from '@shared/components/metric-card/metric-card';
import { RegionChip } from "@shared/components/region-chip/region-chip";
import { PriorityPill } from "@shared/components/priority-pill/priority-pill";
import { StatusBadge } from "@shared/components/status-badge/status-badge";

@Component({
  imports: [SharedModule, StatusUpdateModel, MetricCard, RegionChip, PriorityPill, StatusBadge],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit{

private workOrderService = inject(WorkOrderService);

  // expose global Math for use inside template expressions
  public Math = Math;

  workOrders = signal<WorkOrder[]>([]);
  filterTerm = signal<string>('');
  regionFilter = signal<string>('ALL');
  statusFilter = signal<string>('ALL');

  // Pagination state
  pageSize = signal<number>(10);
  pageIndex = signal<number>(0);
  pageSizes = [5, 10, 20, 50];

  isLoading = signal<boolean>(false);
  loadError = signal<string | null>(null);
  selectedWorkOrder = signal<WorkOrder | null>(null);
  selectedViewOrder = signal<WorkOrder | null>(null);
  simulateErrorToggle = signal<boolean>(false);

  displayedColumns: string[] = [
    'id',
    'site',
    'region',
    'status',
    'priority',
    'owner',
    'slaDueAt',
    'progressPct',
    'actions',
  ];
  filteredWorkOrders = computed(() => {
    const term = this.filterTerm().toLowerCase().trim();
    const region = this.regionFilter();
    const status = this.statusFilter();
    const orders = this.workOrders();

    return orders.filter((order) => {
      const matchesTerm =
        !term ||
        order.id.toLowerCase().includes(term) ||
        order.site.toLowerCase().includes(term) ||
        order.owner.toLowerCase().includes(term);

      const matchesRegion = region === 'ALL' || order.region === region;
      const matchesStatus = status === 'ALL' || order.status === status;

      return matchesTerm && matchesRegion && matchesStatus;
    });
  });

  // Slice filtered results for pagination
  paginatedWorkOrders = computed(() => {
    const list = this.filteredWorkOrders();
    const size = this.pageSize();
    const idx = this.pageIndex();
    const start = idx * size;
    return list.slice(start, start + size);
  });
  summaryMetrics = computed<SummaryMetrics>(() => {
    const orders = this.workOrders();
    const nowTime = new Date().getTime();

    let overdueCount = 0;
    let blockedCount = 0;

    orders.forEach((order:any) => {
      if (order.status === 'Blocked') {
        blockedCount++;
      }
      if (order.status !== 'Done' && new Date(order.slaDueAt).getTime() < nowTime) {
        overdueCount++;
      }
    });

    const totalCount = orders.length;
    const withinSlaCount = totalCount - overdueCount;
    const slaCompliancePct = totalCount > 0 ? Math.round((withinSlaCount / totalCount) * 100) : 100;

    return {
      totalCount,
      overdueCount,
      withinSlaCount,
      blockedCount,
      slaCompliancePct,
    };
  });

  ngOnInit = (): void => {
    this.loadData();
  };

  loadData = (): void => {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.workOrderService.getWorkOrders().subscribe({
      next: (data:any) => {
      console.log('Work orders loaded:', data);
        this.workOrders.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.loadError.set(`Please make sure json-server is running`);
      },
    });
  };

  onWorkOrderUpdated = (updatedOrder: WorkOrder): void => {
    this.workOrders.update((orders) =>
      orders.map((item) => (item.id === updatedOrder.id ? { ...item, ...updatedOrder } : item)),
    );
    this.closeUpdateModal();
  };

  openUpdateModal = (order: WorkOrder): void => {
    this.selectedWorkOrder.set(order);
  };

  openViewModal = (order: WorkOrder): void => {
    this.selectedViewOrder.set(order);
  };

  closeViewModal = (): void => {
    this.selectedViewOrder.set(null);
  };

  closeUpdateModal = (): void => {
    this.selectedWorkOrder.set(null);
  };
  isOverdue = (slaDueAt: string, status: string): boolean => {
    return status !== 'Done' && new Date(slaDueAt).getTime() < new Date().getTime();
  };
  clearFilter = (): void => {
    this.filterTerm.set('');
    this.pageIndex.set(0);
  };
  onFilterInput = (event: Event): void => {
    const value = (event.target as HTMLInputElement).value;
    this.filterTerm.set(value);
    this.pageIndex.set(0);
  };

  // Pagination controls
  goToPage = (index: number): void => {
    const maxPages = Math.ceil(this.filteredWorkOrders().length / this.pageSize());
    if (index < 0) index = 0;
    if (index >= maxPages) index = Math.max(0, maxPages - 1);
    this.pageIndex.set(index);
  };

  changePageSize = (size: number): void => {
    this.pageSize.set(size);
    this.pageIndex.set(0);
  };
}
