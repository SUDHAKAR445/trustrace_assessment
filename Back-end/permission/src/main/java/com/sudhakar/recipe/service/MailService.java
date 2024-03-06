package com.sudhakar.recipe.service;

import com.sudhakar.recipe.entity.MailStructure;

public interface MailService {
    void sendMail(String mail, MailStructure mailStructure);
}
