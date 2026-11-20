package com.timetable.dao;

import com.timetable.config.DBConnection;
import com.timetable.model.Teacher;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class TeacherDAO {

    public List<Teacher> findAll() throws SQLException {
        List<Teacher> list = new ArrayList<>();
        String sql = "SELECT id, employee_code, full_name, email, department FROM teachers ORDER BY full_name ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new Teacher(
                        rs.getInt("id"),
                        rs.getString("employee_code"),
                        rs.getString("full_name"),
                        rs.getString("email"),
                        rs.getString("department")
                ));
            }
        }
        return list;
    }

    public Optional<Teacher> findById(int id) throws SQLException {
        String sql = "SELECT id, employee_code, full_name, email, department FROM teachers WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(new Teacher(
                            rs.getInt("id"),
                            rs.getString("employee_code"),
                            rs.getString("full_name"),
                            rs.getString("email"),
                            rs.getString("department")
                    ));
                }
            }
        }
        return Optional.empty();
    }

    public boolean insert(Teacher teacher) throws SQLException {
        String sql = "INSERT INTO teachers (employee_code, full_name, email, department) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, teacher.getEmployeeCode());
            ps.setString(2, teacher.getFullName());
            ps.setString(3, teacher.getEmail());
            ps.setString(4, teacher.getDepartment());
            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) teacher.setId(keys.getInt(1));
                }
                return true;
            }
        }
        return false;
    }
}
