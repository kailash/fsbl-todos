package com.ka.fsp.todo;

import com.ka.fsp.todo.entity.TodoEntity;
import com.ka.fsp.todo.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private TodoRepository todoRepository;

    @Override
    public void run(String... args) {
        if (todoRepository.count() > 0) {
            return;
        }

        LocalDate today = LocalDate.now();

        List<TodoEntity> todos = Arrays.asList(
            // ── Pending todos ──────────────────────────────────────────────
            todo("Study Spring Boot fundamentals",
                    false, 0, null,
                    false, false, false, true),

            todo("Read Clean Code by Robert Martin",
                    false, 2, today.plusDays(3),
                    false, false, false, true),

            todo("Prepare Q3 project roadmap",
                    false, 0, null,
                    true, false, false, false),

            todo("Review AWS architecture decisions",
                    false, 1, today.plusDays(2),
                    true, false, false, true),

            todo("Plan weekend hiking trip",
                    false, 0, null,
                    false, true, true, false),

            todo("Call dentist for appointment",
                    false, 0, null,
                    false, true, false, false),

            todo("Angular state management patterns",
                    false, 0, null,
                    false, false, false, true),

            todo("Refactor authentication module",
                    false, 1, today.plusDays(2),
                    true, false, false, false),

            todo("Research standing desk options",
                    false, 0, null,
                    false, true, true, false),

            todo("Write integration tests for API",
                    false, 0, null,
                    true, false, false, false),

            // ── Completed todos due for review today (show in Review panel) ─
            todo("Docker networking deep dive",
                    true, 4, today,
                    false, false, false, true),

            todo("Design system component patterns",
                    true, 2, today,
                    true, false, false, true),

            todo("MongoDB aggregation pipelines",
                    true, 1, today,
                    false, false, false, true)
        );

        todoRepository.saveAll(todos);
    }

    private TodoEntity todo(String title,
                             boolean completed, int iteration, LocalDate nextRevision,
                             boolean isWork, boolean isPersonal, boolean isFuture, boolean isLearning) {
        TodoEntity e = new TodoEntity();
        e.setTitle(title);
        e.setCompleted(completed);
        e.setRevisionIeration(iteration);
        e.setNextRevisionDate(nextRevision);
        e.setWork(isWork);
        e.setPersonal(isPersonal);
        e.setFuture(isFuture);
        e.setLearning(isLearning);
        return e;
    }
}
