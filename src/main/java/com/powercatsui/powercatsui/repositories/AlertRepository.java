package com.powercatsui.powercatsui.repositories;

import com.powercatsui.powercatsui.models.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {
}
