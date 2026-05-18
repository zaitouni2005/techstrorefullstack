package com.estore.config;

import com.estore.review.entity.Review;
import com.estore.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private final ReviewRepository reviewRepository;

    @Override
    public void run(String... args) {
        if (reviewRepository.count() > 0) {
            log.info("MongoDB already seeded, skipping.");
            return;
        }

        log.info("Seeding MongoDB with sample reviews...");

        List<Review> reviews = List.of(
                createReview(1L, 3L, "Jean Dupont", 5,
                        "Excellent smartphone ! L'appareil photo est incroyable et la batterie tient deux jours."),
                createReview(1L, 4L, "Marie Curie", 4, "Très bon produit mais un peu lourd. L'écran est magnifique."),
                createReview(2L, 2L, "Test User", 4, "Super téléphone, l'IA est vraiment utile au quotidien."),
                createReview(6L, 3L, "Jean Dupont", 5,
                        "Meilleur ordinateur portable que j'ai jamais eu. Le silence est impressionnant."),
                createReview(6L, 4L, "Marie Curie", 5,
                        "Parfait pour le développement. L'écran est magnifique et la batterie tient 15h."),
                createReview(12L, 4L, "Marie Curie", 4,
                        "Excellent pour la prise de notes et le dessin. Procreate est incroyable dessus."),
                createReview(17L, 3L, "Jean Dupont", 5,
                        "Le meilleur casque audio du marché. La réduction de bruit est bluffante."),
                createReview(18L, 2L, "Test User", 5,
                        "Meilleurs écouteurs sans fil. La qualité sonore est exceptionnelle."),
                createReview(19L, 3L, "Jean Dupont", 4,
                        "Souris très confortable, la molette est parfaite pour la productivité."));

        reviewRepository.saveAll(reviews);
        log.info("Seeded {} sample reviews into MongoDB.", reviews.size());
    }

    private Review createReview(Long productId, Long userId, String userName, int rating, String comment) {
        Review review = new Review();
        review.setProductId(productId);
        review.setUserId(userId);
        review.setUserName(userName);
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());
        return review;
    }
}
