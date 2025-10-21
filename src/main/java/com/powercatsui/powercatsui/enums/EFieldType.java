package com.powercatsui.powercatsui.enums;

public enum EFieldType {
    LUMINOSITY("Luminosity"),TEMPERATURE("Temperature"),VIBRATION("Vibration"), CURRENT("Current"), HUMIDITY("Humidity");

    private final String type;

    EFieldType(String type) {
        this.type = type;
    }
}
