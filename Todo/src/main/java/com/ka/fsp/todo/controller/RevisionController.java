package com.ka.fsp.todo.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ka.fsp.todo.entity.TodoEntity;
import com.ka.fsp.todo.service.TodoService;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class RevisionController {
	
	@Autowired
	TodoService todoService;
	
	@GetMapping("/todos/revision")
	public List<TodoEntity> getAllTodos() {
		return todoService.getRivision4Date(LocalDate.now());
	}

}
