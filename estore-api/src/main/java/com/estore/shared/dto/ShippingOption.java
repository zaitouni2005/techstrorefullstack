package com.estore.shared.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingOption {
    private String carrier;
    private String method;
    private Double price;
    private String estimatedDays;
}
