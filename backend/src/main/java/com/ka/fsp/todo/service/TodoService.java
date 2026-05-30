package com.ka.fsp.todo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ka.fsp.todo.domain.Todo;
import com.ka.fsp.todo.entity.TodoEntity;
import com.ka.fsp.todo.repository.TodoRepository;

@Service
public class TodoService {

	private static final int[] FIB_ARRAY = { 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233 };

	@Autowired
	TodoRepository todoRepository;

	public List<TodoEntity> getAll() {
		return todoRepository.findAll();
	}

	public List<TodoEntity> getAllPending() {
		Sort sortByCreatedAtDesc = Sort.by(Sort.Direction.DESC, "createdAt");
		return todoRepository.findByCompletedFalse(sortByCreatedAtDesc);
	}

	public List<TodoEntity> getRevisionTodosForDate(LocalDate date) {
		return todoRepository.findByNextRevisionDateAndCompletedTrue(date);
	}

	public TodoEntity save(Todo todo) {
		TodoEntity todoEntity = new TodoEntity();
		todoEntity.setTitle(todo.getTitle());
		todoEntity.setRevisionIteration(0);
		todoEntity.setFuture(todo.isFuture());
		todoEntity.setLearning(todo.isLearning());
		todoEntity.setWork(todo.isWork());
		todoEntity.setPersonal(todo.isPersonal());
		todoEntity.setCompleted(false);
		return todoRepository.save(todoEntity);
	}

	public TodoEntity getTodoById(String id) {
		return todoRepository.findById(id)
				.orElseThrow(() -> new NoSuchElementException("Todo not found: " + id));
	}

	public void deleteTodo(String id) {
		TodoEntity entity = getTodoById(id);
		todoRepository.deleteById(entity.getId());
	}

	public TodoEntity markReviewed(String id) {
		TodoEntity entity = todoRepository.findById(id)
				.orElseThrow(() -> new NoSuchElementException("Todo not found: " + id));
		int newIteration = entity.getRevisionIteration() + 1;
		entity.setRevisionIteration(newIteration);
		entity.setNextRevisionDate(LocalDate.now().plusDays(FIB_ARRAY[newIteration % 12]));
		entity.setCompleted(true);
		return todoRepository.save(entity);
	}

	public Optional<TodoEntity> updateTodo(String id, Todo todo) {
		return todoRepository.findById(id)
				.map(todoData -> {
					todoData.setTitle(todo.getTitle());
					return todoRepository.save(todoData);
				});
	}

	// Keep for backward compatibility during transition
	public Optional<TodoEntity> updateTitle(String id, Todo todo) {
		return updateTodo(id, todo);
	}

}
