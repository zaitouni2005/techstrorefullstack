package com.estore.billing.service;

import com.estore.billing.entity.Order;
import com.estore.billing.entity.OrderItem;
import com.estore.billing.repository.OrderRepository;
import com.estore.customer.entity.User;
import com.estore.customer.repository.UserRepository;
import com.estore.exception.ResourceNotFoundException;
import com.estore.inventory.service.InventoryService;
import com.estore.shopping.entity.Cart;
import com.estore.shopping.entity.CartItem;
import com.estore.shopping.service.ShoppingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillingService {
    private final OrderRepository orderRepository;
    private final ShoppingService shoppingService;
    private final InventoryService inventoryService;
    private final UserRepository userRepository;

    @Transactional
    public Order placeOrder(Long userId) {
        Cart cart = shoppingService.getCartByUserId(userId);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 1. Stock check
        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getInventory().getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + item.getProduct().getName());
            }
        }

        // 2. Create Order
        Order order = new Order();
        User user = userRepository.findById(userId).get();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("COMPLETED");

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getProduct().getCurrentPrice());

            // 3. Update Stock
            inventoryService.decreaseStock(cartItem.getProduct().getId(), cartItem.getQuantity());

            return orderItem;
        }).collect(Collectors.toList());

        order.setItems(orderItems);
        order.setTotalAmount(orderItems.stream().mapToDouble(i -> i.getUnitPrice() * i.getQuantity()).sum());
        Order savedOrder = orderRepository.save(order);

        // 4. Empty Cart
        shoppingService.clearCart(userId);

        return savedOrder;
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
