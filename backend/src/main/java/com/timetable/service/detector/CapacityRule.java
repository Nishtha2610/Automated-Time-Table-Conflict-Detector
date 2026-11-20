package com.timetable.service.detector;

import com.timetable.model.ConflictType;
import com.timetable.model.ConflictViolation;
import com.timetable.model.ScheduleEntry;

import java.util.Optional;

/**
 * Validates that room seating capacity is not exceeded by the section student headcount.
 */
public class CapacityRule implements ConflictRule {

    @Override
    public Optional<ConflictViolation> checkConflict(ScheduleEntry candidate, ScheduleEntry existing) {
        if (candidate.getClassroom() == null || candidate.getSection() == null) {
            return Optional.empty();
        }

        int capacity = candidate.getClassroom().getCapacity();
        int studentCount = candidate.getSection().getStudentCount();

        if (studentCount > capacity) {
            String desc = String.format("Classroom '%s' capacity (%d seats) is insufficient for Section '%s' (%d students). Deficit: %d seats.",
                    candidate.getClassroom().getRoomNumber(),
                    capacity,
                    candidate.getSection().getSectionName(),
                    studentCount,
                    (studentCount - capacity)
            );
            return Optional.of(new ConflictViolation(ConflictType.CAPACITY_EXCEEDED, desc, null, candidate));
        }

        return Optional.empty();
    }
}
