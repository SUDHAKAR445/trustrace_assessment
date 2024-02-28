package com.sudhakar.recipe.seeder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.sudhakar.recipe.entity.Role;
import com.sudhakar.recipe.repository.RoleRepository;

@Component
public class DatabaseSeeder implements CommandLineRunner{

    @Autowired
    private RoleRepository roleRepository;


    @Override
    public void run(String... args) throws Exception {
        seedRoles();
    }

    private void seedRoles(){
    String[] roleNames = { "ADMIN", "MODERATOR", "USER" };
        for(String role: roleNames){
            if(!roleRepository.findByRoleName(role).isPresent()){
                roleRepository.save(new Role(role));
            }
        }
    }
}
