package com.timetable.model;

public class Teacher extends BaseEntity {
    private String employeeCode;
    private String fullName;
    private String email;
    private String department;

    public Teacher() {}

    public Teacher(int id, String employeeCode, String fullName, String email, String department) {
        super(id);
        this.employeeCode = employeeCode;
        this.fullName = fullName;
        this.email = email;
        this.department = department;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    @Override
    public String toString() {
        return fullName + " (" + employeeCode + ")";
    }
}
