package com.marketsniper.services;

import com.marketsniper.dto.response.UserDTO;
import com.marketsniper.entities.User;
import com.marketsniper.entities.UserStatus;
import com.marketsniper.exceptions.ResourceNotFoundException;
import com.marketsniper.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    // Constructor Injection (Spring Core IoC)
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return new UserDTO(user);
    }

    @Transactional
    public UserDTO performAdminAction(String email, String action) {
        String cleanEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + cleanEmail));

        String cleanAction = action.trim().toLowerCase();
        switch (cleanAction) {
            case "approve":
                user.setStatus(UserStatus.APPROVED);
                User approved = userRepository.save(user);
                return new UserDTO(approved);

            case "reject":
                user.setStatus(UserStatus.REJECTED);
                User rejected = userRepository.save(user);
                return new UserDTO(rejected);

            case "delete":
                userRepository.delete(user);
                return null;

            default:
                throw new IllegalArgumentException("Unknown administrative action: " + action + ". Supported actions: approve, reject, delete.");
        }
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAdminStats() {
        List<User> allUsers = userRepository.findAll();

        long totalUsers = allUsers.size();
        long pending = allUsers.stream().filter(u -> u.getStatus() == UserStatus.PENDING).count();
        long approved = allUsers.stream().filter(u -> u.getStatus() == UserStatus.APPROVED).count();
        long rejected = allUsers.stream().filter(u -> u.getStatus() == UserStatus.REJECTED).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("pendingApproval", pending);
        stats.put("approved", approved);
        stats.put("rejected", rejected);

        return stats;
    }
}
