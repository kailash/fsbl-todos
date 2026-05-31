package com.ka.fsp.todo.dto;

import java.util.List;

public class StatsResponse {
  private int reviewedToday;
  private int currentStreak;
  private long activeLearningCount;
  private long masteredCount;
  private List<Integer> weeklyActivity;

  public StatsResponse(
      int reviewedToday,
      int currentStreak,
      long activeLearningCount,
      long masteredCount,
      List<Integer> weeklyActivity) {
    this.reviewedToday = reviewedToday;
    this.currentStreak = currentStreak;
    this.activeLearningCount = activeLearningCount;
    this.masteredCount = masteredCount;
    this.weeklyActivity = weeklyActivity;
  }

  public int getReviewedToday() {
    return reviewedToday;
  }

  public int getCurrentStreak() {
    return currentStreak;
  }

  public long getActiveLearningCount() {
    return activeLearningCount;
  }

  public long getMasteredCount() {
    return masteredCount;
  }

  public List<Integer> getWeeklyActivity() {
    return weeklyActivity;
  }
}
