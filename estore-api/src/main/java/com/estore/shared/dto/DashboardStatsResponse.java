package com.estore.shared.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private Double revenue;
    private Double revenueChange;
    private Long orders;
    private Double ordersChange;
    private Long products;
    private Double productsChange;
    private Long customers;
    private Double customersChange;
    private Long lowStock;
}
