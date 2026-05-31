package com.ka.fsp.todo.controller;

import com.ka.fsp.todo.domain.Todo;
import com.ka.fsp.todo.dto.ArchiveResponse;
import com.ka.fsp.todo.dto.TodoResponse;
import com.ka.fsp.todo.service.TodoService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TodoController {

  private final TodoService todoService;

  public TodoController(TodoService todoService) {
    this.todoService = todoService;
  }

  @GetMapping("/todos")
  public List<TodoResponse> getAllTodos() {
    return todoService.getAll();
  }

  @GetMapping("/todos/pending")
  public List<TodoResponse> getAllPendingTodos() {
    return todoService.getAllPending();
  }

  @PostMapping("/todos")
  public ResponseEntity<TodoResponse> createTodo(@Valid @RequestBody Todo todo) {
    return ResponseEntity.ok().body(todoService.save(todo));
  }

  @GetMapping(value = "/todos/{id}")
  public ResponseEntity<TodoResponse> getTodoById(@PathVariable("id") String id) {
    return ResponseEntity.ok().body(todoService.getTodoById(id));
  }

  @PutMapping(value = "/todos/{id}")
  public ResponseEntity<TodoResponse> updateTodo(
      @PathVariable("id") String id, @Valid @RequestBody Todo todo) {
    Optional<TodoResponse> optional = todoService.updateTodo(id, todo);
    if (optional.isPresent()) {
      return ResponseEntity.ok().body(optional.get());
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @PostMapping(value = "/todos/{id}/mark-reviewed")
  public ResponseEntity<TodoResponse> reviewTodo(@PathVariable("id") String id) {
    return ResponseEntity.ok().body(todoService.markReviewed(id));
  }

  @PostMapping(value = "/todos/{id}/close")
  public ResponseEntity<TodoResponse> closeTodo(@PathVariable("id") String id) {
    return ResponseEntity.ok().body(todoService.closeTodo(id));
  }

  @PostMapping(value = "/todos/{id}/remind")
  public ResponseEntity<TodoResponse> setReminder(
      @PathVariable("id") String id, @RequestBody Map<String, String> body) {
    LocalDate date = LocalDate.parse(body.get("remindOn"));
    return ResponseEntity.ok().body(todoService.setReminder(id, date));
  }

  @DeleteMapping(value = "/todos/{id}")
  public ResponseEntity<?> deleteTodo(@PathVariable("id") String id) {
    todoService.deleteTodo(id);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/todos/learning/schedule")
  public List<TodoResponse> getLearningSchedule() {
    return todoService.getLearningSchedule();
  }

  @GetMapping("/todos/learning/new")
  public List<TodoResponse> getNewLearning() {
    return todoService.getNewLearning();
  }

  @GetMapping("/todos/tasks")
  public List<TodoResponse> getTasksAndReminders() {
    return todoService.getTasksAndReminders();
  }

  @PostMapping("/todos/{id}/master")
  public ResponseEntity<TodoResponse> masterTodo(@PathVariable("id") String id) {
    return ResponseEntity.ok().body(todoService.markMastered(id));
  }

  @GetMapping("/todos/archive")
  public ArchiveResponse getArchive() {
    return todoService.getArchive();
  }
}
