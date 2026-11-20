package com.timetable.dao;

import com.timetable.config.DBConnection;
import com.timetable.model.*;

import java.sql.*;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class ScheduleDAO {

    private static final String BASE_SELECT =
            "SELECT s.id, s.day_of_week, s.start_time, s.end_time, s.academic_term, " +
            "t.id AS teacher_id, t.employee_code, t.full_name, t.email, t.department AS teacher_dept, " +
            "c.id AS room_id, c.room_number, c.building, c.capacity, c.room_type, " +
            "co.id AS course_id, co.course_code, co.title, co.credits, co.department AS course_dept, " +
            "sec.id AS section_id, sec.section_name, sec.student_count, sec.department AS sec_dept " +
            "FROM schedule_entries s " +
            "JOIN teachers t ON s.teacher_id = t.id " +
            "JOIN classrooms c ON s.classroom_id = c.id " +
            "JOIN courses co ON s.course_id = co.id " +
            "JOIN sections sec ON s.section_id = sec.id ";

    public List<ScheduleEntry> findAll() throws SQLException {
        List<ScheduleEntry> list = new ArrayList<>();
        String sql = BASE_SELECT + "ORDER BY FIELD(s.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'), s.start_time ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(mapResultSetToEntry(rs));
            }
        }
        return list;
    }

    public boolean insert(ScheduleEntry entry) throws SQLException {
        String sql = "INSERT INTO schedule_entries (teacher_id, classroom_id, course_id, section_id, day_of_week, start_time, end_time, academic_term) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setInt(1, entry.getTeacher().getId());
            ps.setInt(2, entry.getClassroom().getId());
            ps.setInt(3, entry.getCourse().getId());
            ps.setInt(4, entry.getSection().getId());
            ps.setString(5, entry.getTimeSlot().getDayOfWeek());
            ps.setTime(6, Time.valueOf(entry.getTimeSlot().getStartTime()));
            ps.setTime(7, Time.valueOf(entry.getTimeSlot().getEndTime()));
            ps.setString(8, entry.getAcademicTerm() != null ? entry.getAcademicTerm() : "Fall 2026");

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) entry.setId(keys.getInt(1));
                }
                return true;
            }
        }
        return false;
    }

    public boolean delete(int id) throws SQLException {
        String sql = "DELETE FROM schedule_entries WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private ScheduleEntry mapResultSetToEntry(ResultSet rs) throws SQLException {
        Teacher teacher = new Teacher(
                rs.getInt("teacher_id"),
                rs.getString("employee_code"),
                rs.getString("full_name"),
                rs.getString("email"),
                rs.getString("teacher_dept")
        );

        Classroom classroom = new Classroom(
                rs.getInt("room_id"),
                rs.getString("room_number"),
                rs.getString("building"),
                rs.getInt("capacity"),
                rs.getString("room_type")
        );

        Course course = new Course(
                rs.getInt("course_id"),
                rs.getString("course_code"),
                rs.getString("title"),
                rs.getInt("credits"),
                rs.getString("course_dept")
        );

        Section section = new Section(
                rs.getInt("section_id"),
                rs.getString("section_name"),
                rs.getInt("student_count"),
                rs.getString("sec_dept")
        );

        LocalTime start = rs.getTime("start_time").toLocalTime();
        LocalTime end = rs.getTime("end_time").toLocalTime();
        TimeSlot timeSlot = new TimeSlot(rs.getString("day_of_week"), start, end);

        ScheduleEntry entry = new ScheduleEntry(
                rs.getInt("id"),
                teacher,
                classroom,
                course,
                section,
                timeSlot,
                rs.getString("academic_term")
        );
        return entry;
    }
}
