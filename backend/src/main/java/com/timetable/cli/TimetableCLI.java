package com.timetable.cli;

import com.timetable.config.DBConnection;
import com.timetable.dao.*;
import com.timetable.model.*;
import com.timetable.service.detector.ConflictDetector;

import java.sql.Connection;
import java.time.LocalTime;
import java.util.*;

/**
 * Terminal-based interactive CLI application for college evaluation and viva presentation.
 * Demonstrates Core Java OOP concepts, Interval Overlap Math, and JDBC connectivity in the terminal.
 */
public class TimetableCLI {

    private static final Scanner scanner = new Scanner(System.in);
    private static final ConflictDetector detector = new ConflictDetector();

    private static TeacherDAO teacherDAO;
    private static ClassroomDAO classroomDAO;
    private static CourseDAO courseDAO;
    private static SectionDAO sectionDAO;
    private static ScheduleDAO scheduleDAO;

    private static boolean dbAvailable = false;
    private static List<Teacher> inMemoryTeachers = new ArrayList<>();
    private static List<Classroom> inMemoryClassrooms = new ArrayList<>();
    private static List<Course> inMemoryCourses = new ArrayList<>();
    private static List<Section> inMemorySections = new ArrayList<>();
    private static List<ScheduleEntry> inMemorySchedules = new ArrayList<>();

    public static void main(String[] args) {
        initData();

        while (true) {
            printHeader();
            System.out.println("  [1] View Master Weekly Timetable");
            System.out.println("  [2] View Registered Faculty & Classrooms");
            System.out.println("  [3] Schedule a New Lecture (Live Conflict Check)");
            System.out.println("  [4] Run Comprehensive Institution Conflict Audit");
            System.out.println("  [5] Interval-Overlap Math Demonstration (Viva Simulator)");
            System.out.println("  [6] Inject Demo Clashing Slot (To demonstrate conflict alert)");
            System.out.println("  [0] Exit Application");
            System.out.println("------------------------------------------------------------");
            System.out.print("  Select an option [0-6]: ");

            String choice = scanner.nextLine().trim();

            switch (choice) {
                case "1" -> viewTimetable();
                case "2" -> viewResources();
                case "3" -> scheduleNewLecture();
                case "4" -> runConflictAudit();
                case "5" -> demonstrateIntervalMath();
                case "6" -> injectDemoConflict();
                case "0" -> {
                    System.out.println("\nExiting ChronoScheduler. Best of luck for your viva!\n");
                    System.exit(0);
                }
                default -> System.out.println("\n[!] Invalid selection. Please enter a number between 0 and 6.");
            }

            System.out.println("\nPress [ENTER] to return to the main menu...");
            scanner.nextLine();
        }
    }

    private static void initData() {
        System.out.println("============================================================");
        System.out.println("   CHRONOSCHEDULER - AUTOMATED CONFLICT DETECTOR (CLI)     ");
        System.out.println("============================================================");
        System.out.print("[*] Connecting to MySQL Database (localhost:3306/timetable_db)... ");

        try (Connection conn = DBConnection.getConnection()) {
            dbAvailable = true;
            teacherDAO = new TeacherDAO();
            classroomDAO = new ClassroomDAO();
            courseDAO = new CourseDAO();
            sectionDAO = new SectionDAO();
            scheduleDAO = new ScheduleDAO();
            System.out.println("[CONNECTED via JDBC]");
        } catch (Exception e) {
            dbAvailable = false;
            System.out.println("[OFFLINE]");
            System.out.println("    Note: MySQL is not running or password differs. Running in Standalone InMemory Mode.");
            setupInMemorySeed();
        }
    }

