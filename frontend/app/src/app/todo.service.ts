// todo-docker-angular/frontend/app/src/app/todo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private base = '/api/todos'; // Nginx /api'yi backend'e proxy'ler
  constructor(private http: HttpClient) {}
  list(): Observable<Todo[]> { return this.http.get<Todo[]>(this.base); }
  add(title: string): Observable<Todo> { return this.http.post<Todo>(this.base, { title }); }
  toggle(todo: Todo): Observable<Todo> {
    return this.http.patch<Todo>(`${this.base}/${todo.id}`, { completed: !todo.completed });
  }
  save(todo: Todo, title: string): Observable<Todo> {
    return this.http.patch<Todo>(`${this.base}/${todo.id}`, { title });
  }
  remove(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
}
