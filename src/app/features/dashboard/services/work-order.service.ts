import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { catchError, tap, map, mergeMap, shareReplay, switchMap } from 'rxjs/operators';
import { UpdateWorkOrderPayload, WorkOrder } from '@core/models/work-order.model';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/workOrders';

  private workOrdersSubject = new BehaviorSubject<WorkOrder[]>([]);
  public readonly workOrders$: Observable<WorkOrder[]> = this.workOrdersSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public readonly error$: Observable<string | null> = this.errorSubject.asObservable();

  //Fetch work orders from the API and update the BehaviorSubject
  getWorkOrders = (): Observable<WorkOrder[]> => {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<WorkOrder[]>(this.apiUrl).pipe(
      tap({
        next: (data) => {
          this.workOrdersSubject.next(data);
          this.loadingSubject.next(false);
        },
        error: (err) => {
          this.errorSubject.next(err.message || 'Failed to fetch work orders.');
          this.loadingSubject.next(false);
        },
      }),
      shareReplay(1),
      catchError((err) => throwError(() => err)),
    );
  };

  //Fetch a specific work order by ID
  getWorkOrderById = (id: string): Observable<WorkOrder | undefined> => {
    return this.workOrders$.pipe(map((workOrders) => workOrders.find((order) => order.id === id)));
  };
  //Filter work orders by region
  filterWorkOrdersByRegion = (region: string): Observable<WorkOrder[]> => {
    return this.workOrders$.pipe(
      map((orders) => (region === 'ALL' ? orders : orders.filter((o) => o.region === region))),
    );
  };
  //Update the status of a work order and handle simulated failures
  updateWorkOrderStatus = (
    id: string,
    payload: UpdateWorkOrderPayload,
    simulateFailure = false,
  ): Observable<WorkOrder> => {
    const { status, note } = payload;
    const patchBody = {
      status,
      lastUpdatedAt: new Date().toISOString(),
      ...(note ? { note } : {}),
    };
    return timer(600).pipe(
      mergeMap(() => {
        if (simulateFailure || payload.note?.toLowerCase().includes('fail')) {
          return throwError(
            () =>
              new HttpErrorResponse({
                error: { message: `Simulated server error updating work order ${id}` },
                status: 500,
                statusText: 'Internal Server Error',
                url: `${this.apiUrl}/${id}`,
              }),
          );
        }

        return this.http.patch<WorkOrder>(`${this.apiUrl}/${id}`, patchBody).pipe(
          tap((updatedOrder) => {
            const currentOrders = this.workOrdersSubject.getValue();
            const updatedOrders = currentOrders.map((order) =>
              order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order,
            );
            this.workOrdersSubject.next(updatedOrders);
          }),
        );
      }),
    );
  };
}
