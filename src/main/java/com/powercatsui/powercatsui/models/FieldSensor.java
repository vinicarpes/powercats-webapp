package com.powercatsui.powercatsui.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.powercatsui.powercatsui.enums.EFieldType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "field")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class FieldSensor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"fieldSensors", "hibernateLazyInitializer", "handler"})
    @JoinColumn(name = "channel_id", nullable = false)
    private Channel channel;
    @Column(name="name", nullable = false)
    private String name;
    @Column(name = "sensor_type")
    private EFieldType fieldType;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "reference_id")
    private ReferenceValue referenceValue = new ReferenceValue();
}
