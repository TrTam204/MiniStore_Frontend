import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutRequest } from '../models/checkout-request';
import { OrderHistory } from '../models/order-history';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5128/api/Orders';
  constructor(private http: HttpClient) { }

  checkout(request: CheckoutRequest): Observable<string> {
  return this.http.post(
    `${this.apiUrl}/checkout`,
    request,
    {
      responseType: 'text'
    }
  );
}
  getOrdersByUserId(userId: number): Observable<OrderHistory[]> {
    return this.http.get<OrderHistory[]>(
      `${this.apiUrl}/history/${userId}`);
}

  getAllOrders(): Observable<OrderHistory[]> {
    return this.http.get<OrderHistory[]>(`${this.apiUrl}`);
}

  updateOrderStatus(orderId: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/status/${orderId}`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

