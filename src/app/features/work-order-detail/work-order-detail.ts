import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOrder } from '@core/models/work-order.model';
import { WorkOrderService } from '@features/dashboard/services/work-order.service';
import { StatusUpdateModel } from '@features/status-update-model/status-update-model';
import { SharedModule } from '@shared/shared-module';
import { catchError, of, switchMap } from 'rxjs';
import { RegionChip } from '@shared/components/region-chip/region-chip';
import { PriorityPill } from '@shared/components/priority-pill/priority-pill';
import { StatusBadge } from '@shared/components/status-badge/status-badge';

@Component({
  imports: [SharedModule, StatusUpdateModel, RegionChip, PriorityPill, StatusBadge],
  selector: 'app-work-order-detail',
  styleUrl: './work-order-detail.css',
  templateUrl: './work-order-detail.html',
})
export class WorkOrderDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private workOrderService = inject(WorkOrderService);

  workOrder = signal<WorkOrder | null>(null);
  isLoading = signal<boolean>(true);
  loadError = signal<string | null>(null);
  showUpdateModal = signal<boolean>(false);
  simulateErrorToggle = signal<boolean>(false);

  workOrderId = signal<string>('');

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.workOrderId.set(id);
        this.loadWorkOrder(id);
      } else {
        this.loadError.set('No Work Order ID provided in route parameters.');
        this.isLoading.set(false);
      }
    });
  }

  loadWorkOrder(id: string): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.workOrderService
      .getWorkOrderById(id)
      .pipe(
        catchError((error) => {
          this.isLoading.set(false);
          this.loadError.set(
            `Unable to load Work Order '${id}'. Please verify json-server is running on http://localhost:3000.`,
          );
          return of(null);
        }),
      )
      .subscribe((order) => {
        if (order) {
          this.workOrder.set(order);
        }
        this.isLoading.set(false);
      });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  openUpdateModal(): void {
    this.showUpdateModal.set(true);
  }

  closeUpdateModal(): void {
    this.showUpdateModal.set(false);
  }
  isOverdue(slaDueAt: string, status: string): boolean {
    if (status === 'Done') return false;
    const nowTime = new Date('2026-08-19T11:00:00.000Z').getTime();
    return new Date(slaDueAt).getTime() < nowTime;
  }
   onWorkOrderUpdated = (updatedOrder: WorkOrder): void => {
    // this.workOrders.update((orders) =>
    //   orders.map((item) => (item.id === updatedOrder.id ? { ...item, ...updatedOrder } : item)),
    // );
    this.closeUpdateModal();
  };
}
