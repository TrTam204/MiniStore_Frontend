import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
providedIn: 'root'
})
export class CategoryService {
private apiUrl = 'http://localhost:5128/api/Categories';
constructor(private http: HttpClient ) {}

getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
}
getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
}
create(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
}
update(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(
    `${this.apiUrl}/${id}`, category);
}
delete(id: number): Observable<void> {
    return this.http.delete<void>(
    `${this.apiUrl}/${id}`);
}
}