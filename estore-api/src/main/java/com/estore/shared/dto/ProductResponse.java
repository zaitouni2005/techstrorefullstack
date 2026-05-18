package com.estore.shared.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String brand;
    private String brandImage;
    private String category;
    private Long categoryId;
    private Double price;
    private Double oldPrice;
    private Double rating;
    private Integer stock;
    private String mainImage;
    private List<String> images;
    private String description;
    private String descriptionMarkdown;
    private List<ProductSpec> specs;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
