import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { WorkOrder } from '@core/models/work-order.model';
import { Dashboard } from './dashboard';

describe('DashboardComponent', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

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
      status: 'Blocked',
      priority: 2,
      owner: 'Marcus Chen',
      slaDueAt: '2026-08-10T10:00:00.000Z', // Overdue
      lastUpdatedAt: '2026-08-19T09:00:00.000Z',
      progressPct: 45
    },
    {
      id: 'WO-2026-00103',
      site: 'Site 4839 - Metro Substation',
      region: 'APAC',
      status: 'Done',
      priority: 3,
      owner: 'Elena Vance',
      slaDueAt: '2026-08-01T10:00:00.000Z', // Past date but Done (not overdue)
      lastUpdatedAt: '2026-08-19T09:00:00.000Z',
      progressPct: 100
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;

    // Seed initial mock signal data
    component.workOrders.set(mockWorkOrders);
    fixture.detectChanges();
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should compute filteredWorkOrders correctly when filterTerm signal changes (Task 3 computed metric test)', () => {
    // Initial unfiltered count
    expect(component.filteredWorkOrders().length).toBe(3);

    // Filter by site name 'Metro'
    component.filterTerm.set('Metro');
    expect(component.filteredWorkOrders().length).toBe(2);

    // Filter by owner 'Marcus'
    component.filterTerm.set('Marcus');
    expect(component.filteredWorkOrders().length).toBe(1);
    expect(component.filteredWorkOrders()[0].id).toBe('WO-2026-00102');

    // Filter by non-existent term
    component.filterTerm.set('NonExistentSite999');
    expect(component.filteredWorkOrders().length).toBe(0);
  });

  it('should compute summaryMetrics correctly derived from raw signal data (Task 3 computed summary metric test)', () => {
    const metrics = component.summaryMetrics();

    expect(metrics.totalCount).toBe(3);
    expect(metrics.blockedCount).toBe(1);
    // WO-2026-00102 is Blocked and slaDueAt (Aug 10) is past Aug 19 => 1 Overdue
    expect(metrics.overdueCount).toBe(1);
    expect(metrics.withinSlaCount).toBe(2);
    expect(metrics.slaCompliancePct).toBe(67);
  });
});

