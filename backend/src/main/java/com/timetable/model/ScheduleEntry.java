package com.timetable.model;

/**
 * Encapsulates a complete scheduled lecture/lab slot.
 * Demonstrates Object Composition (holding Teacher, Classroom, Course, Section, TimeSlot).
 */
public class ScheduleEntry extends BaseEntity {
    private Teacher teacher;
    private Classroom classroom;
    private Course course;
    private Section section;
    private TimeSlot timeSlot;
    private String academicTerm;

    public ScheduleEntry() {}

    public ScheduleEntry(int id, Teacher teacher, Classroom classroom, Course course, Section section, TimeSlot timeSlot, String academicTerm) {
        super(id);
        this.teacher = teacher;
        this.classroom = classroom;
        this.course = course;
        this.section = section;
        this.timeSlot = timeSlot;
        this.academicTerm = academicTerm;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public Classroom getClassroom() {
        return classroom;
    }

    public void setClassroom(Classroom classroom) {
        this.classroom = classroom;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Section getSection() {
        return section;
    }

    public void setSection(Section section) {
        this.section = section;
    }

    public TimeSlot getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(TimeSlot timeSlot) {
        this.timeSlot = timeSlot;
    }

    public String getAcademicTerm() {
        return academicTerm;
    }

    public void setAcademicTerm(String academicTerm) {
        this.academicTerm = academicTerm;
    }
}
