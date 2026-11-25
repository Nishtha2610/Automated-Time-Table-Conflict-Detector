package com.timetable.cli;

import com.timetable.model.*;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * Standard College Console Runner for Timetable Conflict Detection.
 * Demonstrates:
 * 1. Object-Oriented Programming (Classes, Objects, Constructors, Encapsulation)
 * 2. Java Collections (ArrayList)
 * 3. Java 8 Time API (LocalTime) & Interval Overlap Logic
 * 4. User Interaction via java.util.Scanner
 */
public class TimetableCLI {

    private static final Scanner scanner = new Scanner(System.in);
    private static final List<ScheduleEntry> scheduleList = new ArrayList<>();

    public static void main(String[] args) {
        // Initialize default sample timetable entries
        initSampleData();

        boolean running = true;
        while (running) {
            System.out.println("\n========================================================");
            System.out.println("   ACADEMIC TIMETABLE CONFLICT DETECTOR (JAVA CONSOLE)  ");
            System.out.println("========================================================");
            System.out.println("  1. View Master Weekly Timetable");
            System.out.println("  2. Schedule a New Class (With Overlap Interception)");
            System.out.println("  3. Test Interval-Overlap Math (Viva Examiner Demo)");
            System.out.println("  4. Exit Application");
            System.out.println("--------------------------------------------------------");
            System.out.print("  Enter your choice [1-4]: ");

            String input = scanner.nextLine().trim();

            switch (input) {
                case "1":
                    viewTimetable();
                    break;
                case "2":
                    addNewClass();
                    break;
                case "3":
                    testIntervalMath();
                    break;
                case "4":
                    System.out.println("\nExiting program. Thank you!");
                    running = false;
                    break;
                default:
                    System.out.println("\n[!] Invalid option. Please enter 1, 2, 3, or 4.");
            }
        }
    }

    /**
     * Seeds initial valid timetable entries so the table is never blank.
     */
    private static void initSampleData() {
        Teacher t1 = new Teacher(1, "EMP101", "Dr. Alan Turing", "alan@chitkara.edu", "Computer Science");
        Teacher t2 = new Teacher(2, "EMP102", "Dr. Grace Hopper", "grace@chitkara.edu", "Computer Science");
        Teacher t3 = new Teacher(3, "EMP103", "Prof. Claude Shannon", "shannon@chitkara.edu", "IT");

        Classroom c1 = new Classroom(1, "LH-101", "Turing Block", 60, "Lecture Hall");
        Classroom c2 = new Classroom(2, "LH-102", "Turing Block", 50, "Lecture Hall");
        Classroom c3 = new Classroom(3, "LAB-201", "Computing Hub", 35, "Computer Lab");

        Course crs1 = new Course(1, "CS101", "Data Structures & Algorithms", 4, "Computer Science");
        Course crs2 = new Course(2, "CS202", "Programming in Java", 4, "Computer Science");
        Course crs3 = new Course(3, "IT301", "Database Systems", 3, "IT");

        Section s1 = new Section(1, "CS-A", 45, "Computer Science");
        Section s2 = new Section(2, "CS-B", 40, "Computer Science");

        scheduleList.add(new ScheduleEntry(1, t1, c1, crs1, s1,
                new TimeSlot("Monday", LocalTime.of(9, 0), LocalTime.of(10, 30)), "Fall 2026"));

        scheduleList.add(new ScheduleEntry(2, t2, c3, crs2, s1,
                new TimeSlot("Monday", LocalTime.of(10, 30), LocalTime.of(12, 0)), "Fall 2026"));

        scheduleList.add(new ScheduleEntry(3, t3, c2, crs3, s2,
                new TimeSlot("Tuesday", LocalTime.of(9, 0), LocalTime.of(10, 30)), "Fall 2026"));
    }

