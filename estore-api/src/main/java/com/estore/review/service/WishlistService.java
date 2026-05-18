package com.estore.review.service;

import com.estore.review.entity.WishlistItem;
import com.estore.review.repository.WishlistRepository;
import com.estore.shared.dto.WishlistItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {
    private final WishlistRepository wishlistRepository;

    public List<WishlistItemResponse> getWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<WishlistItemResponse> addToWishlist(Long userId, Long productId) {
        if (!wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            WishlistItem item = new WishlistItem();
            item.setUserId(userId);
            item.setProductId(productId);
            item.setAddedAt(LocalDateTime.now());
            wishlistRepository.save(item);
        }
        return getWishlist(userId);
    }

    @Transactional
    public List<WishlistItemResponse> removeFromWishlist(Long userId, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
        return getWishlist(userId);
    }

    private WishlistItemResponse convertToResponse(WishlistItem item) {
        return WishlistItemResponse.builder()
                .productId(item.getProductId())
                .addedAt(item.getAddedAt())
                .build();
    }
}
