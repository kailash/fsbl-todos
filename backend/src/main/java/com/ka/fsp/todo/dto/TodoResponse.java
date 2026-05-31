package com.ka.fsp.todo.dto;

import com.ka.fsp.todo.entity.Category;
import com.ka.fsp.todo.entity.TodoEntity;
import java.time.LocalDate;
import java.util.Set;

public record TodoResponse(
    String id,
    String title,
    boolean completed,
    LocalDate createdAt,
    Set<Category> categories,
    LocalDate nextRevisionDate,
    int revisionIteration,
    String description,
    LocalDate reminderDate,
    LocalDate lastReviewedAt,
    boolean mastered) {

  public static TodoResponse from(TodoEntity todo) {
    return new TodoResponse(
        todo.getId(),
        todo.getTitle(),
        todo.isCompleted(),
        todo.getCreatedAt(),
        todo.getCategories(),
        todo.getNextRevisionDate(),
        todo.getRevisionIteration(),
        todo.getDescription(),
        todo.getReminderDate(),
        todo.getLastReviewedAt(),
        todo.isMastered());
  }
}
