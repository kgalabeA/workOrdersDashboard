import { Component, Input } from '@angular/core';
import { SharedModule } from '@shared/shared-module';

@Component({
  selector: 'app-metric-card',
  styleUrl: './metric-card.css',
  templateUrl: './metric-card.html',
  imports: [SharedModule],
})
export class MetricCard {

  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string | number;
  @Input({ required: true }) icon!: string;
  @Input() type: 'total' | 'overdue' | 'compliance' | 'blocked' = 'total';
  @Input() valueColor: 'default' | 'red' | 'green' | 'warning' = 'default';
  @Input() isAlert = false;
  @Input() tag?: string;
  @Input() tagType: 'danger' | 'warning' | 'info' = 'danger';
}

