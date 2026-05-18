package com.estore.customer.controller;

import com.estore.config.UserHelper;
import com.estore.customer.service.UserManagementService;
import com.estore.shared.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserManagementService userManagementService;
    private final UserHelper userHelper;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PaginatedResponse<UserResponse> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        return userManagementService.getAllUsers(page, limit);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse updateUserStatus(@PathVariable Long id, @RequestBody UpdateUserStatusRequest request) {
        return userManagementService.updateUserStatus(id, request);
    }

    @PatchMapping("/me")
    public UserResponse updateMyName(@RequestBody UpdateNameRequest request, Authentication authentication) {
        var user = userHelper.getCurrentUser(authentication);
        return userManagementService.updateMyName(user.getId(), request);
    }
}
