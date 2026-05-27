import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutRequest } from '../models/checkout-request';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5128/api/Orders/checkout';
  constructor(private http: HttpClient) { }
  checkout(request: CheckoutRequest): Observable<string> {
    return this.http.post(this.apiUrl, request, { responseType: 'text' });
  }
}
