package com.timetable.model;

import java.time.LocalDateTime;

/**
 * Base abstract class demonstrating OOP Inheritance and Encapsulation.
 */
public abstract class BaseEntity {
    private int id;
    private LocalDateTime createdAt;

    public BaseEntity() {
        this.createdAt = LocalDateTime.now();
    }

    public BaseEntity(int id) {
        this();
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
