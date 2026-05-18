package com.estore.billing.controller;

import com.estore.billing.service.DashboardService;
import com.estore.shared.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public DashboardStatsResponse getDashboardStats() {
        return dashboardService.getStats();
    }

    @GetMapping("/sales")
    public List<SalesPoint> getSalesData() {
        return dashboardService.getSalesData();
    }

    @GetMapping("/categories")
    public List<CategoryDistribution> getCategoryDistribution() {
        return dashboardService.getCategoryDistribution();
    }

    @GetMapping("/activity")
    public List<DashboardActivity> getRecentActivity() {
        return dashboardService.getRecentActivity();
    }

    @GetMapping("/top-products")
    public List<TopProduct> getTopProducts() {
        return dashboardService.getTopProducts();
    }
}
