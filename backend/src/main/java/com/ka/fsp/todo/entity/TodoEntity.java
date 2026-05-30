package com.ka.fsp.todo.entity;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection = "todos")
public class TodoEntity {

	@Id
	private String id;
	@Indexed(unique = true)
	private String title;
	@JsonProperty("revisionIteration")
	private int revisionIteration;
	private LocalDate nextRevisionDate;
	@JsonProperty("isWork")
	private boolean isWork;
	@JsonProperty("isPersonal")
	private boolean isPersonal;
	@JsonProperty("isFuture")
	private boolean isFuture;
	@JsonProperty("isLearning")
	private boolean isLearning;
	private Boolean completed = false;
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private LocalDate createdAt = LocalDate.now();

	public TodoEntity() {
		super();
	}

	public TodoEntity(String title) {
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

	public int getRevisionIteration() {
		return revisionIteration;
	}

	public void setRevisionIteration(int revisionIteration) {
		this.revisionIteration = revisionIteration;
	}

	public LocalDate getNextRevisionDate() {
		return nextRevisionDate;
	}

	public void setNextRevisionDate(LocalDate nextRevisionDate) {
		this.nextRevisionDate = nextRevisionDate;
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
