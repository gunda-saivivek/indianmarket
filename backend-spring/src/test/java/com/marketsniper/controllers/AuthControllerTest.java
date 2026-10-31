package com.marketsniper.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.marketsniper.dto.request.LoginRequest;
import com.marketsniper.dto.request.SignupRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Registration: Rejects non-gmail addresses with 400 Bad Request")
    public void testNonGmailRegistrationRejected() throws Exception {
        SignupRequest signup = new SignupRequest("Tester", "user@yahoo.com", "Password@123");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Error"))
                .andExpect(jsonPath("$.validationErrors.email").exists());
    }

    @Test
    @DisplayName("Registration: Accepts valid @gmail.com registration")
    public void testValidGmailRegistration() throws Exception {
        SignupRequest signup = new SignupRequest("Rahul Sharma", "rahul.test" + System.currentTimeMillis() + "@gmail.com", "Money@123");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PENDING"));
    }

    @Test
    @DisplayName("Login: Master Admin logs in successfully and receives JWT token")
    public void testMasterAdminLogin() throws Exception {
        LoginRequest login = new LoginRequest("gsv.200000@gmail.com", "Money@2027#");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.roles[0]").value("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("Login: Fails on invalid credentials with 401 Unauthorized")
    public void testInvalidPasswordLogin() throws Exception {
        LoginRequest login = new LoginRequest("gsv.200000@gmail.com", "WrongPassword123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }
}
