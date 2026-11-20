package com.timetable.model;

public class Section extends BaseEntity {
    private String sectionName;
    private int studentCount;
    private String department;

    public Section() {}

    public Section(int id, String sectionName, int studentCount, String department) {
        super(id);
        this.sectionName = sectionName;
        this.studentCount = studentCount;
        this.department = department;
    }

    public String getSectionName() {
        return sectionName;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
    }

    public int getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(int studentCount) {
        this.studentCount = studentCount;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    @Override
    public String toString() {
        return sectionName + " (" + studentCount + " students)";
    }
}
