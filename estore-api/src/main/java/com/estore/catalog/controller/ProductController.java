package com.estore.catalog.controller;

import com.estore.catalog.dto.ProductDto;
import com.estore.catalog.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Product Catalog", description = "Endpoints for discovering and managing products")
public class ProductController {
    private final CatalogService catalogService;

    @GetMapping
    @Operation(summary = "Get all products", description = "Retrieve a paginated list of all products in the store")
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return catalogService.getAllProducts(pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product details", description = "Retrieve detailed information about a specific product by its ID")
    public ProductDto getProductById(@PathVariable Long id) {
        return catalogService.getProductById(id);
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get products by category", description = "Retrieve a paginated list of products belonging to a specific category")
    public Page<ProductDto> getProductsByCategory(@PathVariable Long categoryId, Pageable pageable) {
        return catalogService.getProductsByCategory(categoryId, pageable);
    }

    @GetMapping("/search")
    @Operation(summary = "Search products", description = "Search for products by name or description using a keyword")
    public Page<ProductDto> searchProducts(@RequestParam String keyword, Pageable pageable) {
        return catalogService.searchProducts(keyword, pageable);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new product", description = "Add a new product to the catalog. Restricted to ADMIN users.")
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto) {
        return ResponseEntity.ok(catalogService.createProduct(productDto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a product", description = "Update an existing product's details. Restricted to ADMIN users.")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @RequestBody ProductDto productDto) {
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
