package com.ka.fsp.todo.dto;

import java.util.List;

public record ArchiveResponse(List<TodoResponse> masteredItems, List<TodoResponse> closedTasks) {}
