package com.ka.fsp.todo.domain;

import java.time.LocalDate;
import java.util.EnumSet;
import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.ka.fsp.todo.entity.Category;

public class Todo {

	private String id;
	@NotBlank
	@Size(max = 100)
	private String title;
	private Set<Category> categories = EnumSet.noneOf(Category.class);
	private boolean completed = false;
	private LocalDate createdAt = LocalDate.now();

	public Todo() {
		super();
	}

	public Todo(String title) {
		this.title = title;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public boolean isCompleted() {
		return completed;
	}

	public void setCompleted(boolean completed) {
		this.completed = completed;
	}

	public LocalDate getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDate createdAt) {
		this.createdAt = createdAt;
	}

	public Set<Category> getCategories() {
		return categories;
	}

	public void setCategories(Set<Category> categories) {
		this.categories = categories;
	}

	@Override
	public String toString() {
		return String.format("Todo[id=%s, title='%s', completed='%s']", id, title,
				completed);
	}
}
