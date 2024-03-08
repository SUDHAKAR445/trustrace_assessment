package com.sudhakar.recipe.service;

import com.sudhakar.recipe.entity.MailStructure;

import jakarta.mail.MessagingException;

public interface MailService {
    public void sendMail(MailStructure mailStructure);

    public void sendMailWithQr(MailStructure mailStructure) throws MessagingException;
}
