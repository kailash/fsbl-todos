package com.ka.fsp.todo.controller;

import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import com.ka.fsp.todo.repository.TodoRepository;
import com.ka.fsp.todo.service.TodoService;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class TodoController {
	@Autowired
	TodoRepository todoRepository;
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
		return todoRepository.findById(id).map(todo -> ResponseEntity.ok().body(todo))
										  .orElse(ResponseEntity.notFound().build());
	}

	@PutMapping(value = "/todos/{id}")
	public ResponseEntity<TodoEntity> updateTodo4Title(@PathVariable("id") String id,
			@Valid @RequestBody Todo todo) {
		Optional<TodoEntity> optional=todoService.updateTitle(id, todo);
		if(optional.isPresent()) {
			return ResponseEntity.ok().body(optional.get());
		}else {
			return ResponseEntity.notFound().build();
		}
	}
	
	@PutMapping(value = "/todos/updateitr/{id}")
	public ResponseEntity<TodoEntity> updateTodo4RevisionDate(@PathVariable("id") String id,
			@Valid @RequestBody Todo todo) {
		Optional<TodoEntity> optional=todoService.updateTitleAndRevision(id, todo);
		if(optional.isPresent()) {
			return ResponseEntity.ok().body(optional.get());
		}else {
			return ResponseEntity.notFound().build();
		}
	}

	@DeleteMapping(value = "/todos/{id}")
	public ResponseEntity<?> deleteTodo(@PathVariable("id") String id) {
		return todoRepository.findById(id).map(todo -> {
			todoRepository.deleteById(id);
			return ResponseEntity.ok().build();
		}).orElse(ResponseEntity.notFound().build());
	}
}
