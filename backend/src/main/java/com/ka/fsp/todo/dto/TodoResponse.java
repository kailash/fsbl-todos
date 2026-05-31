package com.ka.fsp.todo.dto;

import com.ka.fsp.todo.entity.Category;
import com.ka.fsp.todo.entity.TodoEntity;
import java.time.LocalDate;
import java.util.Set;

public class TodoResponse {
  private String id;
  private String title;
  private boolean completed;
  private LocalDate createdAt;
  private Set<Category> categories;
  private LocalDate nextRevisionDate;
  private int revisionIteration;
  private String description;
  private LocalDate reminderDate;
  private LocalDate lastReviewedAt;
  private boolean mastered;

  public static TodoResponse from(TodoEntity e) {
    TodoResponse r = new TodoResponse();
    r.id = e.getId();
    r.title = e.getTitle();
    r.completed = e.isCompleted();
    r.createdAt = e.getCreatedAt();
    r.categories = e.getCategories();
    r.nextRevisionDate = e.getNextRevisionDate();
    r.revisionIteration = e.getRevisionIteration();
    r.description = e.getDescription();
    r.reminderDate = e.getReminderDate();
    r.lastReviewedAt = e.getLastReviewedAt();
    r.mastered = e.isMastered();
    return r;
  }

  public String getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public boolean isCompleted() {
    return completed;
  }

  public LocalDate getCreatedAt() {
    return createdAt;
  }

  public Set<Category> getCategories() {
    return categories;
  }

  public LocalDate getNextRevisionDate() {
    return nextRevisionDate;
  }

  public int getRevisionIteration() {
    return revisionIteration;
  }

  public String getDescription() {
    return description;
  }

  public LocalDate getReminderDate() {
    return reminderDate;
  }

  public LocalDate getLastReviewedAt() {
    return lastReviewedAt;
  }

  public boolean isMastered() {
    return mastered;
  }
}
