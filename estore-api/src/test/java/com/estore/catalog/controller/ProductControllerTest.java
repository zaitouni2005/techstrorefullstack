package com.estore.catalog.controller;

import com.estore.catalog.service.CatalogService;
import com.estore.config.JwtUtils;
import com.estore.customer.service.UserDetailsServiceImpl;
import com.estore.shared.dto.PaginatedResponse;
import com.estore.shared.dto.ProductResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CatalogService catalogService;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    @MockitoBean
    private JwtUtils jwtUtils;

    @Test
    @WithMockUser
    public void testGetAllProducts() throws Exception {
        PaginatedResponse<ProductResponse> response = PaginatedResponse.<ProductResponse>builder()
                .data(Collections.emptyList())
                .total(0)
                .page(1)
                .limit(20)
                .totalPages(0)
                .build();

        when(catalogService.getAllProducts(anyInt(), anyInt(), isNull(), isNull(),
                isNull(), isNull(), isNull(), isNull(), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(response);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk());
    }
}
