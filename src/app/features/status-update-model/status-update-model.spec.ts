import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StatusUpdateModel } from './status-update-model';
import { WorkOrderService } from '@features/dashboard/services/work-order.service';

describe('StatusUpdateModel', () => {
  let component: StatusUpdateModel;
  let fixture: ComponentFixture<StatusUpdateModel>;

  const mockWorkOrder = {
    id: 'WO-TEST-0001',
    site: 'Test Site',
    region: 'AMER',
    status: 'New',
    priority: 1,
    owner: 'Tester',
    slaDueAt: '2026-08-25T10:00:00.000Z',
    lastUpdatedAt: '2026-08-19T08:00:00.000Z',
    progressPct: 0,
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusUpdateModel],
      providers: [
        { provide: WorkOrderService, useValue: { updateWorkOrderStatus: () => of(mockWorkOrder) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusUpdateModel);
    component = fixture.componentInstance;

    // Provide the required @Input() before change detection runs
    component.workOrder = mockWorkOrder;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
