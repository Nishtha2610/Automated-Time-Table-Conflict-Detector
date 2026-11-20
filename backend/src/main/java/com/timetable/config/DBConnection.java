package com.timetable.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Standard JDBC Connection Factory using MySQL Connector/J.
 * Directly integrates with MySQL Workbench database (timetable_db).
 */
public class DBConnection {
    // Database connection parameters
    private static final String URL = "jdbc:mysql://localhost:3306/timetable_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "root"; // Update this if your MySQL Workbench password differs (e.g. "admin", "1234", or "")

    static {
        try {
            // Explicitly load the MySQL JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL JDBC Driver not found in classpath: " + e.getMessage());
        }
    }

    private DBConnection() {}

    /**
     * Establishes and returns an active SQL Connection.
     * @return java.sql.Connection
     * @throws SQLException if connection fails
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
