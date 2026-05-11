package com.estore.shared;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DashboardStats {
    private Double totalRevenue;
    private Long totalOrders;
    private Long totalProducts;
    private Long outOfStockCount;
    private Map<String, Long> ordersByStatus;
    private Map<String, Long> productsByCategory;
}
