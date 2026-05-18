package com.estore.billing.repository;

import com.estore.billing.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    Page<Order> findByUserId(Long userId, Pageable pageable);
    Page<Order> findByUserIdAndStatus(Long userId, String status, Pageable pageable);
    Page<Order> findByStatus(String status, Pageable pageable);
}
