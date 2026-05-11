package com.estore.billing.service;

import com.estore.billing.entity.Order;
import com.estore.billing.repository.OrderRepository;
import com.estore.catalog.repository.CategoryRepository;
import com.estore.catalog.repository.ProductRepository;
import com.estore.inventory.repository.InventoryRepository;
import com.estore.shared.DashboardStats;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryRepository inventoryRepository;

    public DashboardStats getStats() {
        double revenue = orderRepository.findAll().stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();

        long orderCount = orderRepository.count();
        long productCount = productRepository.count();
        
        long outOfStock = inventoryRepository.findAll().stream()
                .filter(i -> i.getQuantity() <= 0)
                .count();

        var ordersByStatus = orderRepository.findAll().stream()
                .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));

        var productsByCategory = productRepository.findAll().stream()
                .collect(Collectors.groupingBy(p -> p.getCategory().getName(), Collectors.counting()));

        return DashboardStats.builder()
                .totalRevenue(revenue)
                .totalOrders(orderCount)
                .totalProducts(productCount)
                .outOfStockCount(outOfStock)
                .ordersByStatus(ordersByStatus)
                .productsByCategory(productsByCategory)
                .build();
    }
}
