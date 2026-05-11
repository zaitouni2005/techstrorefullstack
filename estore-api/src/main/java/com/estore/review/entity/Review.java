package com.estore.review.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    private String id;
    
    private Long productId;
    private Long userId;
    private String authorName;
    private Integer note; // 1 to 5
    private String comment;
    private LocalDateTime date;
}
