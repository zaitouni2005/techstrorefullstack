package com.estore.catalog.service;

import com.estore.catalog.dto.CategoryDto;
import com.estore.catalog.dto.ProductDto;
import com.estore.catalog.entity.Brand;
import com.estore.catalog.entity.Category;
import com.estore.catalog.entity.Product;
import com.estore.catalog.entity.ProductImage;
import com.estore.catalog.repository.BrandRepository;
import com.estore.catalog.repository.CategoryRepository;
import com.estore.catalog.repository.ProductRepository;
import com.estore.exception.ResourceNotFoundException;
import com.estore.inventory.entity.Inventory;
import com.estore.inventory.repository.InventoryRepository;
import com.estore.shared.dto.BrandResponse;
import com.estore.shared.dto.CategoryResponse;
import com.estore.shared.dto.PaginatedResponse;
import com.estore.shared.dto.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final BrandRepository brandRepository;

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

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (categoryDto.getName() != null) {
            category.setName(categoryDto.getName());
            category.setSlug(categoryDto.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", ""));
        }
        if (categoryDto.getDescription() != null) category.setDescription(categoryDto.getDescription());
        if (categoryDto.getImageUrl() != null) category.setImageUrl(categoryDto.getImageUrl());
        return convertToCategoryDto(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        categoryRepository.delete(category);
    }

    public CategoryResponse getCategoryResponseById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return convertToCategoryResponse(category);
    }

    public List<CategoryResponse> getAllCategoryResponses() {
        return categoryRepository.findAll().stream()
                .map(this::convertToCategoryResponse)
                .collect(Collectors.toList());
    }

    public PaginatedResponse<ProductResponse> getAllProducts(int page, int limit, String sort, String order,
                                                              Long categoryId, String brand, String q,
                                                              Boolean inStock, Double minPrice, Double maxPrice,
                                                              Double minRating, List<String> brands) {
        if (page < 1) page = 1;
        if (limit < 1) limit = 20;

        Sort.Direction direction = "desc".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = "id";
        if (sort != null) {
            switch (sort) {
                case "price": sortField = "currentPrice"; break;
                case "name": sortField = "name"; break;
                case "rating": sortField = "rating"; break;
                case "createdAt": sortField = "createdAt"; break;
                default: sortField = "id";
            }
        }
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(direction, sortField));

        Page<Product> productPage;

        boolean hasBrandsFilter = brands != null && !brands.isEmpty();
        boolean hasSimpleFilters = hasBrandsFilter;

        if (hasSimpleFilters) {
            List<Product> allMatching = productRepository.findFiltered(
                    categoryId, q, brand, inStock, minPrice, maxPrice, minRating, Pageable.unpaged()).getContent();

            if (hasBrandsFilter) {
                allMatching = allMatching.stream()
                        .filter(p -> p.getBrandName() != null && brands.contains(p.getBrandName()))
                        .collect(Collectors.toList());
            }

            int total = allMatching.size();
            int start = (page - 1) * limit;
            int end = Math.min(start + limit, total);
            List<ProductResponse> data = allMatching.subList(Math.min(start, total), end).stream()
                    .map(this::convertToProductResponse)
                    .collect(Collectors.toList());

            return PaginatedResponse.<ProductResponse>builder()
                    .data(data)
                    .total(total)
                    .page(page)
                    .limit(limit)
                    .totalPages((int) Math.ceil((double) total / limit))
                    .build();
        }

        productPage = productRepository.findFiltered(categoryId, q, brand, inStock, minPrice, maxPrice, minRating, pageable);

        List<ProductResponse> data = productPage.getContent().stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());

        return PaginatedResponse.<ProductResponse>builder()
                .data(data)
                .total(productPage.getTotalElements())
                .page(page)
                .limit(limit)
                .totalPages(productPage.getTotalPages())
                .build();
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return convertToProductResponse(product);
    }

    public List<ProductResponse> getPopularProducts(int limit) {
        if (limit < 1) limit = 8;
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "rating"));
        return productRepository.findAll(pageable).stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getSalesProducts(int limit) {
        if (limit < 1) limit = 3;
        Pageable pageable = PageRequest.of(0, limit);
        return productRepository.findSalesProducts(pageable).stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> searchProducts(String q, int limit) {
        if (limit < 1) limit = 10;
        if (q == null || q.isBlank()) return Collections.emptyList();
        Pageable pageable = PageRequest.of(0, limit);
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q, pageable)
                .stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }

    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(b -> BrandResponse.builder()
                        .id(b.getId())
                        .name(b.getName())
                        .image(b.getLogoUrl())
                        .build())
                .sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName()))
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse createProduct(ProductDto productDto) {
        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Brand brand = null;
        if (productDto.getBrandId() != null) {
            brand = brandRepository.findById(productDto.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
        }

        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setCurrentPrice(productDto.getCurrentPrice());
        product.setOldPrice(productDto.getOldPrice());
        product.setCategory(category);
        product.setBrand(brand);

        Product savedProduct = productRepository.save(product);

        Inventory inventory = new Inventory();
        inventory.setQuantity(productDto.getStockQuantity() != null ? productDto.getStockQuantity() : 0);
        inventory.setProduct(savedProduct);
        inventoryRepository.save(inventory);

        savedProduct.setInventory(inventory);
        return convertToProductResponse(savedProduct);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (productDto.getName() != null) product.setName(productDto.getName());
        if (productDto.getDescription() != null) product.setDescription(productDto.getDescription());
        if (productDto.getCurrentPrice() != null) product.setCurrentPrice(productDto.getCurrentPrice());
        if (productDto.getOldPrice() != null) product.setOldPrice(productDto.getOldPrice());

        if (productDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }

        if (productDto.getBrandId() != null) {
            Brand brand = brandRepository.findById(productDto.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
            product.setBrand(brand);
        }

        if (productDto.getStockQuantity() != null && product.getInventory() != null) {
            product.getInventory().setQuantity(productDto.getStockQuantity());
        }

        return convertToProductResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        productRepository.delete(product);
    }

    private CategoryDto convertToCategoryDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setImageUrl(category.getImageUrl());
        return dto;
    }

    private CategoryResponse convertToCategoryResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .image(category.getImageUrl())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    private ProductResponse convertToProductResponse(Product product) {
        String mainImage = null;
        List<String> images = Collections.emptyList();

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            images = product.getImages().stream()
                    .map(ProductImage::getUrl)
                    .collect(Collectors.toList());

            mainImage = product.getImages().stream()
                    .filter(ProductImage::isMain)
                    .findFirst()
                    .map(ProductImage::getUrl)
                    .orElse(images.get(0));
        }

        Double rating = product.getRating() != null ? product.getRating() : 0.0;
        Integer stock = product.getStock();

        String brandImage = product.getBrand() != null ? product.getBrand().getLogoUrl() : null;

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .brand(product.getBrandName())
                .brandImage(brandImage)
                .category(product.getCategoryName())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .price(product.getCurrentPrice())
                .oldPrice(product.getOldPrice())
                .rating(rating)
                .stock(stock)
                .mainImage(mainImage)
                .images(images)
                .description(product.getDescription())
                .specs(Collections.emptyList())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
