package com.hobby;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class HobbyApplication {

    public static void main(String[] args) {
        SpringApplication.run(HobbyApplication.class, args);
    }

}

