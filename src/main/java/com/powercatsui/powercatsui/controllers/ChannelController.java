package com.powercatsui.powercatsui.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.powercatsui.powercatsui.models.Channel;
import com.powercatsui.powercatsui.models.FieldSensor;
import com.powercatsui.powercatsui.models.ReferenceValue;
import com.powercatsui.powercatsui.repositories.ChannelRepository;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.*;
import java.util.stream.Collectors;

@Controller
public class ChannelController {

    private final ChannelRepository channelRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ChannelController(ChannelRepository channelRepository) {
        this.channelRepository = channelRepository;
    }

    @GetMapping("/monitoramento")
    @Transactional(readOnly = true) // mantém sessão aberta para inicializar coleções lazy
    public String monitoramento(Model model) {
        List<Channel> devices = channelRepository.findAll();

        // Mapa id -> JSON string com os fieldSensors
        Map<Long, String> fieldsJsonMap = new HashMap<>();

        for (Channel device : devices) {
            try {
                // força inicialização da coleção (em caso de LAZY)
                List<FieldSensor> fields = device.getFieldSensors() == null
                        ? Collections.emptyList()
                        : new ArrayList<>(device.getFieldSensors());

                // Mapeia apenas os campos que você quer expor ao front (evita problemas com referências Hibernate)
                List<Map<String, Object>> serializableFields = fields.stream().map(fs -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", fs.getId());
                    m.put("name", fs.getName());
                    // fieldType no seu modelo -> mantemos o nome exato
                    m.put("fieldType", fs.getFieldType());
                    // referenceValue pode ser null
                    ReferenceValue rv = fs.getReferenceValue();
                    if (rv != null) {
                        Map<String, Object> rvMap = new HashMap<>();
                        rvMap.put("id", rv.getId());
                        rvMap.put("low", rv.getLow());
                        rvMap.put("moderate", rv.getModerate());
                        rvMap.put("severe", rv.getSevere());
                        rvMap.put("critical", rv.getCritical());
                        m.put("referenceValue", rvMap);
                    } else {
                        m.put("referenceValue", Collections.emptyMap());
                    }
                    return m;
                }).collect(Collectors.toList());

                String json = objectMapper.writeValueAsString(serializableFields);
                fieldsJsonMap.put(device.getId(), json);
            } catch (JsonProcessingException e) {
                // em caso de falha de serialização, coloque um array vazio para evitar que a view quebre
                fieldsJsonMap.put(device.getId(), "[]");
            }
        }

        model.addAttribute("devices", devices);
        model.addAttribute("fieldsJsonMap", fieldsJsonMap);
        return "monitoramento";
    }
}
