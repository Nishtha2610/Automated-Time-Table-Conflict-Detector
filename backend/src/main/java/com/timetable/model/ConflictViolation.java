package com.timetable.model;

/**
 * Details of a specific conflict detected by the scheduling validation engine.
 */
public class ConflictViolation {
    private final ConflictType conflictType;
    private final String description;
    private final ScheduleEntry conflictingEntry;
    private final ScheduleEntry incomingEntry;

    public ConflictViolation(ConflictType conflictType, String description, ScheduleEntry conflictingEntry, ScheduleEntry incomingEntry) {
        this.conflictType = conflictType;
        this.description = description;
        this.conflictingEntry = conflictingEntry;
        this.incomingEntry = incomingEntry;
    }

    public ConflictType getConflictType() {
        return conflictType;
    }

    public String getDescription() {
        return description;
    }

    public ScheduleEntry getConflictingEntry() {
        return conflictingEntry;
    }

    public ScheduleEntry getIncomingEntry() {
        return incomingEntry;
    }

    @Override
    public String toString() {
        return "[" + conflictType.name() + "] " + description;
    }
}
