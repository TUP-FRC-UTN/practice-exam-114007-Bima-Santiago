import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Order from './order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient)
  private readonly url = 'http://localhost:3000/orders';

  get(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url);
  }

  getByMail(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(this.url + '?email=' + email);
  }

  post(data: Order): Observable<Order> {
    return this.http.post<Order>(this.url, data)
  }
}
