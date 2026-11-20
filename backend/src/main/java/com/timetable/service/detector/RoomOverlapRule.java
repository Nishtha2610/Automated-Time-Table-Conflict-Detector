package com.timetable.service.detector;

import com.timetable.model.ConflictType;
import com.timetable.model.ConflictViolation;
import com.timetable.model.ScheduleEntry;

import java.util.Optional;

/**
 * Validates that a classroom cannot host two different classes simultaneously.
 */
public class RoomOverlapRule implements ConflictRule {

    @Override
    public Optional<ConflictViolation> checkConflict(ScheduleEntry candidate, ScheduleEntry existing) {
        if (candidate.getId() > 0 && candidate.getId() == existing.getId()) {
            return Optional.empty();
        }

        if (candidate.getClassroom() == null || existing.getClassroom() == null) {
            return Optional.empty();
        }

        boolean sameRoom = candidate.getClassroom().getId() == existing.getClassroom().getId();
        if (sameRoom && candidate.getTimeSlot().overlapsWith(existing.getTimeSlot())) {
            String desc = String.format("Classroom '%s' is already occupied on %s from %s to %s by Section '%s' (%s).",
                    existing.getClassroom().getRoomNumber(),
                    existing.getTimeSlot().getDayOfWeek(),
                    existing.getTimeSlot().getStartTime(),
                    existing.getTimeSlot().getEndTime(),
                    existing.getSection() != null ? existing.getSection().getSectionName() : "N/A",
                    existing.getCourse() != null ? existing.getCourse().getCourseCode() : "N/A"
            );
            return Optional.of(new ConflictViolation(ConflictType.ROOM_DOUBLE_BOOKED, desc, existing, candidate));
        }

        return Optional.empty();
    }
}
