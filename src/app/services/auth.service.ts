import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface ForgotPasswordRequest { email: string }
export interface VerifyOtpRequest { email: string; otp: string }
export interface ResetPasswordRequest { email: string; otp: string; newPassword: string }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/api/Auth`;

  constructor(private http: HttpClient) {}

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot`, { email } as ForgotPasswordRequest);
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-otp`, { email, otp } as VerifyOtpRequest);
  }

  resetPassword(email: string, otp: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset`, { email, otp, newPassword } as ResetPasswordRequest);
  }
}
