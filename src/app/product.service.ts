import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Product from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient)

  get(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:3000/products');
  }
}
