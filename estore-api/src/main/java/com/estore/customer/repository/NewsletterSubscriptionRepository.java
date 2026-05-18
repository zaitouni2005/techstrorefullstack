package com.estore.customer.repository;

import com.estore.customer.entity.NewsletterSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsletterSubscriptionRepository extends JpaRepository<NewsletterSubscription, Long> {
    boolean existsByEmail(String email);
}
