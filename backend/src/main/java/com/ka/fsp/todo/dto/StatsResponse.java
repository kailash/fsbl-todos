package com.ka.fsp.todo.dto;

import java.util.List;

public record StatsResponse(
    int reviewedToday,
    int currentStreak,
    long activeLearningCount,
    long masteredCount,
    List<Integer> weeklyActivity) {}
