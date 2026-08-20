import { Component, Input } from '@angular/core';
import { WorkOrderRegion } from '@core/models/work-order.model';

@Component({
  imports: [],
  selector: 'app-region-chip',
  styleUrl: './region-chip.css',
  templateUrl: './region-chip.html',
})
export class RegionChip {
 @Input({ required: true }) region!: WorkOrderRegion | string;
}
