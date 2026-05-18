package com.estore.billing.controller;

import com.estore.billing.service.BillingService;
import com.estore.customer.entity.User;
import com.estore.customer.repository.UserRepository;
import com.estore.exception.ResourceNotFoundException;
import com.estore.shared.dto.CreateOrderRequest;
import com.estore.shared.dto.OrderResponse;
import com.estore.shared.dto.PaginatedResponse;
import com.estore.shared.dto.UpdateOrderStatusRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Endpoints for placing and viewing orders")
public class OrderController {
    private final BillingService billingService;
    private final UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Place an order", description = "Create a new order from cart items or provided items")
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody CreateOrderRequest request,
                                                    Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(billingService.placeOrder(user.getId(), request));
    }

    @GetMapping
    @Operation(summary = "Get orders", description = "Retrieve orders for the authenticated user or all orders for admin")
    public PaginatedResponse<OrderResponse> getOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String status,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return billingService.getAllOrders(page, limit, status, null);
        }
        return billingService.getOrdersByUserId(user.getId(), page, limit, status);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all orders (Admin)", description = "Retrieve all orders across the system. Restricted to ADMIN users.")
    public PaginatedResponse<OrderResponse> getAllOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long customerId) {
        return billingService.getAllOrders(page, limit, status, customerId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Retrieve detailed information about a specific order")
    public OrderResponse getOrderById(@PathVariable Long id, Authentication authentication) {
        OrderResponse order = billingService.getOrderById(id);
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !order.getCustomerId().equals(user.getId())) {
            throw new ResourceNotFoundException("Order not found");
        }
        return order;
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update order status", description = "Update the status of an order. Restricted to ADMIN users.")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id,
                                                           @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(billingService.updateOrderStatus(id, request.getStatus()));
    }
}
