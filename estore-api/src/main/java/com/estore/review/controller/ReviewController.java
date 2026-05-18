package com.estore.review.controller;

import com.estore.config.UserHelper;
import com.estore.review.service.ReviewService;
import com.estore.shared.dto.CreateReviewRequest;
import com.estore.shared.dto.ReviewResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private final UserHelper userHelper;

    @GetMapping
    public List<ReviewResponse> getReviewsByProduct(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse createReview(@PathVariable Long productId,
                                        @Valid @RequestBody CreateReviewRequest request,
                                        Authentication authentication) {
        var user = userHelper.getCurrentUser(authentication);

        String userName = user.getProfile() != null
                ? user.getProfile().getFirstName() + " " + user.getProfile().getLastName()
                : user.getEmail();

        return reviewService.createReview(productId, request, user.getId(), userName.trim());
    }
}
