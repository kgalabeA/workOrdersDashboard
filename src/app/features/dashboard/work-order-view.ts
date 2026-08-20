import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkOrder } from '@core/models/work-order.model';
import { SharedModule } from '@shared/shared-module';

@Component({
  imports: [SharedModule],
  selector: 'work-order-view',
  templateUrl: './work-order-view.html',
})
export class WorkOrderView {
  @Input({ required: true }) workOrder!: WorkOrder;
  @Output() closed = new EventEmitter<void>();

  close = (): void => {
    this.closed.emit();
  };
}
