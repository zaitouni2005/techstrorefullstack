package com.estore.review.controller;

import com.estore.config.UserHelper;
import com.estore.review.service.WishlistService;
import com.estore.shared.dto.WishlistItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;
    private final UserHelper userHelper;

    @GetMapping
    public List<WishlistItemResponse> getWishlist(Authentication authentication) {
        var user = userHelper.getCurrentUser(authentication);
        return wishlistService.getWishlist(user.getId());
    }

    @PostMapping("/{productId}")
    @ResponseStatus(HttpStatus.CREATED)
    public List<WishlistItemResponse> addToWishlist(@PathVariable Long productId, Authentication authentication) {
        var user = userHelper.getCurrentUser(authentication);
        return wishlistService.addToWishlist(user.getId(), productId);
    }

    @DeleteMapping("/{productId}")
    public List<WishlistItemResponse> removeFromWishlist(@PathVariable Long productId, Authentication authentication) {
        var user = userHelper.getCurrentUser(authentication);
        return wishlistService.removeFromWishlist(user.getId(), productId);
    }
}
