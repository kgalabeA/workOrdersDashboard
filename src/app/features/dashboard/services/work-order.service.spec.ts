import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { WorkOrderService } from './work-order.service';
import { WorkOrder } from '@core/models/work-order.model';

const mockWorkOrders: WorkOrder[] = [
  {
    id: 'WO-2026-1001',
    site: 'Site 1000 - Regenerator Site',
    region: 'APAC',
    status: 'Done',
    priority: 4,
    owner: 'Ayanda Khumalo',
    slaDueAt: '2026-08-27T10:57:29.656Z',
    lastUpdatedAt: '2026-08-17T14:57:29.656Z',
    progressPct: 100,
  },
  {
    id: 'WO-2026-1002',
    site: 'Site 1017 - Vodacom Hub',
    region: 'AMER',
    status: 'Blocked',
    priority: 1,
    owner: 'Anele van der Merwe',
    slaDueAt: '2026-08-10T22:57:29.656Z',
    lastUpdatedAt: '2026-08-16T12:57:29.656Z',
    progressPct: 70,
  },
];

describe('WorkOrderService', () => {
  let service: WorkOrderService;
  let httpMock: HttpTestingController;
  const API_URL = 'http://localhost:3001/workOrders';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WorkOrderService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(WorkOrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWorkOrders()', () => {
    it('should fetch work orders and emit via workOrders$', () => {
      let result: WorkOrder[] = [];
      service.getWorkOrders().subscribe((orders) => (result = orders));

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockWorkOrders);

      expect(result.length).toBe(2);
      expect(result[0].id).toBe('WO-2026-1001');
    });

    it('should set loading to true during fetch and false on success', () => {
      const loadingStates: boolean[] = [];
      service.loading$.subscribe((v) => loadingStates.push(v));

      service.getWorkOrders().subscribe();
      const req = httpMock.expectOne(API_URL);
      req.flush(mockWorkOrders);

      expect(loadingStates).toContain(true);
      expect(loadingStates[loadingStates.length - 1]).toBe(false);
    });

    it('should set error$ on HTTP failure', () => {
      let errorVal: string | null = null;
      service.error$.subscribe((v) => (errorVal = v));

      service.getWorkOrders().subscribe({ error: () => {} });
      const req = httpMock.expectOne(API_URL);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

      expect(errorVal).toBeTruthy();
    });
  });

  describe('getWorkOrderById()', () => {
    it('should return the correct work order by id', (done) => {
      service.getWorkOrders().subscribe();
      const req = httpMock.expectOne(API_URL);
      req.flush(mockWorkOrders);

      service.getWorkOrderById('WO-2026-1002').subscribe((order) => {
        expect(order).toBeDefined();
        expect(order!.id).toBe('WO-2026-1002');
        expect(order!.status).toBe('Blocked');
        done();
      });
    });

    it('should return undefined for non-existent id', (done) => {
      service.getWorkOrders().subscribe();
      const req = httpMock.expectOne(API_URL);
      req.flush(mockWorkOrders);

      service.getWorkOrderById('WO-9999-0000').subscribe((order) => {
        expect(order).toBeUndefined();
        done();
      });
    });
  });

  describe('filterWorkOrdersByRegion()', () => {
    it('should return all orders when region is ALL', (done) => {
      service.getWorkOrders().subscribe();
      const req = httpMock.expectOne(API_URL);
      req.flush(mockWorkOrders);

      service.filterWorkOrdersByRegion('ALL').subscribe((orders) => {
        expect(orders.length).toBe(2);
        done();
      });
    });

    it('should filter by specific region', (done) => {
      service.getWorkOrders().subscribe();
      const req = httpMock.expectOne(API_URL);
      req.flush(mockWorkOrders);

      service.filterWorkOrdersByRegion('APAC').subscribe((orders) => {
        expect(orders.length).toBe(1);
        expect(orders[0].region).toBe('APAC');
        done();
      });
    });
  });

  describe('updateWorkOrderStatus() – simulated failure', () => {
    it('should emit error when simulateFailure is true', (done) => {
      service.getWorkOrders().subscribe();
      const req = httpMock.expectOne(API_URL);
      req.flush(mockWorkOrders);

      service
        .updateWorkOrderStatus('WO-2026-1001', { status: 'Done', note: 'test' }, true)
        .subscribe({
          error: (err) => {
            expect(err.status).toBe(500);
            done();
          },
        });
      // No HTTP request should be made when simulating failure
      httpMock.expectNone(`${API_URL}/WO-2026-1001`);
    });

    it('should emit error when note contains "fail"', (done) => {
      service.getWorkOrders().subscribe();
      const req = httpMock.expectOne(API_URL);
      req.flush(mockWorkOrders);

      service
        .updateWorkOrderStatus('WO-2026-1001', { status: 'In Progress', note: 'fail' })
        .subscribe({
          error: (err) => {
            expect(err.status).toBe(500);
            done();
          },
        });
      httpMock.expectNone(`${API_URL}/WO-2026-1001`);
    });
  });
});
