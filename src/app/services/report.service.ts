import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SalesReportSummary } from '../models/sales-report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/api/Reports`;

  constructor(private http: HttpClient) {}

  getSalesReport(): Observable<SalesReportSummary> {
    return this.http.get<SalesReportSummary>(`${this.apiUrl}/sales`);
  }
}