package com.estore.shopping.controller;

import com.estore.customer.entity.User;
import com.estore.customer.repository.UserRepository;
import com.estore.exception.ResourceNotFoundException;
import com.estore.shared.dto.CartItemRequest;
import com.estore.shared.dto.CartResponse;
import com.estore.shared.dto.QuantityRequest;
import com.estore.shopping.service.ShoppingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Shopping Cart", description = "Endpoints for managing the user's shopping cart")
public class CartController {
    private final ShoppingService shoppingService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get current cart", description = "Retrieve the shopping cart for the authenticated user")
    public CartResponse getCart(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return shoppingService.getCartByUserId(user.getId());
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart", description = "Add a product to the user's shopping cart")
    public CartResponse addItem(@RequestBody CartItemRequest request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return shoppingService.addItemToCart(user.getId(), request.getProductId(), request.getQuantity());
    }

    @PatchMapping("/items/{productId}")
    @Operation(summary = "Update item quantity", description = "Update the quantity of a product in the cart")
    public CartResponse updateItemQuantity(@PathVariable Long productId, @RequestBody QuantityRequest request,
                                           Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return shoppingService.updateItemQuantity(user.getId(), productId, request.getQuantity());
    }

    @DeleteMapping("/items/{productId}")
    @Operation(summary = "Remove item from cart", description = "Remove a specific product from the cart")
    public CartResponse removeItem(@PathVariable Long productId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return shoppingService.removeItemFromCart(user.getId(), productId);
    }

    @DeleteMapping
    @Operation(summary = "Clear cart", description = "Remove all items from the cart")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        shoppingService.clearCart(user.getId());
        return ResponseEntity.noContent().build();
    }
}
