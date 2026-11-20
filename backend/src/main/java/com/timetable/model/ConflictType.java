package com.timetable.model;

/**
 * Enumeration of distinct schedule conflict violations.
 */
public enum ConflictType {
    TEACHER_DOUBLE_BOOKED("Teacher Conflict", "The specified instructor is already assigned to another class during this time."),
    ROOM_DOUBLE_BOOKED("Classroom Conflict", "The classroom is already occupied by another class during this time."),
    SECTION_DOUBLE_BOOKED("Student Section Conflict", "The student cohort/section has another lecture scheduled in this interval."),
    CAPACITY_EXCEEDED("Room Capacity Exceeded", "The student count of the section exceeds the maximum seating capacity of the room.");

    private final String title;
    private final String description;

    ConflictType(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }
}
