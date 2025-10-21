package com.powercatsui.powercatsui.models;

public enum EPermission {

    MONITOR (1),
    TECHNICIAN(2),
    SUPERVISOR(3),
    ADMINISTRATOR(4);

    private final int value;

    EPermission(int value){
        this.value = value;
    }

    public int getValue() {
        return value;
    }

}
