import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list/todo-list.component';
import {TodoServiceService} from './todo-list/todo-service.service';
import { RevisionListComponent } from './todo-list/revision-list/revision-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    RevisionListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [TodoServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
