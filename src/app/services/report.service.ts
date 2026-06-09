import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SalesReportSummary } from '../models/sales-report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:5128/api/Reports';

  constructor(private http: HttpClient) {}

  getSalesReport(): Observable<SalesReportSummary> {
    return this.http.get<SalesReportSummary>(`${this.apiUrl}/sales`);
  }
}