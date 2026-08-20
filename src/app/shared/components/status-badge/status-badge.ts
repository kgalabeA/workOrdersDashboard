import { Component, Input } from '@angular/core';
import { WorkOrderStatus } from '@core/models/work-order.model';

@Component({
  imports: [],
  selector: 'app-status-badge',
  styleUrl: './status-badge.css',
  templateUrl: './status-badge.html',
})
export class StatusBadge {
 @Input({ required: true }) status!: WorkOrderStatus | string;
  @Input() showDot = true;
  }
