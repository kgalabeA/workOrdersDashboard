import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkOrderService } from '@features/dashboard/services/work-order.service';
import { WorkOrder, WorkOrderStatus } from '@core/models/work-order.model';
import { SharedModule } from '@shared/shared-module';

@Component({
  imports: [SharedModule],
  selector: 'status-update-model',
  styleUrl: './status-update-model.css',
  templateUrl: './status-update-model.html',
})
export class StatusUpdateModel {
  @Input({ required: true }) workOrder!: WorkOrder;
  @Input() simulateErrorToggle = false;
  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<WorkOrder>();

  private fb = inject(FormBuilder);
  private workOrderService = inject(WorkOrderService);

  statusOptions: WorkOrderStatus[] = ['New', 'Planned', 'In Progress', 'Blocked', 'Done'];
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  updateForm!: FormGroup;

  ngOnInit = (): void => {
    this.updateForm = this.fb.group({
      status: [this.workOrder.status, [Validators.required]],
      note: [this.workOrder.note || '']
    });
  }

  onBackdropClick = (event: MouseEvent): void => {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }

  close = (): void => {
    if (!this.isSubmitting()) {
      this.closed.emit();
    }
  }

  submitUpdate = (): void => {
    if (this.updateForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formValue = this.updateForm.value;

    this.workOrderService.updateWorkOrderStatus(
      this.workOrder.id,
      {
        status: formValue.status,
        note: formValue.note
      },
      this.simulateErrorToggle
    ).subscribe({
      next: (updatedOrder) => {
        this.isSubmitting.set(false);
        this.updated.emit(updatedOrder);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const detail = err?.error?.message || err?.message || 'Server error occurred';
        this.errorMessage.set(detail);
      }
    });
  }
}