    private static void setupInMemorySeed() {
        inMemoryTeachers = new ArrayList<>(List.of(
                new Teacher(1, "EMP101", "Dr. Alan Turing", "alan@univ.edu", "Computer Science"),
                new Teacher(2, "EMP102", "Dr. Grace Hopper", "grace@univ.edu", "Computer Science"),
                new Teacher(3, "EMP103", "Prof. Claude Shannon", "shannon@univ.edu", "Information Theory"),
                new Teacher(4, "EMP104", "Dr. Ada Lovelace", "ada@univ.edu", "Mathematics")
        ));

        inMemoryClassrooms = new ArrayList<>(List.of(
                new Classroom(1, "LH-101", "Turing Academic Block", 60, "Lecture Hall"),
                new Classroom(2, "LH-102", "Turing Academic Block", 45, "Lecture Hall"),
                new Classroom(3, "LAB-201", "Computing Hub", 35, "Computer Lab"),
                new Classroom(4, "SEM-301", "Babbage Hall", 25, "Seminar Room")
        ));

        inMemoryCourses = new ArrayList<>(List.of(
                new Course(1, "CS101", "Algorithms & Complexity", 4, "Computer Science"),
                new Course(2, "CS202", "Database Management Systems", 4, "Computer Science"),
                new Course(3, "MATH105", "Discrete Mathematics", 3, "Mathematics"),
                new Course(4, "IT301", "Information Theory", 3, "Information Theory")
        ));

        inMemorySections = new ArrayList<>(List.of(
                new Section(1, "CS-A", 50, "Computer Science"),
                new Section(2, "CS-B", 40, "Computer Science"),
                new Section(3, "IT-A", 30, "Information Theory")
        ));

        inMemorySchedules = new ArrayList<>(List.of(
                new ScheduleEntry(1, inMemoryTeachers.get(0), inMemoryClassrooms.get(0), inMemoryCourses.get(0),
                        inMemorySections.get(0), new TimeSlot("Monday", LocalTime.of(9, 0), LocalTime.of(10, 30)), "Fall 2026"),
                new ScheduleEntry(2, inMemoryTeachers.get(1), inMemoryClassrooms.get(2), inMemoryCourses.get(1),
                        inMemorySections.get(1), new TimeSlot("Monday", LocalTime.of(11, 0), LocalTime.of(12, 30)), "Fall 2026"),
                new ScheduleEntry(3, inMemoryTeachers.get(2), inMemoryClassrooms.get(1), inMemoryCourses.get(3),
                        inMemorySections.get(2), new TimeSlot("Tuesday", LocalTime.of(10, 0), LocalTime.of(11, 30)), "Fall 2026")
        ));
    }

    private static List<ScheduleEntry> getSchedules() {
        if (dbAvailable) {
            try { return scheduleDAO.findAll(); } catch (Exception ignored) {}
        }
        return inMemorySchedules;
    }

    private static List<Teacher> getTeachers() {
        if (dbAvailable) {
            try { return teacherDAO.findAll(); } catch (Exception ignored) {}
        }
        return inMemoryTeachers;
    }

    private static List<Classroom> getClassrooms() {
        if (dbAvailable) {
            try { return classroomDAO.findAll(); } catch (Exception ignored) {}
        }
        return inMemoryClassrooms;
    }

    private static List<Course> getCourses() {
        if (dbAvailable) {
            try { return courseDAO.findAll(); } catch (Exception ignored) {}
        }
        return inMemoryCourses;
    }

    private static List<Section> getSections() {
        if (dbAvailable) {
            try { return sectionDAO.findAll(); } catch (Exception ignored) {}
        }
        return inMemorySections;
    }

    private static void printHeader() {
        System.out.println("\n============================================================");
        System.out.println("  AUTOMATED TIMETABLE CONFLICT DETECTOR — TERMINAL DASHBOARD");
        System.out.println("  Storage Mode: " + (dbAvailable ? "[MySQL Workbench Live Database]" : "[Standalone In-Memory Mock]"));
        System.out.println("============================================================");
    }

    private static void viewTimetable() {
        List<ScheduleEntry> list = getSchedules();
        System.out.println("\n----------------- MASTER WEEKLY TIMETABLE ------------------");
        if (list.isEmpty()) {
            System.out.println("No schedule entries found.");
            return;
        }

        System.out.printf("%-4s | %-10s | %-15s | %-10s | %-18s | %-10s | %-8s\n",
                "ID", "Day", "Time Slot", "Course", "Instructor", "Room", "Section");
        System.out.println("---------------------------------------------------------------------------------------------");

        for (ScheduleEntry s : list) {
            System.out.printf("%-4d | %-10s | %s-%s | %-10s | %-18s | %-10s | %-8s\n",
                    s.getId(),
                    s.getTimeSlot().getDayOfWeek(),
                    s.getTimeSlot().getStartTime(),
                    s.getTimeSlot().getEndTime(),
                    s.getCourse() != null ? s.getCourse().getCourseCode() : "N/A",
                    s.getTeacher() != null ? s.getTeacher().getFullName() : "N/A",
                    s.getClassroom() != null ? s.getClassroom().getRoomNumber() : "N/A",
                    s.getSection() != null ? s.getSection().getSectionName() : "N/A"
            );
        }
    }

