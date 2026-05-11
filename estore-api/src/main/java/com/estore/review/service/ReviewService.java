package com.estore.review.service;

import com.estore.review.entity.Review;
import com.estore.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public List<Review> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    public Review createReview(Review review) {
        review.setDate(LocalDateTime.now());
        return reviewRepository.save(review);
    }
}
