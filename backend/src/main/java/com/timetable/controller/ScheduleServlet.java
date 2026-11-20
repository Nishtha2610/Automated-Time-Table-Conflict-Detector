package com.timetable.controller;

import com.google.gson.Gson;
import com.timetable.dao.ScheduleDAO;
import com.timetable.model.ScheduleEntry;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

/**
 * Classic Jakarta Servlet implementation demonstrating MVC Controller pattern.
 * Mapped to /schedule-servlet
 */
@WebServlet(name = "ScheduleServlet", urlPatterns = {"/schedule-servlet", "/api/v1/schedules"})
public class ScheduleServlet extends HttpServlet {
    private final ScheduleDAO scheduleDAO = new ScheduleDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try {
            List<ScheduleEntry> entries = scheduleDAO.findAll();
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson(entries));
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
