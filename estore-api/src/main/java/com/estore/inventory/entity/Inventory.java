package com.estore.inventory.entity;

import com.estore.catalog.entity.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String location;

    @Column(nullable = false)
    private Integer quantity;

    @OneToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;
}
