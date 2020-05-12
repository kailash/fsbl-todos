import { Component, OnInit } from '@angular/core';
import {Todo} from '../../todo';
import {NgForm} from '@angular/forms';
import {TodoServiceService} from '../todo-service.service';

@Component({
  selector: 'revision-list',
  templateUrl: './revision-list.component.html',
  styleUrls: ['./revision-list.component.css']
})
export class RevisionListComponent implements OnInit {
  dateToday: number = Date.now();
  todos: Todo[];
  newTodo: Todo = new Todo();
  editing: boolean = false;
  editingTodo: Todo = new Todo();

  constructor(private todoService: TodoServiceService,) { }

  ngOnInit() {
    this.getRevisionList()
  }

  getRevisionList(): void {
    this.todoService.getRevisionList()
      .then(todos => this.todos = todos );    
  }

  updateTodo(todoData: Todo): void {
    console.log(todoData);
    this.todoService.updateTodo(todoData)
    .then(updatedTodo => {
      let existingTodo = this.todos.find(todo => todo.id === updatedTodo.id);
      Object.assign(existingTodo, updatedTodo);
      this.clearEditing();
    });
  }

  toggleCompleted(todoData: Todo): void {
    todoData.completed = !todoData.completed;
    this.todoService.updateTodo(todoData)
    .then(updatedTodo => {
      let existingTodo = this.todos.find(todo => todo.id === updatedTodo.id);
      Object.assign(existingTodo, updatedTodo);
    })
    .then(() => {
      this.todos = this.todos.filter(todo => todo.id != todoData.id);
    });
  }

  editTodo(todoData: Todo): void {
    this.editing = true;
    Object.assign(this.editingTodo, todoData);
  }

  deleteTodo(id: string): void {
    this.todoService.deleteTodo(id)
    .then(() => {
      this.todos = this.todos.filter(todo => todo.id != id);
    });
  }

  clearEditing(): void {
    this.editingTodo = new Todo();
    this.editing = false;
  }

}
