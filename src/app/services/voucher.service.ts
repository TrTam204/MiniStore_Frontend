import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Voucher } from '../models/voucher';
import { CheckoutItem } from '../models/checkout-request';

export interface ApplyVoucherRequest {
  code: string;
  orderAmount: number;
  items?: CheckoutItem[];
  userId?: number;
}

export interface ApplyVoucherResponse {
  isValid: boolean;
  discountAmount: number;
  finalAmount: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private apiUrl = 'http://localhost:5128/api/vouchers';
  constructor(private http: HttpClient) {}

  apply(code: string, orderAmount: number, items?: CheckoutItem[], userId?: number): Observable<ApplyVoucherResponse> {
    const req: ApplyVoucherRequest = { code, orderAmount, items, userId };
    return this.http.post<ApplyVoucherResponse>(`${this.apiUrl}/apply`, req);
  }

  // Admin endpoints
  getAll(): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(this.apiUrl);
  }

  getActive(): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(`${this.apiUrl}/active`);
  }

  getById(id: number): Observable<Voucher> {
    return this.http.get<Voucher>(`${this.apiUrl}/${id}`);
  }

  create(v: Partial<Voucher>): Observable<Voucher> {
    return this.http.post<Voucher>(this.apiUrl, v);
  }

  update(id: number, v: Partial<Voucher>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, v);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggle(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/toggle/${id}`, null as any);
  }
}
