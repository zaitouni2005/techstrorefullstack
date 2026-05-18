package com.estore.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private UserInfo user;

    @Data
    @Builder
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String name;
        private String email;
    }
}
