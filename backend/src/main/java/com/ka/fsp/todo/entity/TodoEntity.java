package com.ka.fsp.todo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.util.EnumSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "todos")
@CompoundIndexes({
  @CompoundIndex(name = "revision_idx", def = "{'completed': 1, 'nextRevisionDate': 1}")
})
public class TodoEntity {

  @Id private String id;
  private String title;
  private int revisionIteration;
  private LocalDate nextRevisionDate;

  @Builder.Default private Set<Category> categories = EnumSet.noneOf(Category.class);

  @Builder.Default private boolean completed = false;

  private String description;
  private LocalDate reminderDate;

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  @Builder.Default
  private LocalDate createdAt = LocalDate.now();

  private LocalDate lastReviewedAt;

  @Builder.Default private boolean mastered = false;

  /** Ensures categories is never null and always backed by an EnumSet. */
  public void setCategories(Set<Category> categories) {
    this.categories =
        categories == null || categories.isEmpty()
            ? EnumSet.noneOf(Category.class)
            : EnumSet.copyOf(categories);
  }
}
