import { Routes } from '@angular/router';
import { OrdersFormComponent } from './orders-form/orders-form.component';
import { OrdersListComponent } from './orders-list/orders-list.component';

export const routes: Routes = [
  { path: 'create-order', component: OrdersFormComponent},
  { path: 'orders', component: OrdersListComponent},
  { path: '**', component: OrdersFormComponent}
];
