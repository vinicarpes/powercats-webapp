package com.powercatsui.powercatsui.controllers;


import com.powercatsui.powercatsui.models.Address;
import com.powercatsui.powercatsui.models.EPermission;
import com.powercatsui.powercatsui.models.User;

import com.powercatsui.powercatsui.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/users")
public class UserControler {

    @Autowired
    private UserRepository userRepository;

//    @Autowired
//    private PasswordEncoder passwordEncoder;

    @GetMapping("/register")
    public ModelAndView showRegistrationForm() {
        ModelAndView mv = new ModelAndView("register");
        User user = new User();
        user.setAddress(new Address());
        mv.addObject("user", user);
        return mv;
    }

    @PostMapping("/register")
    public ModelAndView registerUser(@ModelAttribute User user, BindingResult result) {
        ModelAndView mv = new ModelAndView();

        if (userRepository.findByEmail(user.getEmail()) != null) {
            result.rejectValue("email", "error.user", "Este email já está cadastrado");
        }

        if (result.hasErrors()) {
            mv.setViewName("register");
            mv.addObject("user", user);
            return mv;
        }
//
//        // Codifica a senha antes de salvar
////        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Define valores padrão
        user.setPermission(EPermission.MONITOR);
        user.setActive(true);

        userRepository.save(user);

        mv.setViewName("redirect:/login?success");
        return mv;
    }

    @GetMapping("/list")
    public ModelAndView listar(){
        List<User> userList = userRepository.findAll();
        ModelAndView mv = new ModelAndView("users");
        mv.addObject("userList", userList);
        return mv;
    }

    @GetMapping("/{id}/remove")
    public String remover(@PathVariable Integer id){
        Optional<User> userOpt = userRepository.findById(id);

        userOpt.ifPresent(userModel -> userRepository.delete(userModel));

        return "redirect:/users";

    }

    @GetMapping("/users/{id}/alter")
    public ModelAndView showAlterForm(@PathVariable Integer id) {
        ModelAndView mv = new ModelAndView("alter");
        User user = userRepository.findUsersById(id);

        if (user == null) {
            mv.setViewName("redirect:/users?notfound");
            return mv;
        }

        System.out.println(user.getBirthDate());

        mv.addObject("user", user); // adiciona o user buscado do banco a view
        return mv;
    }

    @PutMapping("/users/{id}/alter")
    public ModelAndView alterUser(
            @PathVariable Integer id,
            @ModelAttribute("user") User user,
            BindingResult result) {

        ModelAndView mv = new ModelAndView();

        User persisted = userRepository.findUsersById(id);
        if (persisted == null) {
            mv.setViewName("redirect:/users?notfound");
            return mv;
        }

        // validação simples de e-mail duplicado (exemplo)
        User existing = userRepository.findByEmail(user.getEmail());
        if (existing != null && !existing.getId().equals(id)) {
            result.rejectValue("email", "error.user", "Este email já está cadastrado");
        }

        if (result.hasErrors()) {
            mv.setViewName("alter");
            mv.addObject("user", user);
            return mv;
        }

        // copia dados do form para o objeto persistido
        persisted.setName(user.getName());
        persisted.setBirthDate(user.getBirthDate());
        persisted.setEmail(user.getEmail());
        persisted.setFone(user.getFone());

//        // senha só se veio algo novo
//        if (user.getPassword() != null && !user.getPassword().isBlank()) {
//            persisted.setPassword(passwordEncoder.encode(user.getPassword()));
//        }

        // endereço
        if (persisted.getAddress() == null) {
            persisted.setAddress(new Address());
        }
        persisted.getAddress().setPostalCode(user.getAddress().getPostalCode());
        persisted.getAddress().setAddress(user.getAddress().getAddress());
        persisted.getAddress().setNmbr(user.getAddress().getNmbr());
        persisted.getAddress().setComplement(user.getAddress().getComplement());
        persisted.getAddress().setDistrict(user.getAddress().getDistrict());
        persisted.getAddress().setCity(user.getAddress().getCity());
        persisted.getAddress().setState(user.getAddress().getState());

        userRepository.save(persisted);

        mv.setViewName("redirect:/users");
        return mv;
    }





}