    private static void viewResources() {
        System.out.println("\n------------------- FACULTY DIRECTORY ----------------------");
        for (Teacher t : getTeachers()) {
            System.out.printf("[%d] %-20s (Code: %-8s | Dept: %s)\n", t.getId(), t.getFullName(), t.getEmployeeCode(), t.getDepartment());
        }

        System.out.println("\n------------------ CLASSROOMS & VENUES ---------------------");
        for (Classroom c : getClassrooms()) {
            System.out.printf("[%d] Room: %-10s (Capacity: %2d seats | %s | %s)\n",
                    c.getId(), c.getRoomNumber(), c.getCapacity(), c.getRoomType(), c.getBuilding());
        }

        System.out.println("\n----------------- ACADEMIC COURSES & SECTIONS -------------");
        for (Course co : getCourses()) {
            System.out.printf("[%d] Course: %-8s | Title: %-25s | Credits: %d\n", co.getId(), co.getCourseCode(), co.getTitle(), co.getCredits());
        }
        for (Section sec : getSections()) {
            System.out.printf("[%d] Section: %-8s | Headcount: %2d students\n", sec.getId(), sec.getSectionName(), sec.getStudentCount());
        }
    }

    private static void scheduleNewLecture() {
        System.out.println("\n================= CREATE NEW SCHEDULE ENTRY ================");
        List<Teacher> teachers = getTeachers();
        List<Classroom> classrooms = getClassrooms();
        List<Course> courses = getCourses();
        List<Section> sections = getSections();

        System.out.println("Available Days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday");
        System.out.print("Enter Day: ");
        String day = scanner.nextLine().trim();

        System.out.print("Enter Start Time (HH:MM e.g. 09:30): ");
        LocalTime start = LocalTime.parse(scanner.nextLine().trim());

        System.out.print("Enter End Time (HH:MM e.g. 11:00): ");
        LocalTime end = LocalTime.parse(scanner.nextLine().trim());

        if (!start.isBefore(end)) {
            System.out.println("[ERROR]: Start time must precede end time!");
            return;
        }

        System.out.println("\nAvailable Instructors:");
        for (int i = 0; i < teachers.size(); i++) {
            System.out.printf("  [%d] %s\n", i + 1, teachers.get(i).getFullName());
        }
        System.out.print("Choose Instructor [1-" + teachers.size() + "]: ");
        Teacher teacher = teachers.get(Integer.parseInt(scanner.nextLine().trim()) - 1);

        System.out.println("\nAvailable Classrooms:");
        for (int i = 0; i < classrooms.size(); i++) {
            System.out.printf("  [%d] %s (Cap: %d)\n", i + 1, classrooms.get(i).getRoomNumber(), classrooms.get(i).getCapacity());
        }
        System.out.print("Choose Classroom [1-" + classrooms.size() + "]: ");
        Classroom room = classrooms.get(Integer.parseInt(scanner.nextLine().trim()) - 1);

        System.out.println("\nAvailable Courses:");
        for (int i = 0; i < courses.size(); i++) {
            System.out.printf("  [%d] %s - %s\n", i + 1, courses.get(i).getCourseCode(), courses.get(i).getTitle());
        }
        System.out.print("Choose Course [1-" + courses.size() + "]: ");
        Course course = courses.get(Integer.parseInt(scanner.nextLine().trim()) - 1);

        System.out.println("\nAvailable Sections:");
        for (int i = 0; i < sections.size(); i++) {
            System.out.printf("  [%d] %s (%d students)\n", i + 1, sections.get(i).getSectionName(), sections.get(i).getStudentCount());
        }
        System.out.print("Choose Section [1-" + sections.size() + "]: ");
        Section section = sections.get(Integer.parseInt(scanner.nextLine().trim()) - 1);

        ScheduleEntry candidate = new ScheduleEntry(0, teacher, room, course, section, new TimeSlot(day, start, end), "Fall 2026");

        // RUN INTERVAL CONFLICT ENGINE!
        System.out.println("\n[*] Running Interval-Overlap Conflict Detection Engine...");
        List<ScheduleEntry> currentSchedules = getSchedules();
        List<ConflictViolation> violations = detector.detectConflicts(candidate, currentSchedules);

        if (!violations.isEmpty()) {
            System.out.println("\n[X] ----------------- CONFLICT DETECTED! ----------------- [X]");
            System.out.println("The proposed schedule CANNOT be saved due to the following violations:");
            for (ConflictViolation v : violations) {
                System.out.println("  • " + v.getConflictType().getTitle() + ": " + v.getDescription());
            }
            System.out.println("[X] Action Blocked: Timetable finalization preserves zero-clash integrity.\n");
        } else {
            if (dbAvailable) {
                try {
                    scheduleDAO.insert(candidate);
                    System.out.println("\n[✓] SUCCESS: Verified with 0 conflicts and committed to MySQL database!");
                } catch (Exception e) {
                    System.out.println("[ERROR Saving to DB]: " + e.getMessage());
                }
            } else {
                candidate.setId(inMemorySchedules.size() + 1);
                inMemorySchedules.add(candidate);
                System.out.println("\n[✓] SUCCESS: Verified with 0 conflicts and added to in-memory schedule!");
            }
        }
    }

