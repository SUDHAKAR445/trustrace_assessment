package com.sudhakar.recipe.service.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import com.sudhakar.recipe.entity.MailStructure;
import com.sudhakar.recipe.service.MailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailServiceImplementation implements MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromMail;

    public void sendMail(String mail, MailStructure mailStructure) {

        // JavaMailSenderImpl simpleMailMessage = new JavaMailSenderImpl();
        // simpleMailMessage.setFrom("ssudhakar2107@gmail.com");
        // simpleMailMessage.setSubject("HHHHH");
        // simpleMailMessage.setText("mailStructure.getMessage()");
        // simpleMailMessage.setTo(mail);

        // System.out.println("mail"+ simpleMailMessage);
        // mailSender.send(simpleMailMessage);
    }
}
