import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5128/api/Users';
  constructor(private http: HttpClient) {}

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/by-email?email=${email}`);
  }

  login(userId: number) {
    localStorage.setItem('currentUserId', userId.toString());
    console.log('Đã đăng nhập với ID:', userId);
  }

  logout() {
    localStorage.removeItem('currentUserId');
  }

  getCurrentUserId(): number | null {
    const id = localStorage.getItem('currentUserId');
    return id ? parseInt(id, 10) : null;
  }

}