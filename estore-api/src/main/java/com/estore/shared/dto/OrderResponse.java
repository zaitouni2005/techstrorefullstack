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
public class OrderResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private List<OrderItemResponse> items;
    private Integer itemCount;
    private Double total;
    private String status;
    private LocalDateTime date;
    private String shippingAddress;
    private String paymentMethod;
    private OrderTracking tracking;
    private List<OrderStatusHistory> statusHistory;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
