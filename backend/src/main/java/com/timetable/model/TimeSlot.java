package com.timetable.model;

import java.time.LocalTime;
import java.util.Objects;

/**
 * Represents a discrete scheduled time interval on a given day.
 * Implements interval intersection math:
 * Overlap exists iff: Max(Start1, Start2) < Min(End1, End2)
 */
public class TimeSlot {
    private final String dayOfWeek;
    private final LocalTime startTime;
    private final LocalTime endTime;

    public TimeSlot(String dayOfWeek, LocalTime startTime, LocalTime endTime) {
        if (dayOfWeek == null || startTime == null || endTime == null) {
            throw new IllegalArgumentException("TimeSlot attributes cannot be null");
        }
        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException("Start time must precede end time: " + startTime + " >= " + endTime);
        }
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    /**
     * Checks if this time slot overlaps with another time slot.
     * Overlap occurs only when both slots are on the same day and their intervals intersect.
     */
    public boolean overlapsWith(TimeSlot other) {
        if (other == null) return false;
        if (!this.dayOfWeek.equalsIgnoreCase(other.dayOfWeek)) {
            return false;
        }
        // Formula: S1 < E2 and S2 < E1
        return this.startTime.isBefore(other.endTime) && other.startTime.isBefore(this.endTime);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TimeSlot timeSlot)) return false;
        return dayOfWeek.equalsIgnoreCase(timeSlot.dayOfWeek) &&
               Objects.equals(startTime, timeSlot.startTime) &&
               Objects.equals(endTime, timeSlot.endTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(dayOfWeek.toLowerCase(), startTime, endTime);
    }

    @Override
    public String toString() {
        return dayOfWeek + " [" + startTime + " - " + endTime + "]";
    }
}
