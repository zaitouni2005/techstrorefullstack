package com.estore.catalog.controller;

import com.estore.catalog.dto.CategoryDto;
import com.estore.catalog.service.CatalogService;
import com.estore.shared.dto.CategoryResponse;
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
    @Operation(summary = "Get all categories", description = "Retrieve a list of all product categories")
    public List<CategoryResponse> getAllCategories() {
        return catalogService.getAllCategoryResponses();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID", description = "Retrieve detailed information about a specific category")
    public CategoryResponse getCategoryById(@PathVariable Long id) {
        return catalogService.getCategoryResponseById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new category", description = "Add a new category. Restricted to ADMIN users.")
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) {
        return ResponseEntity.ok(catalogService.createCategory(categoryDto));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a category", description = "Update an existing category. Restricted to ADMIN users.")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id, @RequestBody CategoryDto categoryDto) {
        return ResponseEntity.ok(catalogService.updateCategory(id, categoryDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a category", description = "Delete a category. Restricted to ADMIN users.")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        catalogService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
