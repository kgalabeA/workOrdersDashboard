import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { WorkOrderService } from './work-order.service';
import { UpdateWorkOrderPayload, WorkOrder } from '@core/models/work-order.model';

describe('WorkOrderService', () => {
  let service: WorkOrderService;
  let httpMock: HttpTestingController;

  const mockWorkOrders: WorkOrder[] = [
    {
      id: 'WO-2026-00101',
      site: 'Site 4839 - Metro Hub',
      region: 'AMER',
      status: 'New',
      priority: 1,
      owner: 'Elena Vance',
      slaDueAt: '2026-08-25T10:00:00.000Z',
      lastUpdatedAt: '2026-08-19T08:00:00.000Z',
      progressPct: 0
    },
    {
      id: 'WO-2026-00102',
      site: 'Site 5921 - Tower Node',
      region: 'EMEA',
      status: 'In Progress',
      priority: 2,
      owner: 'Marcus Chen',
      slaDueAt: '2026-08-15T10:00:00.000Z', // Overdue
      lastUpdatedAt: '2026-08-19T09:00:00.000Z',
      progressPct: 45
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WorkOrderService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(WorkOrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch work orders via GET request (Happy Path)', () => {
    return new Promise<void>((resolve, reject) => {
      service.getWorkOrders().subscribe({
        next: (orders) => {
          try {
            expect(orders.length).toBe(2);
            expect(orders[0].id).toBe('WO-2026-00101');
            expect(orders[1].owner).toBe('Marcus Chen');
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        error: reject,
      });

      const req = httpMock.expectOne('http://localhost:3000/workOrders');
      expect(req.request.method).toBe('GET');
      req.flush(mockWorkOrders);
    });
  });

  it('should handle simulated error path gracefully when REST call fails', () => {
    const payload: UpdateWorkOrderPayload = {
      status: 'Blocked',
      note: 'Simulated failure test'
    };

    return new Promise<void>((resolve, reject) => {
      service.updateWorkOrderStatus('WO-2026-00101', payload, true).subscribe({
        next: () => reject(new Error('Should have failed with HTTP 500 error')),
        error: (err) => {
          try {
            expect(err.status).toBe(500);
            expect(err.error.message).toContain('Simulated server error');
            resolve();
          } catch (error) {
            reject(error);
          }
        },
      });
    });
  });
});
