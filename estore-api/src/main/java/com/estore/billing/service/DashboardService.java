package com.estore.billing.service;

import com.estore.billing.entity.Order;
import com.estore.billing.repository.OrderRepository;
import com.estore.catalog.repository.CategoryRepository;
import com.estore.catalog.repository.ProductRepository;
import com.estore.customer.repository.UserRepository;
import com.estore.inventory.repository.InventoryRepository;
import com.estore.shared.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;

    public DashboardStatsResponse getStats() {
        double revenue = orderRepository.getTotalRevenue();
        long orderCount = orderRepository.count();
        long productCount = productRepository.count();
        long customerCount = userRepository.count();
        long lowStock = inventoryRepository.countLowStock();

        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        double recentRevenue = orderRepository.getRevenueSince(sevenDaysAgo);
        long recentOrders = orderRepository.countOrdersSince(sevenDaysAgo);

        double revenueChange = revenue > 0 ? (recentRevenue / (revenue / (Math.max(orderCount, 1) / Math.max(recentOrders, 1)))) * 100 : 0;

        return DashboardStatsResponse.builder()
                .revenue(revenue)
                .revenueChange(Math.min(revenueChange, 100.0))
                .orders(orderCount)
                .ordersChange(0.0)
                .products(productCount)
                .productsChange(0.0)
                .customers(customerCount)
                .customersChange(0.0)
                .lowStock(lowStock)
                .build();
    }

    public List<SalesPoint> getSalesData() {
        LocalDate today = LocalDate.now();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDateTime sevenDaysAgo = today.minusDays(6).atStartOfDay();

        Map<String, Double> salesByDay = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            salesByDay.put(today.minusDays(i).format(fmt), 0.0);
        }

        List<Object[]> rows = orderRepository.getSalesByDaySince(sevenDaysAgo);
        for (Object[] row : rows) {
            String day = row[0] != null ? row[0].toString() : null;
            Double total = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
            if (day != null && salesByDay.containsKey(day)) {
                salesByDay.put(day, total);
            }
        }

        return salesByDay.entrySet().stream()
                .map(e -> SalesPoint.builder().name(e.getKey()).total(e.getValue()).build())
                .collect(Collectors.toList());
    }

    public List<CategoryDistribution> getCategoryDistribution() {
        return categoryRepository.findAll().stream()
                .map(cat -> CategoryDistribution.builder()
                        .name(cat.getName())
                        .value((long) (cat.getProducts() != null ? cat.getProducts().size() : 0))
                        .build())
                .collect(Collectors.toList());
    }

    public List<DashboardActivity> getRecentActivity() {
        List<Order> recentOrders = orderRepository.findAll(
                PageRequest.of(0, 8, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "orderDate")))
                .getContent();

        return recentOrders.stream()
                .map(order -> DashboardActivity.builder()
                        .title("New Order #" + order.getId())
                        .description(order.getCustomerName() != null ? order.getCustomerName() : "Customer")
                        .time(getRelativeTime(order.getOrderDate()))
                        .build())
                .collect(Collectors.toList());
    }

    public List<TopProduct> getTopProducts() {
        List<Object[]> rows = orderRepository.findTopProducts(PageRequest.of(0, 5));

        return rows.stream().map(row -> TopProduct.builder()
                        .productId(((Number) row[0]).longValue())
                        .name((String) row[1])
                        .revenue(((Number) row[2]).doubleValue())
                        .units(((Number) row[3]).longValue())
                        .build())
                .collect(Collectors.toList());
    }

    private String getRelativeTime(LocalDateTime dateTime) {
        if (dateTime == null) return "recently";
        LocalDateTime now = LocalDateTime.now();
        long minutes = java.time.Duration.between(dateTime, now).toMinutes();
        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + " minutes ago";
        long hours = minutes / 60;
        if (hours < 24) return hours + " hours ago";
        long days = hours / 24;
        if (days < 7) return days + " days ago";
        return dateTime.toLocalDate().toString();
    }
}
