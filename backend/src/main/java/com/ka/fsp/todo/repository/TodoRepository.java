package com.ka.fsp.todo.repository;

import com.ka.fsp.todo.entity.Category;
import com.ka.fsp.todo.entity.TodoEntity;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface TodoRepository extends MongoRepository<TodoEntity, String> {

  List<TodoEntity> findByCompletedFalse(Sort sort);

  List<TodoEntity> findByNextRevisionDateAndCompletedTrue(LocalDate nextRevisionDate);

  List<TodoEntity> findByReminderDateAndCompletedFalse(LocalDate date);

  List<TodoEntity> findByCompletedFalseAndReminderDateIsNull(Sort sort);

  @Query("{ 'categories': 'LEARNING', 'completed': true, 'mastered': false }")
  List<TodoEntity> findActiveLearningSchedule(Sort sort);

  List<TodoEntity> findByCategoriesContainingAndCompletedFalse(Category category, Sort sort);

  List<TodoEntity> findByMasteredTrue(Sort sort);

  List<TodoEntity> findByLastReviewedAt(LocalDate date);

  long countByMasteredTrue();

  long countByCategoriesContainingAndCompletedTrueAndMasteredFalse(Category category);
}
