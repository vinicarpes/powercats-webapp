package com.powercatsui.powercatsui.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "tb_location")
@Data //generates getter, setters, toString, equals methods
@NoArgsConstructor // enables no args constructors
@AllArgsConstructor //enabels all args constructors
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private BigDecimal latitude;
    @Column(nullable = false)
    private BigDecimal longitude;
    private int elevation;

    public Location(BigDecimal latitude, BigDecimal longitude, int elevation) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.elevation = elevation;
    }
}
