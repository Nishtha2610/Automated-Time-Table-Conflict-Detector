package com.timetable.dao;

import com.timetable.config.DBConnection;
import com.timetable.model.Classroom;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ClassroomDAO {

    public List<Classroom> findAll() throws SQLException {
        List<Classroom> list = new ArrayList<>();
        String sql = "SELECT id, room_number, building, capacity, room_type FROM classrooms ORDER BY room_number ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new Classroom(
                        rs.getInt("id"),
                        rs.getString("room_number"),
                        rs.getString("building"),
                        rs.getInt("capacity"),
                        rs.getString("room_type")
                ));
            }
        }
        return list;
    }

    public Optional<Classroom> findById(int id) throws SQLException {
        String sql = "SELECT id, room_number, building, capacity, room_type FROM classrooms WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(new Classroom(
                            rs.getInt("id"),
                            rs.getString("room_number"),
                            rs.getString("building"),
                            rs.getInt("capacity"),
                            rs.getString("room_type")
                    ));
                }
            }
        }
        return Optional.empty();
    }

    public boolean insert(Classroom room) throws SQLException {
        String sql = "INSERT INTO classrooms (room_number, building, capacity, room_type) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, room.getRoomNumber());
            ps.setString(2, room.getBuilding());
            ps.setInt(3, room.getCapacity());
            ps.setString(4, room.getRoomType());
            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) room.setId(keys.getInt(1));
                }
                return true;
            }
        }
        return false;
    }
}
