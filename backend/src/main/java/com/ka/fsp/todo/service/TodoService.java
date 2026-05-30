package com.ka.fsp.todo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ka.fsp.todo.domain.Todo;
import com.ka.fsp.todo.dto.TodoResponse;
import com.ka.fsp.todo.entity.TodoEntity;
import com.ka.fsp.todo.repository.TodoRepository;
import com.ka.fsp.todo.util.FibonacciScheduler;

@Service
public class TodoService {

	private static final Logger log = LoggerFactory.getLogger(TodoService.class);

	private final TodoRepository todoRepository;

	public TodoService(TodoRepository todoRepository) {
		this.todoRepository = todoRepository;
	}

	public List<TodoResponse> getAll() {
		return todoRepository.findAll().stream()
				.map(TodoResponse::from)
				.collect(Collectors.toList());
	}

	public List<TodoResponse> getAllPending() {
		Sort sortByCreatedAtDesc = Sort.by(Sort.Direction.DESC, "createdAt");
		return todoRepository.findByCompletedFalse(sortByCreatedAtDesc).stream()
				.map(TodoResponse::from)
				.collect(Collectors.toList());
	}

	public List<TodoResponse> getRevisionTodosForDate(LocalDate date) {
		return todoRepository.findByNextRevisionDateAndCompletedTrue(date).stream()
				.map(TodoResponse::from)
				.collect(Collectors.toList());
	}

	public TodoResponse save(Todo todo) {
		log.info("Creating todo: title={}", todo.getTitle());
		TodoEntity todoEntity = new TodoEntity();
		todoEntity.setTitle(todo.getTitle());
		todoEntity.setRevisionIteration(0);
		todoEntity.setCategories(todo.getCategories());
		todoEntity.setCompleted(false);
		return TodoResponse.from(todoRepository.save(todoEntity));
	}

	public TodoResponse getTodoById(String id) {
		return TodoResponse.from(todoRepository.findById(id)
				.orElseThrow(() -> new NoSuchElementException("Todo not found: " + id)));
	}

	public void deleteTodo(String id) {
		log.info("Deleting todo: id={}", id);
		TodoEntity entity = todoRepository.findById(id)
				.orElseThrow(() -> new NoSuchElementException("Todo not found: " + id));
		todoRepository.deleteById(entity.getId());
	}

	public TodoResponse markReviewed(String id) {
		TodoEntity entity = todoRepository.findById(id)
				.orElseThrow(() -> new NoSuchElementException("Todo not found: " + id));
		int newIteration = entity.getRevisionIteration() + 1;
		log.info("Marking todo reviewed: id={}, newIteration={}", id, newIteration);
		entity.setRevisionIteration(newIteration);
		entity.setNextRevisionDate(LocalDate.now().plusDays(FibonacciScheduler.getDaysUntilNextReview(newIteration)));
		entity.setCompleted(true);
		return TodoResponse.from(todoRepository.save(entity));
	}

	public Optional<TodoResponse> updateTodo(String id, Todo todo) {
		return todoRepository.findById(id)
				.map(todoData -> {
					log.info("Updating todo: id={}", id);
					todoData.setTitle(todo.getTitle());
					todoData.setCategories(todo.getCategories());
					return TodoResponse.from(todoRepository.save(todoData));
				});
	}

}
