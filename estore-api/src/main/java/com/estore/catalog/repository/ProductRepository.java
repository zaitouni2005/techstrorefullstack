package com.estore.catalog.repository;

import com.estore.catalog.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%'))) " +
           "AND (:brand IS NULL OR p.brand.name = :brand) " +
           "AND (:inStock IS NULL OR (:inStock = true AND p.inventory.quantity > 0) OR (:inStock = false AND p.inventory.quantity = 0)) " +
           "AND (:minPrice IS NULL OR p.currentPrice >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.currentPrice <= :maxPrice) " +
           "AND (:minRating IS NULL OR p.rating IS NULL OR p.rating >= :minRating)")
    Page<Product> findFiltered(@Param("categoryId") Long categoryId,
                                @Param("q") String q,
                                @Param("brand") String brand,
                                @Param("inStock") Boolean inStock,
                                @Param("minPrice") Double minPrice,
                                @Param("maxPrice") Double maxPrice,
                                @Param("minRating") Double minRating,
                                Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.oldPrice IS NOT NULL AND p.oldPrice > p.currentPrice ORDER BY (p.oldPrice - p.currentPrice) / p.oldPrice DESC")
    List<Product> findSalesProducts(Pageable pageable);
}
