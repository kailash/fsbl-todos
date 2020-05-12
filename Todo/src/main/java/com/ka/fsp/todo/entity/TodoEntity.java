package com.ka.fsp.todo.entity;

import java.time.LocalDate;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection = "todos")
@JsonIgnoreProperties(value = { "createdAt" }, allowGetters = true)
public class TodoEntity {

	@Id
	private String id;
	@NotBlank
	@Size(max = 100)
	@Indexed(unique = true)
	private String title;
	private int revisionIeration;
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

	public int getRevisionIeration() {
		return revisionIeration;
	}

	public void setRevisionIeration(int revisionIeration) {
		this.revisionIeration = revisionIeration;
	}

	public LocalDate getNextRevision() {
		return nextRevisionDate;
	}

	public void setNextRevision(LocalDate nextRevision) {
		this.nextRevisionDate = nextRevision;
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
