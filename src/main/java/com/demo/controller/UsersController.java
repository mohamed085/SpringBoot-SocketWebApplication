package com.demo.controller;

import com.demo.storage.UserStorage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
public class UsersController {


    Logger logger = LoggerFactory.getLogger(MessageController.class);

    @GetMapping("/registration/{username}")
    public ResponseEntity<Void> register(@PathVariable String username) {
        logger.debug("Handling register user request: " + username);
        try {
            UserStorage.getInstance().setUser(username);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/fetchAllUsers")
    public Set<String> fetchAllUsers() {
        return UserStorage.getInstance().getUsers();
    }

}
