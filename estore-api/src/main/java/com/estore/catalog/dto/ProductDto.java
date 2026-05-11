package com.estore.catalog.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private Double currentPrice;
    private Double oldPrice;
    private String mainImageUrl;
    private List<String> allImageUrls;
    private Long categoryId;
    private Integer stockQuantity;
}
