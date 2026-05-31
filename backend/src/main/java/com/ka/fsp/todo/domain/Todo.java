package com.ka.fsp.todo.domain;

import com.ka.fsp.todo.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.EnumSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Todo {

  private String id;

  @NotBlank
  @Size(max = 100)
  private String title;

  @Builder.Default private Set<Category> categories = EnumSet.noneOf(Category.class);

  @Builder.Default private boolean completed = false;

  @Builder.Default private LocalDate createdAt = LocalDate.now();

  @Size(max = 1000)
  private String description;

  private LocalDate reminderDate;
}
