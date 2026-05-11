package com.estore.catalog.service;

import com.estore.catalog.dto.CategoryDto;
import com.estore.catalog.dto.ProductDto;
import com.estore.catalog.entity.Category;
import com.estore.catalog.entity.Product;
import com.estore.catalog.repository.CategoryRepository;
import com.estore.catalog.repository.ProductRepository;
import com.estore.inventory.entity.Inventory;
import com.estore.inventory.repository.InventoryRepository;
import com.estore.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    // Category CRUD
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToCategoryDto)
                .collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return convertToCategoryDto(category);
    }

    public CategoryDto createCategory(CategoryDto categoryDto) {
        Category category = new Category();
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        category.setImageUrl(categoryDto.getImageUrl());
        return convertToCategoryDto(categoryRepository.save(category));
    }

    // Product CRUD
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::convertToProductDto);
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return convertToProductDto(product);
    }

    public Page<ProductDto> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryId(categoryId, pageable).map(this::convertToProductDto);
    }

    public Page<ProductDto> searchProducts(String keyword, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(keyword, pageable).map(this::convertToProductDto);
    }

    @Transactional
    public ProductDto createProduct(ProductDto productDto) {
        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setCurrentPrice(productDto.getCurrentPrice());
        product.setOldPrice(productDto.getOldPrice());
        product.setCategory(category);

        Product savedProduct = productRepository.save(product);

        Inventory inventory = new Inventory();
        inventory.setQuantity(productDto.getStockQuantity());
        inventory.setProduct(savedProduct);
        inventoryRepository.save(inventory);

        savedProduct.setInventory(inventory);
        return convertToProductDto(savedProduct);
    }

    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setCurrentPrice(productDto.getCurrentPrice());
        product.setOldPrice(productDto.getOldPrice());

        if (product.getInventory() != null) {
            product.getInventory().setQuantity(productDto.getStockQuantity());
        }

        return convertToProductDto(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found");
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDto convertToCategoryDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setImageUrl(category.getImageUrl());
        return dto;
    }

    private ProductDto convertToProductDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setCurrentPrice(product.getCurrentPrice());
        dto.setOldPrice(product.getOldPrice());
        
        // Handle images
        if (product.getImages() != null) {
            dto.setAllImageUrls(product.getImages().stream()
                    .map(com.estore.catalog.entity.ProductImage::getUrl)
                    .collect(Collectors.toList()));
            
            product.getImages().stream()
                    .filter(com.estore.catalog.entity.ProductImage::isMain)
                    .findFirst()
                    .ifPresent(img -> dto.setMainImageUrl(img.getUrl()));
            
            // Fallback if no main image is set
            if (dto.getMainImageUrl() == null && !product.getImages().isEmpty()) {
                dto.setMainImageUrl(product.getImages().get(0).getUrl());
            }
        }
        
        dto.setCategoryId(product.getCategory().getId());
        dto.setStockQuantity(product.getInventory() != null ? product.getInventory().getQuantity() : 0);
        return dto;
    }
}
