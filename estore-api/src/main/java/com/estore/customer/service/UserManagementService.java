package com.estore.customer.service;

import com.estore.customer.entity.User;
import com.estore.customer.repository.UserRepository;
import com.estore.exception.ResourceNotFoundException;
import com.estore.shared.dto.PaginatedResponse;
import com.estore.shared.dto.UpdateNameRequest;
import com.estore.shared.dto.UpdateUserStatusRequest;
import com.estore.shared.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserManagementService {
    private final UserRepository userRepository;

    public PaginatedResponse<UserResponse> getAllUsers(int page, int limit) {
        if (page < 1) page = 1;
        if (limit < 1) limit = 20;
        Pageable pageable = PageRequest.of(page - 1, limit);

        Page<User> userPage = userRepository.findAll(pageable);

        List<UserResponse> data = userPage.getContent().stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());

        return PaginatedResponse.<UserResponse>builder()
                .data(data)
                .total(userPage.getTotalElements())
                .page(page)
                .limit(limit)
                .totalPages(userPage.getTotalPages())
                .build();
    }

    @Transactional
    public UserResponse updateUserStatus(Long id, UpdateUserStatusRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus(request.getStatus());
        return convertToUserResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateMyName(Long userId, UpdateNameRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getProfile() != null && request.getName() != null) {
            String[] parts = request.getName().trim().split(" ", 2);
            user.getProfile().setFirstName(parts[0]);
            user.getProfile().setLastName(parts.length > 1 ? parts[1] : "");
        }
        return convertToUserResponse(userRepository.save(user));
    }

    private UserResponse convertToUserResponse(User user) {
        String name = user.getProfile() != null
                ? user.getProfile().getFirstName() + " " + user.getProfile().getLastName()
                : user.getEmail();
        name = name.trim();

        long orderCount = userRepository.countOrdersByUserId(user.getId());
        double totalSpent = userRepository.totalSpentByUserId(user.getId());

        return UserResponse.builder()
                .id(user.getId())
                .name(name)
                .email(user.getEmail())
                .orders(orderCount)
                .totalSpent(totalSpent)
                .status(user.getStatus() != null ? user.getStatus() : "active")
                .createdAt(user.getCreatedAt())
                .build();
    }
}
