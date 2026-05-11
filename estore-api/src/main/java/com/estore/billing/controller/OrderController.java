package com.estore.billing.controller;

import com.estore.billing.entity.Order;
import com.estore.billing.service.BillingService;
import com.estore.customer.entity.User;
import com.estore.customer.repository.UserRepository;
import com.estore.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Endpoints for placing and viewing orders")
public class OrderController {
    private final BillingService billingService;
    private final UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Place an order", description = "Convert the current user's cart into a completed order")
    public ResponseEntity<Order> placeOrder(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(billingService.placeOrder(user.getId()));
    }

    @GetMapping
    @Operation(summary = "Get personal order history", description = "Retrieve a list of all past orders for the authenticated user")
    public List<Order> getMyOrders(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return billingService.getOrdersByUserId(user.getId());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all orders (Admin)", description = "Retrieve a list of all orders across the entire system. Restricted to ADMIN users.")
    public List<Order> getAllOrders() {
        return billingService.getAllOrders();
    }
}
