package com.estore.catalog.controller;

import com.estore.catalog.dto.ProductDto;
import com.estore.catalog.service.CatalogService;
import com.estore.shared.dto.BrandResponse;
import com.estore.shared.dto.PaginatedResponse;
import com.estore.shared.dto.ProductResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Product Catalog", description = "Endpoints for discovering and managing products")
public class ProductController {
    private final CatalogService catalogService;

    @GetMapping
    @Operation(summary = "Get all products", description = "Retrieve a paginated list of all products with filtering and sorting")
    public PaginatedResponse<ProductResponse> getAllProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String order,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) List<String> brands) {
        return catalogService.getAllProducts(page, limit, sort, order, category, brand, q,
                inStock, minPrice, maxPrice, minRating, brands);
    }

    @GetMapping("/popular")
    @Operation(summary = "Get popular products", description = "Retrieve a list of popular products")
    public List<ProductResponse> getPopularProducts(@RequestParam(defaultValue = "8") int limit) {
        return catalogService.getPopularProducts(limit);
    }

    @GetMapping("/sales")
    @Operation(summary = "Get products on sale", description = "Retrieve a list of products with discounts")
    public List<ProductResponse> getSalesProducts(@RequestParam(defaultValue = "3") int limit) {
        return catalogService.getSalesProducts(limit);
    }

    @GetMapping("/search")
    @Operation(summary = "Search products", description = "Search for products by name or description")
    public List<ProductResponse> searchProducts(
            @RequestParam String q,
            @RequestParam(defaultValue = "10") int limit) {
        return catalogService.searchProducts(q, limit);
    }

    @GetMapping("/brands")
    @Operation(summary = "Get all brands", description = "Retrieve a list of all brands with their images")
    public List<BrandResponse> getAllBrands() {
        return catalogService.getAllBrands();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product details", description = "Retrieve detailed information about a specific product")
    public ProductResponse getProductById(@PathVariable Long id) {
        return catalogService.getProductById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new product", description = "Add a new product to the catalog. Restricted to ADMIN users.")
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductDto productDto) {
        return ResponseEntity.ok(catalogService.createProduct(productDto));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a product", description = "Update an existing product. Restricted to ADMIN users.")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @RequestBody ProductDto productDto) {
        return ResponseEntity.ok(catalogService.updateProduct(id, productDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a product", description = "Delete a product from the catalog. Restricted to ADMIN users.")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        catalogService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
