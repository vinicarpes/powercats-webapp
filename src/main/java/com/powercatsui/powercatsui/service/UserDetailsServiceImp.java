package com.powercatsui.powercatsui.service;


import com.powercatsui.powercatsui.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImp {

    @Autowired
    private UserRepository userRepository;

//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        Users user = userRepository.findByEmail(email);
//
//        if (user == null) {
//            throw new UsernameNotFoundException("Usuário não encontrado com o email: " + email);
//        }
//
//        return user;
//    }
}
