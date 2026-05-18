package com.estore.review.service;

import com.estore.review.entity.Review;
import com.estore.review.repository.ReviewRepository;
import com.estore.shared.dto.CreateReviewRequest;
import com.estore.shared.dto.ReviewResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(this::convertToReviewResponse)
                .collect(Collectors.toList());
    }

    public ReviewResponse createReview(Long productId, CreateReviewRequest request, Long userId, String userName) {
        Review review = new Review();
        review.setProductId(productId);
        review.setUserId(userId);
        review.setUserName(userName);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());

        return convertToReviewResponse(reviewRepository.save(review));
    }

    private ReviewResponse convertToReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProductId())
                .userId(review.getUserId())
                .userName(review.getUserName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
