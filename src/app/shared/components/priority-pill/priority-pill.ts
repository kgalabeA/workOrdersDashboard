import { Component, Input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-priority-pill',
  styleUrl: './priority-pill.css',
  templateUrl: './priority-pill.html',
})
export class PriorityPill {
 @Input({ required: true }) priority!: number;
}
