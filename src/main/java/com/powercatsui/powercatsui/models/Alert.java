package com.powercatsui.powercatsui.models;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.powercatsui.powercatsui.enums.EAlertLevel;
import com.powercatsui.powercatsui.enums.EStatusAlert;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;


@Data
@Entity
@Table(name = "alert")
@AllArgsConstructor
@NoArgsConstructor
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "alert_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private ZonedDateTime alertDate;

    @Column(nullable = false, name = "alert_level")
    @Enumerated(EnumType.STRING)
    private EAlertLevel alertLevel;

    @Column(nullable = false, name =  "status_alert")
    @Enumerated(EnumType.STRING)
    private EStatusAlert statusAlert;

    @Column(name = "description")
    private String description;

    @ManyToOne(optional = false)
    @JoinColumn(name = "channel_device_id", nullable = false)
    @JsonIgnore
    private Channel channel;

    @PrePersist
    public void prePersist() {
        if (alertDate == null) {
            alertDate = ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));
        }
    }

}
