package com.estore.catalog.controller;

import com.estore.catalog.dto.CategoryDto;
import com.estore.catalog.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Product Categories", description = "Endpoints for managing product categories")
public class CategoryController {
    private final CatalogService catalogService;

    @GetMapping
    @Operation(summary = "Get all categories", description = "Retrieve a list of all product categories available")
    public List<CategoryDto> getAllCategories() {
        return catalogService.getAllCategories();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID", description = "Retrieve detailed information about a specific category by its ID")
    public CategoryDto getCategoryById(@PathVariable Long id) {
        return catalogService.getCategoryById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new category", description = "Add a new category to the system. Restricted to ADMIN users.")
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) {
        return ResponseEntity.ok(catalogService.createCategory(categoryDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a category", description = "Delete a category from the system. Restricted to ADMIN users.")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        catalogService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
