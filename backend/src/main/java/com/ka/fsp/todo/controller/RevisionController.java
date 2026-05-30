package com.ka.fsp.todo.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ka.fsp.todo.dto.TodoResponse;
import com.ka.fsp.todo.service.TodoService;

@RestController
@RequestMapping("/api")
public class RevisionController {

	private final TodoService todoService;

	public RevisionController(TodoService todoService) {
		this.todoService = todoService;
	}

	@GetMapping("/todos/revision")
	public List<TodoResponse> getRevisionTodosForToday() {
		return todoService.getRevisionTodosForDate(LocalDate.now());
	}

}
