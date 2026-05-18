package com.estore.customer.service;

import com.estore.config.JwtUtils;
import com.estore.customer.dto.RegisterRequest;
import com.estore.customer.entity.Role;
import com.estore.customer.entity.User;
import com.estore.customer.repository.RoleRepository;
import com.estore.customer.repository.UserRepository;
import com.estore.shopping.repository.CartRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    RoleRepository roleRepository;

    @Mock
    CartRepository cartRepository;

    @Mock
    PasswordEncoder encoder;

    @Mock
    JwtUtils jwtUtils;

    @Mock
    UserDetailsService userDetailsService;

    @InjectMocks
    AuthService authService;

    @Test
    public void testRegisterUser() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@test.com");
        request.setPassword("password");
        request.setName("Test User");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(encoder.encode(anyString())).thenReturn("encodedPassword");
        when(roleRepository.findByName("ROLE_USER")).thenReturn(Optional.of(new Role("ROLE_USER")));
        when(userDetailsService.loadUserByUsername(anyString())).thenReturn(
                org.springframework.security.core.userdetails.User.withUsername("test@test.com")
                        .password("encodedPassword")
                        .authorities("ROLE_USER")
                        .build()
        );

        authService.registerUser(request);

        verify(userRepository, times(1)).save(any(User.class));
        verify(cartRepository, times(1)).save(any());
    }
}
