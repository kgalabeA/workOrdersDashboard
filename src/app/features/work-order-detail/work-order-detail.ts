import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOrder } from '@core/models/work-order.model';
import { WorkOrderService } from '@features/dashboard/services/work-order.service';
import { StatusUpdateModel } from '@features/status-update-model/status-update-model';
import { SharedModule } from '@shared/shared-module';
import { catchError, of, switchMap } from 'rxjs';
import { RegionChip } from "@shared/components/region-chip/region-chip";
import { PriorityPill } from "@shared/components/priority-pill/priority-pill";
import { StatusBadge } from "@shared/components/status-badge/status-badge";

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
  isLoading = signal(true);
  notFound = signal(false);
  loadError = signal<string | null>(null);
  showUpdateModal = signal(false);
  simulateErrorToggle = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound.set(true);
      this.isLoading.set(false);
      return;
    }

    // First load all work orders (populates the BehaviorSubject), then find by id
    this.workOrderService.getWorkOrders().pipe(
      switchMap(() => this.workOrderService.getWorkOrderById(id)),
      catchError((err) => {
        this.loadError.set('Failed to load work orders. Make sure json-server is running on port 3001.');
        this.isLoading.set(false);
        return of(undefined);
      })
    ).subscribe((order) => {
      this.isLoading.set(false);
      if (order === undefined || order === null) {
        this.notFound.set(true);
      } else {
        this.workOrder.set(order);
      }
    });
  }

  goBack = (): void => {
    this.router.navigate(['/dashboard']);
  };

  openUpdateModal = (): void => {
    this.showUpdateModal.set(true);
  };

  closeUpdateModal = (): void => {
    this.showUpdateModal.set(false);
  };

  onWorkOrderUpdated = (updated: WorkOrder): void => {
    this.workOrder.set(updated);
    this.showUpdateModal.set(false);
  };

  isOverdue = (slaDueAt: string, status: string): boolean => {
    return status !== 'Done' && new Date(slaDueAt).getTime() < new Date().getTime();
  };
}
