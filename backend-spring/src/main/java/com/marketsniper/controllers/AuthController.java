package com.marketsniper.controllers;

import com.marketsniper.dto.request.LoginRequest;
import com.marketsniper.dto.request.SignupRequest;
import com.marketsniper.dto.response.ApiResponse;
import com.marketsniper.dto.response.AuthResponse;
import com.marketsniper.dto.response.UserDTO;
import com.marketsniper.entities.User;
import com.marketsniper.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthService authService;

    // Constructor Injection (Spring Core IoC)
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * User Registration / Request Access
     * Flow: Postman/React -> REST Controller -> AuthService -> UserRepository -> Database
     */
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<UserDTO>> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        User registeredUser = authService.registerUser(signupRequest);
        UserDTO userDTO = new UserDTO(registeredUser);

        ApiResponse<UserDTO> response = ApiResponse.success(
                "Access request registered successfully. Your account is pending Administrator review.",
                userDTO
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * User Authentication & Stateless JWT Token Issuance
     * Flow: Postman/React -> REST Controller -> AuthService -> AuthenticationManager -> SecurityContext
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.authenticateUser(loginRequest);

        ApiResponse<AuthResponse> response = ApiResponse.success(
                "Authentication successful. Institutional workspace granted.",
                authResponse
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Get Current Authenticated User Identity
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Authenticated user profile retrieved", new UserDTO(user)));
    }
}
