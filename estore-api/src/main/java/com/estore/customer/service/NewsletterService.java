package com.estore.customer.service;

import com.estore.customer.entity.NewsletterSubscription;
import com.estore.customer.repository.NewsletterSubscriptionRepository;
import com.estore.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NewsletterService {
    private final NewsletterSubscriptionRepository newsletterRepository;

    @Transactional
    public void subscribe(String email) {
        if (newsletterRepository.existsByEmail(email)) {
            return;
        }
        NewsletterSubscription sub = new NewsletterSubscription();
        sub.setEmail(email);
        newsletterRepository.save(sub);
    }
}