    /**
     * Displays all scheduled classes in a clean tabular view.
     */
    private static void viewTimetable() {
        System.out.println("\n------------------------- MASTER WEEKLY TIMETABLE -------------------------");
        System.out.printf("%-4s | %-10s | %-15s | %-8s | %-20s | %-8s | %-6s\n",
                "ID", "Day", "Time Slot", "Course", "Instructor", "Room", "Section");
        System.out.println("---------------------------------------------------------------------------");

        for (ScheduleEntry s : scheduleList) {
            System.out.printf("%-4d | %-10s | %s-%s | %-8s | %-20s | %-8s | %-6s\n",
                    s.getId(),
                    s.getTimeSlot().getDayOfWeek(),
                    s.getTimeSlot().getStartTime(),
                    s.getTimeSlot().getEndTime(),
                    s.getCourse().getCourseCode(),
                    s.getTeacher().getFullName(),
                    s.getClassroom().getRoomNumber(),
                    s.getSection().getSectionName());
        }
        System.out.println("---------------------------------------------------------------------------");
        System.out.println("Total Scheduled Sessions: " + scheduleList.size() + " [Conflict-Free]");
    }

    /**
     * Interactively inputs a class and checks for resource collisions.
     */
    private static void addNewClass() {
        System.out.println("\n--- SCHEDULE A NEW CLASS (WITH CONFLICT CHECK) ---");
        try {
            System.out.print("Enter Day of Week (e.g. Monday, Tuesday): ");
            String day = scanner.nextLine().trim();

            System.out.print("Enter Start Time (HH:mm, e.g. 09:00): ");
            LocalTime start = LocalTime.parse(scanner.nextLine().trim());

            System.out.print("Enter End Time   (HH:mm, e.g. 10:30): ");
            LocalTime end = LocalTime.parse(scanner.nextLine().trim());

            if (!start.isBefore(end)) {
                System.out.println("\n[ERROR]: Start time must be before End time!");
                return;
            }

            TimeSlot newSlot = new TimeSlot(day, start, end);

            System.out.print("Enter Instructor Name (e.g. Dr. Alan Turing): ");
            String teacherName = scanner.nextLine().trim();

            System.out.print("Enter Room Number     (e.g. LH-101, LAB-201): ");
            String room = scanner.nextLine().trim();

            System.out.print("Enter Course Code     (e.g. CS101, CS202): ");
            String course = scanner.nextLine().trim();

            System.out.print("Enter Section Name    (e.g. CS-A, CS-B): ");
            String section = scanner.nextLine().trim();

            // CONFLICT DETECTION LOOP
            // Compares the new request against all existing scheduled slots
            for (ScheduleEntry existing : scheduleList) {
                if (newSlot.overlapsWith(existing.getTimeSlot())) {

                    // 1. Faculty Double-Booking Check
                    if (existing.getTeacher().getFullName().equalsIgnoreCase(teacherName)) {
                        System.out.println("\n========================================================");
                        System.out.println("  [!] CONFLICT INTERCEPTED: FACULTY DOUBLE-BOOKING");
                        System.out.println("  Reason: " + teacherName + " is already teaching another class");
                        System.out.println("  at " + existing.getTimeSlot().getStartTime() + " - " + existing.getTimeSlot().getEndTime() + " in Room " + existing.getClassroom().getRoomNumber());
                        System.out.println("  Action: Slot rejected to prevent schedule collision.");
                        System.out.println("========================================================");
                        return;
                    }

                    // 2. Room Collision Check
                    if (existing.getClassroom().getRoomNumber().equalsIgnoreCase(room)) {
                        System.out.println("\n========================================================");
                        System.out.println("  [!] CONFLICT INTERCEPTED: CLASSROOM COLLISION");
                        System.out.println("  Reason: Room " + room + " is already booked for " + existing.getCourse().getCourseCode());
                        System.out.println("  at " + existing.getTimeSlot().getStartTime() + " - " + existing.getTimeSlot().getEndTime());
                        System.out.println("  Action: Slot rejected to prevent classroom locking.");
                        System.out.println("========================================================");
                        return;
                    }

                    // 3. Student Cohort Overlap Check
                    if (existing.getSection().getSectionName().equalsIgnoreCase(section)) {
                        System.out.println("\n========================================================");
                        System.out.println("  [!] CONFLICT INTERCEPTED: SECTION COHORT CLASH");
                        System.out.println("  Reason: Section " + section + " is already scheduled for " + existing.getCourse().getCourseCode());
                        System.out.println("  at " + existing.getTimeSlot().getStartTime() + " - " + existing.getTimeSlot().getEndTime());
                        System.out.println("  Action: Slot rejected to prevent student clash.");
                        System.out.println("========================================================");
                        return;
                    }
                }
            }

            // No conflicts found -> Add to list
            int nextId = scheduleList.size() + 1;
            Teacher newT = new Teacher(nextId, "EMP" + nextId, teacherName, "faculty@chitkara.edu", "CSE");
            Classroom newC = new Classroom(nextId, room, "Main Academic Block", 50, "Hall");
            Course newCrs = new Course(nextId, course, course + " Subject", 4, "CSE");
            Section newSec = new Section(nextId, section, 40, "CSE");

            scheduleList.add(new ScheduleEntry(nextId, newT, newC, newCrs, newSec, newSlot, "Fall 2026"));

            System.out.println("\n[SUCCESS]: Class scheduled successfully! Zero conflicts detected.");

        } catch (Exception e) {
            System.out.println("\n[!] Input Error: Please enter valid times in HH:mm format (e.g. 09:00). Details: " + e.getMessage());
        }
    }

