package com.timetable.dao;

import com.timetable.config.DBConnection;
import com.timetable.model.Section;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class SectionDAO {

    public List<Section> findAll() throws SQLException {
        List<Section> list = new ArrayList<>();
        String sql = "SELECT id, section_name, student_count, department FROM sections ORDER BY section_name ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new Section(
                        rs.getInt("id"),
                        rs.getString("section_name"),
                        rs.getInt("student_count"),
                        rs.getString("department")
                ));
            }
        }
        return list;
    }

    public Optional<Section> findById(int id) throws SQLException {
        String sql = "SELECT id, section_name, student_count, department FROM sections WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(new Section(
                            rs.getInt("id"),
                            rs.getString("section_name"),
                            rs.getInt("student_count"),
                            rs.getString("department")
                    ));
                }
            }
        }
        return Optional.empty();
    }

    public boolean insert(Section section) throws SQLException {
        String sql = "INSERT INTO sections (section_name, student_count, department) VALUES (?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, section.getSectionName());
            ps.setInt(2, section.getStudentCount());
            ps.setString(3, section.getDepartment());
            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) section.setId(keys.getInt(1));
                }
                return true;
            }
        }
        return false;
    }
}
