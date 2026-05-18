package com.estore.billing.repository;

import com.estore.billing.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    Page<Order> findByUserId(Long userId, Pageable pageable);
    Page<Order> findByUserIdAndStatus(Long userId, String status, Pageable pageable);
    Page<Order> findByStatus(String status, Pageable pageable);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    Double getTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.orderDate >= :since")
    Double getRevenueSince(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate >= :since")
    long countOrdersSince(@Param("since") LocalDateTime since);

    @Query("SELECT FUNCTION('DATE', o.orderDate) as day, SUM(o.totalAmount) as total FROM Order o " +
           "WHERE o.orderDate >= :since GROUP BY FUNCTION('DATE', o.orderDate) ORDER BY day")
    List<Object[]> getSalesByDaySince(@Param("since") LocalDateTime since);

    @Query("SELECT oi.product.id as pid, COALESCE(oi.name, oi.product.name) as name, " +
           "SUM(oi.unitPrice * oi.quantity) as revenue, SUM(oi.quantity) as units " +
           "FROM OrderItem oi GROUP BY oi.product.id, oi.name ORDER BY revenue DESC")
    List<Object[]> findTopProducts(Pageable pageable);
}
