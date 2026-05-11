package com.estore.shopping.controller;

import com.estore.customer.entity.User;
import com.estore.customer.repository.UserRepository;
import com.estore.exception.ResourceNotFoundException;
import com.estore.shopping.entity.Cart;
import com.estore.shopping.service.ShoppingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
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
    @Operation(summary = "Get current cart", description = "Retrieve the shopping cart and its items for the authenticated user")
    public Cart getCart(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return shoppingService.getCartByUserId(user.getId());
    }

    @PostMapping("/add/{productId}")
    @Operation(summary = "Add item to cart", description = "Add a product to the user's shopping cart with a specified quantity")
    public Cart addItemToCart(@PathVariable Long productId, @RequestParam Integer quantity,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return shoppingService.addItemToCart(user.getId(), productId, quantity);
    }

    @PutMapping("/update/{productId}")
    @Operation(summary = "Update item quantity", description = "Update the quantity of a specific product already in the cart")
    public Cart updateItemQuantity(@PathVariable Long productId, @RequestParam Integer quantity,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return shoppingService.updateItemQuantity(user.getId(), productId, quantity);
    }

    @DeleteMapping("/remove/{productId}")
    @Operation(summary = "Remove item from cart", description = "Completely remove a specific product from the user's cart")
    public Cart removeItemFromCart(@PathVariable Long productId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return shoppingService.removeItemFromCart(user.getId(), productId);
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Clear cart", description = "Remove all items from the user's shopping cart")
    public void clearCart(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        shoppingService.clearCart(user.getId());
    }
}
