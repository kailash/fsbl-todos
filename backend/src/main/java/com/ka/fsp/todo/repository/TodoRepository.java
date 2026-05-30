package com.ka.fsp.todo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.ka.fsp.todo.entity.TodoEntity;

public interface TodoRepository extends MongoRepository<TodoEntity, String> {

	List<TodoEntity> findByCompletedFalse(Sort sort);
	List<TodoEntity> findByNextRevisionDateAndCompletedTrue(LocalDate nextRevisionDate);
}
