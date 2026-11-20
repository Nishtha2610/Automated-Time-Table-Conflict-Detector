package com.timetable.dao;

import com.timetable.config.DBConnection;
import com.timetable.model.Course;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class CourseDAO {

    public List<Course> findAll() throws SQLException {
        List<Course> list = new ArrayList<>();
        String sql = "SELECT id, course_code, title, credits, department FROM courses ORDER BY course_code ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new Course(
                        rs.getInt("id"),
                        rs.getString("course_code"),
                        rs.getString("title"),
                        rs.getInt("credits"),
                        rs.getString("department")
                ));
            }
        }
        return list;
    }

    public Optional<Course> findById(int id) throws SQLException {
        String sql = "SELECT id, course_code, title, credits, department FROM courses WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(new Course(
                            rs.getInt("id"),
                            rs.getString("course_code"),
                            rs.getString("title"),
                            rs.getInt("credits"),
                            rs.getString("department")
                    ));
                }
            }
        }
        return Optional.empty();
    }

    public boolean insert(Course course) throws SQLException {
        String sql = "INSERT INTO courses (course_code, title, credits, department) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, course.getCourseCode());
            ps.setString(2, course.getTitle());
            ps.setInt(3, course.getCredits());
            ps.setString(4, course.getDepartment());
            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) course.setId(keys.getInt(1));
                }
                return true;
            }
        }
        return false;
    }
}
