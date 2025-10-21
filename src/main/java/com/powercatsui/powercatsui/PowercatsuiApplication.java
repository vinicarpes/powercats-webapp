package com.powercatsui.powercatsui;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class PowercatsuiApplication {

	public static void main(String[] args) {
		SpringApplication.run(PowercatsuiApplication.class, args);

//		System.out.println(new BCryptPasswordEncoder().encode("123"));

	}

}
