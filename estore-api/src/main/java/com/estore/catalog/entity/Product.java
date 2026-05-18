package com.estore.catalog.entity;

import com.estore.inventory.entity.Inventory;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double currentPrice;

    private Double oldPrice;

    @Column(columnDefinition = "TEXT")
    private String specsJson;

    private Double rating;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnore
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    @JsonIgnore
    private Brand brand;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "product")
    private Inventory inventory;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (inventory != null) {
            inventory.setProduct(this);
        }
    }

    public String getBrandName() {
        return brand != null ? brand.getName() : null;
    }

    public String getCategoryName() {
        return category != null ? category.getName() : null;
    }

    public Integer getStock() {
        return inventory != null ? inventory.getQuantity() : 0;
    }
}
