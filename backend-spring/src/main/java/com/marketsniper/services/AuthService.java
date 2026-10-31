package com.marketsniper.services;

import com.marketsniper.config.JwtUtils;
import com.marketsniper.dto.request.LoginRequest;
import com.marketsniper.dto.request.SignupRequest;
import com.marketsniper.dto.response.AuthResponse;
import com.marketsniper.entities.Role;
import com.marketsniper.entities.RoleName;
import com.marketsniper.entities.User;
import com.marketsniper.entities.UserStatus;
import com.marketsniper.exceptions.AccountPendingException;
import com.marketsniper.exceptions.ResourceNotFoundException;
import com.marketsniper.exceptions.UserAlreadyExistsException;
import com.marketsniper.repositories.RoleRepository;
import com.marketsniper.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    // Constructor Injection (Spring Core IoC)
    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public User registerUser(SignupRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        // Business Rule 1: Email must be unique
        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("An account with email '" + email + "' already exists.");
        }

        // Business Rule 2: Must be @gmail.com
        if (!email.endsWith("@gmail.com")) {
            throw new IllegalArgumentException("Registration is strictly restricted to valid @gmail.com accounts.");
        }

        // Fetch or create standard User role
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_USER)));

        // Create new User entity with encoded password and PENDING status
        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.PENDING);
        user.setRoles(new HashSet<>(Collections.singletonList(userRole)));

        return userRepository.save(user);
    }

    public AuthResponse authenticateUser(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        // Check user existence
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        // Business Rule: Check Admin approval status before generating tokens
        if (user.getStatus() == UserStatus.PENDING) {
            throw new AccountPendingException(
                    "Your access request is currently pending Administrator review. Live market access activates once approved."
            );
        }

        if (user.getStatus() == UserStatus.REJECTED) {
            throw new AccountPendingException(
                    "Institutional access has been denied for this account by the administrator."
            );
        }

        // Authenticate credentials using Spring Security AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate stateless JWT token
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return new AuthResponse(
                jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail(),
                userDetails.getStatus(),
                roles
        );
    }

    @Transactional(readOnly = true)
    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
