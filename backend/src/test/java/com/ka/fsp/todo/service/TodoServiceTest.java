package com.ka.fsp.todo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.ka.fsp.todo.dto.TodoResponse;
import com.ka.fsp.todo.entity.TodoEntity;
import com.ka.fsp.todo.repository.TodoRepository;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TodoServiceTest {

  @Mock private TodoRepository todoRepository;

  @InjectMocks private TodoService todoService;

  private TodoEntity existingEntity;

  @BeforeEach
  void setUp() {
    existingEntity = TodoEntity.builder().title("Test Todo").build();
    existingEntity.setId("test-id-1");
    existingEntity.setRevisionIteration(0);
    existingEntity.setCompleted(false);
  }

  @Test
  void markReviewed_setsNextRevisionDateToTodayPlusTwo_andIterationBecomesOne() {
    existingEntity.setCategories(java.util.EnumSet.of(com.ka.fsp.todo.entity.Category.LEARNING));
    when(todoRepository.findById("test-id-1")).thenReturn(Optional.of(existingEntity));
    when(todoRepository.save(any(TodoEntity.class))).thenAnswer(inv -> inv.getArgument(0));

    TodoResponse result = todoService.markReviewed("test-id-1");

    assertEquals(1, result.revisionIteration());
    assertTrue(result.completed());
    // FibonacciScheduler.getDaysUntilNextReview(1) = INTERVALS[1] = 2 days
    assertEquals(LocalDate.now().plusDays(2), result.nextRevisionDate());
  }

  @Test
  void markReviewed_afterMaxReviews_capsAtLongestInterval() {
    // Start at iteration 11; after one more review iteration becomes 12
    existingEntity.setCategories(java.util.EnumSet.of(com.ka.fsp.todo.entity.Category.LEARNING));
    existingEntity.setRevisionIteration(11);
    when(todoRepository.findById("test-id-1")).thenReturn(Optional.of(existingEntity));
    when(todoRepository.save(any(TodoEntity.class))).thenAnswer(inv -> inv.getArgument(0));

    TodoResponse result = todoService.markReviewed("test-id-1");

    // iteration 12 → Math.min(12, 11) = index 11 → INTERVALS[11] = 233 days (not 1 day via modulo)
    assertEquals(12, result.revisionIteration());
    assertEquals(LocalDate.now().plusDays(233), result.nextRevisionDate());
    assertTrue(result.completed());
  }
}
