package com.ka.fsp.todo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ka.fsp.todo.entity.TodoEntity;

@Repository
public interface TodoRepository extends MongoRepository<TodoEntity, String>{
	
	List<TodoEntity> findByCompletedFalse(Sort sort);
	List<TodoEntity> findByNextRevisionDateAndCompletedTrue(LocalDate nextRevisionDate);
}
