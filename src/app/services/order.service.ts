import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutRequest } from '../models/checkout-request';
import { OrderHistory } from '../models/order-history';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5128/api/Orders';
  constructor(private http: HttpClient,
              private userService: UserService
  ) { }
  private getAuthHeaders(): HttpHeaders {
  const token = this.userService.getToken();
  return new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
}
  checkout(request: CheckoutRequest): Observable<string> {
  return this.http.post(
    `${this.apiUrl}/checkout`,
    request,
    {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }
  );
}
  getOrdersByUserId(userId: number): Observable<OrderHistory[]> {
    return this.http.get<OrderHistory[]>(
      `${this.apiUrl}/history/${userId}`,
    {
      headers: this.getAuthHeaders()
    }
  );
}
}
