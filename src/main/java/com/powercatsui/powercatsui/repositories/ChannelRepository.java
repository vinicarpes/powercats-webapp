package com.powercatsui.powercatsui.repositories;

import com.powercatsui.powercatsui.models.Alert;
import com.powercatsui.powercatsui.models.Channel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChannelRepository extends JpaRepository<Channel, Long> {
}
