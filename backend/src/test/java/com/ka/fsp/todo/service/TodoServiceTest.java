package com.ka.fsp.todo.service;

import com.ka.fsp.todo.dto.TodoResponse;
import com.ka.fsp.todo.entity.TodoEntity;
import com.ka.fsp.todo.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TodoServiceTest {

    @Mock
    private TodoRepository todoRepository;

    @InjectMocks
    private TodoService todoService;

    private TodoEntity existingEntity;

    @BeforeEach
    void setUp() {
        existingEntity = new TodoEntity("Test Todo");
        existingEntity.setId("test-id-1");
        existingEntity.setRevisionIteration(0);
        existingEntity.setCompleted(false);
    }

    @Test
    void markReviewed_setsNextRevisionDateToTodayPlusTwo_andIterationBecomesOne() {
        when(todoRepository.findById("test-id-1")).thenReturn(Optional.of(existingEntity));
        when(todoRepository.save(any(TodoEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        TodoResponse result = todoService.markReviewed("test-id-1");

        assertEquals(1, result.getRevisionIteration());
        assertTrue(result.isCompleted());
        // FibonacciScheduler.getDaysUntilNextReview(1) = INTERVALS[1] = 2 days
        assertEquals(LocalDate.now().plusDays(2), result.getNextRevisionDate());
    }

    @Test
    void markReviewed_afterMaxReviews_capsAtLongestInterval() {
        // Start at iteration 11; after one more review iteration becomes 12
        existingEntity.setRevisionIteration(11);
        when(todoRepository.findById("test-id-1")).thenReturn(Optional.of(existingEntity));
        when(todoRepository.save(any(TodoEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        TodoResponse result = todoService.markReviewed("test-id-1");

        // iteration 12 → Math.min(12, 11) = index 11 → INTERVALS[11] = 233 days (not 1 day via modulo)
        assertEquals(12, result.getRevisionIteration());
        assertEquals(LocalDate.now().plusDays(233), result.getNextRevisionDate());
        assertTrue(result.isCompleted());
    }
}
