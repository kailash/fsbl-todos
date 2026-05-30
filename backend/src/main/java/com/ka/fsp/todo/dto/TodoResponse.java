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

    public static TodoResponse from(TodoEntity e) {
        TodoResponse r = new TodoResponse();
        r.id = e.getId();
        r.title = e.getTitle();
        r.completed = e.isCompleted();
        r.createdAt = e.getCreatedAt();
        r.categories = e.getCategories();
        r.nextRevisionDate = e.getNextRevisionDate();
        r.revisionIteration = e.getRevisionIteration();
        return r;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public boolean isCompleted() { return completed; }
    public LocalDate getCreatedAt() { return createdAt; }
    public Set<Category> getCategories() { return categories; }
    public LocalDate getNextRevisionDate() { return nextRevisionDate; }
    public int getRevisionIteration() { return revisionIteration; }
}
