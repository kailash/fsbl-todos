package com.ka.fsp.todo.dto;

import java.util.List;

public class ArchiveResponse {
  private List<TodoResponse> masteredItems;
  private List<TodoResponse> closedTasks;

  public ArchiveResponse(List<TodoResponse> masteredItems, List<TodoResponse> closedTasks) {
    this.masteredItems = masteredItems;
    this.closedTasks = closedTasks;
  }

  public List<TodoResponse> getMasteredItems() {
    return masteredItems;
  }

  public List<TodoResponse> getClosedTasks() {
    return closedTasks;
  }
}
