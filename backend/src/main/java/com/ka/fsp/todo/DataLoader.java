package com.ka.fsp.todo;

import com.ka.fsp.todo.entity.Category;
import com.ka.fsp.todo.entity.TodoEntity;
import com.ka.fsp.todo.repository.TodoRepository;
import com.ka.fsp.todo.util.FibonacciScheduler;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final TodoRepository todoRepository;

    public DataLoader(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Override
    public void run(String... args) {
        if (todoRepository.count() > 0) {
            return;
        }


        List<TodoEntity> todos = Arrays.asList(
            // ── Pending todos ──────────────────────────────────────────────
            todo("Study Spring Boot fundamentals",
                    false, 0,
                    Category.LEARNING),

            todo("Read Clean Code by Robert Martin",
                    false, 2,
                    Category.LEARNING),

            todo("Prepare Q3 project roadmap",
                    false, 0,
                    Category.WORK),

            todo("Review AWS architecture decisions",
                    false, 1,
                    Category.WORK, Category.LEARNING),

            todo("Plan weekend hiking trip",
                    false, 0,
                    Category.PERSONAL, Category.FUTURE),

            todo("Call dentist for appointment",
                    false, 0,
                    Category.PERSONAL),

            todo("Angular state management patterns",
                    false, 0,
                    Category.LEARNING),

            todo("Refactor authentication module",
                    false, 1,
                    Category.WORK),

            todo("Research standing desk options",
                    false, 0,
                    Category.PERSONAL, Category.FUTURE),

            todo("Write integration tests for API",
                    false, 0,
                    Category.WORK),

            // ── Completed todos due for review today (show in Review panel) ─
            todo("Docker networking deep dive",
                    true, 4,
                    Category.LEARNING),

            todo("Design system component patterns",
                    true, 2,
                    Category.WORK, Category.LEARNING),

            todo("MongoDB aggregation pipelines",
                    true, 1,
                    Category.LEARNING)
        );

        todoRepository.saveAll(todos);
    }

    private TodoEntity todo(String title,
                             boolean completed, int iteration,
                             Category... categories) {
        TodoEntity e = new TodoEntity();
        e.setTitle(title);
        e.setCompleted(completed);
        e.setRevisionIteration(iteration);
        if (completed) {
            e.setNextRevisionDate(LocalDate.now());
        } else if (iteration > 0) {
            e.setNextRevisionDate(LocalDate.now().plusDays(FibonacciScheduler.getDaysUntilNextReview(iteration)));
        }
        e.setCategories(categories.length == 0
                ? EnumSet.noneOf(Category.class)
                : EnumSet.copyOf(Arrays.asList(categories)));
        return e;
    }
}
