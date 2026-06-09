import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { UserCreate } from '../models/user-create.model';
import { UserUpdate } from '../models/user-update.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  email: string;
  role: string;
  token: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
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

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(request: UserCreate): Observable<User> {
    return this.http.post<User>(this.apiUrl, request);
  }

  update(id: number, request: UserUpdate): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  loginWithJwt(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.authApiUrl}/login`,
      request
    );
  }

  register(request: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authApiUrl}/register`, request);
  }

  login(userId: number, email: string, role: string, token: string): void {
  localStorage.setItem('currentUserId', userId.toString());
  localStorage.setItem('currentUserEmail', email);
  localStorage.setItem('role', role);
  localStorage.setItem('token', token);

  console.log('Đã đăng nhập với ID:', userId);
  console.log('Role:', role);
}

  logout(): void {
  localStorage.removeItem('currentUserId');
  localStorage.removeItem('currentUserEmail');
  localStorage.removeItem('role');
  localStorage.removeItem('token');
}
  getRole(): string | null {
  return localStorage.getItem('role');
}

  isAdmin(): boolean {
  const role = this.getRole();
  return role?.toLowerCase() === 'admin';
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