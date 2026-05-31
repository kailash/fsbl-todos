package com.ka.fsp.todo.controller;

import com.ka.fsp.todo.dto.StatsResponse;
import com.ka.fsp.todo.service.TodoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class StatsController {

  private final TodoService todoService;

  public StatsController(TodoService todoService) {
    this.todoService = todoService;
  }

  @GetMapping("/stats")
  public StatsResponse getStats() {
    return todoService.getStats();
  }
}