    private static void runConflictAudit() {
        System.out.println("\n================= FULL INSTITUTION CONFLICT AUDIT ===========");
        List<ScheduleEntry> current = getSchedules();
        List<ConflictViolation> violations = detector.auditEntireTimetable(current);

        System.out.printf("Audited %d schedule records across all departments.\n", current.size());

        if (violations.isEmpty()) {
            System.out.println("\n[✓] ALL CLEAR: 0 Conflicts detected in the current timetable!");
            System.out.println("    All teachers, classrooms, student sections, and capacities are valid.");
        } else {
            System.out.printf("\n[!] CAUTION: Found %d active conflict(s):\n", violations.size());
            int idx = 1;
            for (ConflictViolation v : violations) {
                System.out.printf("  [%d] %s: %s\n", idx++, v.getConflictType().getTitle(), v.getDescription());
            }
        }
    }

    private static void demonstrateIntervalMath() {
        System.out.println("\n============= INTERVAL-OVERLAP MATH (VIVA DEMO) =============");
        System.out.println("Examiner Question: 'How do you check if two class slots overlap?'");
        System.out.println("Answer: Two intervals [S1, E1) and [S2, E2) intersect on the same day if:");
        System.out.println("           Max(Start1, Start2) < Min(End1, End2)");
        System.out.println("------------------------------------------------------------");

        System.out.println("Let's simulate with 2 intervals:");
        System.out.print("Interval 1 Start (e.g. 09:00): ");
        LocalTime s1 = LocalTime.parse(scanner.nextLine().trim());
        System.out.print("Interval 1 End   (e.g. 10:30): ");
        LocalTime e1 = LocalTime.parse(scanner.nextLine().trim());

        System.out.print("Interval 2 Start (e.g. 10:00): ");
        LocalTime s2 = LocalTime.parse(scanner.nextLine().trim());
        System.out.print("Interval 2 End   (e.g. 11:30): ");
        LocalTime e2 = LocalTime.parse(scanner.nextLine().trim());

        TimeSlot slot1 = new TimeSlot("Monday", s1, e1);
        TimeSlot slot2 = new TimeSlot("Monday", s2, e2);

        LocalTime maxStart = s1.isAfter(s2) ? s1 : s2;
        LocalTime minEnd = e1.isBefore(e2) ? e1 : e2;
        boolean overlap = slot1.overlapsWith(slot2);

        System.out.println("\nStep-by-step Evaluation:");
        System.out.println("  • Max(Start1, Start2) = " + maxStart);
        System.out.println("  • Min(End1, End2)     = " + minEnd);
        System.out.println("  • Is " + maxStart + " < " + minEnd + "? -> " + (maxStart.isBefore(minEnd) ? "YES" : "NO"));
        System.out.println("  • Overlap Result: " + (overlap ? ">> OVERLAP DETECTED (CLASH!) <<" : ">> NO OVERLAP (SAFE) <<"));
    }

    private static void injectDemoConflict() {
        System.out.println("\n[*] Injecting an intentional double-booking for viva demonstration...");
        List<Teacher> teachers = getTeachers();
        List<Classroom> classrooms = getClassrooms();
        List<Course> courses = getCourses();
        List<Section> sections = getSections();

        // Intentionally create a clashing entry overlapping with Dr. Alan Turing on Monday 09:30 - 11:00
        ScheduleEntry clash = new ScheduleEntry(
                999,
                teachers.get(0), // Alan Turing again!
                classrooms.get(1), // Different room LH-102
                courses.get(1),
                sections.get(1),
                new TimeSlot("Monday", LocalTime.of(9, 30), LocalTime.of(11, 0)),
                "Fall 2026"
        );

        inMemorySchedules.add(clash);
        System.out.println("[!] Injected: Dr. Alan Turing booked on Monday 09:30 - 11:00 for CS202 in LH-102.");
        System.out.println("    (This overlaps with his existing 09:00 - 10:30 lecture in LH-101!)");
        System.out.println("    Now select Option [4] in the menu to see the Conflict Detector catch it!");
    }
}