    /**
     * Viva demonstration of the interval overlap formula:
     * Overlap condition: Max(Start1, Start2) < Min(End1, End2)
     */
    private static void testIntervalMath() {
        System.out.println("\n--- INTERVAL-OVERLAP MATHEMATICAL FORMULA DEMO ---");
        System.out.println("Formula: Two time intervals [S1, E1) and [S2, E2) intersect if:");
        System.out.println("         Max(Start1, Start2) < Min(End1, End2)");
        System.out.println("--------------------------------------------------");

        try {
            System.out.print("Enter Slot 1 Start (e.g. 09:00): ");
            LocalTime s1 = LocalTime.parse(scanner.nextLine().trim());
            System.out.print("Enter Slot 1 End   (e.g. 10:30): ");
            LocalTime e1 = LocalTime.parse(scanner.nextLine().trim());

            System.out.print("Enter Slot 2 Start (e.g. 10:00): ");
            LocalTime s2 = LocalTime.parse(scanner.nextLine().trim());
            System.out.print("Enter Slot 2 End   (e.g. 11:30): ");
            LocalTime e2 = LocalTime.parse(scanner.nextLine().trim());

            TimeSlot slot1 = new TimeSlot("Monday", s1, e1);
            TimeSlot slot2 = new TimeSlot("Monday", s2, e2);

            boolean overlaps = slot1.overlapsWith(slot2);

            LocalTime maxStart = s1.isAfter(s2) ? s1 : s2;
            LocalTime minEnd = e1.isBefore(e2) ? e1 : e2;

            System.out.println("\nEvaluation:");
            System.out.println("  Max(Start1, Start2) = " + maxStart);
            System.out.println("  Min(End1, End2)     = " + minEnd);
            System.out.println("  Condition Check: " + maxStart + " < " + minEnd + " => " + overlaps);

            if (overlaps) {
                System.out.println("  --> [RESULT: OVERLAP / CONFLICT DETECTED]");
                System.out.println("      Intersection duration: " + maxStart + " to " + minEnd);
            } else {
                System.out.println("  --> [RESULT: NO OVERLAP / CLEAN]");
            }

        } catch (Exception e) {
            System.out.println("\n[!] Invalid time format. Use HH:mm (e.g. 09:00).");
        }
    }
}
