import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { UserService } from './user.service';
@Injectable({
providedIn: 'root'
})
export class CategoryService {
private apiUrl = 'http://localhost:5128/api/Categories';
constructor(private http: HttpClient, private userService: UserService) {}

private getAuthHeaders(): HttpHeaders {
  const token = this.userService.getToken();
  return new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
}

getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
}
getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
}
create(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category, {
      headers: this.getAuthHeaders()
    });
}
update(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(
    `${this.apiUrl}/${id}`,
    category,
    {
      headers: this.getAuthHeaders()
    }
    );
}
delete(id: number): Observable<void> {
    return this.http.delete<void>(
    `${this.apiUrl}/${id}`,
    {
      headers: this.getAuthHeaders()
    }
    );
}
}