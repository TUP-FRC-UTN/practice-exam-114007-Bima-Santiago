import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import Product from '../product';
import { ProductService } from '../product.service';
import { Observable, map, catchError, of } from 'rxjs';
import { OrderService } from '../order.service';
import { UniqueProductValidator } from '../validators/uniqueProduct.validator';
import { ValidateMax } from '../validators/validateMax';
import Order from '../order';

@Component({
  selector: 'app-orders-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './orders-form.component.html',
  styleUrl: './orders-form.component.css'
})
export class OrdersFormComponent {
  productList: Product[] = [];
  selectedProduct!: Product;

  selectedProductControl = new FormControl();
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email], [ this.moreThanThreeValidador()]),
    products: new FormArray([], [
      UniqueProductValidator.validarProductosUnicos()
    ])
  })

  get products() {
    return this.form.controls['products'] as FormArray;
  }

  addProduct() {
    this.selectedProduct = this.selectedProductControl.value

    const productGroup = new FormGroup({
      name: new FormControl(this.selectedProduct, [Validators.required]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1), ValidateMax.validarMaximo()]),
      price: new FormControl(this.selectedProduct.price),
      stock: new FormControl(this.selectedProduct.stock)
    })

    this.products.push(productGroup);
  }

  removeProduct(index: number) {
    this.products.removeAt(index);
  }

  sendForm() {
    if (this.form.invalid) {
      console.log("Formulario inválido");
      return;
    }

    const order: Order = {
      id: '',
      customerName: this.form.get('name')?.value,
      email: this.form.get('email')?.value,
      products: this.form.value,
      total: this.calcularTotal(),
      orderCode: this.generarCodigoOrden(),
      timeStamp: new Date().toISOString()
    };
    this.orderService.post(order).subscribe(
      response => {
        console.log('Pedido creado:', response);
        alert('Pedido creado exitosamente');
      },
      error => {
        console.error('Error al crear el pedido:', error);
        alert('Hubo un error al crear el pedido');
      }
    );
  }

  private readonly productService = inject(ProductService)
  private readonly orderService = inject(OrderService)

  ngOnInit(): void {
    this.productService.get().subscribe(
      (next) => this.productList = next,
      (error) => console.log(error)
    )
  }

  uniqueMailValidador(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log('validador', control.value);
      return this.orderService.getByMail(control.value).pipe(
        map(data => {
          return data.length > 0 ? { existMail: true } : null;
        }),
        catchError(() => {
          alert("error en la api");
          return of({ apiCaida: true });
        })
      );
    };
  }

  moreThanThreeValidador(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.orderService.getByMail(control.value).pipe(
        map((orders: any[]) => {
          const now = new Date();
          const last24HoursOrders = orders.filter(order => {
            const orderDate = new Date(order.timestamp);
            const timeDifference = now.getTime() - orderDate.getTime();
            return timeDifference <= 24 * 60 * 60 * 1000;
          });
          return last24HoursOrders.length > 3 ? { moreThanThree: true } : null;
        }),
        catchError(() => {
          alert("Error en la API");
          return of({ apiCaida: true });
        })
      );
    };
  }

  calcularTotal(): number {
    let total = this.products.controls.reduce((total, control) => {
      return total + (control.get('price')?.value * control.get('quantity')?.value);
    }, 0);

    if (total > 1000) {
      total = total * 0.9;
    }

    return total;
  }

  generarCodigoOrden(): string {
    const nombre = this.form.get('name')?.value || '';
    const email = this.form.get('email')?.value || '';
    const timestamp = Date.now();

    const primeraLetraNombre = nombre.charAt(0).toUpperCase();

    const ultimosCuatroEmail = email.slice(-4);

    const codigo = `${primeraLetraNombre}${ultimosCuatroEmail}${timestamp}`;

    return codigo;
  }
}
