package com.ka.fsp.todo.controller;

import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ka.fsp.todo.domain.Todo;
import com.ka.fsp.todo.entity.TodoEntity;
import com.ka.fsp.todo.service.TodoService;

@RestController
@RequestMapping("/api")
public class TodoController {

	@Autowired
	TodoService todoService;

	@GetMapping("/todos")
	public List<TodoEntity> getAllTodos() {
		return todoService.getAll();
	}

	@GetMapping("/todos/pending")
	public List<TodoEntity> getAllPendingTodos() {
		return todoService.getAllPending();
	}

	@PostMapping("/todos")
	public ResponseEntity<TodoEntity> createTodo(@Valid @RequestBody Todo todo) {
		return ResponseEntity.ok().body(todoService.save(todo));
	}

	@GetMapping(value = "/todos/{id}")
	public ResponseEntity<TodoEntity> getTodoById(@PathVariable("id") String id) {
		try {
			return ResponseEntity.ok().body(todoService.getTodoById(id));
		} catch (java.util.NoSuchElementException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@PutMapping(value = "/todos/{id}")
	public ResponseEntity<TodoEntity> updateTodo(@PathVariable("id") String id,
			@Valid @RequestBody Todo todo) {
		Optional<TodoEntity> optional = todoService.updateTodo(id, todo);
		if (optional.isPresent()) {
			return ResponseEntity.ok().body(optional.get());
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PostMapping(value = "/todos/{id}/review")
	public ResponseEntity<TodoEntity> reviewTodo(@PathVariable("id") String id) {
		try {
			return ResponseEntity.ok().body(todoService.markReviewed(id));
		} catch (java.util.NoSuchElementException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@DeleteMapping(value = "/todos/{id}")
	public ResponseEntity<?> deleteTodo(@PathVariable("id") String id) {
		try {
			todoService.deleteTodo(id);
			return ResponseEntity.ok().build();
		} catch (java.util.NoSuchElementException e) {
			return ResponseEntity.notFound().build();
		}
	}
}
