import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchKeyword = new BehaviorSubject<string>('');
  searchKeyword$ = this.searchKeyword.asObservable();

  setKeyword(keyword: string): void {
    this.searchKeyword.next(keyword);
  }
}