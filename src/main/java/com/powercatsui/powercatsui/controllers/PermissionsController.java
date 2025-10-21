package com.powercatsui.powercatsui.controllers;


import com.powercatsui.powercatsui.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class PermissionsController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/permissions")
    public String permissions(){
        return "permissions";
    }

    /*@PutMapping("/permissions")
    public ModelAndView cadastrarPermissao(@RequestParam String email, @RequestParam EPermissions permissions){
        ModelAndView mv = new ModelAndView();
        Optional<Users> opt = userRepository.findByEmail(email);

        if (opt.isEmpty()){
            mv.setViewName("redirect:/register");
            return mv;
        }

        mv.setViewName("redirect:/users");
        Users user = opt.get();
        user.setPermissions(permissions);
        userRepository.save(user);
        mv.addObject("permissions", permissions);

        return mv;

    }*/
}
