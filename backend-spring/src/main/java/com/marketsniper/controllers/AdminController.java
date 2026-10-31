package com.marketsniper.controllers;

import com.marketsniper.dto.request.AdminActionRequest;
import com.marketsniper.dto.response.ApiResponse;
import com.marketsniper.dto.response.UserDTO;
import com.marketsniper.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    private final UserService userService;

    // Constructor Injection (Spring Core IoC)
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    /**
     * List all platform users and registration requests.
     * Accessible ONLY to ROLE_ADMIN. Regular users receive 403 Forbidden.
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("All users retrieved successfully", users));
    }

    /**
     * Get single user by email.
     */
    @GetMapping("/users/{email}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserByEmail(@PathVariable String email) {
        UserDTO user = userService.getUserByEmail(email);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }

    /**
     * Approve, Reject, or Delete user.
     * Flow: Postman/Admin Dashboard -> REST Controller -> UserService -> UserRepository -> Database
     */
    @PostMapping("/action")
    public ResponseEntity<ApiResponse<UserDTO>> handleUserAction(@Valid @RequestBody AdminActionRequest actionRequest) {
        UserDTO result = userService.performAdminAction(actionRequest.getEmail(), actionRequest.getAction());

        String message = "User " + actionRequest.getEmail() + " action '" + actionRequest.getAction() + "' executed successfully.";
        return ResponseEntity.ok(ApiResponse.success(message, result));
    }

    /**
     * Delete user by path variable.
     */
    @DeleteMapping("/users/{email}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String email) {
        userService.performAdminAction(email, "delete");
        return ResponseEntity.ok(ApiResponse.success("User " + email + " was permanently removed from database.", null));
    }

    /**
     * Administrative dashboard metrics and approval queues.
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminStats() {
        Map<String, Object> stats = userService.getAdminStats();
        return ResponseEntity.ok(ApiResponse.success("Platform administration statistics retrieved", stats));
    }
}
