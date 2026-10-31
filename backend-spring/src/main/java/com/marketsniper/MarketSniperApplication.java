package com.marketsniper;

import com.marketsniper.entities.Role;
import com.marketsniper.entities.RoleName;
import com.marketsniper.entities.User;
import com.marketsniper.entities.UserStatus;
import com.marketsniper.repositories.RoleRepository;
import com.marketsniper.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.HashSet;

@SpringBootApplication
public class MarketSniperApplication {

    public static void main(String[] args) {
        SpringApplication.run(MarketSniperApplication.class, args);
    }

    /**
     * Database Seeder: Seeds Roles & Master Administrator on first run.
     */
    @Bean
    public CommandLineRunner initData(RoleRepository roleRepo, UserRepository userRepo, PasswordEncoder encoder) {
        return args -> {
            // Seed Roles if missing
            Role roleAdmin = roleRepo.findByName(RoleName.ROLE_ADMIN).orElseGet(() -> {
                Role r = new Role(RoleName.ROLE_ADMIN);
                return roleRepo.save(r);
            });

            Role roleUser = roleRepo.findByName(RoleName.ROLE_USER).orElseGet(() -> {
                Role r = new Role(RoleName.ROLE_USER);
                return roleRepo.save(r);
            });

            // Seed Master Admin: gsv.200000@gmail.com / Money@2027#
            String adminEmail = "gsv.200000@gmail.com";
            if (!userRepo.existsByEmail(adminEmail)) {
                User admin = new User();
                admin.setName("Sai Vivek (Admin)");
                admin.setEmail(adminEmail);
                admin.setPassword(encoder.encode("Money@2027#"));
                admin.setStatus(UserStatus.APPROVED);
                admin.setRoles(new HashSet<>(Collections.singletonList(roleAdmin)));
                userRepo.save(admin);
                System.out.println("✅ Master Admin seeded: " + adminEmail + " with ROLE_ADMIN");
            }
        };
    }
}
