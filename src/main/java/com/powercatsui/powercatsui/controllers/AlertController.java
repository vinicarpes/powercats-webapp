package com.powercatsui.powercatsui.controllers;

import com.powercatsui.powercatsui.models.Alert;
import com.powercatsui.powercatsui.repositories.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Controller
@RequestMapping("/alerts")
public class AlertController {

    @Autowired
    private AlertRepository alertRepository;

    @GetMapping()
    public ModelAndView listAlerts(
            @RequestParam(defaultValue = "0") int page,   // página atual (0-index)
            @RequestParam(defaultValue = "10") int size  // linhas por página
    ) {
        List<Alert> alerts = alertRepository.findAll();
        alerts.sort(Comparator.comparing(Alert::getAlertDate).reversed()); // mais recentes primeiro

        // Calcula índices de sublista
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, alerts.size());
        List<Alert> pagedAlerts = fromIndex < alerts.size() ? alerts.subList(fromIndex, toIndex) : Collections.emptyList();

        int totalPages = (int) Math.ceil((double) alerts.size() / size);

        ModelAndView mv = new ModelAndView("alerts");
        mv.addObject("alerts", pagedAlerts);
        mv.addObject("currentPage", page);
        mv.addObject("pageSize", size);
        mv.addObject("totalPages", totalPages);

        return mv;
    }
}
