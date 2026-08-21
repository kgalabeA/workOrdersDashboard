import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WorkOrderDetail } from './work-order-detail';
import { ActivatedRoute } from '@angular/router';
import { WorkOrderService } from '@features/dashboard/services/work-order.service';

describe('WorkOrderDetail', () => {
  let component: WorkOrderDetail;
  let fixture: ComponentFixture<WorkOrderDetail>;

  const mockWorkOrder = {
    id: 'WO-2026-00101',
    site: 'Site 4839 - Metro Hub',
    region: 'AMER',
    status: 'New',
    priority: 1,
    owner: 'Elena Vance',
    slaDueAt: '2026-08-25T10:00:00.000Z',
    lastUpdatedAt: '2026-08-19T08:00:00.000Z',
    progressPct: 0
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderDetail],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: (_: string) => mockWorkOrder.id }) } },
        { provide: WorkOrderService, useValue: { getWorkOrderById: (_id: string) => of(mockWorkOrder) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkOrderDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
