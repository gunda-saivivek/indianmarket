package com.marketsniper.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AdminActionRequest {

    @NotBlank(message = "User email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Action is required")
    @Pattern(
        regexp = "^(?i)(approve|reject|delete)$",
        message = "Action must be one of: approve, reject, delete"
    )
    private String action;

    public AdminActionRequest() {}

    public AdminActionRequest(String email, String action) {
        this.email = email;
        this.action = action;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
