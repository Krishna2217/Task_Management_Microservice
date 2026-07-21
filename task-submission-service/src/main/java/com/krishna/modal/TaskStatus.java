package com.krishna.modal;

public enum TaskStatus {
        PENDING("PENDING"),
        ASSIGNED("ASSIGNED"),
        DONE("DONE"),
        // used by TaskServiceFallback when TASK-SERVICE is unreachable and the real status can't be determined
        UNKNOWN("UNKNOWN");

        TaskStatus(String assigned) {
        }
}

