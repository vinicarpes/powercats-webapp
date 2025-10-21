package com.powercatsui.powercatsui.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "channel_device")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Channel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "device_name")
    private String name;
    @Column(name = "device_serial")
    private String serial;
    private String description;
    @Column(name = "created_at")
    private String created_at =  LocalDateTime.now().toString();
    private String updated_at;
    private String activated_at;
    private boolean active = false;
    private Long last_entry_id;
    @OneToMany(mappedBy = "channel")
    private List<Alert> alerts = new ArrayList<>();
    @OneToOne
    @JoinColumn(name = "location_id")
    private Location location;
    @OneToMany(mappedBy = "channel", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("channel")
    private List<FieldSensor> fieldSensors = new ArrayList<>();
}

