package com.timetable.service.detector;

import com.timetable.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ConflictDetectorTest {

    private ConflictDetector detector;
    private Teacher teacher1;
    private Teacher teacher2;
    private Classroom room1;
    private Course course1;
    private Section section1;

    @BeforeEach
    public void setup() {
        detector = new ConflictDetector();
        teacher1 = new Teacher(1, "EMP101", "Dr. Alan Turing", "alan@univ.edu", "CS");
        teacher2 = new Teacher(2, "EMP102", "Dr. Grace Hopper", "grace@univ.edu", "CS");
        room1 = new Classroom(1, "LH-101", "Turing Block", 50, "Lecture Hall");
        course1 = new Course(1, "CS101", "Algorithms", 4, "CS");
        section1 = new Section(1, "CS-A", 40, "CS");
    }

    @Test
    public void testTeacherDoubleBookingDetected() {
        // Existing entry: Monday 09:00 - 10:30 with teacher1
        ScheduleEntry existing = new ScheduleEntry(10, teacher1, room1, course1, section1,
                new TimeSlot("Monday", LocalTime.of(9, 0), LocalTime.of(10, 30)), "Fall 2026");

        // Candidate entry: Monday 10:00 - 11:30 with teacher1 (30 min overlap!)
        Classroom room2 = new Classroom(2, "LH-102", "Turing Block", 50, "Lecture Hall");
        Section section2 = new Section(2, "CS-B", 40, "CS");
        ScheduleEntry candidate = new ScheduleEntry(0, teacher1, room2, course1, section2,
                new TimeSlot("Monday", LocalTime.of(10, 0), LocalTime.of(11, 30)), "Fall 2026");

        List<ConflictViolation> violations = detector.detectConflicts(candidate, List.of(existing));

        assertFalse(violations.isEmpty(), "Should detect teacher double-booking overlap");
        assertEquals(ConflictType.TEACHER_DOUBLE_BOOKED, violations.get(0).getConflictType());
    }

    @Test
    public void testDifferentTimeNoConflict() {
        // Existing entry: Monday 09:00 - 10:30 with teacher1
        ScheduleEntry existing = new ScheduleEntry(10, teacher1, room1, course1, section1,
                new TimeSlot("Monday", LocalTime.of(9, 0), LocalTime.of(10, 30)), "Fall 2026");

        // Candidate entry: Monday 11:00 - 12:30 (No overlap, 30 min buffer)
        ScheduleEntry candidate = new ScheduleEntry(0, teacher1, room1, course1, section1,
                new TimeSlot("Monday", LocalTime.of(11, 0), LocalTime.of(12, 30)), "Fall 2026");

        List<ConflictViolation> violations = detector.detectConflicts(candidate, List.of(existing));
        assertTrue(violations.isEmpty(), "Consecutive slots without overlap should pass with 0 conflicts");
    }

    @Test
    public void testRoomCapacityExceeded() {
        Classroom smallRoom = new Classroom(3, "SEM-301", "Babbage Hall", 25, "Seminar Room");
        Section largeSection = new Section(3, "CS-Mega", 60, "CS");

        ScheduleEntry candidate = new ScheduleEntry(0, teacher2, smallRoom, course1, largeSection,
                new TimeSlot("Wednesday", LocalTime.of(9, 0), LocalTime.of(10, 30)), "Fall 2026");

        List<ConflictViolation> violations = detector.detectConflicts(candidate, Collections.emptyList());
        assertFalse(violations.isEmpty());
        assertEquals(ConflictType.CAPACITY_EXCEEDED, violations.get(0).getConflictType());
    }
}
