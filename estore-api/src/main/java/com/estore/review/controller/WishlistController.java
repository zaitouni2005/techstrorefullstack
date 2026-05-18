package com.estore.review.controller;

import com.estore.customer.entity.User;
import com.estore.customer.repository.UserRepository;
import com.estore.exception.ResourceNotFoundException;
import com.estore.review.service.WishlistService;
import com.estore.shared.dto.WishlistItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;
    private final UserRepository userRepository;

    @GetMapping
    public List<WishlistItemResponse> getWishlist(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return wishlistService.getWishlist(user.getId());
    }

    @PostMapping("/{productId}")
    public List<WishlistItemResponse> addToWishlist(@PathVariable Long productId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return wishlistService.addToWishlist(user.getId(), productId);
    }

    @DeleteMapping("/{productId}")
    public List<WishlistItemResponse> removeFromWishlist(@PathVariable Long productId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return wishlistService.removeFromWishlist(user.getId(), productId);
    }
}
