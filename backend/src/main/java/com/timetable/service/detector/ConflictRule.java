package com.timetable.service.detector;

import com.timetable.model.ConflictViolation;
import com.timetable.model.ScheduleEntry;

import java.util.Optional;

/**
 * Strategy pattern interface for polymorphic timetable conflict detection.
 */
public interface ConflictRule {
    /**
     * Evaluates whether the candidate entry clashes with an existing scheduled entry.
     * @param candidate The new or modified schedule entry.
     * @param existing The existing schedule entry from the database.
     * @return Optional containing the violation if a conflict is detected, empty otherwise.
     */
    Optional<ConflictViolation> checkConflict(ScheduleEntry candidate, ScheduleEntry existing);
}
