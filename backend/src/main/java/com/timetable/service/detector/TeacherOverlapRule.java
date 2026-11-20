package com.timetable.service.detector;

import com.timetable.model.ConflictType;
import com.timetable.model.ConflictViolation;
import com.timetable.model.ScheduleEntry;

import java.util.Optional;

/**
 * Validates that a teacher cannot be in two classrooms at the same time.
 * Interval Condition: Max(StartA, StartB) < Min(EndA, EndB) on identical Day.
 */
public class TeacherOverlapRule implements ConflictRule {

    @Override
    public Optional<ConflictViolation> checkConflict(ScheduleEntry candidate, ScheduleEntry existing) {
        // Skip comparing an entry against itself during updates
        if (candidate.getId() > 0 && candidate.getId() == existing.getId()) {
            return Optional.empty();
        }

        // Must be the same teacher
        if (candidate.getTeacher() == null || existing.getTeacher() == null) {
            return Optional.empty();
        }

        boolean sameTeacher = candidate.getTeacher().getId() == existing.getTeacher().getId();
        if (sameTeacher && candidate.getTimeSlot().overlapsWith(existing.getTimeSlot())) {
            String desc = String.format("Instructor '%s' is already booked on %s from %s to %s for Course '%s' in Room '%s'.",
                    existing.getTeacher().getFullName(),
                    existing.getTimeSlot().getDayOfWeek(),
                    existing.getTimeSlot().getStartTime(),
                    existing.getTimeSlot().getEndTime(),
                    existing.getCourse() != null ? existing.getCourse().getCourseCode() : "N/A",
                    existing.getClassroom() != null ? existing.getClassroom().getRoomNumber() : "N/A"
            );
            return Optional.of(new ConflictViolation(ConflictType.TEACHER_DOUBLE_BOOKED, desc, existing, candidate));
        }

        return Optional.empty();
    }
}
