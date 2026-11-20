package com.timetable.model;

public class Classroom extends BaseEntity {
    private String roomNumber;
    private String building;
    private int capacity;
    private String roomType;

    public Classroom() {}

    public Classroom(int id, String roomNumber, String building, int capacity, String roomType) {
        super(id);
        this.roomNumber = roomNumber;
        this.building = building;
        this.capacity = capacity;
        this.roomType = roomType;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    @Override
    public String toString() {
        return roomNumber + " [" + building + ", Cap: " + capacity + "]";
    }
}
