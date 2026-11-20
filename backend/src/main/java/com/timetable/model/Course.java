package com.timetable.model;

public class Course extends BaseEntity {
    private String courseCode;
    private String title;
    private int credits;
    private String department;

    public Course() {}

    public Course(int id, String courseCode, String title, int credits, String department) {
        super(id);
        this.courseCode = courseCode;
        this.title = title;
        this.credits = credits;
        this.department = department;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getCredits() {
        return credits;
    }

    public void setCredits(int credits) {
        this.credits = credits;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    @Override
    public String toString() {
        return courseCode + " - " + title;
    }
}
