import { Component, inject, OnInit } from '@angular/core';
import Order from '../order';
import { OrderService } from '../order.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [RouterLink,],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css'
})
export class OrdersListComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  orders: Order[] = [];
  filteredOrders: Order[] = [];

  ngOnInit(): void {
    this.orderService.get().subscribe((next) => {
      this.filteredOrders = next
      this.orders = next;
    },
    (error) => {
      console.log(error)
    })
  }

  filterTable(event: Event) {
    const target = event.target as HTMLInputElement;
    const filterValue = target.value?.toLowerCase() || '';
    if (filterValue === '') {
      this.filteredOrders = this.orders;
      return;
    }
    this.filteredOrders = this.orders.filter(order => {
      return (
        order.customerName.toLowerCase().includes(filterValue.toLowerCase()) ||
        order.email.toLowerCase().includes(filterValue.toLowerCase())
      );
    });
  }
}
