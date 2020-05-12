package com.ka.fsp.todo.domain;

import java.time.LocalDate;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonProperty;

@Component
public class Todo {

	private String id;
	private String title;
	@JsonProperty("isWork")
	private boolean isWork;
	@JsonProperty ("isPersonal")
	private boolean isPersonal;
	@JsonProperty("isFuture")
	private boolean isFuture;
	@JsonProperty("isLearning")
	private boolean isLearning;
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

	public boolean getCompleted() {
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

	public boolean isWork() {
		return isWork;
	}

	public void setWork(boolean isWork) {
		this.isWork = isWork;
	}

	public boolean isPersonal() {
		return isPersonal;
	}

	public void setPersonal(boolean isPersonal) {
		this.isPersonal = isPersonal;
	}

	public boolean isFuture() {
		return isFuture;
	}

	public void setFuture(boolean isFuture) {
		this.isFuture = isFuture;
	}

	public boolean isLearning() {
		return isLearning;
	}

	public void setLearning(boolean isLearning) {
		this.isLearning = isLearning;
	}

	@Override
	public String toString() {
		return String.format("Todo[id=%s, title='%s', completed='%s']", id, title,
				completed);
	}
}
