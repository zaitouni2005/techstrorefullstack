package com.estore.review.controller;

import com.estore.customer.entity.User;
import com.estore.customer.repository.UserRepository;
import com.estore.exception.ResourceNotFoundException;
import com.estore.review.service.ReviewService;
import com.estore.shared.dto.CreateReviewRequest;
import com.estore.shared.dto.ReviewResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @GetMapping
    public List<ReviewResponse> getReviewsByProduct(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId);
    }

    @PostMapping
    public ReviewResponse createReview(@PathVariable Long productId,
                                        @RequestBody CreateReviewRequest request,
                                        Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String userName = user.getProfile() != null
                ? user.getProfile().getFirstName() + " " + user.getProfile().getLastName()
                : user.getEmail();

        return reviewService.createReview(productId, request, user.getId(), userName.trim());
    }
}
