package com.timetable;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import com.timetable.dao.*;
import com.timetable.model.*;
import com.timetable.service.detector.ConflictDetector;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.LocalTime;
import java.util.*;

/**
 * Standalone Embedded Server for 1-Click Execution in VS Code.
 * Exposes RESTful API endpoints for the React Frontend on port 8080.
 */
public class MainApp {
    private static final int PORT = 8080;
    private static final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private static final ConflictDetector detector = new ConflictDetector();

    private static final TeacherDAO teacherDAO = new TeacherDAO();
    private static final ClassroomDAO classroomDAO = new ClassroomDAO();
    private static final CourseDAO courseDAO = new CourseDAO();
    private static final SectionDAO sectionDAO = new SectionDAO();
    private static final ScheduleDAO scheduleDAO = new ScheduleDAO();

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        // Register API endpoints
        server.createContext("/api/teachers", new TeachersHandler());
        server.createContext("/api/classrooms", new ClassroomsHandler());
        server.createContext("/api/courses", new CoursesHandler());
        server.createContext("/api/sections", new SectionsHandler());
        server.createContext("/api/schedules", new SchedulesHandler());
        server.createContext("/api/validate", new ValidateHandler());
        server.createContext("/api/audit", new AuditHandler());

        server.setExecutor(null); // default executor
        System.out.println("==============================================================");
        System.out.println("  Automated Timetable Conflict Detector — Backend Service");
        System.out.println("  Running on: http://localhost:" + PORT);
        System.out.println("  Connected to MySQL via JDBC & Interval Conflict Engine Ready");
        System.out.println("==============================================================");
        server.start();
    }

    private static void enableCors(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, Object data) throws IOException {
        enableCors(exchange);
        String json = gson.toJson(data);
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    // --- Handlers ---

    static class TeachersHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            enableCors(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            try {
                if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendJsonResponse(exchange, 200, teacherDAO.findAll());
                } else if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    Teacher teacher = gson.fromJson(new InputStreamReader(exchange.getRequestBody()), Teacher.class);
                    teacherDAO.insert(teacher);
                    sendJsonResponse(exchange, 201, teacher);
                }
            } catch (Exception e) {
                sendJsonResponse(exchange, 500, Map.of("error", e.getMessage()));
            }
        }
    }

    static class ClassroomsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            enableCors(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            try {
                if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendJsonResponse(exchange, 200, classroomDAO.findAll());
                } else if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    Classroom room = gson.fromJson(new InputStreamReader(exchange.getRequestBody()), Classroom.class);
                    classroomDAO.insert(room);
                    sendJsonResponse(exchange, 201, room);
                }
            } catch (Exception e) {
                sendJsonResponse(exchange, 500, Map.of("error", e.getMessage()));
            }
        }
    }

    static class CoursesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            enableCors(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            try {
                if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendJsonResponse(exchange, 200, courseDAO.findAll());
                } else if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    Course course = gson.fromJson(new InputStreamReader(exchange.getRequestBody()), Course.class);
                    courseDAO.insert(course);
                    sendJsonResponse(exchange, 201, course);
                }
            } catch (Exception e) {
                sendJsonResponse(exchange, 500, Map.of("error", e.getMessage()));
            }
        }
    }

    static class SectionsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            enableCors(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            try {
                if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendJsonResponse(exchange, 200, sectionDAO.findAll());
                } else if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    Section sec = gson.fromJson(new InputStreamReader(exchange.getRequestBody()), Section.class);
                    sectionDAO.insert(sec);
                    sendJsonResponse(exchange, 201, sec);
                }
            } catch (Exception e) {
                sendJsonResponse(exchange, 500, Map.of("error", e.getMessage()));
            }
        }
    }

    static class SchedulesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            enableCors(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            String method = exchange.getRequestMethod();
            try {
                if ("GET".equalsIgnoreCase(method)) {
                    List<ScheduleEntry> entries = scheduleDAO.findAll();
                    sendJsonResponse(exchange, 200, entries);
                } else if ("POST".equalsIgnoreCase(method)) {
                    // Read JSON payload
                    String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                    JsonObject obj = JsonParser.parseString(body).getAsJsonObject();

                    int teacherId = obj.get("teacherId").getAsInt();
                    int classroomId = obj.get("classroomId").getAsInt();
                    int courseId = obj.get("courseId").getAsInt();
                    int sectionId = obj.get("sectionId").getAsInt();
                    String day = obj.get("dayOfWeek").getAsString();
                    LocalTime start = LocalTime.parse(obj.get("startTime").getAsString());
                    LocalTime end = LocalTime.parse(obj.get("endTime").getAsString());

                    Teacher teacher = teacherDAO.findById(teacherId).orElseThrow();
                    Classroom classroom = classroomDAO.findById(classroomId).orElseThrow();
                    Course course = courseDAO.findById(courseId).orElseThrow();
                    Section section = sectionDAO.findById(sectionId).orElseThrow();

                    ScheduleEntry candidate = new ScheduleEntry(
                            0, teacher, classroom, course, section,
                            new TimeSlot(day, start, end), "Fall 2026"
                    );

                    // Run Interval Conflict Detection Engine before committing!
                    List<ScheduleEntry> existing = scheduleDAO.findAll();
                    List<ConflictViolation> conflicts = detector.detectConflicts(candidate, existing);

                    if (!conflicts.isEmpty()) {
                        sendJsonResponse(exchange, 409, Map.of(
                                "status", "CONFLICT",
                                "conflicts", conflicts
                        ));
                        return;
                    }

                    boolean inserted = scheduleDAO.insert(candidate);
                    if (inserted) {
                        sendJsonResponse(exchange, 201, Map.of("status", "SUCCESS", "entry", candidate));
                    } else {
                        sendJsonResponse(exchange, 500, Map.of("error", "Database insert failed"));
                    }
                } else if ("DELETE".equalsIgnoreCase(method)) {
                    String query = exchange.getRequestURI().getQuery();
                    if (query != null && query.contains("id=")) {
                        int id = Integer.parseInt(query.split("id=")[1].split("&")[0]);
                        scheduleDAO.delete(id);
                        sendJsonResponse(exchange, 200, Map.of("deleted", id));
                    } else {
                        sendJsonResponse(exchange, 400, Map.of("error", "Missing id parameter"));
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                sendJsonResponse(exchange, 500, Map.of("error", e.getMessage()));
            }
        }
    }

    static class ValidateHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            enableCors(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            try {
                String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                JsonObject obj = JsonParser.parseString(body).getAsJsonObject();

                int teacherId = obj.get("teacherId").getAsInt();
                int classroomId = obj.get("classroomId").getAsInt();
                int courseId = obj.get("courseId").getAsInt();
                int sectionId = obj.get("sectionId").getAsInt();
                String day = obj.get("dayOfWeek").getAsString();
                LocalTime start = LocalTime.parse(obj.get("startTime").getAsString());
                LocalTime end = LocalTime.parse(obj.get("endTime").getAsString());

                Teacher teacher = teacherDAO.findById(teacherId).orElse(null);
                Classroom classroom = classroomDAO.findById(classroomId).orElse(null);
                Course course = courseDAO.findById(courseId).orElse(null);
                Section section = sectionDAO.findById(sectionId).orElse(null);

                ScheduleEntry candidate = new ScheduleEntry(0, teacher, classroom, course, section, new TimeSlot(day, start, end), "Fall 2026");
                List<ScheduleEntry> existing = scheduleDAO.findAll();
                List<ConflictViolation> conflicts = detector.detectConflicts(candidate, existing);

                sendJsonResponse(exchange, 200, Map.of(
                        "hasConflict", !conflicts.isEmpty(),
                        "conflictCount", conflicts.size(),
                        "violations", conflicts
                ));
            } catch (Exception e) {
                sendJsonResponse(exchange, 400, Map.of("error", e.getMessage()));
            }
        }
    }

    static class AuditHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            enableCors(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            try {
                List<ScheduleEntry> all = scheduleDAO.findAll();
                List<ConflictViolation> violations = detector.auditEntireTimetable(all);
                sendJsonResponse(exchange, 200, Map.of(
                        "totalSchedules", all.size(),
                        "totalConflicts", violations.size(),
                        "auditResults", violations
                ));
            } catch (Exception e) {
                sendJsonResponse(exchange, 500, Map.of("error", e.getMessage()));
            }
        }
    }
}
