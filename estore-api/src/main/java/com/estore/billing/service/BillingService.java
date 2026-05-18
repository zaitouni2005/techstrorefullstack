package com.estore.billing.service;

import com.estore.billing.entity.Order;
import com.estore.billing.entity.OrderItem;
import com.estore.billing.repository.OrderRepository;
import com.estore.catalog.entity.Product;
import com.estore.catalog.entity.ProductImage;
import com.estore.catalog.repository.ProductRepository;
import com.estore.customer.entity.User;
import com.estore.customer.repository.UserRepository;
import com.estore.exception.InsufficientStockException;
import com.estore.exception.ResourceNotFoundException;
import com.estore.inventory.service.InventoryService;
import com.estore.shared.dto.*;
import com.estore.shopping.entity.Cart;
import com.estore.shopping.service.ShoppingService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public OrderResponse placeOrder(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setCustomerName(user.getProfile() != null
                ? user.getProfile().getFirstName() + " " + user.getProfile().getLastName()
                : user.getEmail());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("pending");
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            List<OrderItem> orderItems = request.getItems().stream().map(itemReq -> {
                Product product = productRepository.findById(itemReq.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.getProductId()));

                checkStock(product, itemReq.getQuantity());

                OrderItem orderItem = createOrderItem(order, product, itemReq.getQuantity());
                inventoryService.decreaseStock(product.getId(), itemReq.getQuantity());
                return orderItem;
            }).collect(Collectors.toList());

            order.setItems(orderItems);
            order.setTotalAmount(orderItems.stream().mapToDouble(i -> i.getUnitPrice() * i.getQuantity()).sum());
        } else {
            Cart cart = shoppingService.getCartEntityByUserId(userId);
            if (cart.getItems().isEmpty()) {
                throw new RuntimeException("Cart is empty");
            }

            List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
                Product product = cartItem.getProduct();
                checkStock(product, cartItem.getQuantity());

                OrderItem orderItem = createOrderItem(order, product, cartItem.getQuantity());
                inventoryService.decreaseStock(product.getId(), cartItem.getQuantity());
                return orderItem;
            }).collect(Collectors.toList());

            order.setItems(orderItems);
            order.setTotalAmount(orderItems.stream().mapToDouble(i -> i.getUnitPrice() * i.getQuantity()).sum());
            shoppingService.clearCart(userId);
        }

        Order savedOrder = orderRepository.save(order);
        return convertToOrderResponse(savedOrder);
    }

    private void checkStock(Product product, int quantity) {
        if (product.getInventory() == null || product.getInventory().getQuantity() < quantity) {
            throw new InsufficientStockException("Insufficient stock for product: " + product.getName());
        }
    }

    private OrderItem createOrderItem(Order order, Product product, int quantity) {
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(quantity);
        orderItem.setUnitPrice(product.getCurrentPrice());
        orderItem.setName(product.getName());

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            String img = product.getImages().stream()
                    .filter(ProductImage::isMain)
                    .findFirst()
                    .map(ProductImage::getUrl)
                    .orElse(product.getImages().get(0).getUrl());
            orderItem.setImage(img);
        }

        return orderItem;
    }

    public PaginatedResponse<OrderResponse> getOrdersByUserId(Long userId, int page, int limit, String status) {
        if (page < 1) page = 1;
        if (limit < 1) limit = 20;
        Pageable pageable = PageRequest.of(page - 1, limit);

        Page<Order> orderPage;
        if (status != null && !status.isBlank()) {
            orderPage = orderRepository.findByUserIdAndStatus(userId, status, pageable);
        } else {
            orderPage = orderRepository.findByUserId(userId, pageable);
        }

        List<OrderResponse> data = orderPage.getContent().stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());

        return PaginatedResponse.<OrderResponse>builder()
                .data(data)
                .total(orderPage.getTotalElements())
                .page(page)
                .limit(limit)
                .totalPages(orderPage.getTotalPages())
                .build();
    }

    public PaginatedResponse<OrderResponse> getAllOrders(int page, int limit, String status, Long customerId) {
        if (page < 1) page = 1;
        if (limit < 1) limit = 20;
        Pageable pageable = PageRequest.of(page - 1, limit);

        Page<Order> orderPage;
        if (status != null && !status.isBlank() && customerId != null) {
            orderPage = orderRepository.findByUserIdAndStatus(customerId, status, pageable);
        } else if (status != null && !status.isBlank()) {
            orderPage = orderRepository.findByStatus(status, pageable);
        } else if (customerId != null) {
            orderPage = orderRepository.findByUserId(customerId, pageable);
        } else {
            orderPage = orderRepository.findAll(pageable);
        }

        List<OrderResponse> data = orderPage.getContent().stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());

        return PaginatedResponse.<OrderResponse>builder()
                .data(data)
                .total(orderPage.getTotalElements())
                .page(page)
                .limit(limit)
                .totalPages(orderPage.getTotalPages())
                .build();
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return convertToOrderResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, String newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        OrderStatusHistory historyEntry = OrderStatusHistory.builder()
                .status(order.getStatus())
                .timestamp(LocalDateTime.now())
                .build();

        List<OrderStatusHistory> history = getStatusHistory(order);
        history.add(historyEntry);
        order.setStatusHistoryJson(toJson(history));
        order.setStatus(newStatus);

        return convertToOrderResponse(orderRepository.save(order));
    }

    private OrderResponse convertToOrderResponse(Order order) {
        String customerName = order.getCustomerName();
        if (customerName == null && order.getUser().getProfile() != null) {
            customerName = order.getUser().getProfile().getFirstName() + " " + order.getUser().getProfile().getLastName();
        }
        if (customerName == null) customerName = order.getUser().getEmail();

        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .productId(item.getProduct().getId())
                        .name(item.getName() != null ? item.getName() : item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .image(item.getImage())
                        .build())
                .collect(Collectors.toList());

        int itemCount = items.stream().mapToInt(OrderItemResponse::getQuantity).sum();

        return OrderResponse.builder()
                .id(order.getId())
                .customerId(order.getUser().getId())
                .customerName(customerName)
                .items(items)
                .itemCount(itemCount)
                .total(order.getTotalAmount())
                .status(order.getStatus())
                .date(order.getOrderDate())
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())
                .tracking(parseTracking(order.getTrackingJson()))
                .statusHistory(getStatusHistory(order))
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderTracking parseTracking(String trackingJson) {
        if (trackingJson == null || trackingJson.isBlank()) return null;
        try {
            return objectMapper.readValue(trackingJson, OrderTracking.class);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    private List<OrderStatusHistory> getStatusHistory(Order order) {
        if (order.getStatusHistoryJson() == null || order.getStatusHistoryJson().isBlank()) return new java.util.ArrayList<>();
        try {
            return objectMapper.readValue(order.getStatusHistoryJson(), new TypeReference<List<OrderStatusHistory>>() {});
        } catch (JsonProcessingException e) {
            return new java.util.ArrayList<>();
        }
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }
}
