package com.estore.shared.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private List<OrderItemRequest> items;
    private String shippingAddress;
    private String paymentMethod;
}
