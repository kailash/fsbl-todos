package com.ka.fsp.todo.entity;

import java.time.LocalDate;
import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection = "todos")
@CompoundIndexes({
    @CompoundIndex(name = "revision_idx", def = "{'completed': 1, 'nextRevisionDate': 1}")
})
public class TodoEntity {

	@Id
	private String id;
	private String title;
	private int revisionIteration;
	private LocalDate nextRevisionDate;
	private Set<Category> categories = EnumSet.noneOf(Category.class);
	private boolean completed = false;
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

	public Set<Category> getCategories() {
		return Collections.unmodifiableSet(categories);
	}

	public void setCategories(Set<Category> categories) {
		this.categories = categories == null ? EnumSet.noneOf(Category.class) : EnumSet.copyOf(categories.isEmpty() ? EnumSet.noneOf(Category.class) : categories);
	}

	@Override
	public String toString() {
		return String.format("Todo[id=%s, title='%s', completed='%s']", id, title, completed);
	}

}
