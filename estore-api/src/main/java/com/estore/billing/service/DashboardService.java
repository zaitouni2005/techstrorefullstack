package com.estore.billing.service;

import com.estore.billing.entity.Order;
import com.estore.billing.repository.OrderRepository;
import com.estore.catalog.repository.CategoryRepository;
import com.estore.catalog.repository.ProductRepository;
import com.estore.customer.repository.UserRepository;
import com.estore.inventory.repository.InventoryRepository;
import com.estore.shared.dto.*;
import lombok.RequiredArgsConstructor;
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
        List<Order> allOrders = orderRepository.findAll();
        double revenue = allOrders.stream().mapToDouble(Order::getTotalAmount).sum();
        long orderCount = orderRepository.count();
        long productCount = productRepository.count();
        long customerCount = userRepository.count();
        long lowStock = inventoryRepository.findAll().stream()
                .filter(i -> i.getQuantity() <= 5)
                .count();

        return DashboardStatsResponse.builder()
                .revenue(revenue)
                .revenueChange(0.0)
                .orders((long) orderCount)
                .ordersChange(0.0)
                .products(productCount)
                .productsChange(0.0)
                .customers(customerCount)
                .customersChange(0.0)
                .lowStock(lowStock)
                .build();
    }

    public List<SalesPoint> getSalesData() {
        List<Order> allOrders = orderRepository.findAll();
        LocalDate today = LocalDate.now();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        Map<String, Double> salesByDay = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            salesByDay.put(today.minusDays(i).format(fmt), 0.0);
        }

        for (Order order : allOrders) {
            if (order.getOrderDate() != null) {
                String dayKey = order.getOrderDate().toLocalDate().format(fmt);
                salesByDay.merge(dayKey, order.getTotalAmount(), Double::sum);
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
        List<Order> recentOrders = orderRepository.findAll().stream()
                .sorted((a, b) -> b.getOrderDate() != null && a.getOrderDate() != null
                        ? b.getOrderDate().compareTo(a.getOrderDate()) : 0)
                .limit(8)
                .collect(Collectors.toList());

        return recentOrders.stream()
                .map(order -> DashboardActivity.builder()
                        .title("New Order #" + order.getId())
                        .description(order.getCustomerName() != null ? order.getCustomerName() : "Customer")
                        .time(getRelativeTime(order.getOrderDate()))
                        .build())
                .collect(Collectors.toList());
    }

    public List<TopProduct> getTopProducts() {
        List<Order> allOrders = orderRepository.findAll();

        Map<Long, TopProduct> productMap = new HashMap<>();
        for (Order order : allOrders) {
            if (order.getItems() != null) {
                order.getItems().forEach(item -> {
                    Long pid = item.getProduct().getId();
                    double revenue = item.getUnitPrice() * item.getQuantity();
                    long units = item.getQuantity();
                    productMap.merge(pid, TopProduct.builder()
                            .productId(pid)
                            .name(item.getName() != null ? item.getName() : item.getProduct().getName())
                            .revenue(revenue)
                            .units(units)
                            .build(), (existing, incoming) -> {
                        existing.setRevenue(existing.getRevenue() + incoming.getRevenue());
                        existing.setUnits(existing.getUnits() + incoming.getUnits());
                        return existing;
                    });
                });
            }
        }

        return productMap.values().stream()
                .sorted((a, b) -> Double.compare(b.getRevenue(), a.getRevenue()))
                .limit(5)
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
