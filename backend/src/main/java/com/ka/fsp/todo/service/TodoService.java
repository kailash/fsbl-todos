package com.ka.fsp.todo.service;

import com.ka.fsp.todo.domain.Todo;
import com.ka.fsp.todo.dto.ArchiveResponse;
import com.ka.fsp.todo.dto.StatsResponse;
import com.ka.fsp.todo.dto.TodoResponse;
import com.ka.fsp.todo.entity.Category;
import com.ka.fsp.todo.entity.TodoEntity;
import com.ka.fsp.todo.repository.TodoRepository;
import com.ka.fsp.todo.util.FibonacciScheduler;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class TodoService {

  private static final Logger log = LoggerFactory.getLogger(TodoService.class);

  private final TodoRepository todoRepository;

  public TodoService(TodoRepository todoRepository) {
    this.todoRepository = todoRepository;
  }

  public List<TodoResponse> getAll() {
    return todoRepository.findAll().stream().map(TodoResponse::from).collect(Collectors.toList());
  }

  public List<TodoResponse> getAllPending() {
    Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
    return todoRepository.findByCompletedFalseAndReminderDateIsNull(sort).stream()
        .map(TodoResponse::from)
        .collect(Collectors.toList());
  }

  public List<TodoResponse> getRevisionTodosForDate(LocalDate date) {
    // LEARNING todos due for Fibonacci review
    List<TodoEntity> learningReviews =
        todoRepository.findByNextRevisionDateAndCompletedTrue(date).stream()
            .filter(e -> e.getCategories().contains(Category.LEARNING))
            .collect(Collectors.toList());

    // Non-learning todos whose user-set reminder is due today
    List<TodoEntity> reminders = todoRepository.findByReminderDateAndCompletedFalse(date);

    return Stream.concat(learningReviews.stream(), reminders.stream())
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
    todoEntity.setDescription(todo.getDescription());
    todoEntity.setReminderDate(todo.getReminderDate());
    return TodoResponse.from(todoRepository.save(todoEntity));
  }

  public TodoResponse getTodoById(String id) {
    return TodoResponse.from(
        todoRepository
            .findById(id)
            .orElseThrow(() -> new NoSuchElementException("Todo not found: " + id)));
  }

  public void deleteTodo(String id) {
    log.info("Deleting todo: id={}", id);
    TodoEntity entity =
        todoRepository
            .findById(id)
            .orElseThrow(() -> new NoSuchElementException("Todo not found: " + id));
    todoRepository.deleteById(entity.getId());
  }

  public TodoResponse markReviewed(String id) {
    TodoEntity entity =
        todoRepository
            .findById(id)
            .orElseThrow(() -> new NoSuchElementException("Todo not found: " + id));
    if (!entity.getCategories().contains(Category.LEARNING)) {
      throw new IllegalArgumentException("Only LEARNING todos support spaced repetition review");
    }
    int newIteration = entity.getRevisionIteration() + 1;
    log.info("Marking todo reviewed: id={}, newIteration={}", id, newIteration);
    entity.setRevisionIteration(newIteration);
    entity.setNextRevisionDate(
        LocalDate.now().plusDays(FibonacciScheduler.getDaysUntilNextReview(newIteration)));
    entity.setCompleted(true);
    entity.setLastReviewedAt(LocalDate.now());
    return TodoResponse.from(todoRepository.save(entity));
  }

  public TodoResponse closeTodo(String id) {
    log.info("Closing todo: id={}", id);
    TodoEntity entity =
        todoRepository
            .findById(id)
            .orElseThrow(() -> new NoSuchElementException("Todo not found: " + id));
    entity.setCompleted(true);
    entity.setReminderDate(null);
    return TodoResponse.from(todoRepository.save(entity));
  }

  public TodoResponse setReminder(String id, LocalDate reminderDate) {
    log.info("Setting reminder: id={}, date={}", id, reminderDate);
    TodoEntity entity =
        todoRepository
            .findById(id)
            .orElseThrow(() -> new NoSuchElementException("Todo not found: " + id));
    entity.setReminderDate(reminderDate);
    return TodoResponse.from(todoRepository.save(entity));
  }

  public Optional<TodoResponse> updateTodo(String id, Todo todo) {
    return todoRepository
        .findById(id)
        .map(
            todoData -> {
              log.info("Updating todo: id={}", id);
              todoData.setTitle(todo.getTitle());
              todoData.setCategories(todo.getCategories());
              todoData.setDescription(todo.getDescription());
              return TodoResponse.from(todoRepository.save(todoData));
            });
  }

  public TodoResponse markMastered(String id) {
    TodoEntity entity =
        todoRepository
            .findById(id)
            .orElseThrow(() -> new NoSuchElementException("Todo not found: " + id));
    if (!entity.getCategories().contains(Category.LEARNING)) {
      throw new IllegalArgumentException("Only LEARNING todos can be mastered");
    }
    log.info("Marking todo as mastered: id={}", id);
    entity.setMastered(true);
    entity.setLastReviewedAt(LocalDate.now());
    return TodoResponse.from(todoRepository.save(entity));
  }

  public List<TodoResponse> getLearningSchedule() {
    Sort sort = Sort.by(Sort.Direction.ASC, "nextRevisionDate");
    return todoRepository.findActiveLearningSchedule(sort).stream()
        .map(TodoResponse::from)
        .collect(Collectors.toList());
  }

  public List<TodoResponse> getNewLearning() {
    Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
    return todoRepository
        .findByCategoriesContainingAndCompletedFalse(Category.LEARNING, sort)
        .stream()
        .map(TodoResponse::from)
        .collect(Collectors.toList());
  }

  public List<TodoResponse> getTasksAndReminders() {
    Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
    // Pending non-LEARNING (no reminder date, not completed)
    List<TodoEntity> pending =
        todoRepository.findByCompletedFalseAndReminderDateIsNull(sort).stream()
            .filter(e -> !e.getCategories().contains(Category.LEARNING))
            .collect(Collectors.toList());
    // Non-LEARNING with reminder due today
    List<TodoEntity> reminders =
        todoRepository.findByReminderDateAndCompletedFalse(LocalDate.now()).stream()
            .filter(e -> !e.getCategories().contains(Category.LEARNING))
            .collect(Collectors.toList());
    return Stream.concat(pending.stream(), reminders.stream())
        .map(TodoResponse::from)
        .collect(Collectors.toList());
  }

  public StatsResponse getStats() {
    int reviewedToday = todoRepository.findByLastReviewedAt(LocalDate.now()).size();

    // Streak: walk back from today counting consecutive days with reviews
    Set<LocalDate> reviewDates =
        todoRepository.findAll().stream()
            .map(TodoEntity::getLastReviewedAt)
            .filter(java.util.Objects::nonNull)
            .collect(java.util.stream.Collectors.toSet());
    int streak = 0;
    LocalDate cursor = LocalDate.now();
    while (reviewDates.contains(cursor)) {
      streak++;
      cursor = cursor.minusDays(1);
    }

    long activeLearning =
        todoRepository.countByCategoriesContainingAndCompletedTrueAndMasteredFalse(
            Category.LEARNING);
    long mastered = todoRepository.countByMasteredTrue();

    // Weekly activity: count reviews per day for last 7 days (oldest first)
    List<Integer> weeklyActivity = new java.util.ArrayList<>();
    for (int i = 6; i >= 0; i--) {
      weeklyActivity.add(todoRepository.findByLastReviewedAt(LocalDate.now().minusDays(i)).size());
    }

    return new StatsResponse(reviewedToday, streak, activeLearning, mastered, weeklyActivity);
  }

  public ArchiveResponse getArchive() {
    Sort sort = Sort.by(Sort.Direction.DESC, "lastReviewedAt");
    List<TodoResponse> masteredItems =
        todoRepository.findByMasteredTrue(sort).stream()
            .map(TodoResponse::from)
            .collect(Collectors.toList());
    // Closed non-LEARNING tasks (completed=true, not LEARNING, not mastered)
    List<TodoResponse> closedTasks =
        todoRepository.findAll().stream()
            .filter(e -> e.isCompleted() && !e.getCategories().contains(Category.LEARNING))
            .map(TodoResponse::from)
            .collect(Collectors.toList());
    return new ArchiveResponse(masteredItems, closedTasks);
  }
}
