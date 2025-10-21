package com.powercatsui.powercatsui.models;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;


@Getter @Setter
public class RegisterDevice {
    private int id;
    private LocalDate dateOccurence;
    private String description;
}
