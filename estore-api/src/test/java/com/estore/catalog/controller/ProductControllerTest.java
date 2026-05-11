package com.estore.catalog.controller;

import com.estore.catalog.dto.ProductDto;
import com.estore.catalog.service.CatalogService;
import com.estore.config.JwtUtils;
import com.estore.customer.service.UserDetailsServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
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
        Page<ProductDto> productPage = new PageImpl<>(Collections.emptyList());
        when(catalogService.getAllProducts(any(Pageable.class))).thenReturn(productPage);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk());
    }
}
