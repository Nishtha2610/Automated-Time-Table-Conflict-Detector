package com.timetable.service.detector;

import com.timetable.model.ConflictType;
import com.timetable.model.ConflictViolation;
import com.timetable.model.ScheduleEntry;

import java.util.Optional;

/**
 * Validates that a student cohort/section cannot have two simultaneous lectures.
 */
public class SectionOverlapRule implements ConflictRule {

    @Override
    public Optional<ConflictViolation> checkConflict(ScheduleEntry candidate, ScheduleEntry existing) {
        if (candidate.getId() > 0 && candidate.getId() == existing.getId()) {
            return Optional.empty();
        }

        if (candidate.getSection() == null || existing.getSection() == null) {
            return Optional.empty();
        }

        boolean sameSection = candidate.getSection().getId() == existing.getSection().getId();
        if (sameSection && candidate.getTimeSlot().overlapsWith(existing.getTimeSlot())) {
            String desc = String.format("Student Section '%s' already has lecture '%s' scheduled on %s from %s to %s with Dr. %s.",
                    existing.getSection().getSectionName(),
                    existing.getCourse() != null ? existing.getCourse().getTitle() : "Course",
                    existing.getTimeSlot().getDayOfWeek(),
                    existing.getTimeSlot().getStartTime(),
                    existing.getTimeSlot().getEndTime(),
                    existing.getTeacher() != null ? existing.getTeacher().getFullName() : "N/A"
            );
            return Optional.of(new ConflictViolation(ConflictType.SECTION_DOUBLE_BOOKED, desc, existing, candidate));
        }

        return Optional.empty();
    }
}
