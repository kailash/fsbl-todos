import { Component, OnInit } from '@angular/core';
import {Todo} from '../todo';
import {NgForm} from '@angular/forms';
import {TodoServiceService} from '../todo-list/todo-service.service';

@Component({
  selector: 'add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {
  
  newTodo: Todo = new Todo();
  todos: Todo[];
 
  constructor(private todoService:TodoServiceService) {
    this.newTodo.isLearning=true;
   }

  ngOnInit() {
  }

  createTodo(todoForm: NgForm): void {
    this.todoService.createTodo(this.newTodo)
      .then(createTodo => {        
        todoForm.reset();
        this.newTodo = new Todo();
        this.todos.unshift(createTodo)
      });
  }
}
