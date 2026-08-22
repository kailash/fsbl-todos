package com.ka.fsp.todo.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
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

// Explicit @JsonCreator on the no-args constructor forces Jackson to bind via
// setters instead of the Lombok-generated all-args constructor. Without this,
// Jackson 3's constructor-detection selects the all-args constructor as the
// creator and fails with "Cannot map `null` into type `boolean`" whenever a
// request omits a primitive field (e.g. `completed`).
@Data
@Builder
@NoArgsConstructor(onConstructor_ = @JsonCreator)
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
