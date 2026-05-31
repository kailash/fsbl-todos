package com.ka.fsp.todo.util;

public final class FibonacciScheduler {
  public static final int[] INTERVALS = {1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233};

  private FibonacciScheduler() {}

  public static int getDaysUntilNextReview(int iteration) {
    return INTERVALS[Math.min(iteration, INTERVALS.length - 1)];
  }
}
