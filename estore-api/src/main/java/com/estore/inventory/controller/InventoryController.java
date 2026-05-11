package com.estore.inventory.controller;

import com.estore.inventory.entity.Inventory;
import com.estore.inventory.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "Endpoints for checking and managing product stock")
public class InventoryController {
    private final InventoryService inventoryService;

    @GetMapping("/{productId}")
    @Operation(summary = "Get inventory by product", description = "Retrieve the current stock level and location for a specific product")
    public Inventory getInventory(@PathVariable Long productId) {
        return inventoryService.getInventoryByProductId(productId);
    }

    @PutMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update product stock", description = "Manually update the stock quantity for a product. Restricted to ADMIN users.")
    public Inventory updateStock(@PathVariable Long productId, @RequestParam Integer quantity) {
        return inventoryService.updateStock(productId, quantity);
    }
}
