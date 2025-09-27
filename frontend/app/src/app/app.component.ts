// todo-docker-angular/frontend/app/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { TodoService, Todo } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Todo List';
  todos: Todo[] = [];
  newTitle = '';
  loading = false;

  constructor(private api: TodoService) {}

  ngOnInit(): void { this.refresh(); }

  refresh() {
    this.loading = true;
    this.api.list().subscribe({
      next: (t) => { this.todos = t; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  add() {
    const t = this.newTitle.trim();
    if (!t) return;
    this.api.add(t).subscribe(todo => {
      this.todos.unshift(todo);
      this.newTitle = '';
    });
  }

  toggle(todo: Todo) {
    this.api.toggle(todo).subscribe(updated => Object.assign(todo, updated));
  }

  save(todo: Todo) {
    const t = (todo.title || '').trim();
    if (!t) return;
    this.api.save(todo, t).subscribe(updated => Object.assign(todo, updated));
  }

  remove(todo: Todo) {
    this.api.remove(todo.id).subscribe(() => {
      this.todos = this.todos.filter(x => x.id !== todo.id);
    });
  }
}
