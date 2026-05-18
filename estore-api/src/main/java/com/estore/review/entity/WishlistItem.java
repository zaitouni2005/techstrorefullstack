package com.estore.review.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "wishlists")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItem {

    @Id
    private String id;

    private Long userId;
    private Long productId;
    private LocalDateTime addedAt;
}
