package com.marketsniper.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.marketsniper.dto.request.AdminActionRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AdminSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Admin API: Unauthenticated request is rejected with 401 Unauthorized")
    public void testUnauthenticatedAccessRejected() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "customer@gmail.com", roles = {"USER"})
    @DisplayName("Admin API: Standard User/Customer is blocked with 403 Forbidden")
    public void testCustomerAccessToAdminBlocked() throws Exception {
        // Strict Rubric Requirement: Employees/customers must not access admin APIs
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "gsv.200000@gmail.com", roles = {"ADMIN"})
    @DisplayName("Admin API: Administrator with ROLE_ADMIN granted full access (200 OK)")
    public void testAdminAccessAllowed() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @WithMockUser(username = "gsv.200000@gmail.com", roles = {"ADMIN"})
    @DisplayName("Admin API: Admin can fetch statistics (200 OK)")
    public void testAdminStatsAccess() throws Exception {
        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalUsers").exists());
    }
}
