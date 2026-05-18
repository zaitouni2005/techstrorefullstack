package com.estore.shared.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopProduct {
    private Long productId;
    private String name;
    private Double revenue;
    private Long units;
}
