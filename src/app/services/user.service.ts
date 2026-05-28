import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  email: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5128/api/Users';

  private authApiUrl = 'http://localhost:5128/api/Auth';

  constructor(private http: HttpClient) {}

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/by-email?email=${email}`);
  }

  loginWithJwt(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.authApiUrl}/login`,
      request
    );
  }

  login(userId: number, email: string, token?: string): void {
    localStorage.setItem('currentUserId', userId.toString());
    localStorage.setItem('currentUserEmail', email);

    if (token) {
      localStorage.setItem('token', token);
    }

    console.log('Đã đăng nhập với ID:', userId);
  }

  logout(): void {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('token');
  }

  getCurrentUserEmail(): string | null {
    return localStorage.getItem('currentUserEmail');
  }

  getCurrentUserId(): number | null {
    const id = localStorage.getItem('currentUserId');
    return id ? parseInt(id, 10) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}