import { Routes } from '@angular/router';
import { Dashboard } from '@features/dashboard/dashboard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
  path: 'work-order/:id',
  loadComponent: () => import('@features/work-order-detail/work-order-detail').then(m => m.WorkOrderDetail)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
