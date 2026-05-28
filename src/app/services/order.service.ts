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
  checkout(request: CheckoutRequest): Observable<string> {
  return this.http.post(
    `${this.apiUrl}/checkout`,
    request,
    { responseType: 'text' }
  );
}
 getOrdersByUserId(userId: number): Observable<OrderHistory[]> {
  const token = this.userService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.get<OrderHistory[]>(
    `${this.apiUrl}/history/${userId}`,
    { headers }
  );
}
}
