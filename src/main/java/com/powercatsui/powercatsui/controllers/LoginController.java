package com.powercatsui.powercatsui.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class LoginController {

    @GetMapping("/login")
    public ModelAndView login(){
        ModelAndView mv = new ModelAndView("login");

        return mv;
    }
    @GetMapping("/painelUser")
    public ModelAndView administrador(){
        ModelAndView mv = new ModelAndView("painelUser");

        return mv;
    }


    @GetMapping("/instalacao")
    public ModelAndView instalacao(){
        ModelAndView mv = new ModelAndView("instalacao");

        return mv;
    }

    @GetMapping("/device")
    public ModelAndView device(){
        ModelAndView mv = new ModelAndView("device");

        return mv;
    }

    @GetMapping("/listdevices")
    public ModelAndView listdevices(){
        ModelAndView mv = new ModelAndView("listdevices");

        return mv;
    }

    @GetMapping("/detalhes")
    public ModelAndView detalhes(){
        ModelAndView mv = new ModelAndView("detalhes");

        return mv;
    }

}
