package com.demo.controller;

import com.demo.model.MessageModel;
import com.demo.storage.UserStorage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class MessageController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    Logger logger = LoggerFactory.getLogger(MessageController.class);

    public MessageController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/chat/{to}")
    public void sendMessage(@DestinationVariable String to, MessageModel message) {
        logger.info("Handling send message: " + message + " to: " + to);
        boolean isExist = UserStorage.getInstance().getUsers().contains(to);
        if (isExist) {
            simpMessagingTemplate.convertAndSend("/topic/messages/" + to, message);
        }

    }
}
