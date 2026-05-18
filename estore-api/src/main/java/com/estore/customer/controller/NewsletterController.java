package com.estore.customer.controller;

import com.estore.customer.service.NewsletterService;
import com.estore.shared.dto.SubscribeRequest;
import com.estore.shared.dto.SuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class NewsletterController {
    private final NewsletterService newsletterService;

    @PostMapping("/subscribe")
    public ResponseEntity<SuccessResponse> subscribe(@RequestBody SubscribeRequest request) {
        newsletterService.subscribe(request.getEmail());
        return ResponseEntity.ok(new SuccessResponse(true));
    }
}
