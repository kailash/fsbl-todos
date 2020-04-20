package com.ka.fsp.todo.domain;

import java.time.LocalDate;

import org.springframework.stereotype.Component;
@Component
public class Todo {

	private String id;
	private String title;
	private Boolean completed = false;
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

	public Boolean getCompleted() {
		return completed;
	}

	public void setCompleted(Boolean completed) {
		this.completed = completed;
	}

	public LocalDate getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDate createdAt) {
		this.createdAt = createdAt;
	}

	@Override
	public String toString() {
		return String.format("Todo[id=%s, title='%s', completed='%s']", id, title,
				completed);
	}
}
