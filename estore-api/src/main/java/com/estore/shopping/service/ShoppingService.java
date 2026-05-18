package com.estore.shopping.service;

import com.estore.catalog.entity.Product;
import com.estore.catalog.entity.ProductImage;
import com.estore.catalog.repository.ProductRepository;
import com.estore.exception.ResourceNotFoundException;
import com.estore.shared.dto.CartItemResponse;
import com.estore.shared.dto.CartResponse;
import com.estore.shopping.entity.Cart;
import com.estore.shopping.entity.CartItem;
import com.estore.shopping.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShoppingService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public Cart getCartEntityByUserId(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }

    public CartResponse getCartByUserId(Long userId) {
        Cart cart = getCartEntityByUserId(userId);
        return convertToCartResponse(cart);
    }

    @Transactional
    public CartResponse addItemToCart(Long userId, Long productId, Integer quantity) {
        Cart cart = getCartEntityByUserId(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        return convertToCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateItemQuantity(Long userId, Long productId, Integer quantity) {
        Cart cart = getCartEntityByUserId(userId);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in cart"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            item.setQuantity(quantity);
        }

        return convertToCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeItemFromCart(Long userId, Long productId) {
        Cart cart = getCartEntityByUserId(userId);
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        return convertToCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCartEntityByUserId(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private CartResponse convertToCartResponse(Cart cart) {
        return CartResponse.builder()
                .id(String.valueOf(cart.getId()))
                .userId(cart.getUser().getId())
                .items(cart.getItems().stream()
                        .map(this::convertToCartItemResponse)
                        .collect(Collectors.toList()))
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private CartItemResponse convertToCartItemResponse(CartItem item) {
        Product product = item.getProduct();
        String image = null;
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            image = product.getImages().stream()
                    .filter(ProductImage::isMain)
                    .findFirst()
                    .map(ProductImage::getUrl)
                    .orElse(product.getImages().get(0).getUrl());
        }

        return CartItemResponse.builder()
                .productId(product.getId())
                .name(product.getName())
                .price(product.getCurrentPrice())
                .image(image)
                .quantity(item.getQuantity())
                .build();
    }
}
